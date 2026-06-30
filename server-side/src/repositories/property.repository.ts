import Property, { IProperty } from '../models/propertyModel.js';

/**
 * Persist a new property listing.
 * Validation/casting is enforced by the schema on save().
 */
export async function createProperty(data: Partial<IProperty>): Promise<IProperty> {
  const property = new Property(data);
  return property.save();
}

/**
 * Find all listings owned by a user, newest first.
 */
export async function findPropertiesByOwner(ownerId: string): Promise<IProperty[]> {
  return Property.find({ owner: ownerId }).sort({ createdAt: -1 });
}

/**
 * Find all active (publicly visible) listings, newest first.
 */
export async function findActiveProperties(): Promise<IProperty[]> {
  return Property.find({ status: 'active' }).sort({ createdAt: -1 });
}

/**
 * Find a single listing by its id.
 */
export async function findPropertyById(id: string): Promise<IProperty | null> {
  return Property.findById(id);
}

/**
 * Find a single listing by id with the owner's public fields populated
 * (for the "Listed by" card on the detail page).
 */
export async function findPropertyByIdWithOwner(id: string): Promise<IProperty | null> {
  return Property.findById(id).populate('owner', 'name avatar contact email isProfessional isEmailVerified');
}

/**
 * Update a listing by its id.
 */
export async function updateProperty(id: string, updates: Partial<IProperty>): Promise<IProperty | null> {
  return Property.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

/**
 * Delete a listing by its id.
 */
export async function deletePropertyById(id: string): Promise<IProperty | null> {
  return Property.findByIdAndDelete(id);
}
