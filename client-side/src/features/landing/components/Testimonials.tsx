import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sita Devi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    cover: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    rating: "5.0",
    text: "Dwello truly cares about their clients. They listened to my needs and preferences and helped me find the perfect home in the Bay Area. Their professionalism and attention to detail are unmatched.",
  },
  {
    name: "Ram Thapa",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    cover: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
    rating: "4.5",
    text: "I had a fantastic experience working with Dwello. Their expertise and personalized service exceeded my expectations. I found my dream home quickly and smoothly. Highly recommended!",
  },
  {
    name: "Ravindra Tamang",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    cover: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80",
    rating: "5.0",
    text: "Dwello made my dream of owning a home a reality! Their team provided exceptional support and guided me through every step of the process. I couldn't be happier with my new home!",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-transparent">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-extrabold text-[#342417] sm:text-3xl">
            What People Say
            <br />
            About NirMix
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="overflow-hidden rounded-2xl border border-[#E0D4C5] bg-[#F0E5DA]/40 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col"
            >
              {/* Room Image */}
              <div className="relative h-44 w-full">
                <Image
                  src={t.cover}
                  alt="Room decoration"
                  fill
                  className="object-cover"
                  sizes="(max-w-768px) 100vw, 33vw"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                {/* User Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white shadow-xs">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#342417]">{t.name}</span>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 bg-[#FFC529] px-2 py-0.5 rounded-sm text-[10px] font-extrabold text-[#342417]">
                    <Star className="h-3 w-3 fill-[#342417] text-[#342417]" />
                    <span>{t.rating}</span>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-xs leading-relaxed text-[#5C4D3C] font-medium">
                  {t.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <div className="mt-10 flex justify-center gap-4">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#342417] text-white hover:bg-[#251910] transition-colors cursor-pointer shadow-xs"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#342417] text-white hover:bg-[#251910] transition-colors cursor-pointer shadow-xs"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

