import mongoose, { Document, Schema, Types } from 'mongoose';
import { LISTING_TYPES, PROPERTY_TYPES, IPropertyMedia } from '../types/property.types.js';

export interface IProperty extends Document {
  owner: Types.ObjectId;
  listingType: string;
  propertyType: string;
  status: 'active' | 'draft' | 'sold' | 'rented';
  title: string;
  description: string;
  location: {
    province: string;
    district: string;
    city: string;
    wardNo: string;
    area: string;
    landmark?: string;
    coordinates?: { lat: number; lng: number };
  };
  price: number;
  videoLink?: string;
  details: Record<string, unknown>;
  photos: IPropertyMedia[];
  floorPlan?: IPropertyMedia;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IPropertyMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const propertySchema = new Schema<IProperty>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
    listingType: {
      type: String,
      enum: LISTING_TYPES,
      required: [true, 'Listing type is required'],
    },
    propertyType: {
      type: String,
      enum: PROPERTY_TYPES,
      required: [true, 'Property type is required'],
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'sold', 'rented'],
      default: 'active',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      province: { type: String, required: true, trim: true },
      district: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      wardNo: { type: String, required: true, trim: true },
      area: { type: String, required: true, trim: true },
      landmark: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    videoLink: {
      type: String,
      trim: true,
    },
    // Type-specific specs from the wizard's Details step (houseType, beds, landArea, …).
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    photos: {
      type: [mediaSchema],
      default: [],
    },
    floorPlan: {
      type: mediaSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Property = mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema);

export default Property;
