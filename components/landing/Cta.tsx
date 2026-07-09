import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-32 text-center">
      <div className="p-12 rounded-3xl bg-zinc-900 border border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
        
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 mb-6">
          Ready to automate the boilerplate?
        </h2>
        <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
          Join the workspaces reducing MTTR and reclaiming 5+ hours a week. Get 2M tokens free on your first month.
        </p>
        <Button size="lg" className="bg-zinc-100 text-zinc-950 hover:bg-white rounded-full px-8 h-12 font-semibold">
          Create Workspace
        </Button>
      </div>
    </section>
  );
}