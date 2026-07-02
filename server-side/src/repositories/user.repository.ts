import User, {IUser} from '../models/userModel';
import { PortfolioRole } from '../constants/portfolioRoles';

export async function createUser(data: {
  name:     string;
  email:    string;
  password: string; // plain text here — schema pre-save hook hashes it
  contact?: string;
}): Promise<IUser> {
  const user = new User(data);
  return user.save(); // pre-save hook runs here, hashing the password
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email: email.toLowerCase() });
}

export async function findUserById(id: string): Promise<IUser | null> {
  return User.findById(id);
}

export async function updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
  return User.findByIdAndUpdate(id, updates, { returnDocument: 'after', runValidators: true });
}

export async function deleteUser(id: string): Promise<IUser | null> {
  return User.findByIdAndDelete(id);
}

export async function findUserByEmail_WithPassword(email: string): Promise<IUser | null> {
  return User.findOne({ email: email.toLowerCase() }).select('+password');
}

export async function findUserById_WithPassword(id: string): Promise<IUser | null> {
  return User.findById(id).select('+password');
}
