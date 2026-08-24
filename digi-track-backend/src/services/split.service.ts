import { splitRepository } from '../repositories/split.repository';
import { expenseService } from './expense.service';
import { SplitBillModel, SplitParticipant, SettlementDebt } from '../models/split.model';
import { computeMinimalSettlements } from '../utils/settlement';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS, ERROR_CODES } from '../constants/httpStatus';

export class SplitService {
  async getSplits(userId: string): Promise<SplitBillModel[]> { return splitRepository.findByUserId(userId); }

  async getSplitById(userId: string, id: string): Promise<SplitBillModel> {
    const split = await splitRepository.findById(id);
    if (!split || split.userId !== userId) throw new AppError('Split bill not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    return split;
  }

  async createSplit(userId: string, data: { title: string; totalAmount: number; category?: string; date?: string; splitType?: 'equal' | 'exact' | 'percentage' | 'shares'; participants: SplitParticipant[]; settlements?: SettlementDebt[]; notes?: string }): Promise<SplitBillModel> {
    if (!data.title?.trim()) throw new AppError('Bill title is required.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    if (typeof data.totalAmount !== 'number' || data.totalAmount <= 0) throw new AppError('Total amount must be > 0.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    if (!Array.isArray(data.participants) || data.participants.length < 2) throw new AppError('At least 2 participants required.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    const now = Date.now();
    return splitRepository.create({ id: `split-${now}-${Math.random().toString(36).substr(2, 4)}`, userId, title: data.title.trim(), totalAmount: Math.round(data.totalAmount * 100) / 100, category: data.category || 'food', date: data.date || new Date().toISOString().split('T')[0], splitType: data.splitType || 'equal', participants: data.participants, settlements: data.settlements?.length ? data.settlements : computeMinimalSettlements(data.participants), notes: data.notes?.trim(), createdAt: now, updatedAt: now });
  }

  async updateSplit(userId: string, id: string, updates: Partial<Omit<SplitBillModel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<SplitBillModel> {
    const existing = await this.getSplitById(userId, id);
    const settlements = updates.participants && !updates.settlements ? computeMinimalSettlements(updates.participants) : (updates.settlements || existing.settlements);
    return (await splitRepository.update(id, { ...updates, settlements }))!;
  }

  async deleteSplit(userId: string, id: string): Promise<boolean> { await this.getSplitById(userId, id); return splitRepository.delete(id); }

  async settleDebt(userId: string, splitId: string, index: number, paymentMode = 'UPI', recordAsExpense = false): Promise<{ split: SplitBillModel; createdExpense?: any }> {
    const split = await this.getSplitById(userId, splitId);
    if (!split.settlements[index]) throw new AppError('Settlement not found at index.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    const settlements = [...split.settlements];
    const debt = settlements[index];
    settlements[index] = { ...debt, settled: true, settledAt: Date.now(), settledPaymentMode: paymentMode };
    let createdExpense;
    if (recordAsExpense && debt.from.toLowerCase() === 'you') {
      const now = new Date();
      createdExpense = await expenseService.createExpense(userId, { title: `Settled with ${debt.to}: ${split.title}`, amount: Math.round(debt.amount), category: split.category || 'other', date: now.toISOString().split('T')[0], time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), paymentMode: paymentMode as any, note: `Settlement for "${split.title}"` });
    }
    return { split: (await splitRepository.update(splitId, { settlements }))!, createdExpense };
  }

  async settleAllDebts(userId: string, splitId: string): Promise<SplitBillModel> {
    const split = await this.getSplitById(userId, splitId);
    const now = Date.now();
    return (await splitRepository.update(splitId, { settlements: split.settlements.map((s) => ({ ...s, settled: true, settledAt: s.settledAt || now, settledPaymentMode: s.settledPaymentMode || 'UPI' })) }))!;
  }
}

export const splitService = new SplitService();
