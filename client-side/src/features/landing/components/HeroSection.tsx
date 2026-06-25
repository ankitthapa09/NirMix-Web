import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F9F4EA] px-4 pb-16 pt-20 sm:px-6 lg:px-8 z-10">
      {/* Background shape behind the right side (exactly matching the screenshot's soft yellow polygon) */}
      <div className="absolute right-0 top-0 bottom-0 w-[50%] bg-[#FCF8EC] -z-10 hidden lg:block rounded-l-[160px] skew-x-3 origin-top-right transform scale-x-110" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        {/* Left — Copy */}
        <div className="reveal max-w-xl space-y-8">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-[#342417] sm:text-6xl lg:text-[4rem]">
            Find Your
            <br />
            Dream Home
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-[#5C4D3C] sm:text-base font-semibold">
            Explore our curated selection of exquisite properties meticulously
            tailored to your unique dream home vision
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-lg bg-[#342417] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#251910]"
          >
            Explore <span className="text-[#A9DF8F] ml-1 font-extrabold">&gt;&gt;&gt;</span>
          </Link>
        </div>

        {/* Right — Hero Image */}
        <div className="reveal reveal-delay-1 relative lg:pl-10">
          <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-ink/5 border border-white/20">
            <Image
              src="/images/hero-house.png"
              alt="Modern luxury villa"
              width={720}
              height={480}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
