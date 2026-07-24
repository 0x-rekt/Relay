"use server";

import { db } from "@/db";
import { integrations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";

export const getIntegrations = async (workspaceId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return { error: "Unauthorized" };

    const membership = await db.query.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!membership) return { error: "Access denied" };

    const result = await db.query.integrations.findMany({
      where: {
        workspaceId,
      },
      columns: {
        id: true,
        provider: true,
        status: true,
        scopes: true,
        providerAccountId: true,
        tokenExpiresAt: true,
        createdAt: true,
        updatedAt: true,
        accessTokenEnc: false,
        refreshTokenEnc: false,
        webhookSecretEnc: false,
      },
    });

    return { integrations: result };
  } catch (error) {
    console.error("getIntegrations error:", error);
    return { error: "Failed to load integrations" };
  }
};

export const disconnectIntegration = async (
  workspaceId: string,
  provider: string,
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return { error: "Unauthorized" };

    const membership = await db.query.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!membership) return { error: "Access denied" };
    if (!["owner", "admin"].includes(membership.role)) {
      return { error: "Only owners and admins can disconnect integrations" };
    }

    await db
      .delete(integrations)
      .where(
        and(
          eq(integrations.workspaceId, workspaceId),
          eq(integrations.provider, provider as any),
        ),
      );

    return { success: true };
  } catch (error) {
    console.error("disconnectIntegration error:", error);
    return { error: "Failed to disconnect integration" };
  }
};
