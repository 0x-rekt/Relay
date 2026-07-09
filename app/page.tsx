import { HeroSection } from "@/components/landing/Hero";
import { FeaturesSection } from "@/components/landing/Features";
import { IntegrationsSection } from "@/components/landing/Integrations";
import { CtaSection } from "@/components/landing/Cta";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      <Navbar />
      <main className="flex-1 w-full">
        <HeroSection />
        <IntegrationsSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}