import { z } from 'zod';
import { ALL_USER_ROLES, UserRole } from '../constants/userRoles.js';

// Coerced boolean for query strings: "true"/"false" arrive as text.
const queryBool = z
  .enum(['true', 'false'])
  .transform((v) => v === 'true');

// ── Admin: list / search users ───────────────────────────────────────────────

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  // Free-text match against name / email / contact.
  search: z.string().trim().max(120).optional(),
  role: z.enum(ALL_USER_ROLES as [UserRole, ...UserRole[]]).optional(),
  isVerified: queryBool.optional(),
  isActive: queryBool.optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

// ── Admin: mutate a single user ──────────────────────────────────────────────

export const updateUserRoleSchema = z.object({
  role: z.enum(ALL_USER_ROLES as [UserRole, ...UserRole[]]),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

// Identity verification review outcome — drives the Verified badge (isVerified).
export const setVerificationSchema = z.object({
  isVerified: z.boolean(),
});

export type SetVerificationInput = z.infer<typeof setVerificationSchema>;

// Suspend / reactivate an account (isActive).
export const setActiveSchema = z.object({
  isActive: z.boolean(),
});

export type SetActiveInput = z.infer<typeof setActiveSchema>;
