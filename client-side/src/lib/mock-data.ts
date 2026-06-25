import type { Property } from "@/types/property";

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern Villa with Pool",
    type: "House",
    price: 12500000,
    location: {
      district: "Lalitpur",
      city: "Lalitpur",
      neighborhood: "Satdobato",
    },
    beds: 4,
    baths: 3,
    areaSqft: 3200,
    photos: ["/images/property-1.png"],
    status: "For Sale",
    featured: true,
    description:
      "Luxurious modern villa featuring an infinity pool, smart home tech, and panoramic valley views.",
    agent: { name: "Aarav Shrestha", company: "NirMix Premium" },
  },
  {
    id: "2",
    title: "Contemporary Family Home",
    type: "House",
    price: 8500000,
    location: {
      district: "Kathmandu",
      city: "Kathmandu",
      neighborhood: "Budhanilkantha",
    },
    beds: 3,
    baths: 2,
    areaSqft: 2400,
    photos: ["/images/property-2.png"],
    status: "For Sale",
    featured: true,
    description:
      "Stone and timber contemporary house with open-plan living, garden, and mountain views.",
    agent: { name: "Sita Tamang", company: "Himalayan Realty" },
  },
  {
    id: "3",
    title: "Sunset Villa Retreat",
    type: "House",
    price: 18000000,
    location: {
      district: "Kaski",
      city: "Pokhara",
      neighborhood: "Lakeside",
    },
    beds: 5,
    baths: 4,
    areaSqft: 4600,
    photos: ["/images/property-3.png"],
    status: "For Sale",
    featured: true,
    description:
      "Exclusive lakeside villa with private pool, outdoor lounge, and direct lake views.",
    agent: { name: "Binod Gurung", company: "Pokhara Estates" },
  },
  {
    id: "4",
    title: "Urban Luxury Apartment",
    type: "Apartment",
    price: 35000,
    location: {
      district: "Kathmandu",
      city: "Kathmandu",
      neighborhood: "Jhamsikhel",
    },
    beds: 2,
    baths: 2,
    areaSqft: 1200,
    photos: ["/images/property-4.png"],
    status: "For Rent",
    featured: true,
    description:
      "Premium apartment in the heart of the city with balcony, gym, and rooftop garden access.",
    agent: { name: "Mina Karki", company: "Metro Rent" },
  },
];

export function getFeaturedProperties() {
  return properties.filter((p) => p.featured).slice(0, 4);
}
