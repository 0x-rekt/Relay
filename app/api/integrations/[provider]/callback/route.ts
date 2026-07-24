import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { integrations } from "@/db/schema";
import { encrypt } from "@/lib/crypto";
import { eq } from "drizzle-orm";

interface OauthProviderConfig {
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  clientId: string;
  clientSecret: string;
}

const OAUTH_CONFIGS: Record<string, OauthProviderConfig> = {
  github: {
    authUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    scopes: ["user", "repo"],
    clientId: process.env.INTEGRATION_GITHUB_CLIENT_ID!,
    clientSecret: process.env.INTEGRATION_GITHUB_CLIENT_SECRET!,
  },
  slack: {
    authUrl: "https://slack.com/oauth/v2/authorize",
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    scopes: ["chat:write", "channels:read", "users:read", "im:write"],
    clientId: process.env.INTEGRATION_SLACK_CLIENT_ID!,
    clientSecret: process.env.INTEGRATION_SLACK_CLIENT_SECRET!,
  },
  linear: {
    authUrl: "https://linear.app/oauth/authorize",
    tokenUrl: "https://api.linear.app/oauth/token",
    scopes: ["read", "write", "issues:write"],
    clientId: process.env.INTEGRATION_LINEAR_CLIENT_ID!,
    clientSecret: process.env.INTEGRATION_LINEAR_CLIENT_SECRET!,
  },
  sentry: {
    authUrl: "https://sentry.io/oauth/authorize/",
    tokenUrl: "https://sentry.io/oauth/token/",
    scopes: ["event:read", "org:read", "project:read"],
    clientId: process.env.INTEGRATION_SENTRY_CLIENT_ID!,
    clientSecret: process.env.INTEGRATION_SENTRY_CLIENT_SECRET!,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const providerKey = provider.toLowerCase();
  const config = OAUTH_CONFIGS[providerKey];

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError =
    searchParams.get("error") || searchParams.get("error_description");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const redirectUri = `${baseUrl}/api/integrations/${providerKey}/callback`;

  if (!code && !oauthError) {
    const workspaceId = searchParams.get("workspaceId");
    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId query parameter is required" },
        { status: 400 },
      );
    }

    if (!config) {
      return NextResponse.json(
        { error: `Unsupported integration provider: ${provider}` },
        { status: 400 },
      );
    }

    const membership = await db.query.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Access denied to workspace" },
        { status: 403 },
      );
    }

    const statePayload = Buffer.from(
      JSON.stringify({
        workspaceId,
        provider: providerKey,
        userId: session.user.id,
        timestamp: Date.now(),
      }),
    ).toString("base64url");

    const authorizeUrl = new URL(config.authUrl);
    authorizeUrl.searchParams.set("client_id", config.clientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("state", statePayload);

    if (providerKey === "slack") {
      authorizeUrl.searchParams.set("scope", config.scopes.join(","));
    } else {
      authorizeUrl.searchParams.set("scope", config.scopes.join(" "));
    }

    return NextResponse.redirect(authorizeUrl.toString());
  }

  let workspaceId: string | null = null;
  if (state) {
    try {
      const decodedState = JSON.parse(
        Buffer.from(state, "base64url").toString("utf8"),
      );
      workspaceId = decodedState.workspaceId;
    } catch (e) {
      console.error("Failed to parse OAuth state parameter:", e);
    }
  }

  const redirectBase = workspaceId
    ? `/dashboard/${workspaceId}/integrations`
    : "/dashboard";

  if (oauthError) {
    return NextResponse.redirect(
      new URL(
        `${redirectBase}?error=${encodeURIComponent(oauthError)}`,
        request.url,
      ),
    );
  }

  if (!config) {
    return NextResponse.redirect(
      new URL(`${redirectBase}?error=Unsupported provider`, request.url),
    );
  }

  if (!workspaceId) {
    return NextResponse.redirect(
      new URL(`${redirectBase}?error=Missing workspace context`, request.url),
    );
  }

  const membership = await db.query.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId: session.user.id,
    },
  });

  if (!membership) {
    return NextResponse.redirect(
      new URL(`${redirectBase}?error=Access denied`, request.url),
    );
  }

  try {
    let tokenData: any = null;
    let accessToken: string | null = null;
    let refreshToken: string | null = null;
    let expiresIn: number | null = null;
    let grantedScopes: string = config.scopes.join(" ");
    let providerAccountId: string | null = null;

    if (providerKey === "github") {
      const res = await fetch(config.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      });
      tokenData = await res.json();
      if (!res.ok || tokenData.error) {
        throw new Error(
          tokenData.error_description ||
            tokenData.error ||
            "GitHub token exchange failed",
        );
      }
      accessToken = tokenData.access_token;
      grantedScopes = tokenData.scope || config.scopes.join(" ");

      if (accessToken) {
        const userRes = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "Relay-App",
          },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          providerAccountId = userData.login || String(userData.id);
        }
      }
    } else if (providerKey === "slack") {
      const body = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code!,
        redirect_uri: redirectUri,
      });
      const res = await fetch(config.tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      tokenData = await res.json();
      if (!tokenData.ok) {
        throw new Error(tokenData.error || "Slack token exchange failed");
      }
      accessToken = tokenData.access_token;
      grantedScopes = tokenData.scope || config.scopes.join(" ");
      providerAccountId =
        tokenData.team?.name || tokenData.team?.id || tokenData.authed_user?.id;
    } else if (providerKey === "linear") {
      const body = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      });
      const res = await fetch(config.tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      tokenData = await res.json();
      if (!res.ok || tokenData.error) {
        throw new Error(
          tokenData.error_description ||
            tokenData.error ||
            "Linear token exchange failed",
        );
      }
      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token || null;
      expiresIn = tokenData.expires_in || null;
      if (Array.isArray(tokenData.scope)) {
        grantedScopes = tokenData.scope.join(" ");
      } else if (typeof tokenData.scope === "string") {
        grantedScopes = tokenData.scope;
      }

      if (accessToken) {
        const viewerRes = await fetch("https://api.linear.app/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: "{ viewer { id name email } }" }),
        });
        if (viewerRes.ok) {
          const viewerData = await viewerRes.json();
          providerAccountId =
            viewerData.data?.viewer?.email ||
            viewerData.data?.viewer?.name ||
            viewerData.data?.viewer?.id;
        }
      }
    } else if (providerKey === "sentry") {
      const body = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      });
      const res = await fetch(config.tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      tokenData = await res.json();
      if (!res.ok || tokenData.error) {
        throw new Error(
          tokenData.error_description ||
            tokenData.error ||
            "Sentry token exchange failed",
        );
      }
      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token || null;
      expiresIn = tokenData.expires_in || null;
      providerAccountId =
        tokenData.user?.email || tokenData.user?.id || tokenData.user?.name;
    }

    if (!accessToken) {
      throw new Error("No access token received from provider");
    }

    const accessTokenEnc = encrypt(accessToken);
    const refreshTokenEnc = refreshToken ? encrypt(refreshToken) : null;
    const tokenExpiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000)
      : null;

    const existing = await db.query.integrations.findFirst({
      where: {
        workspaceId,
        provider: providerKey as any,
      },
    });

    if (existing) {
      await db
        .update(integrations)
        .set({
          status: "connected",
          accessTokenEnc,
          refreshTokenEnc,
          tokenExpiresAt,
          scopes: grantedScopes,
          providerAccountId,
          updatedAt: new Date(),
        })
        .where(eq(integrations.id, existing.id));
    } else {
      await db.insert(integrations).values({
        workspaceId,
        provider: providerKey as any,
        status: "connected",
        accessTokenEnc,
        refreshTokenEnc,
        tokenExpiresAt,
        scopes: grantedScopes,
        providerAccountId,
      });
    }

    return NextResponse.redirect(
      new URL(
        `/dashboard/${workspaceId}/integrations?connected=${providerKey}`,
        request.url,
      ),
    );
  } catch (err: any) {
    console.error(`OAuth callback error for ${providerKey}:`, err);
    return NextResponse.redirect(
      new URL(
        `${redirectBase}?error=${encodeURIComponent(
          err.message || "Failed to complete OAuth flow",
        )}`,
        request.url,
      ),
    );
  }
}
