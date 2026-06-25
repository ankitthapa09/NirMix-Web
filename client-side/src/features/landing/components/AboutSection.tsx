import Image from "next/image";

const stats = [
  { value: "8K+", label: "Houses Available" },
  { value: "6K+", label: "Houses Sold" },
];

export function AboutSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="relative overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/images/about-house.png"
            alt="Beautiful home interior"
            width={600}
            height={420}
            className="h-auto w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            We Help You To Find
            <br />
            Your Dream Home
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-slate">
            From cozy cottages to luxurious estates, our dedicated team guides
            you through every step of the journey, turning your dream house
            into a reality.
          </p>

          {/* Stats */}
          <div className="flex gap-10 pt-2">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-ember">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
