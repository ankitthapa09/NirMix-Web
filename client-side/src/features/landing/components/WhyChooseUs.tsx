import { ShieldCheck, UserCheck, Eye, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Expert Guidance",
    description:
      "Benefit from our expertise to navigate the complex real estate market with confidence.",
  },
  {
    icon: UserCheck,
    title: "Personalized Service",
    description:
      "Our services tailored to your needs, ensuring your real estate journey is smooth and success-driven.",
  },
  {
    icon: Eye,
    title: "Transparent Process",
    description:
      "Stay informed with our transparent process, ensuring clarity throughout your property experience.",
  },
  {
    icon: HeadphonesIcon,
    title: "Exceptional Support",
    description:
      "Providing peace of mind through unmatched client support and personalized assistance.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-paper/60 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Row */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-lg space-y-3">
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="text-sm leading-relaxed text-slate">
              Elevating Your Home-Buying Experience with Expertise, Integrity,
              and Unmatched Personalized Service.
            </p>
          </div>

          {/* Trusted Agents counter */}
          <div className="rounded-2xl border border-mist bg-paper p-6 text-center shadow-sm">
            <div className="text-4xl font-extrabold text-ember">2K+</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate">
              Trusted Agents
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-mist/60 bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ember/30 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ember/10 text-ember transition-transform group-hover:scale-110">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-ink">{feature.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
