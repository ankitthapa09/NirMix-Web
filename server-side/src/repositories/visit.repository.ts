import Visit, { IVisit } from '../models/visitModel.js';

/** Persist a new visit request. */
export async function createVisit(data: Partial<IVisit>): Promise<IVisit> {
  const visit = new Visit(data);
  return visit.save();
}

/**
 * All visit requests on properties owned by a user, newest first, with a
 * lightweight property summary populated for the dashboard list.
 */
export async function findVisitsByOwner(ownerId: string): Promise<IVisit[]> {
  return Visit.find({ propertyOwner: ownerId })
    .sort({ createdAt: -1 })
    .populate('property', 'title referenceId photos location price listingType');
}

export async function findVisitById(id: string): Promise<IVisit | null> {
  return Visit.findById(id);
}

export async function updateVisit(id: string, updates: Partial<IVisit>): Promise<IVisit | null> {
  return Visit.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

/** Remove every visit request for a property; returns how many were deleted. */
export async function deleteVisitsByProperty(propertyId: string): Promise<number> {
  const result = await Visit.deleteMany({ property: propertyId });
  return result.deletedCount ?? 0;
}
