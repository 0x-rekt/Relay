"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  GitFork, 
  PlayCircle, 
  ChevronLeft, 
  Cpu, 
  Sparkles,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  workspace: {
    id: string;
    name: string;
    ai_tokens_used: number;
    nl_gens_used: number;
  };
}

export function Sidebar({ workspace }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Overview",
      href: `/dashboard/${workspace.id}`,
      icon: LayoutDashboard,
      active: pathname === `/dashboard/${workspace.id}`,
    },
    {
      name: "Workflows",
      href: `/dashboard/${workspace.id}/workflows`,
      icon: GitFork,
      active: pathname.startsWith(`/dashboard/${workspace.id}/workflows`),
    },
    {
      name: "Executions",
      href: `/dashboard/${workspace.id}/executions`,
      icon: PlayCircle,
      active: pathname.startsWith(`/dashboard/${workspace.id}/executions`),
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-900/80 p-5 flex flex-col justify-between h-auto md:h-[calc(100vh-4rem)] sticky top-16 select-none z-20">
      <div className="space-y-6">
        {/* Back Link & Workspace Label */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors group cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Workspaces</span>
          </Link>

          {/* Workspace Title Card */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/30 border border-zinc-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Terminal className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-zinc-200 truncate" title={workspace.name}>
                {workspace.name}
              </h2>
              <span className="text-[10px] font-mono text-zinc-500">Active Workspace</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer",
                  item.active
                    ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-sm"
                    : "border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-105",
                  item.active ? "text-indigo-400" : "text-zinc-400 group-hover:text-zinc-300"
                )} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Usage card at the bottom */}
      <div className="pt-6 border-t border-zinc-900/80 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Workspace Usage</span>
        </div>

        {/* AI Tokens Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-zinc-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400" />
              AI Tokens
            </span>
            <span className="text-zinc-300">{workspace.ai_tokens_used.toLocaleString()}</span>
          </div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (workspace.ai_tokens_used / 100000) * 100)}%` }}
            />
          </div>
        </div>

        {/* NL Generations Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              NL Gens
            </span>
            <span className="text-zinc-300">{workspace.nl_gens_used.toLocaleString()}</span>
          </div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (workspace.nl_gens_used / 500) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
