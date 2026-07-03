import { Types } from 'mongoose';
import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary.js';
import {
  createPortfolio,
  findPortfolioByOwner,
  findActivePortfolios,
  findPortfolioById,
  findPortfolioByIdWithOwner,
  updatePortfolio,
  deletePortfolioById,
} from '../repositories/portfolio.repository.js';
import { updateUser, findUserById } from '../repositories/user.repository.js';
import { getNextSequence } from '../repositories/counter.repository.js';
import { IPortfolio } from '../models/portfolioModel.js';
import { IUser } from '../models/userModel.js';
import { PortfolioRole } from '../constants/portfolioRoles.js';
import {
  CreatePortfolioInput,
  UpdatePortfolioInput,
  IPortfolioMedia,
  IPortfolioProject,
  buildReferenceId,
  referenceKey,
} from '../types/portfolio.types.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

const PORTFOLIO_FOLDER = 'nirmix/portfolios';

// Shape of req.files produced by upload.middleware's `.fields()` config.
export interface PortfolioMediaFiles {
  coverImage?: Express.Multer.File[];
  projectImages?: Express.Multer.File[];
}

class PortfolioService {
  /** Stream a single in-memory file buffer to Cloudinary. */
  private uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<IPortfolioMedia> {
    return new Promise<IPortfolioMedia>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(error ?? new ApiError(HTTP_STATUS.INTERNAL, 'Image upload failed'));
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      stream.end(file.buffer);
    });
  }

  /**
   * Rebuild the projects array: keep the client's retained image refs and append
   * the freshly uploaded files, distributed across projects in order via
   * each project's `newImageCount`.
   */
  private async buildProjects(
    projects: CreatePortfolioInput['projects'],
    projectImageFiles: Express.Multer.File[]
  ): Promise<IPortfolioProject[]> {
    // Slice the flat file list per project synchronously so ordering is deterministic.
    const slices: { project: CreatePortfolioInput['projects'][number]; files: Express.Multer.File[] }[] = [];
    let cursor = 0;
    for (const project of projects) {
      const count = project.newImageCount ?? 0;
      slices.push({ project, files: projectImageFiles.slice(cursor, cursor + count) });
      cursor += count;
    }

    return Promise.all(
      slices.map(async ({ project, files }) => {
        const uploaded = await Promise.all(files.map((f) => this.uploadToCloudinary(f, PORTFOLIO_FOLDER)));
        const { newImageCount: _drop, ...rest } = project;
        void _drop;
        return { ...rest, images: [...(project.images ?? []), ...uploaded] };
      })
    );
  }

  /**
   * Persist the identity block onto the owning User (single source of truth),
   * and mark them a professional in this category.
   */
  private async applyIdentity(
    ownerId: string,
    identity: CreatePortfolioInput['identity'],
    category: PortfolioRole
  ): Promise<void> {
    const user = await findUserById(ownerId);
    const professions = new Set<PortfolioRole>(user?.profession ?? []);
    professions.add(category);

    const updates: Partial<IUser> = {
      name: identity.fullName,
      displayName: identity.displayName,
      dob: identity.dob,
      gender: identity.gender,
      contact: identity.phone,
      citizenshipNo: identity.citizenshipNo,
      address: {
        province: identity.address?.province,
        district: identity.address?.district,
        municipality: identity.address?.municipality,
        ward: identity.address?.ward,
        tole: identity.address?.tole,
      },
      isProfessional: true,
      profession: [...professions],
    };
    await updateUser(ownerId, updates);
  }

  /** Create the user's portfolio (one per user). */
  async createPortfolio(
    ownerId: string,
    data: CreatePortfolioInput,
    files: PortfolioMediaFiles
  ): Promise<IPortfolio> {
    const existing = await findPortfolioByOwner(ownerId);
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'You already have a portfolio — edit it instead.');
    }

    let coverImage: IPortfolioMedia | undefined;
    const coverFile = files.coverImage?.[0];
    if (coverFile) {
      coverImage = await this.uploadToCloudinary(coverFile, PORTFOLIO_FOLDER);
    }

    const projects = await this.buildProjects(data.projects, files.projectImages ?? []);

    const seq = await getNextSequence(referenceKey(data.category));
    const referenceId = buildReferenceId(data.category, seq);

    const portfolio = await createPortfolio({
      referenceId,
      owner: new Types.ObjectId(ownerId),
      category: data.category,
      headline: data.headline,
      availability: data.availability,
      bio: data.bio,
      experienceYears: data.experienceYears,
      serviceAreas: data.serviceAreas,
      languages: data.languages,
      preferredContact: data.preferredContact,
      feeModel: data.feeModel,
      feeAmount: data.feeAmount,
      details: data.details,
      socials: data.socials,
      projects,
      coverImage,
    });

    await this.applyIdentity(ownerId, data.identity, data.category);

    return portfolio;
  }

  /** The authenticated user's own portfolio (or null). */
  async getMyPortfolio(ownerId: string): Promise<IPortfolio | null> {
    return findPortfolioByOwner(ownerId);
  }

  /** Active portfolios for the public directory, optionally filtered by category. */
  async getAllPortfolios(category?: PortfolioRole): Promise<IPortfolio[]> {
    return findActivePortfolios(category);
  }

  /** A single portfolio by id (public), with the owner populated. */
  async getPortfolioById(id: string): Promise<IPortfolio> {
    const portfolio = await findPortfolioByIdWithOwner(id);
    if (!portfolio) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Portfolio not found');
    }
    return portfolio;
  }

  /**
   * Update the user's portfolio. Diffs media against what the client kept:
   * removes dropped images from Cloudinary, uploads new ones. Category and the
   * reference code are preserved.
   */
  async updatePortfolio(
    ownerId: string,
    portfolioId: string,
    data: UpdatePortfolioInput,
    files: PortfolioMediaFiles
  ): Promise<IPortfolio> {
    const portfolio = await findPortfolioById(portfolioId);
    if (!portfolio) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Portfolio not found');
    }
    if (portfolio.owner.toString() !== ownerId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only edit your own portfolio');
    }

    // Cover image: new file replaces; otherwise keep the kept ref or drop it.
    let coverImage: IPortfolioMedia | undefined;
    const coverFile = files.coverImage?.[0];
    if (coverFile) {
      coverImage = await this.uploadToCloudinary(coverFile, PORTFOLIO_FOLDER);
    } else if (data.existingCoverImage) {
      coverImage = data.existingCoverImage;
    }

    const projects = await this.buildProjects(data.projects, files.projectImages ?? []);

    // Remove any Cloudinary media the client dropped (best effort).
    const oldIds = new Set<string>();
    if (portfolio.coverImage) oldIds.add(portfolio.coverImage.publicId);
    portfolio.projects.forEach((p) => p.images.forEach((img) => oldIds.add(img.publicId)));

    const keptIds = new Set<string>();
    if (coverImage) keptIds.add(coverImage.publicId);
    projects.forEach((p) => p.images.forEach((img) => keptIds.add(img.publicId)));

    const removed = [...oldIds].filter((id) => !keptIds.has(id));
    await Promise.all(removed.map((id) => cloudinary.uploader.destroy(id).catch(() => undefined)));

    const updated = await updatePortfolio(portfolioId, {
      headline: data.headline,
      availability: data.availability,
      bio: data.bio,
      experienceYears: data.experienceYears,
      serviceAreas: data.serviceAreas,
      languages: data.languages,
      preferredContact: data.preferredContact,
      feeModel: data.feeModel,
      feeAmount: data.feeAmount,
      details: data.details,
      socials: data.socials,
      projects,
      coverImage,
    });

    if (!updated) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Portfolio not found');
    }

    await this.applyIdentity(ownerId, data.identity, portfolio.category);

    return updated;
  }

  /** Delete the user's portfolio, its Cloudinary media, and clear the professional flag. */
  async deletePortfolio(ownerId: string, portfolioId: string): Promise<void> {
    const portfolio = await findPortfolioById(portfolioId);
    if (!portfolio) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Portfolio not found');
    }
    if (portfolio.owner.toString() !== ownerId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only delete your own portfolio');
    }

    const publicIds = [
      ...(portfolio.coverImage ? [portfolio.coverImage.publicId] : []),
      ...portfolio.projects.flatMap((p) => p.images.map((img) => img.publicId)),
    ];
    await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id).catch(() => undefined)));

    await deletePortfolioById(portfolioId);

    // Drop this category from the user's professions; unflag if none remain.
    const user = await findUserById(ownerId);
    const remaining = (user?.profession ?? []).filter((p) => p !== portfolio.category);
    await updateUser(ownerId, { profession: remaining, isProfessional: remaining.length > 0 });
  }
}

export default new PortfolioService();
