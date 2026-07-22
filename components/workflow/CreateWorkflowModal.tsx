"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWorkflow } from "@/actions/workflow.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { GitFork, Plus, Loader2 } from "lucide-react";

interface CreateWorkflowModalProps {
  workspaceId: string;
  trigger?: React.ReactElement;
}

export function CreateWorkflowModal({ workspaceId, trigger }: CreateWorkflowModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await createWorkflow(workspaceId, name);
      if (res.error) {
        setError(res.error);
      } else {
        setName("");
        setOpen(false);
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 py-2 font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-indigo-500/20">
      <Plus className="w-4 h-4" />
      <span>Create Workflow</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ?? defaultTrigger} />

      <DialogContent className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 relative">
        {/* Glow background */}
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none" />

        <DialogHeader className="flex flex-row items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <GitFork className="h-4.5 w-4.5" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-zinc-100">
              Create Workflow
            </DialogTitle>
          </div>
        </DialogHeader>

        <DialogDescription className="text-sm text-zinc-400 mb-4">
          Build an automated workflow pipeline to connect tools and automate actions.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="workflow-name"
              className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2"
            >
              Workflow Name
            </label>
            <input
              id="workflow-name"
              type="text"
              required
              placeholder="e.g. Incident Triage Pipeline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 focus:outline-none text-zinc-100 text-sm transition-all placeholder:text-zinc-600"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-xs text-rose-400 font-mono bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
              [error] {error}
            </div>
          )}

          <DialogFooter className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setError("");
                setName("");
              }}
              className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-xl px-4 py-2"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2 font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Create Workflow</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkflowModal;
