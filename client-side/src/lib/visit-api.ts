import { API_BASE } from "./property-api";
import { apiFetch } from "./api-client";

export type VisitStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface ScheduleVisitInput {
  propertyId: string;
  date: string;
  slot: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
}

export interface ApiVisitProperty {
  _id: string;
  title: string;
  referenceId?: string;
  photos?: { url: string; publicId: string }[];
  location?: { district?: string; city?: string; area?: string };
  price?: number;
  listingType?: string;
}

export interface ApiVisit {
  _id: string;
  property: ApiVisitProperty | string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  date: string;
  slot: string;
  status: VisitStatus;
  createdAt: string;
}

/**
 * Request a visit for a property. Works for guests; if the user is logged in the
 * token is attached so the server can reject an owner booking their own listing.
 */
export async function scheduleVisit(input: ScheduleVisitInput): Promise<void> {
  const res = await apiFetch(`${API_BASE}/visits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Failed to request visit");
}

/** The authenticated owner's incoming visit requests. */
export async function fetchReceivedVisits(): Promise<ApiVisit[]> {
  const res = await apiFetch(`${API_BASE}/visits/received`);
  if (!res.ok) throw new Error("Failed to load visit requests");
  const json = await res.json();
  return (json.data as ApiVisit[]) ?? [];
}

/** Update a visit request's status (owner only). */
export async function updateVisitStatus(id: string, status: VisitStatus): Promise<ApiVisit> {
  const res = await apiFetch(`${API_BASE}/visits/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update visit");
  return json.data;
}
