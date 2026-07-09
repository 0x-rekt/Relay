import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-32 flex flex-col items-center text-center">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-300 mb-8">
        <Terminal className="w-4 h-4 text-indigo-400" />
        <span>Relay v1.0 is live with Agentic AI</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-500">
        The Developer Integration Platform with a Brain.
      </h1>
      
      <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
        Eliminate friction between your tools. Combine rule-based workflow automation with an autonomous agentic incident responder to resolve issues faster, without human-in-the-loop bottlenecks.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-12 w-full sm:w-auto font-medium cursor-pointer">
          Start Building Free <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button size="lg" variant="outline" className="border-zinc-800 text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white rounded-full px-8 h-12 w-full sm:w-auto font-medium cursor-pointer">
          Read the Docs
        </Button>
      </div>
    </section>
  );
}