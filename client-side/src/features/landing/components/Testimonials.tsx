import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sita Devi",
    role: "Property Buyer",
    avatar: "SD",
    rating: 5,
    text: "Thanks to NirMix, we found our dream home in Lalitpur within two weeks. The agents were professional, verified, and responded within hours. Highly recommended!",
  },
  {
    name: "Ram Thapa",
    role: "Real Estate Agent",
    avatar: "RT",
    rating: 5,
    text: "As an agent, listing on NirMix brought me quality leads that actually convert. The dashboard tracking and valuation tools give my clients complete transparency.",
  },
  {
    name: "Surendra Tamang",
    role: "Contractor",
    avatar: "ST",
    rating: 5,
    text: "NirMix's calculators and material estimators have saved me hours of manual work. Their platform connects me directly with site owners looking for quality builders.",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
            What People Say
            <br />
            About NirMix
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-mist/60 bg-paper p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* User Info */}
              <div className="mb-4 flex items-center gap-4">
                {/* Avatar Circle */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ember/10 text-sm font-bold text-ember">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{t.name}</div>
                  <div className="text-[11px] text-slate">{t.role}</div>
                </div>
              </div>

              {/* Stars */}
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs leading-relaxed text-slate">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
