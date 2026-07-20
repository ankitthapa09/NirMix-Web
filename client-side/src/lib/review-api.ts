import { API_BASE } from "./property-api";
import { apiFetch } from "./api-client";

export interface ApiReviewAuthor {
  _id: string;
  name: string;
  displayName?: string;
  avatar?: string;
}

export interface ApiReview {
  _id: string;
  property: string;
  author: ApiReviewAuthor | string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
  /** Number of reviews per star, keyed "1".."5". */
  buckets: Record<string, number>;
}

export interface PropertyReviews {
  reviews: ApiReview[];
  summary: ReviewSummary;
}

export interface SubmitReviewInput {
  propertyId: string;
  rating: number;
  comment: string;
}

/** Fresh empty result — used as the fallback so callers never share a mutable object. */
const emptyReviews = (): PropertyReviews => ({
  reviews: [],
  summary: { average: 0, count: 0, buckets: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
});

/** A property's reviews + aggregate summary (public — no auth needed). */
export async function fetchPropertyReviews(propertyId: string): Promise<PropertyReviews> {
  try {
    const res = await fetch(`${API_BASE}/reviews/property/${propertyId}`, { cache: "no-store" });
    if (!res.ok) return emptyReviews();
    const json = await res.json();
    return (json.data as PropertyReviews) ?? emptyReviews();
  } catch {
    return emptyReviews();
  }
}

/** Create or update the signed-in user's review for a property (server upserts). */
export async function submitReview(input: SubmitReviewInput): Promise<ApiReview> {
  const res = await apiFetch(`${API_BASE}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Failed to submit review");
  return json.data;
}

/** Delete the signed-in user's own review. */
export async function deleteReview(id: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/reviews/${id}`, { method: "DELETE" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Failed to delete review");
}
