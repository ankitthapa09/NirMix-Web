import Link from "next/link";
import Image from "next/image";

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
  findUs: [
    { label: "Events", href: "/events" },
    { label: "Locations", href: "/locations" },
    { label: "Newsletter", href: "/newsletter" },
  ],
};

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}


export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-[#157A74] bg-[#E2D6C9] text-[#342417]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-5 lg:px-8">
        {/* Brand Column */}
        <div className="space-y-4 col-span-1 md:col-span-1">
          <Link href="/" className="inline-block">
            <Image
              src="/images/NirMix_Logo.png"
              alt="NirMix Logo"
              width={160}
              height={52}
              className="h-14 w-auto object-contain"
            />
          </Link>
          <p className="max-w-xs text-xs leading-relaxed text-[#5C4D3C] font-semibold">
            Bringing you closer to your dream home, one click at a time.
          </p>
        </div>

        {/* About Column */}
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#342417]">
            About
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-[#5C4D3C]">
            {footerLinks.about.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-[#157A74]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#342417]">
            Support
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-[#5C4D3C]">
            {footerLinks.support.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-[#157A74]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Find Us Column */}
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#342417]">
            Find Us
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-[#5C4D3C]">
            {footerLinks.findUs.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-[#157A74]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Social Column */}
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#342417]">
            Our Social
          </h4>
          <ul className="space-y-3">
            {/* Instagram */}
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-xs font-semibold text-[#5C4D3C] hover:text-[#157A74] transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#C8B8A6] text-[#342417] hover:border-[#157A74] transition-colors">
                  <InstagramIcon className="h-3.5 w-3.5" />
                </span>
                Instagram
              </a>
            </li>

            {/* Facebook */}
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-xs font-semibold text-[#5C4D3C] hover:text-[#157A74] transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#C8B8A6] text-[#342417] hover:border-[#157A74] transition-colors">
                  <FacebookIcon className="h-3.5 w-3.5" />
                </span>
                Facebook
              </a>
            </li>

            {/* Twitter/X */}
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-xs font-semibold text-[#5C4D3C] hover:text-[#157A74] transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#C8B8A6] text-[#342417] hover:border-[#157A74] transition-colors">
                  <XIcon className="h-3.5 w-3.5" />
                </span>
                Twitter (x)
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#C8B8A6] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-[11px] font-semibold text-[#5C4D3C] sm:flex-row">
          <p>© {new Date().getFullYear()} NirMix. All rights reserved.</p>
          <p>
            Made for Nepal <span className="text-red-500">🇳🇵</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

