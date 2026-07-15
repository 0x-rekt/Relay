"use client";

import React, { useState } from "react";
import { 
  PlayCircle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Calendar, 
  Clock, 
  Cpu, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  Filter
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExecutionLog {
  id: string;
  workflowName: string;
  workflowId: string;
  version: string;
  status: "success" | "failed" | "skipped";
  timestamp: string;
  duration: string;
  steps: {
    name: string;
    type: string;
    status: "success" | "failed" | "skipped";
    duration: string;
    log: string;
  }[];
  aiExplanation?: {
    cause: string;
    recommendation: string;
    category: string;
  };
}

export default function ExecutionsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed" | "skipped">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("exec-2"); // default expand the failed one to highlight AI debugger
  const [isRetrying, setIsRetrying] = useState<string | null>(null);

  const [executions, setExecutions] = useState<ExecutionLog[]>([
    {
      id: "exec-1",
      workflowName: "Sentry Incident Auto-Remediator",
      workflowId: "wf-1",
      version: "v1.2",
      status: "success",
      timestamp: "2026-07-15 09:12:05",
      duration: "12.4s",
      steps: [
        {
          name: "Sentry Webhook Trigger",
          type: "trigger",
          status: "success",
          duration: "0.1s",
          log: "Received webhook payload from Sentry. Issue ID: SEN-9921. Level: error."
        },
        {
          name: "Analyze Error Log (AI Agent)",
          type: "ai_agent_step",
          status: "success",
          duration: "11.2s",
          log: "Starting autonomous agent session. Max tool calls: 8.\n[Agent] Reading stack trace...\n[Agent] Searching git commit log for matching file: 'actions/workspace.actions.ts'...\n[Agent] Found potential root cause: null pointer check missing on line 125.\n[Agent] Created issue analysis summary."
        },
        {
          name: "Send Slack Alert",
          type: "action",
          status: "success",
          duration: "1.1s",
          log: "Sent alert payload to Slack channel #incidents. Message sent with block kit metadata."
        }
      ]
    },
    {
      id: "exec-2",
      workflowName: "Vercel Deployment Failure Hook",
      workflowId: "wf-3",
      version: "v1.0",
      status: "failed",
      timestamp: "2026-07-15 07:15:32",
      duration: "1.8s",
      steps: [
        {
          name: "Vercel Webhook Trigger",
          type: "trigger",
          status: "success",
          duration: "0.1s",
          log: "Received deployment.failed webhook event from Vercel. Project ID: prj_relay_web."
        },
        {
          name: "Vercel Rollback Deployment",
          type: "action",
          status: "failed",
          duration: "1.7s",
          log: "Requesting rollback to deployment 'dpl_last_stable'...\nERROR: 403 Forbidden. Invalid Vercel API Credentials or token expired."
        },
        {
          name: "Send Slack Alert",
          type: "action",
          status: "skipped",
          duration: "0.0s",
          log: "Action skipped because preceding step 'Vercel Rollback Deployment' failed."
        }
      ],
      aiExplanation: {
        category: "Authentication Failure",
        cause: "The Vercel integration API token has expired or has been revoked by the account admin.",
        recommendation: "Renew the Vercel API token in your integration credentials settings, then retry this execution run."
      }
    },
    {
      id: "exec-3",
      workflowName: "GitHub Release Announcer",
      workflowId: "wf-2",
      version: "v1.1",
      status: "skipped",
      timestamp: "2026-07-14 18:30:11",
      duration: "0.2s",
      steps: [
        {
          name: "GitHub Push Event Trigger",
          type: "trigger",
          status: "success",
          duration: "0.1s",
          log: "Received push payload. Branch: 'feature/sidebar'. Base ref: 'refs/heads/feature/sidebar'."
        },
        {
          name: "Filter branch == main",
          type: "filter",
          status: "skipped",
          duration: "0.1s",
          log: "Filter evaluation failed. Branch 'feature/sidebar' does not match target 'main'. Halting execution."
        }
      ]
    }
  ]);

  const handleRetry = (execId: string) => {
    setIsRetrying(execId);
    setTimeout(() => {
      setIsRetrying(null);
      alert("Simulating workflow rerun. Triggered fresh execution context.");
    }, 1500);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredExecutions = executions.filter(exec => {
    const matchesStatus = statusFilter === "all" || exec.status === statusFilter;
    const matchesSearch = exec.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exec.workflowId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
            <PlayCircle className="w-6 h-6 text-indigo-400" />
            Executions
          </h1>
          <p className="text-zinc-400 text-xs font-sans">
            Review detailed, step-by-step logs, dry runs, and AI analysis for past workflow runs.
          </p>
        </div>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by execution ID or workflow name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-zinc-950 border border-zinc-900/80 hover:border-zinc-800/80 focus:border-indigo-500/50 pl-9 pr-4 py-2.5 text-xs text-zinc-200 focus:outline-none placeholder:text-zinc-600 transition-colors font-sans"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/40 border border-zinc-900 self-start sm:self-auto font-mono text-[10px]">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === "all" ? "bg-zinc-800 text-zinc-200 font-bold" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("success")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === "success" ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/10" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setStatusFilter("failed")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === "failed" ? "bg-rose-500/10 text-rose-400 font-bold border border-rose-500/10" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Failed
          </button>
          <button
            onClick={() => setStatusFilter("skipped")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === "skipped" ? "bg-zinc-800 text-zinc-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Skipped
          </button>
        </div>
      </div>

      {/* Logs Accordion */}
      <div className="space-y-4">
        {filteredExecutions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-900 bg-zinc-950/20">
            <p className="text-zinc-500 text-xs font-mono">No execution records found matching your filters.</p>
          </div>
        ) : (
          filteredExecutions.map(exec => {
            const isExpanded = expandedId === exec.id;
            return (
              <div 
                key={exec.id} 
                className={`rounded-2xl border transition-all ${
                  isExpanded 
                    ? "border-zinc-800 bg-zinc-900/10" 
                    : "border-zinc-900 hover:border-zinc-800/80 bg-zinc-950/40"
                }`}
              >
                {/* Header Row */}
                <div 
                  onClick={() => toggleExpand(exec.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    {/* Status icon */}
                    <div className="mt-0.5 shrink-0">
                      {exec.status === "success" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : exec.status === "failed" ? (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-zinc-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-zinc-200">
                          {exec.workflowName}
                        </h3>
                        <span className="text-[9px] font-mono text-zinc-500">
                          {exec.version}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {exec.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exec.duration}
                        </span>
                        <span>ID: {exec.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full uppercase ${
                      exec.status === "success" 
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                        : exec.status === "failed" 
                        ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" 
                        : "bg-zinc-800 border border-zinc-700 text-zinc-400"
                    }`}>
                      {exec.status}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Content Panel */}
                {isExpanded && (
                  <div className="border-t border-zinc-900 p-5 space-y-6 animate-in slide-in-from-top-1 duration-200">
                    
                    {/* AI debugger explanation block */}
                    {exec.status === "failed" && exec.aiExplanation && (
                      <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-rose-500/10">
                          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                            <Sparkles className="w-4 h-4" />
                            <span>AI Failure Analysis</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-rose-950/40 text-[9px] font-mono text-rose-300">
                            {exec.aiExplanation.category}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono uppercase text-zinc-500">Root Cause Description</span>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{exec.aiExplanation.cause}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono uppercase text-zinc-500">Suggested Action</span>
                            <p className="text-xs text-emerald-400 leading-relaxed font-sans font-medium">{exec.aiExplanation.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step Timeline */}
                    <div className="space-y-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Execution Sequence</span>
                      <div className="space-y-3 font-mono text-xs">
                        {exec.steps.map((step, idx) => (
                          <div key={idx} className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 space-y-3">
                            <div className="flex items-center justify-between text-[10px] pb-2 border-b border-zinc-900/60">
                              <div className="flex items-center gap-2">
                                <span className={
                                  step.status === "success" 
                                    ? "text-emerald-400" 
                                    : step.status === "failed" 
                                    ? "text-rose-400" 
                                    : "text-zinc-600"
                                }>●</span>
                                <span className="font-bold text-zinc-300">{step.name}</span>
                                <span className="text-zinc-600">({step.type})</span>
                              </div>
                              <span className="text-zinc-500">{step.duration}</span>
                            </div>
                            <pre className="text-zinc-400 text-[10px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                              {step.log}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rerun/Retry options */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-[10px] font-mono text-zinc-500">
                        Version context: {exec.version} • Worker Node: w-us-east-1
                      </div>
                      <Button
                        onClick={() => handleRetry(exec.id)}
                        disabled={isRetrying === exec.id}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer flex items-center gap-2"
                      >
                        {isRetrying === exec.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Retrying...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Rerun Execution</span>
                          </>
                        )}
                      </Button>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
