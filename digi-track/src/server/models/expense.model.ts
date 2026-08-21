export type PaymentMode = 'Cash' | 'UPI' | 'Card' | 'NetBanking';

export interface ExpenseModel {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:42 AM"
  paymentMode: PaymentMode;
  note?: string;
  createdAt: number;
  updatedAt: number;
}
