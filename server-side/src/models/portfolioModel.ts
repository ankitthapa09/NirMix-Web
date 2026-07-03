import mongoose, { Document, Schema, Types } from 'mongoose';
import { ALL_Portfolio_ROLES, PortfolioRole } from '../constants/portfolioRoles.js';
import {
  PORTFOLIO_STATUSES,
  PortfolioStatus,
  IPortfolioMedia,
  IPortfolioProject,
  IPortfolioSocials,
} from '../types/portfolio.types.js';

export interface IPortfolio extends Document {
  referenceId: string;
  owner: Types.ObjectId;
  category: PortfolioRole;
  status: PortfolioStatus;

  headline: string;
  availability: string;
  bio: string;
  experienceYears?: number;
  serviceAreas: string[];
  languages: string[];
  preferredContact: string;
  feeModel: string;
  feeAmount?: number;

  details: Record<string, unknown>;
  socials: IPortfolioSocials;
  projects: IPortfolioProject[];
  coverImage?: IPortfolioMedia;

  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IPortfolioMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const projectSchema = new Schema<IPortfolioProject>(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, trim: true, default: '' },
    role: { type: String, trim: true, default: '' },
    district: { type: String, trim: true, default: '' },
    year: { type: String, trim: true, default: '' },
    duration: { type: String, trim: true, default: '' },
    valueRange: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    images: { type: [mediaSchema], default: [] },
  },
  { _id: false }
);

const socialsSchema = new Schema<IPortfolioSocials>(
  {
    website: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    youtube: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    viber: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    behance: { type: String, trim: true },
  },
  { _id: false }
);

const portfolioSchema = new Schema<IPortfolio>(
  {
    referenceId: {
      type: String,
      required: [true, 'Reference ID is required'],
      unique: true,
      index: true,
    },
    // One portfolio per user (Option A) — a unique index enforces it.
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      unique: true,
      index: true,
    },
    category: {
      type: String,
      enum: ALL_Portfolio_ROLES,
      required: [true, 'Category is required'],
    },
    status: {
      type: String,
      enum: PORTFOLIO_STATUSES,
      default: 'active',
    },

    headline: { type: String, required: [true, 'Headline is required'], trim: true },
    availability: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, default: '' },
    experienceYears: { type: Number, min: 0 },
    serviceAreas: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    preferredContact: { type: String, trim: true, default: '' },
    feeModel: { type: String, trim: true, default: '' },
    feeAmount: { type: Number, min: 0 },

    // Category-specific fields from the wizard's Expertise step (NEC no., services, …).
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    socials: {
      type: socialsSchema,
      default: () => ({}),
    },
    projects: {
      type: [projectSchema],
      default: [],
    },
    coverImage: {
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

const Portfolio =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', portfolioSchema);

export default Portfolio;
