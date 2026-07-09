import {
  SiGithub,
  SiSentry,
  SiJira,
  SiPagerduty,
  SiSlackware,
  SiVercel,
  SiLinear,
  SiDatadog,
  SiDiscord,
} from "@icons-pack/react-simple-icons";

const tools = [
  { name: "GitHub", icon: SiGithub, color: "hover:text-white hover:border-zinc-700 hover:bg-zinc-900/60" },
  { name: "Sentry", icon: SiSentry, color: "hover:text-[#362D59] dark:hover:text-[#E2E1E6] hover:border-[#362D59]/40 hover:bg-[#362D59]/10" },
  { name: "Slack", icon: SiSlackware, color: "hover:text-[#4A154B] dark:hover:text-[#ECB22E] hover:border-[#4A154B]/40 hover:bg-[#4A154B]/10" },
  { name: "Jira", icon: SiJira, color: "hover:text-[#0052CC] hover:border-[#0052CC]/40 hover:bg-[#0052CC]/10" },
  { name: "PagerDuty", icon: SiPagerduty, color: "hover:text-[#00D084] hover:border-[#00D084]/40 hover:bg-[#00D084]/10" },
  { name: "Vercel", icon: SiVercel, color: "hover:text-white hover:border-zinc-700 hover:bg-zinc-900/60" },
  { name: "Linear", icon: SiLinear, color: "hover:text-[#5E6AD2] hover:border-[#5E6AD2]/40 hover:bg-[#5E6AD2]/10" },
  { name: "Datadog", icon: SiDatadog, color: "hover:text-[#632CA6] hover:border-[#632CA6]/40 hover:bg-[#632CA6]/10" },
  { name: "Discord", icon: SiDiscord, color: "hover:text-[#5865F2] hover:border-[#5865F2]/40 hover:bg-[#5865F2]/10" },
];

export function IntegrationsSection() {
  // Duplicate tools array to ensure a seamless looping effect
  const marqueeTools = [...tools, ...tools, ...tools];

  return (
    <section id="integrations" className="w-full py-16 border-y border-zinc-900 bg-zinc-950/40 relative overflow-hidden">
      
      {/* Decorative background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0_/_2%)_1px,transparent_1px)] bg-[size:6rem_6rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
          Extensible Stack Ecosystem
        </p>
        <h3 className="text-xl md:text-2xl font-bold text-zinc-200">
          Natively Integrated with Your Existing Toolchain
        </h3>
      </div>

      {/* Infinite Marquee Container */}
      <div className="w-full relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] py-4">
        <div className="flex gap-8 w-max animate-marquee hover:[animation-play-state:paused] transition-all">
          {marqueeTools.map((tool, idx) => (
            <div
              key={`${tool.name}-${idx}`}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 text-zinc-400 backdrop-blur-sm transition-all duration-300 ${tool.color} cursor-pointer group`}
            >
              <tool.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold text-sm tracking-tight">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
