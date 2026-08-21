import { expenseRepository, ExpenseFilterOptions } from '../repositories/expense.repository';
import { categoryRepository } from '../repositories/category.repository';
import { ExpenseModel } from '../models/expense.model';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS, ERROR_CODES } from '../constants/httpStatus';

export class ExpenseService {
  async getExpenses(userId: string, options: ExpenseFilterOptions) {
    const result = await expenseRepository.findFiltered(userId, options);
    const categories = await categoryRepository.findAvailableForUser(userId);
    const totals: Record<string, number> = {};
    result.expenses.forEach((e) => { totals[e.category] = (totals[e.category] || 0) + e.amount; });
    const categoryBreakdown = categories.map((cat) => {
      const total = totals[cat.id] || 0;
      return { category: cat, total, percentage: result.totalAmount > 0 ? Math.round((total / result.totalAmount) * 100) : 0 };
    });
    return { ...result, categoryBreakdown };
  }

  async getExpenseById(userId: string, id: string): Promise<ExpenseModel> {
    const expense = await expenseRepository.findById(id);
    if (!expense || expense.userId !== userId) throw new AppError('Expense not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    return expense;
  }

  async createExpense(userId: string, data: Omit<ExpenseModel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ExpenseModel> {
    if (!data.title?.trim()) throw new AppError('Expense title is required.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    if (typeof data.amount !== 'number' || data.amount <= 0) throw new AppError('Amount must be a positive number.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    const now = Date.now();
    return expenseRepository.create({
      id: `exp-${now}-${Math.random().toString(36).substr(2, 5)}`, userId,
      title: data.title.trim(), amount: Math.round(data.amount * 100) / 100,
      category: data.category || 'other', date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      paymentMode: data.paymentMode || 'UPI', note: data.note?.trim() || undefined,
      createdAt: now, updatedAt: now,
    });
  }

  async updateExpense(userId: string, id: string, updates: Partial<Omit<ExpenseModel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<ExpenseModel> {
    const existing = await this.getExpenseById(userId, id);
    if (updates.amount !== undefined && (typeof updates.amount !== 'number' || updates.amount <= 0)) throw new AppError('Amount must be a positive number.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    const updated = await expenseRepository.update(id, { ...updates, title: updates.title?.trim() ?? existing.title, note: updates.note?.trim() ?? existing.note });
    if (!updated) throw new AppError('Failed to update expense.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    return updated;
  }

  async deleteExpense(userId: string, id: string): Promise<boolean> {
    await this.getExpenseById(userId, id);
    return expenseRepository.delete(id);
  }
}

export const expenseService = new ExpenseService();
