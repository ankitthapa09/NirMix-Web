import Link from "next/link";
import Image from "next/image";

export function PropertyWorthCTA() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-ember/90 px-8 py-12 shadow-xl sm:px-12">
          {/* Background Pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-lg space-y-3 text-center md:text-left">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Not sure what your property is worth?
              </h2>
              <p className="text-sm leading-relaxed text-white/80">
                Get a detailed valuation report in under 24 hours. Our verified
                appraisers cover Kathmandu, Lalitpur, Bhaktapur, Pokhara, and 30+
                municipalities across Nepal.
              </p>
            </div>

            <Link
              href="/valuation"
              className="shrink-0 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-ember shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Get Free Valuation
            </Link>
          </div>

          {/* Small decorative house image overlapping right edge */}
          <div className="pointer-events-none absolute -bottom-4 -right-4 hidden h-40 w-56 opacity-20 lg:block">
            <Image
              src="/images/about-house.png"
              alt=""
              fill
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
