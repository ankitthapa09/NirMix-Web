import Property, { IProperty } from '../models/propertyModel.js';

/**
 * Persist a new property listing.
 * Validation/casting is enforced by the schema on save().
 */
export async function createProperty(data: Partial<IProperty>): Promise<IProperty> {
  const property = new Property(data);
  return property.save();
}
