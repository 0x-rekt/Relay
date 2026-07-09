"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  // Live timeline logs for right panel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const timelineSteps = [
    {
      text: "⚠️ Sentry Alert received: TypeError: auth.user is undefined",
      type: "error",
    },
    {
      text: "🔍 Relay Agent analyzing repository git-diff in sandbox...",
      type: "info",
    },
    {
      text: "🛠️ Generated bugfix patch for controllers/auth.ts line 28",
      type: "success",
    },
    {
      text: "🚀 Patch verified against test suite & Pull Request #412 opened",
      type: "success",
    },
    {
      text: "✅ Slack dispatch sent. Incident mitigated in 4.8s.",
      type: "success",
    },
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Signing in with ${email}... (Mock auth flow)`);
  };

  const handleSignIn = async (provider: string) => {
    await authClient.signIn.social({
      provider: provider,
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      {/* LEFT COLUMN: Authentication Form */}
      <div className="flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 relative overflow-hidden">
        {/* Subtle grid and glow for mobile layout */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0_/_2%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_2%)_1px,transparent_1px)] bg-[size:4rem_4rem] lg:hidden pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 blur-[100px] rounded-full lg:hidden pointer-events-none" />

        {/* Top Header: Brand */}
        <div className="z-10 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/20 transition-all">
              <Terminal className="h-4.5 w-4.5 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight">Relay</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>
        </div>

        {/* Center: Auth card */}
        <div className="z-10 w-full max-w-sm mx-auto my-12">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              Welcome back
            </h1>
            <p className="text-zinc-400 text-sm">
              Sign in to your workspace to continue building on autopilot.
            </p>
          </div>

          {/* Social Logins */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-11 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-100 text-zinc-300 transition-all font-medium cursor-pointer rounded-xl flex items-center justify-center gap-2"
              onClick={() => handleSignIn("github")}
            >
              <SiGithub className="h-5 w-5" />
              <span>Continue with GitHub</span>
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-100 text-zinc-300 transition-all font-medium cursor-pointer rounded-xl flex items-center justify-center gap-2"
              onClick={() => handleSignIn("google")}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>
          </div>

          {/* Email Login Form */}
        </div>

        {/* Bottom footer disclaimer */}
        <div className="z-10 text-center text-xs text-zinc-600 leading-relaxed font-mono">
          By signing in, you agree to our{" "}
          <Link href="#" className="underline hover:text-zinc-400">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-zinc-400">
            Privacy Policy
          </Link>
          .
        </div>
      </div>

      {/* RIGHT COLUMN: Immersive Visual Panel (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900/30 border-l border-zinc-900 relative overflow-hidden">
        {/* Subtle grid and mesh glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0_/_3%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_3%)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Status tag */}
        <div className="z-10 flex items-center justify-end">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-xs font-mono text-zinc-400">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>sys_status: operational</span>
          </div>
        </div>

        {/* Visual Content: Mock Console and value prop */}
        <div className="z-10 max-w-lg mx-auto space-y-12">
          {/* Main Visual: Active Agent Simulator */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-2xl p-6 relative overflow-hidden group">
            {/* Spotlight overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <span className="font-mono text-sm font-semibold text-zinc-300">
                  relay-agent-prod-03
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 animate-pulse flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                  live_agent
                </span>
              </div>
            </div>

            {/* Simulated Live Logs */}
            <div className="font-mono text-xs text-left space-y-3.5 min-h-[160px]">
              {timelineSteps.map((step, index) => {
                const isActive = index <= activeStep;
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 transition-all duration-300 ${
                      isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 pointer-events-none"
                    }`}
                  >
                    {step.type === "error" ? (
                      <span className="text-red-400 font-semibold shrink-0">
                        [err]
                      </span>
                    ) : step.type === "success" ? (
                      <span className="text-emerald-400 font-semibold shrink-0">
                        [ok]
                      </span>
                    ) : (
                      <span className="text-indigo-400 font-semibold shrink-0">
                        [run]
                      </span>
                    )}
                    <span
                      className={`text-zinc-300 ${step.type === "error" ? "text-rose-200" : ""}`}
                    >
                      {step.text}
                    </span>
                  </div>
                );
              })}

              {activeStep < 4 && (
                <div className="flex items-center gap-1 opacity-70">
                  <span className="text-zinc-600">...</span>
                  <span className="h-4 w-1.5 bg-indigo-400 animate-cursor-blink" />
                </div>
              )}
            </div>
          </div>

          {/* Value Prop Bulletpoints */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Autopilot responder</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
              Mitigate production outages in seconds.
            </h2>

            <ul className="space-y-3.5 text-sm text-zinc-400 text-left">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Reduce mean-time-to-resolution (MTTR) by up to 85%</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Out-of-the-box integrations for Sentry, GitHub, Jira, and
                  Slack
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  100% secure, sandboxed container runtime for error
                  reproduction
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-right text-xs text-zinc-650 font-mono">
          Relay Cloud Inc. © 2026
        </div>
      </div>
    </div>
  );
}
