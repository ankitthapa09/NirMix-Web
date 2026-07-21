import { listUsers, findUserForReview, PaginatedUsers } from '../repositories/admin.repository.js';
import { findUserById, updateUser } from '../repositories/user.repository.js';
import { IUser } from '../models/userModel.js';
import {
  ListUsersQuery,
  UpdateUserRoleInput,
  SetVerificationInput,
  SetActiveInput,
} from '../types/admin.types.js';
import { USER_ROLES } from '../constants/userRoles.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

class AdminService {
  /** Paginated, filterable user list for the admin panel. */
  async listUsers(query: ListUsersQuery): Promise<PaginatedUsers> {
    return listUsers(query);
  }

  /** A single user with citizenshipNo, for the identity-verification screen. */
  async getUserForReview(userId: string): Promise<IUser> {
    const user = await findUserForReview(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }
    return user;
  }

  /**
   * Change a user's role. An admin may not strip their own admin role — that
   * would risk locking the last admin out of the panel.
   */
  async updateUserRole(
    actingAdminId: string,
    targetUserId: string,
    data: UpdateUserRoleInput
  ): Promise<IUser> {
    if (actingAdminId === targetUserId && data.role !== USER_ROLES.ADMIN) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You cannot remove your own admin role');
    }

    const updated = await updateUser(targetUserId, { role: data.role });
    if (!updated) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }
    return updated;
  }

  /** Approve or revoke identity verification (drives the Verified badge). */
  async setUserVerification(
    targetUserId: string,
    data: SetVerificationInput
  ): Promise<IUser> {
    const updated = await updateUser(targetUserId, { isVerified: data.isVerified });
    if (!updated) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }
    return updated;
  }

  /**
   * Suspend or reactivate an account. An admin may not deactivate their own
   * account.
   */
  async setUserActive(
    actingAdminId: string,
    targetUserId: string,
    data: SetActiveInput
  ): Promise<IUser> {
    if (actingAdminId === targetUserId && !data.isActive) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You cannot deactivate your own account');
    }

    const updated = await updateUser(targetUserId, { isActive: data.isActive });
    if (!updated) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }
    return updated;
  }
}

export default new AdminService();
