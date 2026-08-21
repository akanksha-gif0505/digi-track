import { SplitParticipant, SettlementDebt } from '../models/split.model';

export function computeMinimalSettlements(participants: SplitParticipant[]): SettlementDebt[] {
  const balances = participants.map((p) => ({
    name: p.name,
    amount: Math.round((p.paidAmount - p.shareAmount) * 100) / 100,
  }));

  const debtors = balances.filter((b) => b.amount < -0.01).map((d) => ({ ...d, amount: -d.amount }));
  const creditors = balances.filter((b) => b.amount > 0.01);
  const settlements: SettlementDebt[] = [];

  let d = 0, c = 0;
  while (d < debtors.length && c < creditors.length) {
    const amt = Math.min(debtors[d].amount, creditors[c].amount);
    if (amt > 0.01) {
      settlements.push({ from: debtors[d].name, to: creditors[c].name, amount: Math.round(amt), settled: false });
    }
    debtors[d].amount -= amt;
    creditors[c].amount -= amt;
    if (debtors[d].amount <= 0.01) d++;
    if (creditors[c].amount <= 0.01) c++;
  }

  return settlements;
}
