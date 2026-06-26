"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { LandingPage } from "@/features/landing/LandingPage";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSignup = pathname === "/signup";

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Background Landing Page (Blurred and non-interactive) */}
      <div className="absolute inset-0 select-none pointer-events-none blur-md brightness-[0.7] saturate-[0.8] z-0">
        <LandingPage />
      </div>

      {/* Overlay Backdrop and Modal Card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 backdrop-blur-xs bg-black/25">
        {/* Click outside to close (goes back to home) */}
        <Link href="/" className="absolute inset-0 z-0 cursor-default" aria-label="Close modal" />

        {/* Modal content - Shared Card Shell */}
        <div className="relative z-10 w-full max-w-5xl h-[700px] overflow-hidden rounded-3xl bg-paper shadow-2xl shadow-ink/10 animate-slide-down flex">

          {/* Persistent Close Button on the top-right of the entire card */}
          <Link
            href="/"
            className="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-mist bg-paper/85 text-slate transition-all hover:bg-red-500 hover:text-white hover:border-red-500 shadow-md backdrop-blur-xs"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Link>

          {/* SLIDING IMAGE PANEL */}
          <div
            className={`absolute top-0 bottom-0 w-1/2 z-20 transition-all duration-500 ease-in-out hidden lg:flex items-center justify-center p-6 ${isSignup ? "left-1/2" : "left-0"
              }`}
          >
            <Image
              src="/images/nirmix_auth_img.jpg"
              alt="Scenic landscape"
              fill
              className="object-cover"
              priority
            />
            {/* Glassmorphism Brand Card (Centered in the middle of image panel) */}
            <div className="relative z-30 w-full max-w-[380px] rounded-2xl border border-white/20 bg-sand/75 p-8 text-center backdrop-blur-md shadow-lg">
              <Image
                src="/images/NirMix_Logo.png"
                alt="NirMix Logo"
                width={120}
                height={48}
                className="mx-auto mb-4 h-auto"
              />
              <p className="text-xs font-semibold leading-relaxed text-ink">
                Redefining the horizon of Nepalese luxury real estate and
                architectural excellence.
              </p>
              <p className="mt-5 text-xs font-bold text-ember transition-all duration-300">
                {isSignup ? "Already have an account?" : "Start Your Journey"}
              </p>
              <Link
                href={isSignup ? "/login" : "/signup"}
                className="mt-3 inline-block rounded-full border-2 border-ink px-6 py-2 text-xs font-bold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                {isSignup ? "Sign In" : "Create Account"}
              </Link>
            </div>
          </div>

          {/* Form Content pages (login/signup) */}
          <div className="relative w-full h-full flex">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}



