import { z } from 'zod';

export const LISTING_TYPES = ['For Sale', 'For Rent'] as const;
export const PROPERTY_TYPES = ['House', 'Apartment', 'Land', 'Room', 'Flats', 'Office Space', 'Shop Space'] as const;

export type ListingType = (typeof LISTING_TYPES)[number];
export type PropertyTypeValue = (typeof PROPERTY_TYPES)[number];

// `data` JSON field of the multipart request. Photos & floorPlan arrive as files,
// so they are NOT part of this schema — the service attaches their Cloudinary URLs.
export const createPropertySchema = z.object({
  listingType: z.enum(LISTING_TYPES),
  propertyType: z.enum(PROPERTY_TYPES),
  title: z.string().trim().min(10).max(150),
  description: z.string().trim().min(20).max(5000),

  location: z.object({
    province: z.string().trim().min(1),
    district: z.string().trim().min(1),
    city: z.string().trim().min(1),
    wardNo: z.string().trim().min(1),
    area: z.string().trim().min(1),
    landmark: z.string().trim().optional().default(''),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  }),

  price: z.coerce.number().positive(),
  videoLink: z.union([z.url(), z.literal('')]).optional().default(''),

  // Everything type-specific (ownership, deposit, beds, baths, landArea, amenities,
  // houseType, bhkType, plotType, reraRegistered, …) lives here, untyped-but-stored.
  details: z.record(z.string(), z.unknown()).optional().default({}),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

// ── Human-readable reference code, e.g. "SALE-LAND-0001" ──
export const LISTING_CODES: Record<ListingType, string> = {
  'For Sale': 'SALE',
  'For Rent': 'RENT',
};

export const CATEGORY_CODES: Record<PropertyTypeValue, string> = {
  House: 'HOUSE',
  Apartment: 'APT',
  Land: 'LAND',
  Room: 'ROOM',
  Flats: 'FLAT',
  'Office Space': 'OFFICE',
  'Shop Space': 'SHOP',
};

/** Counter key for a listing+category combination, e.g. "SALE-LAND". */
export function referenceKey(listingType: ListingType, propertyType: PropertyTypeValue): string {
  return `${LISTING_CODES[listingType]}-${CATEGORY_CODES[propertyType]}`;
}

/** Reference code from the combination + sequence, e.g. "SALE-LAND-0001". */
export function buildReferenceId(
  listingType: ListingType,
  propertyType: PropertyTypeValue,
  seq: number
): string {
  return `${referenceKey(listingType, propertyType)}-${String(seq).padStart(4, '0')}`;
}

// Uploaded media references stored in MongoDB (Cloudinary URL + delete handle).
export interface IPropertyMedia {
  url: string;
  publicId: string;
}
