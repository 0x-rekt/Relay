"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Terminal,
  GitBranch,
  Cpu,
  Settings,
  FileText,
} from "lucide-react";
import { FaSlack } from "react-icons/fa";
import {
  SiGithub,
  SiSentry,
  SiJira,
  SiPagerduty,
  SiVercel,
  SiLinear,
  SiDatadog,
  SiDiscord,
} from "@icons-pack/react-simple-icons";

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<"logs" | "report" | "json">(
    "logs",
  );
  const [logStep, setLogStep] = useState(0);

  // Auto-typing simulator for logs
  useEffect(() => {
    if (activeTab !== "logs") return;
    const interval = setInterval(() => {
      setLogStep((prev) => (prev < 7 ? prev + 1 : 0));
    }, 2200);
    return () => clearInterval(interval);
  }, [activeTab]);

  const mockLogs = [
    {
      time: "20:47:06",
      type: "info",
      text: "📥 Webhook received from sentry.io: Alert #1289",
    },
    {
      time: "20:47:07",
      type: "agent",
      text: "🔍 Triggering IncidentResponderAgent...",
    },
    {
      time: "20:47:08",
      type: "agent",
      text: "🕵️ Fetching recent commits for PaymentService.ts from GitHub",
    },
    {
      time: "20:47:09",
      type: "agent",
      text: "📂 Searching Linear for open bugs related to PaymentService",
    },
    {
      time: "20:47:10",
      type: "agent",
      text: "📊 Retrieving error frequency from Sentry (last 24h)",
    },
    {
      time: "20:47:11",
      type: "agent",
      text: "🧠 Synthesizing findings and compiling incident report...",
    },
    {
      time: "20:47:12",
      type: "info",
      text: "✅ Contextualized report posted to #incidents (5.2s)",
    },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-24 flex flex-col items-center text-center overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0_/_4%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_4%)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* Dynamic Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none animate-float" />
      <div className="absolute top-36 left-1/3 w-[300px] h-[200px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Floating Integration Icons — hidden on small screens */}
      <SiGithub className="hidden md:block absolute top-[8%] left-[6%] w-7 h-7 text-zinc-600 animate-float-slow pointer-events-none" />
      <SiSentry className="hidden md:block absolute top-[5%] right-[8%] w-7 h-7 text-[#362D59] dark:text-[#E2E1E6]/20 animate-float-slower pointer-events-none" />
      <SiDiscord className="hidden md:block absolute top-[22%] left-[3%] w-6 h-6 text-[#5865F2]/40 animate-float pointer-events-none" />
      <SiJira className="hidden md:block absolute top-[20%] right-[4%] w-6 h-6 text-[#0052CC]/40 animate-float-slow pointer-events-none" />
      <SiVercel className="hidden md:block absolute top-[38%] left-[12%] w-6 h-6 text-zinc-500/40 animate-float-slower pointer-events-none" />
      <FaSlack className="hidden md:block absolute top-[40%] right-[10%] w-6 h-6 text-[#4A154B]/90 dark:text-[#ECB22E]/20 animate-float-fast pointer-events-none" />
      <SiPagerduty className="hidden md:block absolute top-[55%] left-[5%] w-6 h-6 text-[#00D084]/50 animate-float-slow pointer-events-none" />
      <SiLinear className="hidden md:block absolute top-[58%] right-[6%] w-6 h-6 text-[#5E6AD2]/60 animate-float pointer-events-none" />
      <SiDatadog className="hidden md:block absolute top-[72%] left-[9%] w-6 h-6 text-[#632CA6]/20 animate-float-slower pointer-events-none" />

      {/* Floating Notification/Tag */}
      <div className="z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-xs md:text-sm font-medium text-zinc-300 mb-8 backdrop-blur-sm shadow-md hover:border-zinc-700 transition-colors">
        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
        <Terminal className="w-3.5 h-3.5 text-indigo-400" />
        <span>Relay v1.0 — Autonomous Incident Investigation</span>
      </div>

      {/* Title */}
      <h1 className="z-10 text-5xl md:text-8xl font-extrabold tracking-tight mb-6 max-w-5xl leading-[1.05]">
        <span className="block text-3xl md:text-5xl font-light tracking-wide text-zinc-400 mb-3">
          Your Stack. Connected.
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-600 animate-gradient bg-[length:200%_auto] drop-shadow-[0_0_40px_rgba(99,102,241,0.25)]">
          Incidents. Investigated.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="z-10 text-lg md:text-xl text-zinc-400 max-w-3xl mb-12 leading-relaxed font-normal">
        Relay connects your dev stack with autonomous AI agents that detect
        incidents, investigate root causes across tools, and deliver
        contextualized reports — so you can respond in seconds, not minutes.
      </p>

      {/* Call to Actions */}
      <div className="z-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-20 max-w-md">
        <Button
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 h-12 w-full sm:w-auto font-medium transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          Start Building Free <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-zinc-800 text-zinc-300 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white rounded-full px-8 h-12 w-full sm:w-auto font-medium backdrop-blur-sm transition-all cursor-pointer"
        >
          Read the Docs
        </Button>
      </div>

      {/* Interactive Mock Agent Console */}
      <div className="z-10 w-full max-w-5xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden group/console">
        {/* Border highlights */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/60 border-b border-zinc-800/80">
          {/* Mac window dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/40 group-hover/console:bg-red-500/80 transition-colors" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/40 group-hover/console:bg-yellow-500/80 transition-colors" />
            <span className="w-3 h-3 rounded-full bg-green-500/40 group-hover/console:bg-green-500/80 transition-colors" />
          </div>

          {/* File Tab Selector */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-0.5">
            <button
              onClick={() => {
                setActiveTab("logs");
                setLogStep(7);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === "logs"
                  ? "bg-zinc-800 text-zinc-100"
                  : "hover:text-zinc-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>agent_responder.log</span>
            </button>
            <button
              onClick={() => setActiveTab("report")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === "report"
                  ? "bg-zinc-800 text-zinc-100"
                  : "hover:text-zinc-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>incident_report.json</span>
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === "json"
                  ? "bg-zinc-800 text-zinc-100"
                  : "hover:text-zinc-200"
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              <span>workflow.json</span>
            </button>
          </div>

          {/* Active Status Badge */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>agent_live</span>
          </div>
        </div>

        {/* Console Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[340px] text-left">
          {/* Left Main Console Output */}
          <div className="p-6 md:col-span-3 font-mono text-xs md:text-sm bg-zinc-950/90 leading-relaxed overflow-y-auto">
            {activeTab === "logs" && (
              <div className="space-y-3">
                {mockLogs.slice(0, logStep + 1).map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 animate-fadeIn"
                  >
                    <span className="text-zinc-600 select-none">
                      [{log.time}]
                    </span>
                    {log.type === "info" ? (
                      <span className="text-indigo-400 font-semibold">
                        [system]
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">
                        [agent]
                      </span>
                    )}
                    <span className="text-zinc-300 break-all">{log.text}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-600 select-none">
                    [{mockLogs[logStep === 7 ? 6 : logStep].time}]
                  </span>
                  <span className="h-4 w-1.5 bg-indigo-400 animate-cursor-blink" />
                </div>
              </div>
            )}

            {activeTab === "report" && (
              <pre className="text-zinc-400 overflow-x-auto selection:bg-indigo-500/20">
                <code>
                  {`{
  "summary": "NullPointerException in PaymentService.processRefund",
  "severity": "high",
  "hypothesis": "Likely introduced in commit a3f2d1 (2 hrs ago) by @dev-name — refactored null-check removed",
  "affectedModule": "PaymentService",
  "recentCommits": [
    "a3f2d1",
    "b7e9c2",
    "d1f4e3"
  ],
  "relatedIssues": [
    "BUG-142",
    "BUG-158"
  ],
  "suggestedOwner": "@dev-name",
  "confidence": "medium"
}`}
                </code>
              </pre>
            )}

            {activeTab === "json" && (
              <pre className="text-zinc-400 overflow-x-auto selection:bg-purple-500/20">
                <code>
                  {`{
  "id": "workflow_sentry_handler",
  "name": "Auto-Resolve Production Alerts",
  "trigger": {
    "type": "webhook",
    "provider": "sentry",
    "event": "issue_created"
  },
  "actions": [
    {
      "name": "diagnose_bug",
      "uses": "relay/agentic-responder",
      "with": {
        "sandbox": "isolated-node20",
        "interactive": true
      }
    },
    {
      "name": "notify_devs",
      "uses": "relay/slack",
      "with": {
        "channel": "#production-alerts"
      }
    }
  ]
}`}
                </code>
              </pre>
            )}
          </div>

          {/* Right Console Stats Panel */}
          <div className="p-6 border-t md:border-t-0 md:border-l border-zinc-800/80 bg-zinc-900/30 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  Active Task
                </h4>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-zinc-200">
                    Incident Investigation
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  Performance
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Avg MTTR</span>
                    <span className="text-zinc-200 font-mono">5.2 seconds</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Success Rate</span>
                    <span className="text-emerald-400 font-semibold font-mono">
                      98.4%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Tokens / Run</span>
                    <span className="text-zinc-200 font-mono">1.2k avg</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  Connected Branch
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono bg-zinc-950 px-2 py-1.5 rounded-lg border border-zinc-800">
                  <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                  <span>origin/main</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800/50">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-500 font-medium">
                  Relay Agent Status
                </span>
                <span className="text-indigo-400 font-medium">92% load</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full animate-pulse"
                  style={{ width: "92%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
