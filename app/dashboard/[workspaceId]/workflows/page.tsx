"use client";

import React, { useState } from "react";
import { 
  GitFork, 
  Sparkles, 
  Search, 
  Plus, 
  Play, 
  Pause, 
  Terminal, 
  ArrowRight, 
  Check, 
  RefreshCw, 
  Sliders, 
  AlertCircle 
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  triggerEvent: string;
  status: "active" | "paused";
  lastExecuted: string;
  actionsCount: number;
  description: string;
  hasAgent: boolean;
  definition: string;
}

export default function WorkflowsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<Workflow | null>(null);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "wf-1",
      name: "Sentry Incident Auto-Remediator",
      trigger: "Sentry",
      triggerEvent: "sentry.issue_created",
      status: "active",
      lastExecuted: "2 minutes ago",
      actionsCount: 3,
      description: "Triggered on critical Sentry errors. Starts autonomous incident responder agent to analyze code, search commits, and post solution to Slack.",
      hasAgent: true,
      definition: JSON.stringify({
        name: "Sentry Incident Auto-Remediator",
        trigger: { type: "sentry.issue_created", filters: { level: "error" } },
        actions: [
          { type: "ai_agent_step", config: { prompt: "Analyze error and draft hotfix PR", max_tool_calls: 8 } },
          { type: "slack.post_message", config: { channel: "#incidents", mention: "@dev-oncall" } }
        ]
      }, null, 2)
    },
    {
      id: "wf-2",
      name: "GitHub Release Announcer",
      trigger: "GitHub",
      triggerEvent: "github.release_published",
      status: "active",
      lastExecuted: "3 hours ago",
      actionsCount: 2,
      description: "When a release is published on main, generate plain-English changelogs from commits and notify the marketing Slack channel.",
      hasAgent: true,
      definition: JSON.stringify({
        name: "GitHub Release Announcer",
        trigger: { type: "github.release_published" },
        actions: [
          { type: "ai_agent_step", config: { prompt: "Summarize releases into changelogs" } },
          { type: "slack.post_message", config: { channel: "#product-updates" } }
        ]
      }, null, 2)
    },
    {
      id: "wf-3",
      name: "Vercel Deployment Failure Hook",
      trigger: "Vercel",
      triggerEvent: "vercel.deployment_failed",
      status: "paused",
      lastExecuted: "2 days ago",
      actionsCount: 2,
      description: "Triggered when a deployment fails. Auto-rolls back to the last stable deployment and runs a status check script.",
      hasAgent: false,
      definition: JSON.stringify({
        name: "Vercel Deployment Failure Hook",
        trigger: { type: "vercel.deployment_failed" },
        actions: [
          { type: "vercel.rollback_deployment" },
          { type: "slack.post_message", config: { channel: "#devops" } }
        ]
      }, null, 2)
    }
  ]);

  const handleToggleStatus = (id: string) => {
    setWorkflows(prev => 
      prev.map(w => w.id === id ? { ...w, status: w.status === "active" ? "paused" : "active" } : w)
    );
  };

  const startAIGeneration = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationStep(1);
    setGeneratedWorkflow(null);

    // Simulate AI workflow generation pipeline
    setTimeout(() => {
      setGenerationStep(2);
      setTimeout(() => {
        setGenerationStep(3);
        setTimeout(() => {
          setGenerationStep(4);
          setTimeout(() => {
            const hasAgentWord = prompt.toLowerCase().includes("agent") || prompt.toLowerCase().includes("ai") || prompt.toLowerCase().includes("responder");
            const newWorkflow: Workflow = {
              id: `wf-${Date.now()}`,
              name: prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt,
              trigger: prompt.toLowerCase().includes("github") ? "GitHub" : prompt.toLowerCase().includes("vercel") ? "Vercel" : "Webhook",
              triggerEvent: prompt.toLowerCase().includes("github") ? "github.push" : prompt.toLowerCase().includes("vercel") ? "vercel.deployment_succeeded" : "custom.webhook",
              status: "active",
              lastExecuted: "Never",
              actionsCount: hasAgentWord ? 3 : 2,
              description: `AI-generated workflow based on prompt: "${prompt}"`,
              hasAgent: hasAgentWord,
              definition: JSON.stringify({
                name: prompt,
                trigger: {
                  type: prompt.toLowerCase().includes("github") ? "github.push" : "custom.webhook"
                },
                actions: [
                  hasAgentWord ? {
                    type: "ai_agent_step",
                    config: {
                      prompt: "Investigate event data and compile insights"
                    }
                  } : {
                    type: "execute_script",
                    config: {
                      language: "javascript"
                    }
                  },
                  {
                    type: "slack.post_message",
                    config: {
                      channel: "#operations"
                    }
                  }
                ]
              }, null, 2)
            };
            setGeneratedWorkflow(newWorkflow);
            setIsGenerating(false);
          }, 800);
        }, 900);
      }, 700);
    }, 600);
  };

  const handleAddGeneratedWorkflow = () => {
    if (generatedWorkflow) {
      setWorkflows(prev => [generatedWorkflow, ...prev]);
      setGeneratedWorkflow(null);
      setPrompt("");
      setShowBuilder(false);
    }
  };

  const filteredWorkflows = workflows.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.trigger.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
            <GitFork className="w-6 h-6 text-indigo-400" />
            Workflows
          </h1>
          <p className="text-zinc-400 text-xs font-sans">
            Configure event triggers, design execution sequences, and integrate autonomous AI agents.
          </p>
        </div>
        <div>
          <Button 
            onClick={() => setShowBuilder(!showBuilder)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 text-xs font-medium cursor-pointer flex items-center gap-2"
          >
            {showBuilder ? "Hide AI Builder" : "Create Workflow with AI"}
            <Sparkles className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* AI Prompt Builder Section */}
      {showBuilder && (
        <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/10 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Natural Language Workflow Builder
            </h2>
            <p className="text-zinc-400 text-[11px] max-w-xl font-sans">
              Describe what automation you want in plain English. The AI will construct the dynamic filters, integrate requested events, and prepare the JSON schema setup.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              placeholder="Example: When a deployment fails on Vercel, run an AI agent to inspect the logs, check the git changes, and notify the #production-alerts channel in Slack."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="flex-1 min-h-[80px] rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 resize-none font-sans"
              disabled={isGenerating}
            />
            <Button
              onClick={startAIGeneration}
              disabled={isGenerating || !prompt.trim()}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/30 text-indigo-400 rounded-xl px-5 h-auto text-xs font-medium cursor-pointer shrink-0"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>Generate</span>
              )}
            </Button>
          </div>

          {/* Simulated AI Log / Stepper */}
          {isGenerating && (
            <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 font-mono text-[10px] space-y-2.5 text-zinc-400 select-none">
              <div className="flex items-center gap-2">
                <span className={generationStep >= 1 ? "text-indigo-400" : "text-zinc-600"}>●</span>
                <span className={generationStep >= 1 ? "text-zinc-300 font-bold" : "text-zinc-600"}>[AI] Parsed trigger conditions and webhook schema mappings...</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={generationStep >= 2 ? "text-indigo-400" : "text-zinc-600"}>●</span>
                <span className={generationStep >= 2 ? "text-zinc-300 font-bold" : "text-zinc-600"}>[AI] Assembling operational script block and agent config keys...</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={generationStep >= 3 ? "text-indigo-400" : "text-zinc-600"}>●</span>
                <span className={generationStep >= 3 ? "text-zinc-300 font-bold" : "text-zinc-600"}>[AI] Compiling JSON definition block...</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={generationStep >= 4 ? "text-emerald-400" : "text-zinc-600"}>●</span>
                <span className={generationStep >= 4 ? "text-emerald-400 font-bold" : "text-zinc-600"}>[AI] Validated configuration against Relay Core Schema. Complete!</span>
              </div>
            </div>
          )}

          {/* Render Result */}
          {generatedWorkflow && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* English Summary Card */}
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Check className="w-4 h-4" />
                  <span>Workflow Generation Ready</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-zinc-200">{generatedWorkflow.name}</h3>
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    Triggered on <strong>{generatedWorkflow.trigger}</strong>. This workflow executes {generatedWorkflow.actionsCount} actions, including {generatedWorkflow.hasAgent ? "an autonomous debugger session" : "a deterministic run script"} followed by notification delivery.
                  </p>
                </div>
                <Button 
                  onClick={handleAddGeneratedWorkflow}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Save and Activate
                </Button>
              </div>

              {/* JSON Definition Card */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-[10px] space-y-2 relative overflow-hidden">
                <div className="flex justify-between items-center text-zinc-500 pb-2 border-b border-zinc-900">
                  <span>workflow.json</span>
                  <span className="text-[8px] bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400 uppercase">valid schema</span>
                </div>
                <pre className="text-zinc-300 overflow-x-auto max-h-[160px] custom-scrollbar leading-relaxed">
                  {generatedWorkflow.definition}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-zinc-950 border border-zinc-900/80 hover:border-zinc-800/80 focus:border-indigo-500/50 pl-9 pr-4 py-2.5 text-xs text-zinc-200 focus:outline-none placeholder:text-zinc-600 transition-colors font-sans"
          />
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWorkflows.map(w => (
          <Card 
            key={w.id} 
            className="bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700/80 transition-all hover:bg-zinc-900/10 flex flex-col justify-between overflow-hidden relative group"
          >
            {/* Top border glow active state */}
            {w.status === "active" && (
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            )}

            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    w.trigger === "Sentry" 
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                      : w.trigger === "GitHub" 
                      ? "bg-zinc-800 text-zinc-300 border border-zinc-700" 
                      : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  }`}>
                    {w.trigger} trigger
                  </span>
                  {w.hasAgent && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Agentic AI
                    </span>
                  )}
                </div>
                
                {/* Active / Paused Pill */}
                <div className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                  w.status === "active" 
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                    : "bg-zinc-900 border border-zinc-800 text-zinc-500"
                }`}>
                  {w.status}
                </div>
              </div>

              <CardTitle className="text-base font-bold text-zinc-200 group-hover:text-zinc-50 transition-colors">
                {w.name}
              </CardTitle>
              <CardDescription className="text-zinc-500 font-mono text-[9px] mt-1">
                Event: {w.triggerEvent}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                {w.description}
              </p>

              {/* Workflow Details Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-900 font-mono text-[10px]">
                <div className="space-y-1">
                  <span className="text-zinc-500">Actions</span>
                  <p className="text-zinc-300 font-bold">{w.actionsCount} steps</p>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-500">Last Triggered</span>
                  <p className="text-zinc-300 font-bold">{w.lastExecuted}</p>
                </div>
              </div>
            </CardContent>

            <div className="border-t border-zinc-900/60 p-4 bg-zinc-900/10 flex justify-between items-center">
              <button 
                onClick={() => handleToggleStatus(w.id)}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                {w.status === "active" ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Pause Workflow</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-indigo-400 font-semibold">Resume Workflow</span>
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => alert(`JSON Schema definition:\n\n${w.definition}`)}
                  className="px-2.5 py-1 text-[10px] font-mono rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  View JSON
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
