import Image from "next/image";

const stats = [
  { value: "8K+", label: "Houses Available" },
  { value: "6K+", label: "Houses Sold" },
];

export function AboutSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 z-10 bg-[#F9F4EA]/40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="relative overflow-hidden rounded-3xl shadow-lg border border-mist/20">
          <Image
            src="/images/about-house.png"
            alt="Beautiful home interior with pool"
            width={600}
            height={420}
            className="h-auto w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight text-[#342417] sm:text-5xl">
            We Help You To Find
            <br />
            Your Dream Home
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-[#5C4D3C] font-semibold">
            From cozy cottages to luxurious estates, our dedicated team guides
            you through every step of the journey, ensuring your dream home
            becomes a reality
          </p>

          {/* Stats */}
          <div className="flex gap-14 pt-2">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-extrabold text-[#342417]">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-semibold text-[#5C4D3C]">
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
