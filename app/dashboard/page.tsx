import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWorkSpaces } from "@/actions/workspace.actions";
import { Navbar } from "@/components/layout/Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CreateWorkspaceModal } from "@/components/workspace/CreateWorkspaceModal";
import { ArrowRight, Terminal, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { workspaces, error } = await getWorkSpaces();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 relative">
        {/* Glow backgrounds */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative space-y-10">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-8">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">
                Workspaces
              </h1>
              <p className="text-zinc-400 text-sm max-w-2xl font-sans">
                Select a workspace to view your integrations, trigger incident
                response workflows, and configure autonomous developers.
              </p>
            </div>
            <div>
              <CreateWorkspaceModal />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm font-mono">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>[error] {error}</span>
            </div>
          )}

          {/* Workspaces Grid */}
          {!error && (!workspaces || workspaces.length === 0) ? (
            /* Empty State */
            <div className="relative p-12 md:p-16 rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800/80 text-center max-w-2xl mx-auto overflow-hidden">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none" />

              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                <Terminal className="h-6 w-6 text-indigo-400" />
              </div>

              <h3 className="text-xl font-bold text-zinc-100 mb-2">
                No Workspaces Found
              </h3>

              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                You haven't joined or created any workspaces yet. Create your
                first workspace to connect Sentry alerts, GitHub repositories,
                and begin autopilot debugging.
              </p>

              <CreateWorkspaceModal />
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces?.map((item) => {
                const ws = item.workspace;
                if (!ws) return null;

                return (
                  <Card
                    key={ws.id}
                    className="relative bg-zinc-950 border-zinc-800/80 hover:border-indigo-500/30 transition-all hover:bg-zinc-900/10 shadow-lg hover:shadow-indigo-500/5 group flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top border highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/20 transition-all">
                          <Terminal className="h-4.5 w-4.5 text-indigo-400" />
                        </div>
                        <CardTitle className="font-heading text-base font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">
                          {ws.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-zinc-500 font-mono text-[11px]">
                        ID: {ws.id}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-6">
                      <div className="space-y-2 text-xs text-zinc-400">
                        <div className="flex items-center justify-between font-sans">
                          <span>Active agents</span>
                          <span className="font-mono text-zinc-500">0</span>
                        </div>
                        <div className="flex items-center justify-between font-sans">
                          <span>Resolved issues</span>
                          <span className="font-mono text-zinc-500">0</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t border-zinc-900/60 pt-4 flex justify-between items-center bg-zinc-900/10">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                        <span>role: owner</span>
                      </div>
                      <Link
                        href={`/workspace/${ws.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer group/link"
                      >
                        <span>Enter</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" />
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
