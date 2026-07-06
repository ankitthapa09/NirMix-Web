import { Types } from 'mongoose';
import {
  createVisit,
  findVisitsByOwner,
  findVisitById,
  updateVisit,
} from '../repositories/visit.repository.js';
import { findPropertyById } from '../repositories/property.repository.js';
import { IVisit } from '../models/visitModel.js';
import { CreateVisitInput, VisitStatus } from '../types/visit.types.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

class VisitService {
  /**
   * Schedule a visit for a property (public). Resolves the property owner so
   * they can manage the request. `visitorId` is set when the requester is logged in.
   */
  async scheduleVisit(data: CreateVisitInput, visitorId?: string): Promise<IVisit> {
    const property = await findPropertyById(data.propertyId);
    if (!property) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found');
    }

    // An owner can't request a visit on their own listing.
    if (visitorId && property.owner.toString() === visitorId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can’t request a visit on your own property');
    }

    return createVisit({
      property: new Types.ObjectId(data.propertyId),
      propertyOwner: property.owner,
      visitor: visitorId ? new Types.ObjectId(visitorId) : undefined,
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
      date: data.date,
      slot: data.slot,
    });
  }

  /** Visit requests on the authenticated owner's properties. */
  async getReceivedVisits(ownerId: string): Promise<IVisit[]> {
    return findVisitsByOwner(ownerId);
  }

  /** Update a visit's status — only the property owner may do this. */
  async updateStatus(ownerId: string, visitId: string, status: VisitStatus): Promise<IVisit> {
    const visit = await findVisitById(visitId);
    if (!visit) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Visit not found');
    }
    if (visit.propertyOwner.toString() !== ownerId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only manage visits on your own properties');
    }

    const updated = await updateVisit(visitId, { status });
    if (!updated) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Visit not found');
    }
    return updated;
  }
}

export default new VisitService();
