import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-24 text-center relative overflow-hidden">
      
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative p-12 md:p-16 rounded-3xl bg-zinc-950 border border-zinc-800/80 shadow-2xl overflow-hidden group">
        
        {/* Border highlights */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />

        {/* Mesh Spotlight */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-indigo-500/15 via-indigo-500/5 to-transparent blur-[80px] pointer-events-none transition-transform duration-500 group-hover:scale-105" />

        {/* Small floating Sparkle */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Instant Onboarding</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-100 mb-6 leading-tight max-w-2xl mx-auto">
          Ready to Automate your Developer Boilerplate?
        </h2>
        
        <p className="text-zinc-400 mb-10 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
          Join the engineering teams reducing MTTR to seconds and reclaiming 5+ hours a week. Get 2M tokens free on your first month.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
          <Button size="lg" className="w-full bg-zinc-100 text-zinc-950 hover:bg-white rounded-full px-8 h-12 font-semibold shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-100 transition-all cursor-pointer">
            Create Free Workspace
          </Button>
          <Button size="lg" variant="outline" className="w-full border-zinc-800 text-zinc-300 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white rounded-full px-6 h-12 font-medium backdrop-blur-sm transition-all cursor-pointer">
            Talk to Sales
          </Button>
        </div>

        <p className="text-[11px] text-zinc-500 mt-6 font-mono">
          No credit card required. Free tier includes all core integrations.
        </p>
      </div>
    </section>
  );
}