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
    const currencyCode = user?.currencyCode || 'INR';

    const headers = ['Title', 'Amount', 'Currency', 'Category', 'Date', 'Time', 'Payment Mode', 'Notes', 'ID'];
    const rows = expenses.map((e) => [
      `"${e.title.replace(/"/g, '""')}"`,
      e.amount,
      `"${currencyCode}"`,
      `"${e.category}"`,
      `"${e.date}"`,
      `"${e.time}"`,
      `"${e.paymentMode}"`,
      `"${(e.note || '').replace(/"/g, '""')}"`,
      `"${e.id}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  async exportJSON(userId: string): Promise<any> {
    const user = await userRepository.findById(userId);
    const expenses = await expenseRepository.findByUserId(userId);
    const categories = await categoryRepository.findAvailableForUser(userId);
    const budget = await budgetRepository.findByUserId(userId);
    const savingsConfig = await savingsConfigRepository.findByUserId(userId);
    const savingsGoals = await savingsGoalRepository.findByUserId(userId);
    const splits = await splitRepository.findByUserId(userId);

    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

    return {
      appName: 'Digi Track - Daily Expense & Budget',
      exportedAt: new Date().toISOString(),
      user: {
        name: user?.name,
        email: user?.email,
        currency: user?.currencyCode || 'INR',
        currencySymbol: user?.currencySymbol || '₹',
      },
      summary: {
        totalTransactions: expenses.length,
        totalSpent,
        monthlyBudget: budget?.totalMonthlyBudget || 0,
      },
      expenses,
      categories,
      budget,
      savingsConfig,
      savingsGoals,
      splits,
    };
  }

  async exportStatementText(userId: string): Promise<string> {
    const user = await userRepository.findById(userId);
    const expenses = await expenseRepository.findByUserId(userId);
    const categories = await categoryRepository.findAvailableForUser(userId);
    const budget = await budgetRepository.findByUserId(userId);

    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const now = new Date();
    const symbol = user?.currencySymbol || '₹';

    let text = `========================================\n`;
    text += `       DIGI TRACK EXPENSE STATEMENT     \n`;
    text += `========================================\n`;
    text += `Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}\n`;
    text += `User: ${user?.name || 'User'} (${user?.email || 'N/A'})\n`;
    text += `Total Expenses: ${expenses.length}\n`;
    text += `Total Amount Spent: ${symbol}${total.toLocaleString()}\n`;
    text += `Monthly Budget Cap: ${symbol}${(budget?.totalMonthlyBudget || 0).toLocaleString()}\n`;
    text += `----------------------------------------\n\n`;

    text += `TRANSACTION BREAKDOWN:\n`;
    expenses.forEach((e, idx) => {
      const catObj = categories.find((c) => c.id.toLowerCase() === e.category.toLowerCase());
      const catName = catObj ? catObj.name : e.category;
      text += `${idx + 1}. [${e.date} ${e.time}] ${e.title} - ${symbol}${e.amount.toLocaleString()} (${catName}, ${e.paymentMode})\n`;
      if (e.note) text += `   Note: ${e.note}\n`;
    });

    text += `\n========================================\n`;
    text += `End of Statement - Digi Track\n`;
    return text;
  }
}

export const exportService = new ExportService();
