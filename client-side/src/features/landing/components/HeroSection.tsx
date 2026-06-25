import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-sand px-4 pb-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        {/* Left — Copy */}
        <div className="reveal max-w-xl space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
            Find Your
            <br />
            <span className="text-ember">Dream Home</span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-slate sm:text-base">
            Explore our curated selection of exquisite properties meticulously
            tailored to your unique desire and aspirations.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-xl bg-ember px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-ember/20 transition-all hover:-translate-y-0.5 hover:bg-ember/90"
          >
            EXPLORE →
          </Link>
        </div>

        {/* Right — Hero Image */}
        <div className="reveal reveal-delay-1 relative">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-ink/10">
            <Image
              src="/images/hero-house.png"
              alt="Modern luxury villa"
              width={720}
              height={480}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
          {/* Decorative blob behind the image */}
          <div className="pointer-events-none absolute -right-10 -top-10 -z-10 h-72 w-72 rounded-full bg-ember/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 -z-10 h-56 w-56 rounded-full bg-jade/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
