import mongoose, { Document, Schema, Types } from 'mongoose';
import { VISIT_STATUSES, VisitStatus } from '../types/visit.types.js';

export interface IVisit extends Document {
  property: Types.ObjectId;
  propertyOwner: Types.ObjectId; // denormalised so an owner can list requests efficiently
  visitor?: Types.ObjectId;      // set when the requester is logged in
  name: string;
  phone: string;
  email?: string;
  message?: string;
  date: string;
  slot: string;
  status: VisitStatus;
  createdAt: Date;
  updatedAt: Date;
}

const visitSchema = new Schema<IVisit>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property is required'],
      index: true,
    },
    propertyOwner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    visitor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    message: { type: String, trim: true },
    date: { type: String, required: true },
    slot: { type: String, required: true },
    status: {
      type: String,
      enum: VISIT_STATUSES,
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Visit = mongoose.models.Visit || mongoose.model<IVisit>('Visit', visitSchema);

export default Visit;
