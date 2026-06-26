"use client";

import { useState } from "react";
import { Check, Mail } from "lucide-react";

export function ContactSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit behavior
    setEmail("");
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-transparent">
      <div className="mx-auto max-w-4xl rounded-3xl bg-[#EAE0D5]/50 border border-[#E0D4C5] px-6 py-12 text-center sm:px-12 sm:py-14 shadow-xs">
        <h2 className="text-2xl font-extrabold text-[#342417] sm:text-3xl leading-tight">
          Do You Have Any Questions?
          <br />
          Get Help From Us
        </h2>

        {/* Checkmark Action Links */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs sm:text-sm text-[#342417] font-bold">
          <a
            href="mailto:support@nirmix.com.np"
            className="flex items-center gap-2 hover:text-[#157A74] transition-colors"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#157A74]/15 text-[#157A74]">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </span>
            Chat live with our support team
          </a>
          <a
            href="/faq"
            className="flex items-center gap-2 hover:text-[#157A74] transition-colors"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#157A74]/15 text-[#157A74]">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </span>
            Browse our FAQ
          </a>
        </div>

        {/* Email Subscribe Bar */}
        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-xl bg-white p-1.5 shadow-xs border border-[#E0D4C5]">
          <div className="flex flex-1 items-center pl-3">
            <Mail className="h-4 w-4 text-[#8C7A6B]" />
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-0 bg-transparent px-3 py-2.5 text-xs sm:text-sm text-[#342417] placeholder:text-[#8C7A6B]/60 focus:outline-hidden"
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#342417] px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#251910] cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}

