import { MapPin, User, FileText, Handshake } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Expert Guidance",
    description:
      "Benefit from our team's seasoned expertise for a smooth buying experience",
  },
  {
    icon: User,
    title: "Personalized Service",
    description:
      "Our services adapt to your unique needs, making your journey stress-free",
  },
  {
    icon: FileText,
    title: "Transparent Process",
    description:
      "Stay informed with our clear and honest approach to buying your home",
  },
  {
    icon: Handshake,
    title: "Exceptional Support",
    description:
      "Providing peace of mind with our responsive and attentive customer service",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-[#FAF7F0] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Row - Centered */}
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-4xl font-extrabold text-[#342417] sm:text-5xl">
            Why Choose Us
          </h2>
          <p className="text-sm leading-relaxed text-[#5C4D3C] font-semibold">
            Elevating Your Home Buying Experience with Expertise, Integrity,
            and Unmatched Personalized Service
          </p>
        </div>

        {/* Counter floating right above grid */}
        <div className="flex justify-end mb-4 pr-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#342417]">2K+</span>
            <span className="text-xs font-bold text-[#5C4D3C] uppercase tracking-wider">Trusted Agents</span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl bg-[#E6D8C8]/50 p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-[#E6D8C8]/70 hover:shadow-lg border border-[#342417]/5"
            >
              {/* Circular Icon with dark tone */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#342417] text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#342417]">{feature.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5C4D3C] font-semibold">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
