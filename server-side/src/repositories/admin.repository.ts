import { QueryFilter } from 'mongoose';
import User, { IUser } from '../models/userModel';
import { ListUsersQuery } from '../types/admin.types';

export interface PaginatedUsers {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
}

export async function listUsers(query: ListUsersQuery): Promise<PaginatedUsers> {
  const { page, limit, search, role, isVerified, isActive } = query;

  const filter: QueryFilter<IUser> = {};

  if (role !== undefined) filter.role = role;
  if (isVerified !== undefined) filter.isVerified = isVerified;
  if (isActive !== undefined) filter.isActive = isActive;

  if (search) {
    const rx = new RegExp(escapeRegExp(search), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { contact: rx }];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return { users, total, page, limit };
}

/**
 * A single user with the normally-hidden `citizenshipNo` included, for the
 * identity-verification review screen. Password/tokens remain excluded.
 */
export async function findUserForReview(id: string): Promise<IUser | null> {
  return User.findById(id).select('+citizenshipNo');
}

// Escape user input before building a RegExp so "." etc. are treated literally.
function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
