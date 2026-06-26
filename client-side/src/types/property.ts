export type PropertyType = "House" | "Land" | "Apartment";

export type Property = {
  id: string;
  title: string;
  type: PropertyType;
  price: number;
  location: {
    district: string;
    city: string;
    neighborhood: string;
  };
  beds: number;
  baths: number;
  areaSqft: number;
  areaUnit?: "sqft" | "Aana";
  photos: string[];
  status: "For Sale" | "For Rent";
  featured?: boolean;
  tag?: "NEW" | "VERIFIED" | "HOT";
  description: string;
  agent: {
    name: string;
    company: string;
  };
};
