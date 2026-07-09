import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <Terminal className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-50">
              Relay
            </span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#integrations"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              Integrations
            </Link>
            <Link
              href="#docs"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-zinc-300 hover:text-zinc-50 sm:block transition-colors"
          >
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 font-medium transition-all cursor-pointer">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
