import { expenseRepository } from '../repositories/expense.repository';
import { categoryRepository } from '../repositories/category.repository';
import { budgetRepository } from '../repositories/budget.repository';
import { savingsConfigRepository, savingsGoalRepository } from '../repositories/savings.repository';
import { splitRepository } from '../repositories/split.repository';
import { userRepository } from '../repositories/user.repository';

export class ExportService {
  async exportCSV(userId: string): Promise<string> {
    const user = await userRepository.findById(userId);
    const expenses = await expenseRepository.findByUserId(userId);
    const curr = user?.currencyCode || 'INR';
    const headers = ['Title', 'Amount', 'Currency', 'Category', 'Date', 'Time', 'Payment Mode', 'Notes', 'ID'];
    const rows = expenses.map((e) => [`"${e.title.replace(/"/g, '""')}"`, e.amount, `"${curr}"`, `"${e.category}"`, `"${e.date}"`, `"${e.time}"`, `"${e.paymentMode}"`, `"${(e.note || '').replace(/"/g, '""')}"`, `"${e.id}"`]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  async exportJSON(userId: string): Promise<any> {
    const [user, expenses, categories, budget, savingsConfig, savingsGoals, splits] = await Promise.all([
      userRepository.findById(userId), expenseRepository.findByUserId(userId),
      categoryRepository.findAvailableForUser(userId), budgetRepository.findByUserId(userId),
      savingsConfigRepository.findByUserId(userId), savingsGoalRepository.findByUserId(userId),
      splitRepository.findByUserId(userId),
    ]);
    return { appName: 'Digi Track', exportedAt: new Date().toISOString(), user: { name: user?.name, email: user?.email, currency: user?.currencyCode || 'INR', currencySymbol: user?.currencySymbol || '₹' }, summary: { totalTransactions: expenses.length, totalSpent: expenses.reduce((s, e) => s + e.amount, 0), monthlyBudget: budget?.totalMonthlyBudget || 0 }, expenses, categories, budget, savingsConfig, savingsGoals, splits };
  }

  async exportStatementText(userId: string): Promise<string> {
    const [user, expenses, categories, budget] = await Promise.all([userRepository.findById(userId), expenseRepository.findByUserId(userId), categoryRepository.findAvailableForUser(userId), budgetRepository.findByUserId(userId)]);
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const sym = user?.currencySymbol || '₹';
    const now = new Date();
    let t = `========================================\n       DIGI TRACK EXPENSE STATEMENT     \n========================================\n`;
    t += `Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}\nUser: ${user?.name || 'User'} (${user?.email || 'N/A'})\nTotal Expenses: ${expenses.length}\nTotal Spent: ${sym}${total.toLocaleString()}\nMonthly Budget: ${sym}${(budget?.totalMonthlyBudget || 0).toLocaleString()}\n----------------------------------------\n\nTRANSACTION BREAKDOWN:\n`;
    expenses.forEach((e, i) => {
      const cat = categories.find((c) => c.id === e.category)?.name || e.category;
      t += `${i + 1}. [${e.date} ${e.time}] ${e.title} - ${sym}${e.amount.toLocaleString()} (${cat}, ${e.paymentMode})\n`;
      if (e.note) t += `   Note: ${e.note}\n`;
    });
    t += `\n========================================\nEnd of Statement - Digi Track\n`;
    return t;
  }
}

export const exportService = new ExportService();
