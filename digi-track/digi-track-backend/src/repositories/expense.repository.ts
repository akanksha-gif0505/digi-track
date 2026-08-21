import { BaseRepository } from './base.repository';
import { ExpenseModel } from '../models/expense.model';

export type DatePreset = 'all' | 'today' | 'week' | 'month' | 'custom';

export interface ExpenseFilterOptions {
  search?: string;
  category?: string;
  datePreset?: DatePreset;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

function getPresetBounds(preset: DatePreset): { startDate?: string; endDate?: string } {
  const now = new Date();
  const iso = (d: Date) => d.toISOString().split('T')[0];
  const today = iso(now);
  switch (preset) {
    case 'today': return { startDate: today, endDate: today };
    case 'week': {
      const s = new Date(now); s.setDate(now.getDate() - 6);
      return { startDate: iso(s), endDate: today };
    }
    case 'month': {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: iso(s), endDate: today };
    }
    default: return {};
  }
}

export class ExpenseRepository extends BaseRepository<ExpenseModel> {
  constructor() { super('expenses'); }

  async findByUserId(userId: string): Promise<ExpenseModel[]> {
    const list = await this.findAll((e) => e.userId === userId);
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  async findFiltered(userId: string, opts: ExpenseFilterOptions) {
    let list = await this.findByUserId(userId);

    let startDate = opts.startDate;
    let endDate = opts.endDate;
    if (opts.datePreset && opts.datePreset !== 'all' && opts.datePreset !== 'custom') {
      const bounds = getPresetBounds(opts.datePreset);
      startDate = bounds.startDate;
      endDate = bounds.endDate;
    }

    if (opts.category && opts.category !== 'all') {
      const cat = opts.category.toLowerCase();
      list = list.filter((e) => e.category.toLowerCase() === cat);
    }
    if (startDate) list = list.filter((e) => e.date >= startDate!);
    if (endDate) list = list.filter((e) => e.date <= endDate!);

    if (opts.search) {
      const q = opts.search.trim().toLowerCase();
      list = list.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.note && e.note.toLowerCase().includes(q)) ||
        e.amount.toString().includes(q) ||
        e.paymentMode.toLowerCase().includes(q) ||
        e.date.includes(q)
      );
    }

    const totalCount = list.length;
    const totalAmount = list.reduce((s, i) => s + i.amount, 0);
    const page = opts.page || 1;
    const limit = opts.limit || 50;
    const expenses = list.slice((page - 1) * limit, page * limit);

    return { expenses, totalCount, totalAmount, page, limit };
  }
}

export const expenseRepository = new ExpenseRepository();
