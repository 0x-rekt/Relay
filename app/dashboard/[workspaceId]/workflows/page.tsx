import { getWorkflows } from "@/actions/workflow.actions";
import { WorkflowCard } from "@/components/workflow/WorkflowCard";
import { CreateWorkflowModal } from "@/components/workflow/CreateWorkflowModal";
import { GitFork, AlertCircle, Plus, Zap, Cpu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ workspaceId: string }>;
}

const WorkflowPage = async ({ params }: PageProps) => {
  const { workspaceId } = await params;
  const { workflows, error } = await getWorkflows(workspaceId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-100">
              Workflows
            </h1>
            {workflows && workflows.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {workflows.length} {workflows.length === 1 ? "workflow" : "workflows"}
              </span>
            )}
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Create, manage, and monitor your automated pipelines and agent triggers.
          </p>
        </div>

        <CreateWorkflowModal workspaceId={workspaceId} />
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm font-mono">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>Error loading workflows: {error}</span>
        </div>
      )}

      {/* Empty state */}
      {!error && workflows?.length === 0 && (
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/50 via-zinc-950/80 to-zinc-950 p-10 md:p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
          {/* Ambient Glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center max-w-md space-y-6">
            {/* Icon Container */}
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-sm opacity-20 animate-pulse" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-indigo-500/30 text-indigo-400 shadow-xl shadow-indigo-500/10">
                <GitFork className="w-8 h-8" />
              </div>
            </div>

            {/* Text details */}
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-100">
                No Workflows Found
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                You haven&apos;t created any workflows in this workspace yet. Get started by building your first integration pipeline.
              </p>
            </div>

            {/* Action button */}
            <CreateWorkflowModal 
              workspaceId={workspaceId} 
              trigger={
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-2.5 font-medium transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]">
                  <Plus className="w-4 h-4" />
                  <span>Create Workflow</span>
                </Button>
              }
            />

            {/* Feature pill badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 border-t border-zinc-900/80 w-full text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Instant Execution</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Automations</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visual Flow Editor</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflows Grid */}
      {!error && workflows && workflows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowPage;
