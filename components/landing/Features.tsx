import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Workflow, MessageSquareCode, BugPlay } from "lucide-react";

const features = [
  {
    title: "Agentic Incident Responder",
    description: "When Sentry fires, Relay's AI autonomously investigates GitHub commits and Jira bugs, synthesizing a root cause hypothesis before you even open Slack.",
    icon: BrainCircuit,
    colSpan: "md:col-span-2",
  },
  {
    title: "Natural Language Builder",
    description: "Describe your workflow in plain English. Our LLM generates, validates, and deploys the JSON configuration instantly.",
    icon: MessageSquareCode,
    colSpan: "md:col-span-1",
  },
  {
    title: "Deterministic Workflows",
    description: "At-least-once delivery, exponential backoff, and idempotency built-in for mission-critical webhook automations.",
    icon: Workflow,
    colSpan: "md:col-span-1",
  },
  {
    title: "AI Execution Debugger",
    description: "Failed workflow? Get plain-English explanations distinguishing between user errors, API rate limits, or platform bugs.",
    icon: BugPlay,
    colSpan: "md:col-span-2",
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 mb-4">
          Engineered for Developers
        </h2>
        <p className="text-zinc-400 max-w-2xl">
          We combined deterministic rule engines with ReAct-style LLM agents to handle everything from ticket syncing to root-cause analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <Card key={i} className={`bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors ${feature.colSpan}`}>
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4 border border-zinc-700">
                <feature.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <CardTitle className="text-xl text-zinc-100">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-zinc-400 text-base leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}