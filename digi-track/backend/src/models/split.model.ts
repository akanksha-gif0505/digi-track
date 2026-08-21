export interface SplitParticipant {
  id: string;
  name: string;
  avatarColor?: string;
  paidAmount: number;
  shareAmount: number;
  percentage?: number;
  exactAmount?: number;
  shares?: number;
  isCustom?: boolean;
}

export interface SettlementDebt {
  from: string; // Debtor who owes money
  to: string;   // Creditor who gets paid
  amount: number;
  settled?: boolean;
  settledAt?: number;
  settledPaymentMode?: string;
}

export interface SplitBillModel {
  id: string;
  userId: string;
  title: string;
  totalAmount: number;
  category: string;
  date: string;
  splitType: 'equal' | 'exact' | 'percentage' | 'shares';
  participants: SplitParticipant[];
  settlements: SettlementDebt[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
}
