import { splitRepository } from '../repositories/split.repository';
import { expenseService } from './expense.service';
import { SplitBillModel, SplitParticipant, SettlementDebt } from '../models/split.model';
import { computeMinimalSettlements } from '../utils/settlement';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS, ERROR_CODES } from '../constants/httpStatus';

export class SplitService {
  async getSplits(userId: string): Promise<SplitBillModel[]> {
    return splitRepository.findByUserId(userId);
  }

  async getSplitById(userId: string, id: string): Promise<SplitBillModel> {
    const split = await splitRepository.findById(id);
    if (!split || split.userId !== userId) {
      throw new AppError('Split bill not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }
    return split;
  }

  async createSplit(
    userId: string,
    data: {
      title: string;
      totalAmount: number;
      category?: string;
      date?: string;
      splitType?: 'equal' | 'exact' | 'percentage' | 'shares';
      participants: SplitParticipant[];
      settlements?: SettlementDebt[];
      notes?: string;
    }
  ): Promise<SplitBillModel> {
    if (!data.title || !data.title.trim()) {
      throw new AppError('Bill title is required.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }
    if (typeof data.totalAmount !== 'number' || data.totalAmount <= 0) {
      throw new AppError('Total amount must be greater than 0.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }
    if (!Array.isArray(data.participants) || data.participants.length < 2) {
      throw new AppError('At least 2 participants are required to split a bill.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const now = Date.now();
    const id = `split-${now}-${Math.random().toString(36).substr(2, 4)}`;

    // If client did not provide computed settlements, compute them automatically
    const settlements = data.settlements && data.settlements.length > 0
      ? data.settlements
      : computeMinimalSettlements(data.participants);

    const newSplit: SplitBillModel = {
      id,
      userId,
      title: data.title.trim(),
      totalAmount: Math.round(data.totalAmount * 100) / 100,
      category: data.category || 'food',
      date: data.date || new Date().toISOString().split('T')[0],
      splitType: data.splitType || 'equal',
      participants: data.participants,
      settlements,
      notes: data.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    return splitRepository.create(newSplit);
  }

  async updateSplit(
    userId: string,
    id: string,
    updates: Partial<Omit<SplitBillModel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<SplitBillModel> {
    const existing = await this.getSplitById(userId, id);

    let settlements = updates.settlements || existing.settlements;
    if (updates.participants && !updates.settlements) {
      settlements = computeMinimalSettlements(updates.participants);
    }

    const updated = await splitRepository.update(id, {
      ...updates,
      settlements,
    });

    return updated!;
  }

  async deleteSplit(userId: string, id: string): Promise<boolean> {
    await this.getSplitById(userId, id);
    return splitRepository.delete(id);
  }

  async settleDebt(
    userId: string,
    splitId: string,
    settlementIndex: number,
    paymentMode: string = 'UPI',
    recordAsExpense: boolean = false
  ): Promise<{ split: SplitBillModel; createdExpense?: any }> {
    const split = await this.getSplitById(userId, splitId);
    const updatedSettlements = [...split.settlements];

    if (!updatedSettlements[settlementIndex]) {
      throw new AppError('Settlement debt item not found at index.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    const debt = updatedSettlements[settlementIndex];
    updatedSettlements[settlementIndex] = {
      ...debt,
      settled: true,
      settledAt: Date.now(),
      settledPaymentMode: paymentMode,
    };

    let createdExpense = undefined;

    // If debt is owed by "You" and recordAsExpense is true, automatically create an expense
    if (recordAsExpense && (debt.from === 'You' || debt.from.toLowerCase() === 'you')) {
      const now = new Date();
      createdExpense = await expenseService.createExpense(userId, {
        title: `Settled with ${debt.to}: ${split.title}`,
        amount: Math.round(debt.amount),
        category: split.category || 'other',
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        paymentMode: (paymentMode as any) || 'UPI',
        note: `Split bill settlement paid to ${debt.to} for "${split.title}"`,
      });
    }

    const updated = await splitRepository.update(splitId, {
      settlements: updatedSettlements,
    });

    return {
      split: updated!,
      createdExpense,
    };
  }

  async settleAllDebts(userId: string, splitId: string): Promise<SplitBillModel> {
    const split = await this.getSplitById(userId, splitId);
    const now = Date.now();

    const updatedSettlements = split.settlements.map((s) => ({
      ...s,
      settled: true,
      settledAt: s.settledAt || now,
      settledPaymentMode: s.settledPaymentMode || 'UPI',
    }));

    const updated = await splitRepository.update(splitId, {
      settlements: updatedSettlements,
    });

    return updated!;
  }
}

export const splitService = new SplitService();
