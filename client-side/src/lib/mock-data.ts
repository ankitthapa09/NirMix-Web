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
    tag: "NEW",
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
    tag: "VERIFIED",
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

/* ── Dashboard feed properties (matching the screenshot) ── */

export const dashboardFeedProperties: Property[] = [
  {
    id: "feed-1",
    title: "Modern 4BHK Duplex in Bhaise",
    type: "House",
    price: 48500000,
    location: {
      district: "Lalitpur",
      city: "Lalitpur",
      neighborhood: "Bhaisepati",
    },
    beds: 4,
    baths: 3,
    areaSqft: 5,
    areaUnit: "Aana",
    photos: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    ],
    status: "For Sale",
    tag: "NEW",
    description:
      "Brand new 4BHK duplex with modern finishes, rooftop terrace, and mountain views.",
    agent: { name: "Aarav Shrestha", company: "NirMix Premium" },
  },
  {
    id: "feed-2",
    title: "Furnished Apartment with Hill View",
    type: "Apartment",
    price: 65000,
    location: {
      district: "Lalitpur",
      city: "Lalitpur",
      neighborhood: "Kupondole",
    },
    beds: 3,
    baths: 2,
    areaSqft: 1450,
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
    status: "For Rent",
    tag: "VERIFIED",
    description:
      "Fully furnished 3BHK apartment with stunning hill views and modern amenities.",
    agent: { name: "Sita Tamang", company: "Himalayan Realty" },
  },
  {
    id: "feed-3",
    title: "Commercial Land on Ring Road",
    type: "Land",
    price: 120000000,
    location: {
      district: "Kathmandu",
      city: "Kathmandu",
      neighborhood: "Balaju",
    },
    beds: 0,
    baths: 0,
    areaSqft: 8,
    areaUnit: "Aana",
    photos: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    ],
    status: "For Sale",
    tag: "HOT",
    description:
      "Prime commercial land on the ring road with excellent road access and high visibility.",
    agent: { name: "Binod Gurung", company: "Pokhara Estates" },
  },
  {
    id: "feed-4",
    title: "Quiet Studio near Patan Durbar",
    type: "Apartment",
    price: 22000,
    location: {
      district: "Lalitpur",
      city: "Lalitpur",
      neighborhood: "Pulchowk",
    },
    beds: 1,
    baths: 1,
    areaSqft: 520,
    photos: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    ],
    status: "For Rent",
    tag: "NEW",
    description:
      "Cozy studio apartment near Patan Durbar Square, ideal for students or young professionals.",
    agent: { name: "Mina Karki", company: "Metro Rent" },
  },
];

export function getFeaturedProperties() {
  return properties.filter((p) => p.featured).slice(0, 4);
}

/* ── Buy / Rent listing pages — one premium mock listing each (for now) ── */

export const listingProperties: Property[] = [
  {
    id: "listing-sale-1",
    title: "Modern 5BHK Villa with Private Garden",
    type: "House",
    price: 42500000,
    location: {
      district: "Lalitpur",
      city: "Lalitpur",
      neighborhood: "Bhaisepati",
    },
    beds: 5,
    baths: 4,
    areaSqft: 8,
    areaUnit: "Aana",
    photos: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80",
    ],
    status: "For Sale",
    featured: true,
    tag: "NEW",
    description:
      "Architect-designed villa with double-height living, landscaped garden, smart-home automation and panoramic valley views.",
    agent: { name: "Aarav Shrestha", company: "NirMix Premium" },
    listedBy: {
      type: "Agent",
      name: "Aarav Shrestha",
      company: "NirMix Premium",
      phone: "+977 9801234567",
      email: "aarav@nirmix.com.np",
      verified: true,
      listings: 24,
    },
    postedOn: "2026-06-20",
    specs: [
      { label: "Property type", value: "House · Villa" },
      { label: "Bedrooms", value: "5" },
      { label: "Bathrooms", value: "4" },
      { label: "Plot area", value: "8 Aana" },
      { label: "Built-up area", value: "4,200 sqft" },
      { label: "Floors", value: "2.5" },
      { label: "Facing", value: "East" },
      { label: "Furnishing", value: "Semi-furnished" },
      { label: "Parking", value: "2 Cars" },
      { label: "Ownership", value: "Freehold (Lalpurja)" },
      { label: "Road access", value: "20 ft Blacktopped" },
      { label: "Year built", value: "2022" },
    ],
    amenities: [
      "Power Backup",
      "24x7 Water",
      "Security / CCTV",
      "Garden / Lawn",
      "Solar Panel",
      "Modular Kitchen",
      "Covered Parking",
      "Compound Wall",
    ],
    highlights: [
      "Architect-designed with double-height living",
      "Landscaped private garden",
      "Smart-home automation throughout",
      "Panoramic valley views",
    ],
    videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    floorPlan: {
      url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
      name: "Villa-floor-plan.png",
    },
    coordinates: { lat: 27.6411, lng: 85.3089 },
    wardNo: "5",
    landmark: "Near Bhaisepati Chowk, opposite Civil Homes gate",
  },
  {
    id: "listing-rent-1",
    title: "Furnished 3BHK Apartment with Hill View",
    type: "Apartment",
    price: 65000,
    location: {
      district: "Lalitpur",
      city: "Lalitpur",
      neighborhood: "Kupondole",
    },
    beds: 3,
    baths: 2,
    areaSqft: 1450,
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
    ],
    status: "For Rent",
    featured: true,
    tag: "VERIFIED",
    description:
      "Fully furnished apartment with floor-to-ceiling windows, modular kitchen, rooftop garden access and dedicated parking.",
    agent: { name: "Sita Tamang", company: "Himalayan Realty" },
    listedBy: {
      type: "Personal",
      name: "Sita Tamang",
      phone: "+977 9847654321",
      email: "sita.tamang@example.com",
      verified: false,
    },
    postedOn: "2026-06-25",
    specs: [
      { label: "Property type", value: "Apartment · 3 BHK" },
      { label: "Bedrooms", value: "3" },
      { label: "Bathrooms", value: "2" },
      { label: "Carpet area", value: "1,450 sqft" },
      { label: "Floor", value: "7th of 12" },
      { label: "Facing", value: "South-East" },
      { label: "Furnishing", value: "Fully furnished" },
      { label: "Parking", value: "1 Car · 1 Bike" },
      { label: "Deposit", value: "2 months rent" },
      { label: "Minimum lease", value: "1 year" },
      { label: "Available from", value: "Immediately" },
    ],
    amenities: [
      "Lift",
      "Gym",
      "Power Backup",
      "CCTV",
      "Rooftop Garden",
      "Intercom",
      "Reserved Parking",
      "24x7 Water",
    ],
    highlights: [
      "Floor-to-ceiling windows with hill views",
      "Modular kitchen with chimney",
      "Rooftop garden & lounge access",
      "Dedicated covered parking",
    ],
    videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    floorPlan: {
      url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
      name: "Apartment-3BHK-layout.png",
    },
    coordinates: { lat: 27.6792, lng: 85.3158 },
    wardNo: "10",
    landmark: "Kupondole Heights, near Hotel Himalaya",
  },
];

export function getListingsByStatus(status: Property["status"]) {
  return listingProperties.filter((p) => p.status === status);
}

/* ── All Property hub — every listing across the platform ── */

export const allProperties: Property[] = [
  ...listingProperties,
  ...dashboardFeedProperties,
  ...properties,
];

export function getPropertyById(id: string): Property | undefined {
  return allProperties.find((p) => p.id === id);
}
