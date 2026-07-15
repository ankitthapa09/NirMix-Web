import {
  upsertReview,
  findReviewsByProperty,
  findReviewById,
  deleteReviewById,
} from '../repositories/review.repository.js';
import { findPropertyById } from '../repositories/property.repository.js';
import { IReview } from '../models/reviewModel.js';
import { CreateReviewInput, ReviewSummary } from '../types/review.types.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

const isObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

/** Mean rating, count, and per-star buckets from a property's reviews. */
function buildSummary(reviews: IReview[]): ReviewSummary {
  const buckets: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  for (const r of reviews) {
    total += r.rating;
    const star = r.rating as 1 | 2 | 3 | 4 | 5;
    if (buckets[star] !== undefined) buckets[star] += 1;
  }
  const count = reviews.length;
  const average = count ? Math.round((total / count) * 10) / 10 : 0;
  return { average, count, buckets };
}

class ReviewService {
  /**
   * Create or update the caller's review for a property. Owners can't review
   * their own listing; re-submitting updates the existing review.
   */
  async submitReview(authorId: string, data: CreateReviewInput): Promise<IReview> {
    const property = await findPropertyById(data.propertyId);
    if (!property) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found');
    }
    if (property.owner.toString() === authorId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can’t review your own property');
    }

    const review = await upsertReview(data.propertyId, authorId, {
      rating: data.rating,
      comment: data.comment,
    });
    if (!review) {
      throw new ApiError(HTTP_STATUS.INTERNAL, 'Failed to save review');
    }
    return review.populate('author', 'name displayName avatar');
  }

  /** A property's reviews (newest first) plus an aggregate summary. */
  async getPropertyReviews(propertyId: string): Promise<{ reviews: IReview[]; summary: ReviewSummary }> {
    if (!isObjectId(propertyId)) {
      return { reviews: [], summary: buildSummary([]) };
    }
    const reviews = await findReviewsByProperty(propertyId);
    return { reviews, summary: buildSummary(reviews) };
  }

  /** Delete a review — only its author may do this. */
  async deleteReview(authorId: string, reviewId: string): Promise<void> {
    const review = await findReviewById(reviewId);
    if (!review) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Review not found');
    }
    if (review.author.toString() !== authorId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only delete your own review');
    }
    await deleteReviewById(reviewId);
  }
}

export default new ReviewService();
