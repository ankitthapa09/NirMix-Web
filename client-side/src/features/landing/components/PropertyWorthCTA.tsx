import Link from "next/link";
import Image from "next/image";

export function PropertyWorthCTA() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-7xl relative">
        {/* Banner container */}
        <div className="relative rounded-3xl bg-[#634E3C] px-8 py-10 shadow-xl sm:px-12 lg:py-14 lg:pr-[380px] overflow-hidden lg:overflow-visible">
          {/* Background subtle light overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px] rounded-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-xl text-left">
              <div>
                <span className="inline-block bg-[#FFC529] text-[#342417] text-[10px] font-extrabold px-3 py-1 rounded-sm uppercase tracking-wider">
                  Powered by AI
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl md:text-3xl leading-tight">
                Not sure what your property is worth?
              </h2>
              <p className="text-xs md:text-sm leading-relaxed text-white/80">
                Get an AI-powered valuation in under 2 minutes — trained on 50,000+ Nepal property transactions.
              </p>
            </div>

            <div className="shrink-0 pt-2 md:pt-0">
              <Link
                href="/valuation"
                className="inline-flex items-center gap-2 rounded-md bg-[#FFC529] px-6 py-3 text-xs font-bold text-[#342417] shadow-lg transition-all hover:bg-[#e6b122] hover:-translate-y-0.5 hover:shadow-xl"
              >
                Get Free Valuation
                <span className="text-sm font-bold">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Overlapping Isometric house image for desktop */}
          <div className="pointer-events-none absolute lg:block hidden -top-12 -right-8 w-[380px] h-[300px] z-20">
            <Image
              src="/images/property-4.png"
              alt="Isometric Property Valuation"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

