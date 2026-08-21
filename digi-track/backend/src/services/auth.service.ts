import { userRepository } from '../repositories/user.repository';
import { savingsConfigRepository } from '../repositories/savings.repository';
import { budgetRepository } from '../repositories/budget.repository';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS, ERROR_CODES } from '../constants/httpStatus';
import { UserModel, SafeUser } from '../models/user.model';

export class AuthService {
  async signup(data: {
    name: string;
    email: string;
    password?: string;
    currencySymbol?: string;
    currencyCode?: string;
  }): Promise<{ user: SafeUser; token: string }> {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new AppError('An account with this email already exists.', HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }

    const passwordHash = hashPassword(data.password || 'password123');
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const now = Date.now();

    const newUser: UserModel = {
      id: userId,
      name: data.name.trim(),
      email: normalizedEmail,
      passwordHash,
      currencySymbol: data.currencySymbol || '₹',
      currencyCode: data.currencyCode || 'INR',
      isPremium: false,
      onboarded: true,
      createdAt: now,
      updatedAt: now,
    };

    await userRepository.create(newUser);

    // Initialize Default Savings Config
    await savingsConfigRepository.create({
      id: `sav-${userId}`,
      userId,
      monthlySalary: 60000,
      monthlySavingsGoal: 20000,
      emergencyFundReserve: 50000,
      savingsLockEnabled: true,
      autoDeductSavings: true,
      createdAt: now,
      updatedAt: now,
    });

    // Initialize Default Budget
    await budgetRepository.create({
      id: `bud-${userId}`,
      userId,
      totalMonthlyBudget: 40000,
      selectedMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      categoryCaps: {
        food: 10000,
        shopping: 20000,
        travel: 5000,
        entertainment: 4000,
        housing: 20000,
        utilities: 5000,
        transport: 5000,
        other: 3000,
      },
      createdAt: now,
      updatedAt: now,
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return { user: safeUser, token };
  }

  async login(email: string, password?: string): Promise<{ user: SafeUser; token: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new AppError('Invalid email or password.', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_CREDENTIALS);
    }

    if (password && !verifyPassword(password, user.passwordHash)) {
      throw new AppError('Invalid email or password.', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_CREDENTIALS);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async demoLogin(email: string): Promise<{ user: SafeUser; token: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    let user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      // Auto register demo profile
      const result = await this.signup({
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email: normalizedEmail,
        password: 'password123',
      });
      return result;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User profile not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId: string, updates: Partial<UserModel>): Promise<SafeUser> {
    const { passwordHash, id, ...allowedUpdates } = updates;
    const updated = await userRepository.update(userId, allowedUpdates);
    if (!updated) {
      throw new AppError('User profile not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }
    const { passwordHash: _, ...safeUser } = updated;
    return safeUser;
  }
}

export const authService = new AuthService();
