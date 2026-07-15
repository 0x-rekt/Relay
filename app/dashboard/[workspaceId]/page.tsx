import { getWorkspaceById } from "@/actions/workspace.actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Cpu, Sparkles, Users, Shield, AlertCircle, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  const { workspaceId } = await params;
  const { workspace } = await getWorkspaceById(workspaceId);

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm font-mono max-w-md">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>Error: Workspace not found or you do not have permission to access it.</span>
        </div>
      </div>
    );
  }

  const members = workspace.members || [];
  const owner = workspace.owner;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/60 via-zinc-950 to-indigo-950/10 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none -translate-y-12 translate-x-12" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex h-8 items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Active Workspace
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100">
            Welcome to {workspace.name}
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Monitor real-time workflow executions, set up autopilot debugging rules, and track your resource usage. Connect your developer tools to automate incident response.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric: AI Tokens */}
        <Card className="bg-zinc-950/60 border-zinc-800/80 hover:border-indigo-500/30 transition-all hover:bg-zinc-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">AI Tokens Used</span>
              <p className="text-2xl font-bold font-mono text-zinc-100">{workspace.ai_tokens_used.toLocaleString()}</p>
            </div>
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Cpu className="h-4.5 w-4.5 text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full" 
                style={{ width: `${Math.min(100, (workspace.ai_tokens_used / 100000) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-zinc-500">
              <span>Usage relative to limit</span>
              <span>100K Limit</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric: NL Gens */}
        <Card className="bg-zinc-950/60 border-zinc-800/80 hover:border-indigo-500/30 transition-all hover:bg-zinc-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">NL Generations</span>
              <p className="text-2xl font-bold font-mono text-zinc-100">{workspace.nl_gens_used.toLocaleString()}</p>
            </div>
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Sparkles className="h-4.5 w-4.5 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full" 
                style={{ width: `${Math.min(100, (workspace.nl_gens_used / 500) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-zinc-500">
              <span>Usage relative to limit</span>
              <span>500 Limit</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric: Members */}
        <Card className="bg-zinc-950/60 border-zinc-800/80 hover:border-indigo-500/30 transition-all hover:bg-zinc-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Team Size</span>
              <p className="text-2xl font-bold font-mono text-zinc-100">{members.length}</p>
            </div>
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Users className="h-4.5 w-4.5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex -space-x-2 overflow-hidden">
              {members.map((member, idx) => {
                const userObj = member.user;
                if (!userObj) return null;
                return (
                  <div key={idx} className="relative inline-block h-6 w-6 rounded-full ring-2 ring-zinc-950">
                    <Image
                      src={userObj.image || "https://lh3.googleusercontent.com/a/default-user=s96-c"}
                      alt={userObj.name || "Member"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-[10px] font-mono text-zinc-500">
              <span>Active workspace collaborators</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric: Owner */}
        <Card className="bg-zinc-950/60 border-zinc-800/80 hover:border-indigo-500/30 transition-all hover:bg-zinc-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Owner</span>
              <p className="text-sm font-bold text-zinc-200 truncate max-w-[150px]">{owner?.name || "Unknown"}</p>
            </div>
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Shield className="h-4.5 w-4.5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-2 flex items-center gap-2">
            {owner?.image && (
              <div className="relative h-6 w-6 rounded-full shrink-0">
                <Image
                  src={owner.image}
                  alt={owner.name || "Owner"}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <div className="text-[10px] font-mono text-zinc-500 truncate">
              {owner?.email || ""}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launch Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl border border-zinc-800/80 bg-zinc-900/10 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-100">Get Started with Workflows</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Connect triggers from Sentry, GitHub, or PagerDuty to execute script paths and auto-remediate issues using autonomous dev agents.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link 
                href={`/dashboard/${workspaceId}/workflows`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-zinc-50 text-sm font-medium transition-all group cursor-pointer"
              >
                Configure Workflows
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/dashboard/${workspaceId}/executions`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-sm font-medium transition-all cursor-pointer"
              >
                View History
              </Link>
            </div>
          </div>
        </div>

        {/* Integration Status Card */}
        <div className="p-6 rounded-3xl border border-zinc-800/80 bg-zinc-900/10 space-y-4">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-indigo-400" />
            Integrations
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
              <span className="text-zinc-400">GitHub App</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
              <span className="text-zinc-400">Sentry Webhook</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500">Not configured</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
              <span className="text-zinc-400">Slack Alerts</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500">Not configured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
