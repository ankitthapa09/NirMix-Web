import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid property id');

// A logged-in user posts (or updates) their review for a property.
export const createReviewSchema = z.object({
  propertyId: objectId,
  rating: z.coerce.number().int().min(1, 'Rating must be 1-5').max(5, 'Rating must be 1-5'),
  comment: z.string().trim().min(3, 'Review is required').max(2000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// Aggregate returned alongside a property's reviews.
export interface ReviewSummary {
  average: number; // mean rating, rounded to 1 decimal
  count: number;
  buckets: Record<1 | 2 | 3 | 4 | 5, number>; // how many reviews at each star
}
