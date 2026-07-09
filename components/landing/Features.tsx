import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Workflow, MessageSquareCode, BugPlay, Check, AlertCircle, Sparkles, Send } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-20 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-4 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-5">
          Engineered for Modern Developers
        </h2>
        <p className="text-zinc-400 max-w-2xl text-base md:text-lg leading-relaxed">
          We combined deterministic rule engines with autonomous ReAct-style LLM agents to handle everything from ticket syncing to auto-rollback root cause investigations.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Card 1: Agentic Incident Responder */}
        <Card className="bg-zinc-950/40 border-zinc-800/80 backdrop-blur-md hover:border-indigo-500/40 hover:shadow-indigo-500/5 hover:shadow-2xl transition-all duration-300 md:col-span-2 flex flex-col justify-between group overflow-hidden">
          <div className="p-8 pb-4">
            <CardHeader className="p-0">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <BrainCircuit className="w-6 h-6 text-indigo-400 group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl text-zinc-100 font-semibold mb-3">Agentic Incident Responder</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-zinc-400 text-base leading-relaxed max-w-xl">
                When Sentry fires, Relay&apos;s AI autonomously investigates GitHub commits and Jira issues, synthesizing a root cause hypothesis and delivering a contextualized incident report before you even open Slack.
              </CardDescription>
            </CardContent>
          </div>
          
          {/* Card 1 Mockup */}
          <div className="px-8 pb-8 pt-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-4 font-mono text-xs text-zinc-400 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <span className="text-red-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  CRITICAL: Sentry Alert #839
                </span>
                <span className="text-zinc-600">payment_svc</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-zinc-300">⚡ TypeError: Cannot read properties of null (reading &apos;amount&apos;)</p>
                <p className="text-zinc-500">→ Scanning recent commits by <span className="text-indigo-400">@developer-x</span>...</p>
                <p className="text-emerald-400/90 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Identified bug in checkout.ts:L98 (missing null check on orderTotal)
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Natural Language Builder */}
        <Card className="bg-zinc-950/40 border-zinc-800/80 backdrop-blur-md hover:border-indigo-500/40 hover:shadow-indigo-500/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
          <div className="p-8 pb-4">
            <CardHeader className="p-0">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <MessageSquareCode className="w-6 h-6 text-indigo-400 group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl text-zinc-100 font-semibold mb-3">Natural Language Builder</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-zinc-400 text-base leading-relaxed">
                Describe your automation flows in plain English. Our AI generates, type-checks, and deploys the JSON configurations instantly.
              </CardDescription>
            </CardContent>
          </div>
          
          {/* Card 2 Mockup */}
          <div className="px-8 pb-8 pt-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-4 space-y-3">
              <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 border border-zinc-800">
                <span className="text-[11px] text-zinc-400 font-medium line-clamp-1 italic">
                  &quot;Sync Github issues to Jira...&quot;
                </span>
                <Send className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-auto" />
              </div>
              <div className="rounded border border-zinc-900 bg-zinc-950 p-2 font-mono text-[10px] text-zinc-500 overflow-x-auto">
                <span className="text-indigo-400">&quot;trigger&quot;</span>: <span className="text-emerald-400">&quot;github.issue_opened&quot;</span>,<br />
                <span className="text-indigo-400">&quot;action&quot;</span>: <span className="text-emerald-400">&quot;jira.create_ticket&quot;</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: Deterministic Workflows */}
        <Card className="bg-zinc-950/40 border-zinc-800/80 backdrop-blur-md hover:border-indigo-500/40 hover:shadow-indigo-500/5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
          <div className="p-8 pb-4">
            <CardHeader className="p-0">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Workflow className="w-6 h-6 text-indigo-400 group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl text-zinc-100 font-semibold mb-3">Deterministic Workflows</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-zinc-400 text-base leading-relaxed">
                At-least-once delivery guarantees, exponential backoff, and idempotency built-in for mission-critical webhook automations.
              </CardDescription>
            </CardContent>
          </div>
          
          {/* Card 3 Mockup */}
          <div className="px-8 pb-8 pt-4">
            <div className="flex items-center justify-between gap-2 bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 font-mono text-xs">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-zinc-500 mb-1">Trigger</span>
                <span className="px-2 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800/80 rounded-md font-semibold text-[11px]">
                  Webhook
                </span>
              </div>
              <div className="h-px bg-zinc-800 flex-1 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-zinc-500 mb-1">Retry</span>
                <span className="px-2 py-1 bg-amber-950/80 text-amber-300 border border-amber-900/60 rounded-md text-[11px]">
                  Backoff 3s
                </span>
              </div>
              <div className="h-px bg-zinc-800 flex-1" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-zinc-500 mb-1">Status</span>
                <span className="px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-900/60 rounded-md text-[11px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  200 OK
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 4: AI Execution Debugger */}
        <Card className="bg-zinc-950/40 border-zinc-800/80 backdrop-blur-md hover:border-indigo-500/40 hover:shadow-indigo-500/5 hover:shadow-2xl transition-all duration-300 md:col-span-2 flex flex-col justify-between group overflow-hidden">
          <div className="p-8 pb-4">
            <CardHeader className="p-0">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <BugPlay className="w-6 h-6 text-indigo-400 group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl text-zinc-100 font-semibold mb-3">AI Execution Debugger</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-zinc-400 text-base leading-relaxed max-w-xl">
                Failed workflow execution? Get clear, plain-English explanations identifying whether the issue lies in user input errors, API rate limits, or downstream platform outages.
              </CardDescription>
            </CardContent>
          </div>
          
          {/* Card 4 Mockup */}
          <div className="px-8 pb-8 pt-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-4 font-mono text-xs flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-1.5 border-b md:border-b-0 md:border-r border-zinc-900 pb-3 md:pb-0 md:pr-4">
                <p className="text-red-400 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Execution Failed: Step 2
                </p>
                <p className="text-zinc-500 text-[11px]">POST https://api.linear.app/v1/issues</p>
                <p className="text-amber-500/90 font-medium">Status code: 401 Unauthorized</p>
              </div>
              <div className="flex-1 bg-zinc-900/55 p-3 rounded-lg border border-zinc-850">
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block mb-1">Relay Debug Assistant</span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  &quot;The API key provided for Linear has expired or is invalid. Regenerate the token in Linear settings and update your credentials in Relay secrets.&quot;
                </p>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </section>
  );
}