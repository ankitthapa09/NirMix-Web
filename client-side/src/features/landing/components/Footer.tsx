import Link from "next/link";
import { MapPin, Globe, Camera, MessageCircle } from "lucide-react";

const footerLinks = {
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Our Team", href: "/team" },
    { label: "Resources", href: "/resources" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Help Center", href: "/help" },
    { label: "Terms of Service", href: "/terms" },
  ],
  social: [
    { label: "Locations", href: "/locations", icon: MapPin },
    { label: "Facebook", href: "#", icon: Globe },
    { label: "Instagram", href: "#", icon: Camera },
    { label: "Twitter", href: "#", icon: MessageCircle },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-mist/60 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="text-2xl font-extrabold tracking-tight">
            Nir<span className="text-ember">Mix</span>
          </h3>
          <p className="max-w-xs text-xs leading-relaxed text-slate-400">
            Bringing you closer to your dream home, one click at a time.
          </p>
        </div>

        {/* About */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            About
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            {footerLinks.about.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-ember"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Support
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            {footerLinks.support.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-ember"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Social */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Our Social
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            {footerLinks.social.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-2 transition-colors hover:text-ember"
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-[11px] text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} NirMix. All rights reserved.</p>
          <p>
            Made for Nepal <span className="text-red-500">🇳🇵</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
