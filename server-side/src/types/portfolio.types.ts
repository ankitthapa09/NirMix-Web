import { z } from 'zod';
import { ALL_Portfolio_ROLES, PortfolioRole } from '../constants/portfolioRoles.js';

export const PORTFOLIO_STATUSES = ['draft', 'active', 'hidden'] as const;
export type PortfolioStatus = (typeof PORTFOLIO_STATUSES)[number];

// ── Reusable sub-schemas ─────────────────────────────────────────────────────

// Cloudinary references already uploaded; new files arrive as multipart parts and
// are attached by the service, so they are not part of the JSON `data` field.
const mediaRefSchema = z.object({ url: z.string(), publicId: z.string() });

const socialsSchema = z
  .object({
    website: z.string().trim().optional().default(''),
    facebook: z.string().trim().optional().default(''),
    instagram: z.string().trim().optional().default(''),
    linkedin: z.string().trim().optional().default(''),
    youtube: z.string().trim().optional().default(''),
    tiktok: z.string().trim().optional().default(''),
    viber: z.string().trim().optional().default(''),
    whatsapp: z.string().trim().optional().default(''),
    behance: z.string().trim().optional().default(''),
  })
  .partial();

// One work sample. `images` are the kept Cloudinary refs; `newImageCount` tells the
// service how many of the uploaded projectImages files belong to this project (in order).
const projectSchema = z.object({
  title: z.string().trim().min(1).max(150),
  type: z.string().trim().optional().default(''),
  role: z.string().trim().optional().default(''),
  district: z.string().trim().optional().default(''),
  year: z.string().trim().optional().default(''),
  duration: z.string().trim().optional().default(''),
  valueRange: z.string().trim().optional().default(''),
  description: z.string().trim().max(2000).optional().default(''),
  images: z.array(mediaRefSchema).optional().default([]),
  newImageCount: z.coerce.number().int().min(0).optional().default(0),
});

// Personal/identity fields — these are written to the User, not the Portfolio.
const identitySchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  displayName: z.string().trim().min(2).max(80),
  dob: z.string().trim().optional().default(''),
  gender: z.string().trim().optional().default(''),
  phone: z.string().trim().min(1),
  citizenshipNo: z.string().trim().optional().default(''),
  address: z
    .object({
      province: z.string().trim().optional().default(''),
      district: z.string().trim().optional().default(''),
      municipality: z.string().trim().optional().default(''),
      ward: z.string().trim().optional().default(''),
      tole: z.string().trim().optional().default(''),
    })
    .partial()
    .optional(),
});

// ── Create / update payloads (the `data` JSON of the multipart request) ──────

export const createPortfolioSchema = z.object({
  category: z.enum(ALL_Portfolio_ROLES as [PortfolioRole, ...PortfolioRole[]]),
  headline: z.string().trim().min(1).max(120),
  availability: z.string().trim().optional().default(''),
  bio: z.string().trim().max(3000).optional().default(''),
  experienceYears: z.coerce.number().int().min(0).max(70).optional(),
  serviceAreas: z.array(z.string().trim()).optional().default([]),
  languages: z.array(z.string().trim()).optional().default([]),
  preferredContact: z.string().trim().optional().default(''),
  feeModel: z.string().trim().optional().default(''),
  feeAmount: z.coerce.number().min(0).optional(),

  // Category-specific fields (NEC no., contractor class, services, …) — flexible bag.
  details: z.record(z.string(), z.unknown()).optional().default({}),
  socials: socialsSchema.optional().default({}),
  projects: z.array(projectSchema).optional().default([]),

  // Split out by the service to update the owning User.
  identity: identitySchema,
});

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;

// Update: same fields plus the kept cover image. `category` is accepted but ignored
// by the service (locked to preserve the reference code).
export const updatePortfolioSchema = createPortfolioSchema.extend({
  existingCoverImage: mediaRefSchema.nullable().optional(),
});

export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;

// ── Reference code, e.g. "ENG-0001" ─────────────────────────────────────────

export const PORTFOLIO_CATEGORY_CODES: Record<PortfolioRole, string> = {
  engineer: 'ENG',
  architect: 'ARCH',
  agent: 'AGENT',
  interior_designer: 'INT',
  contractor: 'CONT',
};

/** Counter key for a category, e.g. "PORTFOLIO-ENG". */
export function referenceKey(category: PortfolioRole): string {
  return `PORTFOLIO-${PORTFOLIO_CATEGORY_CODES[category]}`;
}

/** Reference code from category + sequence, e.g. "ENG-0001". */
export function buildReferenceId(category: PortfolioRole, seq: number): string {
  return `${PORTFOLIO_CATEGORY_CODES[category]}-${String(seq).padStart(4, '0')}`;
}

// ── Persisted document sub-shapes ────────────────────────────────────────────

export interface IPortfolioMedia {
  url: string;
  publicId: string;
}

export interface IPortfolioProject {
  title: string;
  type: string;
  role: string;
  district: string;
  year: string;
  duration: string;
  valueRange: string;
  description: string;
  images: IPortfolioMedia[];
}

export interface IPortfolioSocials {
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  viber?: string;
  whatsapp?: string;
  behance?: string;
}
