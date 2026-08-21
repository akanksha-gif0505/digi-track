import { userRepository } from '../repositories/user.repository';
import { savingsConfigRepository } from '../repositories/savings.repository';
import { budgetRepository } from '../repositories/budget.repository';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS, ERROR_CODES } from '../constants/httpStatus';
import { UserModel, SafeUser } from '../models/user.model';

export class AuthService {
  async signup(data: { name: string; email: string; password?: string; currencySymbol?: string; currencyCode?: string }): Promise<{ user: SafeUser; token: string }> {
    const email = data.email.trim().toLowerCase();
    if (await userRepository.findByEmail(email)) {
      throw new AppError('An account with this email already exists.', HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }
    const now = Date.now();
    const userId = `user-${now}-${Math.random().toString(36).substr(2, 5)}`;
    const newUser: UserModel = {
      id: userId, name: data.name.trim(), email,
      passwordHash: hashPassword(data.password || 'password123'),
      currencySymbol: data.currencySymbol || '₹', currencyCode: data.currencyCode || 'INR',
      isPremium: false, onboarded: true, createdAt: now, updatedAt: now,
    };
    await userRepository.create(newUser);
    await savingsConfigRepository.create({ id: `sav-${userId}`, userId, monthlySalary: 60000, monthlySavingsGoal: 20000, emergencyFundReserve: 50000, savingsLockEnabled: true, autoDeductSavings: true, createdAt: now, updatedAt: now });
    await budgetRepository.create({ id: `bud-${userId}`, userId, totalMonthlyBudget: 40000, selectedMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }), categoryCaps: { food: 10000, shopping: 20000, travel: 5000, entertainment: 4000, housing: 20000, utilities: 5000, transport: 5000, other: 3000 }, createdAt: now, updatedAt: now });
    const token = generateToken({ userId: newUser.id, email: newUser.email, name: newUser.name });
    const { passwordHash: _, ...safeUser } = newUser;
    return { user: safeUser, token };
  }

  async login(email: string, password?: string): Promise<{ user: SafeUser; token: string }> {
    const user = await userRepository.findByEmail(email.trim().toLowerCase());
    if (!user) throw new AppError('Invalid email or password.', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_CREDENTIALS);
    if (password && !verifyPassword(password, user.passwordHash)) throw new AppError('Invalid email or password.', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_CREDENTIALS);
    const token = generateToken({ userId: user.id, email: user.email, name: user.name });
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async demoLogin(email: string): Promise<{ user: SafeUser; token: string }> {
    const normalized = email.trim().toLowerCase();
    const user = await userRepository.findByEmail(normalized);
    if (!user) return this.signup({ name: normalized.split('@')[0].replace(/[._]/g, ' '), email: normalized, password: 'password123' });
    const token = generateToken({ userId: user.id, email: user.email, name: user.name });
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId: string, updates: Partial<UserModel>): Promise<SafeUser> {
    const { passwordHash, id, ...allowed } = updates;
    const updated = await userRepository.update(userId, allowed);
    if (!updated) throw new AppError('User not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    const { passwordHash: _, ...safeUser } = updated;
    return safeUser;
  }
}

export const authService = new AuthService();
