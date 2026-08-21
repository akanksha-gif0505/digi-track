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

function getDatePresetBounds(preset: DatePreset): { startDate?: string; endDate?: string } {
  const now = new Date();
  const toISO = (d: Date) => d.toISOString().split('T')[0];
  const today = toISO(now);

  switch (preset) {
    case 'today':
      return { startDate: today, endDate: today };
    case 'week': {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 6);
      return { startDate: toISO(weekStart), endDate: today };
    }
    case 'month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: toISO(monthStart), endDate: today };
    }
    default:
      return {};
  }
}

export class ExpenseRepository extends BaseRepository<ExpenseModel> {
  constructor() {
    super('expenses');
  }

  async findByUserId(userId: string): Promise<ExpenseModel[]> {
    const list = await this.findAll((e) => e.userId === userId);
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  async findFiltered(userId: string, options: ExpenseFilterOptions) {
    let list = await this.findByUserId(userId);

    // Resolve datePreset into startDate/endDate bounds (custom uses explicit dates)
    let effectiveStartDate = options.startDate;
    let effectiveEndDate = options.endDate;
    if (options.datePreset && options.datePreset !== 'all' && options.datePreset !== 'custom') {
      const bounds = getDatePresetBounds(options.datePreset);
      effectiveStartDate = bounds.startDate;
      effectiveEndDate = bounds.endDate;
    }

    // Filter by Category
    if (options.category && options.category !== 'all') {
      const cat = options.category.toLowerCase();
      list = list.filter((e) => e.category.toLowerCase() === cat);
    }

    // Filter by Date bounds
    if (effectiveStartDate) {
      list = list.filter((e) => e.date >= effectiveStartDate!);
    }
    if (effectiveEndDate) {
      list = list.filter((e) => e.date <= effectiveEndDate!);
    }

    // Filter by Search Query
    if (options.search) {
      const q = options.search.trim().toLowerCase();
      list = list.filter((e) => {
        const titleMatch = e.title.toLowerCase().includes(q);
        const catMatch = e.category.toLowerCase().includes(q);
        const noteMatch = !!e.note && e.note.toLowerCase().includes(q);
        const amountMatch = e.amount.toString().includes(q);
        const modeMatch = e.paymentMode.toLowerCase().includes(q);
        const dateMatch = e.date.includes(q);
        return titleMatch || catMatch || noteMatch || amountMatch || modeMatch || dateMatch;
      });
    }

    const totalCount = list.length;
    const totalAmount = list.reduce((sum, item) => sum + item.amount, 0);

    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 50;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      expenses: paginated,
      totalCount,
      totalAmount,
      page,
      limit,
    };
  }
}

export const expenseRepository = new ExpenseRepository();
