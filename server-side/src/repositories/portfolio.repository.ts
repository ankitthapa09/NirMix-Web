import Portfolio, { IPortfolio } from '../models/portfolioModel.js';
import { PortfolioRole } from '../constants/portfolioRoles.js';

const OWNER_PUBLIC_FIELDS = 'name avatar contact email isProfessional isEmailVerified';

/**
 * Persist a new portfolio.
 * Validation/casting is enforced by the schema on save().
 */
export async function createPortfolio(data: Partial<IPortfolio>): Promise<IPortfolio> {
  const portfolio = new Portfolio(data);
  return portfolio.save();
}

/**
 * Find the portfolio owned by a user (one per user, or null).
 */
export async function findPortfolioByOwner(ownerId: string): Promise<IPortfolio | null> {
  return Portfolio.findOne({ owner: ownerId });
}

/**
 * Find all active (publicly visible) portfolios, newest first,
 * optionally filtered by category, with the owner's public fields populated.
 */
export async function findActivePortfolios(category?: PortfolioRole): Promise<IPortfolio[]> {
  const query: Record<string, unknown> = { status: 'active' };
  if (category) query.category = category;
  return Portfolio.find(query).sort({ createdAt: -1 }).populate('owner', OWNER_PUBLIC_FIELDS);
}

/**
 * Find a single portfolio by its id.
 */
export async function findPortfolioById(id: string): Promise<IPortfolio | null> {
  return Portfolio.findById(id);
}

/**
 * Find a single portfolio by id with the owner's public fields populated
 * (for the public profile page).
 */
export async function findPortfolioByIdWithOwner(id: string): Promise<IPortfolio | null> {
  return Portfolio.findById(id).populate('owner', OWNER_PUBLIC_FIELDS);
}

/**
 * Update a portfolio by its id.
 */
export async function updatePortfolio(
  id: string,
  updates: Partial<IPortfolio>
): Promise<IPortfolio | null> {
  return Portfolio.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

/**
 * Delete a portfolio by its id.
 */
export async function deletePortfolioById(id: string): Promise<IPortfolio | null> {
  return Portfolio.findByIdAndDelete(id);
}
