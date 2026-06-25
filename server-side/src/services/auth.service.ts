import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from '../models/userModel';
import { createUser, findUserByEmail, findUserById, updateUser, findUserByEmail_WithPassword } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { IRegisterRequest, ILoginRequest, IAuthResponse, IJwtPayload } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '30d';

class AuthService {
  /**
   * Generate JWT Access Token
   */
  private generateAccessToken(payload: IJwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE } as SignOptions);
  }

  /**
   * Generate JWT Refresh Token
   */
  private generateRefreshToken(payload: IJwtPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE } as SignOptions);
  }

  /**
   * Verify Access Token
   */
  verifyAccessToken(token: string): IJwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as IJwtPayload;
    } catch (error) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired access token');
    }
  }

  /**
   * Verify Refresh Token
   */
  verifyRefreshToken(token: string): IJwtPayload {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as IJwtPayload;
    } catch (error) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired refresh token');
    }
  }

  /**
   * Register a new user
   */
  async register(data: IRegisterRequest): Promise<IAuthResponse> {
    // Check if user already exists
    const existingUser = await findUserByEmail(data.email);
    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'User with this email already exists');
    }

    // Create new user (password will be hashed by the schema pre-save hook)
    const user = await createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      contact: data.contact,
    });

    // Generate tokens
    const accessToken = this.generateAccessToken({
      id: user._id.toString(),
      email: user.email,
    });

    const refreshToken = this.generateRefreshToken({
      id: user._id.toString(),
      email: user.email,
    });

    // Save refresh token to database
    await updateUser(user._id.toString(), { refreshToken });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        contact: user.contact,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user with email and password
   */
  async login(data: ILoginRequest): Promise<IAuthResponse> {
    // Find user by email with password field selected
    const user = await findUserByEmail_WithPassword(data.email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'User account is inactive');
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken({
      id: user._id.toString(),
      email: user.email,
    });

    const refreshToken = this.generateRefreshToken({
      id: user._id.toString(),
      email: user.email,
    });

    // Save refresh token to database
    await updateUser(user._id.toString(), { refreshToken });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        contact: user.contact,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify refresh token
    const payload = this.verifyRefreshToken(refreshToken);

    // Find user and check if refresh token matches
    const user = await findUserById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token is invalid or expired');
    }

    // Generate new tokens
    const newAccessToken = this.generateAccessToken({
      id: user._id.toString(),
      email: user.email,
    });

    const newRefreshToken = this.generateRefreshToken({
      id: user._id.toString(),
      email: user.email,
    });

    // Save new refresh token to database
    await updateUser(user._id.toString(), { refreshToken: newRefreshToken });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout user (clear refresh token)
   */
  async logout(userId: string): Promise<void> {
    await updateUser(userId, { refreshToken: undefined });
  }
}

export default new AuthService();
