import mongoose, { Document, Schema, Types } from 'mongoose';
import { NOTIFICATION_TYPES, NotificationType } from '../types/notification.types.js';

export interface INotification extends Document {
  user: Types.ObjectId; // recipient
  type: NotificationType;
  title: string;
  message: string;
  property?: Types.ObjectId;
  link?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: [true, 'Type is required'],
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    link: { type: String, trim: true },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Feed query: a recipient's notifications, newest first.
notificationSchema.index({ user: 1, createdAt: -1 });

const Notification =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
