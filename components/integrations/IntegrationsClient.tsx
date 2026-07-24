"use client";

import { useState, useTransition } from "react";
import { disconnectIntegration } from "@/actions/integration.actions";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plug,
  Loader2,
  ExternalLink,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { SiLinear, SiGithub, SiSentry } from "react-icons/si";
import { FaSlack } from "react-icons/fa";

const PROVIDERS = [
  {
    id: "github",
    name: "GitHub",
    description:
      "Trigger workflows on pull requests, pushes, issues, deployments, and releases.",
    icon: SiGithub,
    color: "zinc",
    accentColor: "#e2e8f0",
    gradient: "from-zinc-900/80 to-zinc-950",
    border: "border-zinc-700/50 hover:border-zinc-600/70",
    iconBg: "bg-zinc-800 border-zinc-700",
    badge: "bg-zinc-800/80 border-zinc-700 text-zinc-300",
    triggers: [
      "push",
      "pull_request.*",
      "issues.*",
      "deployment_status",
      "release",
    ],
    actions: ["Create issue", "Add comment", "Add label"],
    docsUrl: "https://docs.github.com/en/developers/webhooks-and-events",
  },
  {
    id: "slack",
    name: "Slack",
    description:
      "Post messages to channels and send DMs as a bot when workflows complete.",
    icon: FaSlack,
    color: "green",
    accentColor: "#4ade80",
    gradient: "from-green-950/30 to-zinc-950",
    border: "border-green-900/40 hover:border-green-700/50",
    iconBg: "bg-green-950/60 border-green-800/50",
    badge: "bg-green-950/60 border-green-800/50 text-green-300",
    triggers: [],
    actions: ["Post to channel", "Send DM", "Lookup channel"],
    docsUrl: "https://api.slack.com/authentication/oauth-v2",
  },
  {
    id: "linear",
    name: "Linear",
    description:
      "Trigger on issue events and automatically update issue status or create new issues.",
    icon: SiLinear,
    color: "violet",
    accentColor: "#a78bfa",
    gradient: "from-violet-950/30 to-zinc-950",
    border: "border-violet-900/40 hover:border-violet-700/50",
    iconBg: "bg-violet-950/60 border-violet-800/50",
    badge: "bg-violet-950/60 border-violet-800/50 text-violet-300",
    triggers: ["Issue.*", "Comment.*"],
    actions: ["Update status", "Add comment", "Create issue"],
    docsUrl: "https://developers.linear.app/docs/oauth/authentication",
  },
  {
    id: "sentry",
    name: "Sentry",
    description:
      "Primary trigger for the AI Incident Responder — fires on error alerts and metric spikes.",
    icon: SiSentry,
    color: "rose",
    accentColor: "#fb7185",
    gradient: "from-rose-950/30 to-zinc-950",
    border: "border-rose-900/40 hover:border-rose-700/50",
    iconBg: "bg-rose-950/60 border-rose-800/50",
    badge: "bg-rose-950/60 border-rose-800/50 text-rose-300",
    triggers: ["event_alert", "metric_alert"],
    actions: ["Read error details", "Get error frequency"],
    docsUrl: "https://docs.sentry.io/api/auth/",
  },
] as const;

type Provider = (typeof PROVIDERS)[number];

interface ConnectedIntegration {
  id: string;
  provider: string;
  status: string;
  scopes: string | null;
  providerAccountId: string | null;
  tokenExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IntegrationsClientProps {
  workspaceId: string;
  connectedIntegrations: ConnectedIntegration[];
  error?: string;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "connected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Connected
      </span>
    );
  }
  if (status === "degraded") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400">
        <AlertTriangle className="h-3 w-3" />
        Degraded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-zinc-900 border border-zinc-800 text-zinc-500">
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
      Not connected
    </span>
  );
}

function ProviderCard({
  provider,
  connected,
  workspaceId,
}: {
  provider: Provider;
  connected?: ConnectedIntegration;
  workspaceId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [disconnectConfirm, setDisconnectConfirm] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const Icon = provider.icon;
  const isConnected = !!connected && connected.status !== "disconnected";

  const handleDisconnect = () => {
    if (!disconnectConfirm) {
      setDisconnectConfirm(true);
      setTimeout(() => setDisconnectConfirm(false), 3000);
      return;
    }
    setLocalError(null);
    startTransition(async () => {
      const result = await disconnectIntegration(workspaceId, provider.id);
      if (result.error) {
        setLocalError(result.error);
      } else {
        window.location.reload();
      }
    });
  };

  const handleConnect = () => {
    window.location.href = `/api/integrations/${provider.id}/callback?workspaceId=${workspaceId}`;
  };

  return (
    <div
      className={`relative group overflow-hidden rounded-2xl border bg-gradient-to-br ${provider.gradient} ${provider.border} transition-all duration-300 flex flex-col`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${provider.accentColor}08 0%, transparent 70%)`,
        }}
      />

      <div className="relative p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 flex items-center justify-center rounded-xl border ${provider.iconBg} shrink-0`}
              style={{ color: provider.accentColor }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                {provider.name}
              </h3>
              {connected?.providerAccountId && (
                <p className="text-[10px] font-mono text-zinc-500 truncate max-w-[140px]">
                  {connected.providerAccountId}
                </p>
              )}
            </div>
          </div>
          <StatusBadge status={connected?.status ?? "disconnected"} />
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {provider.description}
        </p>
        <div className="space-y-2">
          {provider.triggers.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {(provider.triggers as readonly string[]).slice(0, 3).map((t) => (
                <span
                  key={t}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${provider.badge}`}
                >
                  {t}
                </span>
              ))}
              {provider.triggers.length > 3 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-zinc-900/60 border-zinc-800 text-zinc-500">
                  +{provider.triggers.length - 3} more
                </span>
              )}
            </div>
          )}
          {provider.triggers.length === 0 && (
            <span className="text-[10px] font-mono text-zinc-600 italic">
              Action-only (no triggers)
            </span>
          )}
        </div>

        {connected?.tokenExpiresAt &&
          new Date(connected.tokenExpiresAt) <
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              Token expires{" "}
              {new Date(connected.tokenExpiresAt).toLocaleDateString()}
            </div>
          )}

        {localError && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono">
            <XCircle className="h-3 w-3 shrink-0" />
            {localError}
          </div>
        )}
      </div>

      <div className="relative px-5 pb-5 flex items-center justify-between gap-3">
        <a
          href={provider.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Docs <ExternalLink className="h-3 w-3" />
        </a>

        {isConnected ? (
          <button
            id={`disconnect-${provider.id}`}
            onClick={handleDisconnect}
            disabled={isPending}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[11px] font-medium font-mono transition-all cursor-pointer ${
              disconnectConfirm
                ? "bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {disconnectConfirm ? "Click again to confirm" : "Disconnect"}
          </button>
        ) : (
          <button
            id={`connect-${provider.id}`}
            onClick={handleConnect}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[11px] font-medium font-mono bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer group/btn"
          >
            <Plug className="h-3 w-3 transition-transform group-hover/btn:rotate-12" />
            Connect
            <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function IntegrationsClient({
  workspaceId,
  connectedIntegrations,
  error,
}: IntegrationsClientProps) {
  const connectedCount = connectedIntegrations.filter(
    (i) => i.status === "connected",
  ).length;

  const getConnected = (providerId: string) =>
    connectedIntegrations.find((i) => i.provider === providerId);

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm font-mono">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>Error loading integrations: {error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-zinc-100">
              {connectedCount}
            </p>
            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Connected
            </p>
          </div>
          <div className="h-10 w-px bg-zinc-800" />
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-zinc-400">
              {PROVIDERS.length - connectedCount}
            </p>
            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Available
            </p>
          </div>
          <div className="h-10 w-px bg-zinc-800" />
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-zinc-100">
              {PROVIDERS.length}
            </p>
            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Total
            </p>
          </div>
        </div>

        {connectedCount === 0 && (
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Connect at least one integration to start creating workflows.
            </span>
          </div>
        )}
        {connectedCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              {connectedCount} integration{connectedCount > 1 ? "s" : ""} active
              and ready.
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {PROVIDERS.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            connected={getConnected(provider.id)}
            workspaceId={workspaceId}
          />
        ))}
      </div>

      <p className="text-[11px] font-mono text-zinc-600 text-center pb-4">
        OAuth tokens are encrypted at rest (AES-256-GCM) and never exposed in
        API responses or logs.
      </p>
    </div>
  );
}
