import { z } from 'zod';

export const VISIT_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const;
export type VisitStatus = (typeof VISIT_STATUSES)[number];

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid property id');

// Public request to schedule a visit for a property.
export const createVisitSchema = z.object({
  propertyId: objectId,
  date: z.string().trim().min(1, 'Date is required'),
  slot: z.string().trim().min(1, 'Time slot is required'),
  name: z.string().trim().min(2, 'Name is required').max(80),
  phone: z.string().trim().min(1, 'Phone is required').max(20),
  email: z.union([z.email(), z.literal('')]).optional().default(''),
  message: z.string().trim().max(1000).optional().default(''),
});

export type CreateVisitInput = z.infer<typeof createVisitSchema>;

// Owner updates the status of a visit request on their property.
export const updateVisitStatusSchema = z.object({
  status: z.enum(VISIT_STATUSES),
});

export type UpdateVisitStatusInput = z.infer<typeof updateVisitStatusSchema>;
