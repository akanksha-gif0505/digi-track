import { SplitParticipant, SettlementDebt } from '../models/split.model';

/**
 * Computes minimal cash-flow settlements between participants
 */
export function computeMinimalSettlements(participants: SplitParticipant[]): SettlementDebt[] {
  // 1. Calculate net balances: paidAmount - shareAmount
  const balances: { name: string; amount: number }[] = participants.map((p) => ({
    name: p.name,
    amount: Math.round((p.paidAmount - p.shareAmount) * 100) / 100,
  }));

  // Debtors owe money (amount < 0), Creditors get paid (amount > 0)
  const debtors = balances.filter((b) => b.amount < -0.01).map((d) => ({ ...d, amount: -d.amount }));
  const creditors = balances.filter((b) => b.amount > 0.01).map((c) => ({ ...c }));

  const settlements: SettlementDebt[] = [];

  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    const settleAmt = Math.min(debtor.amount, creditor.amount);

    if (settleAmt > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(settleAmt),
        settled: false,
      });
    }

    debtor.amount -= settleAmt;
    creditor.amount -= settleAmt;

    if (debtor.amount <= 0.01) dIdx++;
    if (creditor.amount <= 0.01) cIdx++;
  }

  return settlements;
}
