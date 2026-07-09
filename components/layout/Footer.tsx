import Link from "next/link";
import {
  SiGithub,
  SiSentry,
  SiJira,
  SiPagerduty,
  SiSlackware,
  SiRelay,
} from "@icons-pack/react-simple-icons";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <SiRelay className="h-5 w-5 text-indigo-400" />
            <span className="font-bold text-lg text-zinc-50">Relay</span>
          </Link>
          <p className="text-sm text-zinc-500 mb-6 pr-4">
            The Developer Integration Platform with an Agentic AI brain.
            Automate your toolchain natively.
          </p>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="#" className="hover:text-indigo-400 transition-colors">
              <SiGithub className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">
              <SiSentry className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">
              <SiJira className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">
              <SiPagerduty className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">
              <SiSlackware className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Links Columns */}
        <div>
          <h3 className="font-semibold text-zinc-100 mb-4">Product</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                Agentic Responder
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                Workflow Builder
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                Integrations
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                Changelog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-zinc-100 mb-4">Resources</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                API Reference
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                Community
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-zinc-100 mb-4">Company</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-900/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} Relay Platform Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-sm text-zinc-500">All systems operational</span>
        </div>
      </div>
    </footer>
  );
}
