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
