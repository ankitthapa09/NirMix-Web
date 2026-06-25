"use client";

import { MessageCircle, BookOpen, Send } from "lucide-react";
import { useState } from "react";

export function ContactSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-paper/60 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
          Do You Have Any Questions?
          <br />
          Get Help From Us
        </h2>

        {/* Action Chips */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:support@nirmix.com.np"
            className="inline-flex items-center gap-2 rounded-full border border-mist bg-paper px-6 py-3 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-ember/40 hover:shadow-md"
          >
            <MessageCircle className="h-4 w-4 text-ember" />
            Chat live with our support team
          </a>
          <a
            href="/faq"
            className="inline-flex items-center gap-2 rounded-full border border-mist bg-paper px-6 py-3 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-ember/40 hover:shadow-md"
          >
            <BookOpen className="h-4 w-4 text-ember" />
            Browse our FAQ
          </a>
        </div>

        {/* Email Subscribe */}
        <div className="mx-auto mt-10 flex max-w-md overflow-hidden rounded-xl border border-mist bg-paper shadow-sm">
          <input
            type="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 border-0 bg-transparent px-5 py-3.5 text-sm text-ink placeholder:text-slate/50 focus:outline-hidden"
          />
          <button className="flex items-center gap-2 bg-jade px-6 text-sm font-bold text-white transition-colors hover:bg-jade/90">
            <Send className="h-4 w-4" />
            Submit
          </button>
        </div>
      </div>
    </section>
  );
}
