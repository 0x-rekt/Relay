import {
  SiGithub,
  SiSentry,
  SiJira,
  SiPagerduty,
  SiSlackware,
} from "@icons-pack/react-simple-icons";

const tools = [
  { name: "GitHub", icon: SiGithub },
  { name: "Sentry", icon: SiSentry },
  { name: "Slack", icon: SiSlackware },
  { name: "Jira / Linear", icon: SiJira },
  { name: "PagerDuty", icon: SiPagerduty },
];

export function IntegrationsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12 border-y border-zinc-900 bg-zinc-950/50">
      <p className="text-center text-sm font-medium text-zinc-500 uppercase tracking-widest mb-8">
        Natively integrated with your stack
      </p>
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <tool.icon className="w-6 h-6" />
            <span className="font-semibold">{tool.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
