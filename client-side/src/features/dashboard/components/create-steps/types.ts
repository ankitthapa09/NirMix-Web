// Shared types for the property-create wizard and its steps.

export interface MediaItem {
  url: string;
  name?: string;
  file?: File;
}

// The wizard's form is mostly known fields, but the Details step also writes a
// number of property-type-specific keys (houseType, bhkType, plotType, …) that
// are addressed dynamically. The index signature covers those while the named
// fields keep their concrete types for the rest of the flow.
export interface PropertyFormData {
  listingType: string;
  propertyType: string;
  title: string;
  description: string;
  province: string;
  district: string;
  city: string;
  wardNo: string;
  area: string;
  landmark: string;
  price: string;
  negotiable: boolean;
  ownership: string;
  deposit: string;
  beds: string;
  baths: string;
  balconies: string;
  floor: string;
  floors: string;
  parking: string;
  builtUpArea: string;
  carpetArea: string;
  landArea: string;
  ropani: string;
  aana: string;
  paisa: string;
  daam: string;
  facing: string;
  furnishing: string;
  leaseTerm: string;
  minLease: string;
  availableFrom: string;
  zoning: string;
  roadSize: string;
  frontage: string;
  roadType: string;
  pricePerUnit: string;
  floorLevel: string;
  sharedFacilities: string[];
  amenities: string[];
  photos: MediaItem[];
  videoLink: string;
  floorPlan: MediaItem | null;
  termsAccepted: boolean;
  detailsCompletion?: number;
  isDetailsValid?: boolean;
  [key: string]: unknown;
}

export interface StepProps {
  formData: PropertyFormData;
  onChange: (data: PropertyFormData) => void;
  errors: Record<string, string>;
}

// Narrowing helper for restoring drafts / uploaded media from untyped sources.
export const isMediaItem = (value: unknown): value is MediaItem =>
  !!value &&
  typeof value === "object" &&
  typeof (value as Record<string, unknown>).url === "string";
