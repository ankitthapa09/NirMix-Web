import { Types } from 'mongoose';
import Review, { IReview } from '../models/reviewModel.js';

/** Create or update the caller's single review for a property (upsert on property+author). */
export async function upsertReview(
  propertyId: string,
  authorId: string,
  data: { rating: number; comment: string }
): Promise<IReview | null> {
  return Review.findOneAndUpdate(
    { property: propertyId, author: authorId },
    { $set: { rating: data.rating, comment: data.comment } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
}

/** A property's reviews, newest first, with the author's public identity populated. */
export async function findReviewsByProperty(propertyId: string): Promise<IReview[]> {
  return Review.find({ property: propertyId })
    .sort({ createdAt: -1 })
    .populate('author', 'name displayName avatar');
}

export async function findReviewById(id: string): Promise<IReview | null> {
  return Review.findById(id);
}

export async function deleteReviewById(id: string): Promise<IReview | null> {
  return Review.findByIdAndDelete(id);
}

/** Remove every review for a property; returns how many were deleted. */
export async function deleteReviewsByProperty(propertyId: string): Promise<number> {
  const result = await Review.deleteMany({ property: propertyId });
  return result.deletedCount ?? 0;
}

export async function getRatingStats(
  propertyId: string
): Promise<{ average: number; count: number }> {
  const [row] = await Review.aggregate<{ average: number; count: number }>([
    { $match: { property: new Types.ObjectId(propertyId) } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (!row) return { average: 0, count: 0 };
  return { average: Math.round(row.average * 10) / 10, count: row.count };
}
