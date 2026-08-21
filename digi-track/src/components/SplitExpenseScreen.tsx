import React, { useState, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { SplitParticipant, SettlementDebt, SplitBill } from '../types';

const AVATAR_COLORS = ['#005c55', '#004eaa', '#ba1a1a', '#fd761a', '#0165d8', '#0f766e', '#7c3aed', '#db2777'];

const FRIEND_SUGGESTIONS = ['Rahul', 'Priya', 'Vikram', 'Amit', 'Sneha', 'Rohan', 'Neha', 'Pooja', 'Tanmay'];

// Function to compute minimal cash flow settlements
function computeSettlements(participants: SplitParticipant[]): SettlementDebt[] {
  // 1. Calculate net balances (paid - share)
  const balances: { name: string; amount: number }[] = participants.map((p) => ({
    name: p.name,
    amount: Math.round((p.paidAmount - p.shareAmount) * 100) / 100,
  }));

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

export const SplitExpenseScreen: React.FC = () => {
  const {
    userProfile,
    categories,
    formatCurrency,
    addExpense,
    addSplitBill,
    deleteSplitBill,
    toggleSettlementStatus,
    settleDebt,
    settleAllDebtsInBill,
    splitBills,
    setActiveTab,
  } = useExpense();

  // Screen View Mode: 'create' | 'saved'
  const [viewMode, setViewMode] = useState<'create' | 'saved'>('create');

  // Split Form State
  const [title, setTitle] = useState('');
  const [totalAmountStr, setTotalAmountStr] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Participants State
  const [participants, setParticipants] = useState<SplitParticipant[]>([
    { id: 'you', name: 'You', paidAmount: 0, shareAmount: 0, avatarColor: '#005c55' },
    { id: 'p1', name: 'Rahul', paidAmount: 0, shareAmount: 0, avatarColor: '#004eaa' },
    { id: 'p2', name: 'Priya', paidAmount: 0, shareAmount: 0, avatarColor: '#ba1a1a' },
  ]);

  const [newFriendName, setNewFriendName] = useState('');

  // Payer Mode: 'single' | 'multiple'
  const [payerMode, setPayerMode] = useState<'single' | 'multiple'>('single');
  const [singlePayerId, setSinglePayerId] = useState<string>('you');

  // Split Method: 'equal' | 'exact' | 'percentage' | 'shares'
  const [splitMethod, setSplitMethod] = useState<'equal' | 'exact' | 'percentage' | 'shares'>('equal');

  // Custom inputs for uneven splits
  const [exactShares, setExactShares] = useState<Record<string, string>>({});
  const [percentageShares, setPercentageShares] = useState<Record<string, string>>({});
  const [ratioShares, setRatioShares] = useState<Record<string, number>>({});
  const [customPaidAmounts, setCustomPaidAmounts] = useState<Record<string, string>>({});

  // Feedback states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loggedShareSuccess, setLoggedShareSuccess] = useState(false);

  // Settlement Modal State
  const [settleModalData, setSettleModalData] = useState<{
    splitId?: string;
    settlementIndex: number;
    from: string;
    to: string; // The person who originally paid
    amount: number;
    billTitle: string;
    category?: string;
    isLiveDraft?: boolean;
  } | null>(null);

  const [settlePaymentMode, setSettlePaymentMode] = useState<'UPI' | 'Cash' | 'Card' | 'NetBanking'>('UPI');
  const [autoRecordSettlementExpense, setAutoRecordSettlementExpense] = useState(true);

  // Live draft manual settlement overrides
  const [draftSettledMap, setDraftSettledMap] = useState<Record<number, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalBillAmount = parseFloat(totalAmountStr) || 0;

  // Add Participant
  const handleAddParticipant = (nameToAdd?: string) => {
    const name = (nameToAdd || newFriendName).trim();
    if (!name) return;
    if (participants.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      showToast(`${name} is already added!`);
      return;
    }

    const nextColor = AVATAR_COLORS[participants.length % AVATAR_COLORS.length];
    const newParticipant: SplitParticipant = {
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      paidAmount: 0,
      shareAmount: 0,
      avatarColor: nextColor,
    };

    setParticipants([...participants, newParticipant]);
    setNewFriendName('');
  };

  const handleRemoveParticipant = (id: string) => {
    if (participants.length <= 2) {
      showToast('Need at least 2 participants to split a bill.');
      return;
    }
    if (id === 'you') {
      showToast('You cannot remove yourself from the split.');
      return;
    }
    const updated = participants.filter((p) => p.id !== id);
    setParticipants(updated);
    if (singlePayerId === id) {
      setSinglePayerId('you');
    }
  };

  // Calculate Computed Participants with paid and share amounts
  const computedParticipants = useMemo((): SplitParticipant[] => {
    if (participants.length === 0) return [];
    const count = participants.length;

    return participants.map((p) => {
      // 1. Calculate paid amount
      let paid = 0;
      if (payerMode === 'single') {
        paid = p.id === singlePayerId ? totalBillAmount : 0;
      } else {
        paid = parseFloat(customPaidAmounts[p.id] || '0') || 0;
      }

      // 2. Calculate share amount
      let share = 0;
      if (splitMethod === 'equal') {
        share = count > 0 && totalBillAmount > 0 ? Math.round((totalBillAmount / count) * 100) / 100 : 0;
      } else if (splitMethod === 'exact') {
        share = parseFloat(exactShares[p.id] || '0') || 0;
      } else if (splitMethod === 'percentage') {
        const pct = parseFloat(percentageShares[p.id] || '0') || 0;
        share = Math.round(((totalBillAmount * pct) / 100) * 100) / 100;
      } else if (splitMethod === 'shares') {
        const values = Object.values(ratioShares) as number[];
        const totalRatios = values.reduce((a: number, b: number) => a + (b || 1), 0) || count;
        const currentRatio = ratioShares[p.id] || 1;
        share = Math.round(((totalBillAmount * currentRatio) / totalRatios) * 100) / 100;
      }

      return {
        ...p,
        paidAmount: paid,
        shareAmount: share,
      };
    });
  }, [
    participants,
    totalBillAmount,
    payerMode,
    singlePayerId,
    customPaidAmounts,
    splitMethod,
    exactShares,
    percentageShares,
    ratioShares,
  ]);

  // Validation Checks
  const totalPaidSum = useMemo(() => {
    return computedParticipants.reduce((sum, p) => sum + p.paidAmount, 0);
  }, [computedParticipants]);

  const totalShareSum = useMemo(() => {
    return computedParticipants.reduce((sum, p) => sum + p.shareAmount, 0);
  }, [computedParticipants]);

  const paidDifference = Math.abs(totalBillAmount - totalPaidSum);
  const shareDifference = Math.abs(totalBillAmount - totalShareSum);

  const isSplitValid =
    totalBillAmount > 0 &&
    (payerMode === 'single' || paidDifference < 1) &&
    (splitMethod === 'equal' || shareDifference < 1);

  // Settlements Calculation
  const settlements = useMemo(() => {
    if (!isSplitValid) return [];
    return computeSettlements(computedParticipants);
  }, [computedParticipants, isSplitValid]);

  // User's Own Share and Balance
  const myParticipant = computedParticipants.find((p) => p.id === 'you' || p.name.toLowerCase() === 'you');
  const myNetBalance = myParticipant ? myParticipant.paidAmount - myParticipant.shareAmount : 0;

  // 1-Click: Log My Share to Digi Track Expenses
  const handleLogMyShare = () => {
    if (!myParticipant || myParticipant.shareAmount <= 0) {
      showToast('No share amount to log for You.');
      return;
    }

    const otherNames = participants
      .filter((p) => p.id !== 'you' && p.name.toLowerCase() !== 'you')
      .map((p) => p.name)
      .join(', ');

    addExpense({
      title: title.trim() ? `${title.trim()} (My Share)` : 'Split Bill (My Share)',
      amount: Math.round(myParticipant.shareAmount),
      category: category || 'food',
      date: date || new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      paymentMode: 'UPI',
      note: `Split total ${formatCurrency(totalBillAmount)} with ${otherNames}`,
    });

    setLoggedShareSuccess(true);
    showToast(`Logged ${formatCurrency(myParticipant.shareAmount)} directly to your Digi Track expenses!`);
    setTimeout(() => setLoggedShareSuccess(false), 3000);
  };

  // Save Split to History
  const handleSaveSplit = () => {
    if (!totalBillAmount || totalBillAmount <= 0) {
      showToast('Please enter a total bill amount.');
      return;
    }

    const newBill = addSplitBill({
      title: title.trim() || 'Split Expense',
      totalAmount: totalBillAmount,
      category,
      date,
      splitType: splitMethod,
      participants: computedParticipants,
      settlements,
      notes,
    });

    showToast('Split Bill saved successfully!');
    setViewMode('saved');
  };

  // Copy WhatsApp Summary
  const handleCopyWhatsApp = (bill?: SplitBill) => {
    const currentTitle = bill ? bill.title : title.trim() || 'Expense';
    const currentTotal = bill ? bill.totalAmount : totalBillAmount;
    const currentSettlements = bill ? bill.settlements : settlements;
    const currentParticipants = bill ? bill.participants : computedParticipants;

    let text = `💸 *Digi Track Split Summary: ${currentTitle}*\n`;
    text += `💰 *Total Bill:* ${formatCurrency(currentTotal)}\n`;
    text += `📅 *Date:* ${bill ? bill.date : date}\n\n`;
    text += `👥 *Individual Shares:*\n`;

    currentParticipants.forEach((p) => {
      text += `• ${p.name}: Share ${formatCurrency(p.shareAmount)} (Paid ${formatCurrency(p.paidAmount)})\n`;
    });

    text += `\n⚖️ *Who Owes Whom (Settlements):*\n`;
    if (currentSettlements.length === 0) {
      text += `All settled evenly! No debts pending. ✨\n`;
    } else {
      currentSettlements.forEach((s) => {
        text += `👉 *${s.from}* owes *${s.to}* ${formatCurrency(s.amount)}${s.settled ? ' (✅ Settled)' : ''}\n`;
      });
    }

    text += `\n_Calculated via Digi Track_`;

    navigator.clipboard.writeText(text);
    showToast('WhatsApp split summary copied to clipboard! 📋');
  };

  // Handle Settlement Confirmation from Modal
  const handleConfirmSettlement = () => {
    if (!settleModalData) return;

    if (settleModalData.isLiveDraft) {
      // For live draft calculation preview
      setDraftSettledMap((prev) => ({
        ...prev,
        [settleModalData.settlementIndex]: true,
      }));
      showToast(`Payment of ${formatCurrency(settleModalData.amount)} marked as settled with ${settleModalData.to}!`);
    } else if (settleModalData.splitId) {
      // For saved split bill
      settleDebt(
        settleModalData.splitId,
        settleModalData.settlementIndex,
        settlePaymentMode,
        autoRecordSettlementExpense
      );
      showToast(`Payment of ${formatCurrency(settleModalData.amount)} marked as settled with ${settleModalData.to}!`);
    }

    setSettleModalData(null);
  };

  return (
    <div className="flex flex-col gap-4 pb-28 md:pb-12 max-w-3xl mx-auto w-full px-4 pt-3">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/20 text-[13px] font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-[18px] text-[#a3faef]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & View Switcher */}
      <section className="bg-white rounded-3xl p-5 shadow-elevation-1 border border-[#eff4ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#005c55] to-[#004eaa] text-white flex items-center justify-center shadow-md shadow-[#005c55]/20">
            <span className="material-symbols-outlined text-[28px]">call_split</span>
          </div>
          <div>
            <h2 className="font-display text-[20px] sm:text-[22px] font-extrabold text-[#0b1c30] tracking-tight">
              Expense Splitter
            </h2>
            <p className="text-[12px] text-[#6e7977] font-medium">
              Calculate exact shares &amp; settlement debts without a calculator
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-[#eff4ff] p-1 rounded-2xl border border-[#bdc9c6]/40 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('create')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold transition-all ${
              viewMode === 'create'
                ? 'bg-white text-[#005c55] shadow-xs'
                : 'text-[#6e7977] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New Split</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('saved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold transition-all relative ${
              viewMode === 'saved'
                ? 'bg-white text-[#005c55] shadow-xs'
                : 'text-[#6e7977] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            <span>Saved Splits</span>
            {splitBills.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-[#005c55] text-white rounded-full text-[10px]">
                {splitBills.length}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* CREATE NEW SPLIT VIEW */}
      {viewMode === 'create' && (
        <div className="flex flex-col gap-4">
          {/* Card 1: Bill Basic Info */}
          <section className="bg-white rounded-3xl p-5 shadow-elevation-1 border border-[#eff4ff] flex flex-col gap-4">
            <h3 className="font-display text-[16px] font-bold text-[#0b1c30] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#eff4ff] text-[#005c55] text-[12px] font-bold flex items-center justify-center">
                1
              </span>
              Bill Details &amp; Total Amount
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Total Amount Input */}
              <div className="sm:col-span-2">
                <label className="block text-[12px] font-bold text-[#0b1c30] mb-1 uppercase tracking-wider">
                  Total Bill Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-[22px] font-extrabold text-[#005c55]">
                    {userProfile.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={totalAmountStr}
                    onChange={(e) => setTotalAmountStr(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-[#eff4ff]/60 border border-[#bdc9c6]/60 rounded-2xl font-display text-[22px] font-extrabold text-[#0b1c30] placeholder-[#6e7977] focus:bg-white focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20 outline-none transition-all"
                  />
                </div>

                {/* Quick numeric shortcuts */}
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
                  {[500, 1000, 2000, 3600, 4800, 6000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTotalAmountStr(amt.toString())}
                      className="px-2.5 py-1 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#005c55] text-[12px] font-bold border border-[#bdc9c6]/30 transition-all shrink-0"
                    >
                      +{userProfile.currencySymbol}{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title / Description */}
              <div>
                <label className="block text-[12px] font-bold text-[#0b1c30] mb-1">
                  Description / Event Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7977] text-[18px]">
                    edit_note
                  </span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Goa Trip, Dinner, Groceries"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#eff4ff]/60 border border-[#bdc9c6]/60 rounded-xl text-[14px] text-[#0b1c30] placeholder-[#6e7977] focus:bg-white focus:border-[#005c55] outline-none"
                  />
                </div>
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[12px] font-bold text-[#0b1c30] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full py-2.5 px-2.5 bg-[#eff4ff]/60 border border-[#bdc9c6]/60 rounded-xl text-[13px] text-[#0b1c30] focus:bg-white focus:border-[#005c55] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0b1c30] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full py-2.5 px-2.5 bg-[#eff4ff]/60 border border-[#bdc9c6]/60 rounded-xl text-[13px] text-[#0b1c30] focus:bg-white focus:border-[#005c55] outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Card 2: Participants & Payer */}
          <section className="bg-white rounded-3xl p-5 shadow-elevation-1 border border-[#eff4ff] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-[16px] font-bold text-[#0b1c30] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#eff4ff] text-[#005c55] text-[12px] font-bold flex items-center justify-center">
                  2
                </span>
                Participants ({participants.length})
              </h3>
              <span className="text-[12px] text-[#6e7977]">
                Who was involved in this bill?
              </span>
            </div>

            {/* Current Participants List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {participants.map((p) => {
                const isYou = p.id === 'you' || p.name.toLowerCase() === 'you';
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f8fafc] border border-[#bdc9c6]/40 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-full text-white text-[12px] font-bold flex items-center justify-center shrink-0"
                        style={{ backgroundColor: p.avatarColor || '#005c55' }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                        {p.name} {isYou ? '(You)' : ''}
                      </span>
                    </div>

                    {!isYou && (
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(p.id)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[#6e7977] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                        title={`Remove ${p.name}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Friend Input & Suggestions */}
            <div className="flex flex-col gap-2 pt-1 border-t border-[#eff4ff]">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7977] text-[18px]">
                    person_add
                  </span>
                  <input
                    type="text"
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddParticipant();
                      }
                    }}
                    placeholder="Enter friend's name (e.g. Sneha)"
                    className="w-full pl-9 pr-3 py-2 bg-[#eff4ff]/60 border border-[#bdc9c6]/60 rounded-xl text-[13px] text-[#0b1c30] placeholder-[#6e7977] focus:bg-white focus:border-[#005c55] outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddParticipant()}
                  className="px-4 py-2 bg-[#005c55] hover:bg-[#004d47] text-white rounded-xl text-[13px] font-bold transition-all shrink-0"
                >
                  Add
                </button>
              </div>

              {/* 1-Click Friend Suggestions */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                <span className="text-[#6e7977] font-semibold shrink-0">Quick Add:</span>
                {FRIEND_SUGGESTIONS.filter(
                  (name) => !participants.some((p) => p.name.toLowerCase() === name.toLowerCase())
                ).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleAddParticipant(name)}
                    className="px-2 py-0.5 rounded-lg bg-[#eff4ff] text-[#005c55] hover:bg-[#e5eeff] font-semibold border border-[#bdc9c6]/30 transition-all shrink-0"
                  >
                    +{name}
                  </button>
                ))}
              </div>
            </div>

            {/* Payer Configuration */}
            <div className="pt-2 border-t border-[#eff4ff] flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-[#0b1c30] uppercase tracking-wider">
                  Who Paid for this bill?
                </span>
                <div className="flex bg-[#eff4ff] p-0.5 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPayerMode('single')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      payerMode === 'single' ? 'bg-white text-[#005c55] shadow-xs' : 'text-[#6e7977]'
                    }`}
                  >
                    Single Payer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayerMode('multiple')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      payerMode === 'multiple' ? 'bg-white text-[#005c55] shadow-xs' : 'text-[#6e7977]'
                    }`}
                  >
                    Multiple Payers
                  </button>
                </div>
              </div>

              {payerMode === 'single' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {participants.map((p) => {
                    const isSelected = singlePayerId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSinglePayerId(p.id)}
                        className={`flex items-center justify-between p-2.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#eff4ff] border-[#005c55] ring-2 ring-[#005c55]/20 shadow-xs'
                            : 'bg-[#f8fafc] border-[#bdc9c6]/40 hover:bg-[#eff4ff]/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div
                            className="w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                            style={{ backgroundColor: p.avatarColor || '#005c55' }}
                          >
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                            {p.name}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[#005c55] text-[18px]">
                            check_circle
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-2 bg-[#f8fafc] p-3 rounded-2xl border border-[#bdc9c6]/40">
                  <p className="text-[11px] text-[#6e7977]">
                    Enter the exact amount paid by each person (Total must equal{' '}
                    {formatCurrency(totalBillAmount)}):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {participants.map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-bold text-[#0b1c30] truncate w-24">
                          {p.name}
                        </span>
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#6e7977]">
                            {userProfile.currencySymbol}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="0"
                            value={customPaidAmounts[p.id] || ''}
                            onChange={(e) =>
                              setCustomPaidAmounts({
                                ...customPaidAmounts,
                                [p.id]: e.target.value,
                              })
                            }
                            className="w-full pl-7 pr-2 py-1.5 bg-white border border-[#bdc9c6]/60 rounded-xl text-[13px] text-[#0b1c30] outline-none focus:border-[#005c55]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 text-[12px] border-t border-[#bdc9c6]/30">
                    <span className="font-semibold text-[#6e7977]">
                      Sum of Paid Amounts: {formatCurrency(totalPaidSum)}
                    </span>
                    <span
                      className={`font-bold ${
                        paidDifference < 1 ? 'text-[#005c55]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {paidDifference < 1
                        ? '✓ Exact match'
                        : `Remaining: ${formatCurrency(totalBillAmount - totalPaidSum)}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Card 3: Split Method */}
          <section className="bg-white rounded-3xl p-5 shadow-elevation-1 border border-[#eff4ff] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-[16px] font-bold text-[#0b1c30] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#eff4ff] text-[#005c55] text-[12px] font-bold flex items-center justify-center">
                  3
                </span>
                Split Method
              </h3>
            </div>

            {/* Split Type Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'equal', label: 'Equally (1/N)', icon: 'balance' },
                { id: 'exact', label: 'Exact Amounts', icon: 'payments' },
                { id: 'percentage', label: 'Percentages (%)', icon: 'percent' },
                { id: 'shares', label: 'Shares / Ratios', icon: 'pie_chart' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSplitMethod(m.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                    splitMethod === m.id
                      ? 'bg-[#005c55] text-white border-[#005c55] shadow-xs'
                      : 'bg-[#f8fafc] text-[#3e4947] border-[#bdc9c6]/40 hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] mb-1">{m.icon}</span>
                  <span className="text-[12px] font-bold">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Unequal Inputs if not equal */}
            {splitMethod === 'exact' && (
              <div className="bg-[#f8fafc] p-3 rounded-2xl border border-[#bdc9c6]/40 flex flex-col gap-2">
                <p className="text-[11px] text-[#6e7977]">
                  Specify the exact share for each person:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-bold text-[#0b1c30] truncate w-24">
                        {p.name}
                      </span>
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#6e7977]">
                          {userProfile.currencySymbol}
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          placeholder="0"
                          value={exactShares[p.id] || ''}
                          onChange={(e) =>
                            setExactShares({ ...exactShares, [p.id]: e.target.value })
                          }
                          className="w-full pl-7 pr-2 py-1.5 bg-white border border-[#bdc9c6]/60 rounded-xl text-[13px] text-[#0b1c30] outline-none focus:border-[#005c55]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 text-[12px] border-t border-[#bdc9c6]/30">
                  <span className="font-semibold text-[#6e7977]">
                    Sum of Shares: {formatCurrency(totalShareSum)}
                  </span>
                  <span
                    className={`font-bold ${
                      shareDifference < 1 ? 'text-[#005c55]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {shareDifference < 1
                      ? '✓ Exact match'
                      : `Remaining to allocate: ${formatCurrency(totalBillAmount - totalShareSum)}`}
                  </span>
                </div>
              </div>
            )}

            {splitMethod === 'percentage' && (
              <div className="bg-[#f8fafc] p-3 rounded-2xl border border-[#bdc9c6]/40 flex flex-col gap-2">
                <p className="text-[11px] text-[#6e7977]">
                  Assign percentages (Total must equal 100%):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-bold text-[#0b1c30] truncate w-24">
                        {p.name}
                      </span>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          placeholder="0"
                          value={percentageShares[p.id] || ''}
                          onChange={(e) =>
                            setPercentageShares({ ...percentageShares, [p.id]: e.target.value })
                          }
                          className="w-full pl-3 pr-7 py-1.5 bg-white border border-[#bdc9c6]/60 rounded-xl text-[13px] text-[#0b1c30] outline-none focus:border-[#005c55]"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#6e7977]">
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {splitMethod === 'shares' && (
              <div className="bg-[#f8fafc] p-3 rounded-2xl border border-[#bdc9c6]/40 flex flex-col gap-2">
                <p className="text-[11px] text-[#6e7977]">
                  Assign proportion shares (e.g. 1 share for individuals, 2 for couples):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-bold text-[#0b1c30] truncate w-24">
                        {p.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const cur = ratioShares[p.id] || 1;
                            if (cur > 1) setRatioShares({ ...ratioShares, [p.id]: cur - 1 });
                          }}
                          className="w-7 h-7 bg-white border border-[#bdc9c6] rounded-lg font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-[13px]">
                          {ratioShares[p.id] || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = ratioShares[p.id] || 1;
                            setRatioShares({ ...ratioShares, [p.id]: cur + 1 });
                          }}
                          className="w-7 h-7 bg-white border border-[#bdc9c6] rounded-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Card 4: AUTOMATIC "WHO OWES WHOM" & BREAKDOWN RESULTS */}
          {totalBillAmount > 0 && (
            <section className="bg-white rounded-3xl p-5 shadow-elevation-2 border border-[#005c55]/20 flex flex-col gap-4 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-[#eff4ff] pb-3">
                <div>
                  <h3 className="font-display text-[18px] font-extrabold text-[#0b1c30] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005c55] text-[22px]">
                      auto_awesome
                    </span>
                    Calculated Settlement Breakdown
                  </h3>
                  <p className="text-[12px] text-[#6e7977]">
                    Exact per-person share &amp; minimal debt settlement instructions
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[#6e7977] uppercase block">
                    Per Person Equal
                  </span>
                  <span className="font-display text-[16px] font-extrabold text-[#005c55]">
                    {formatCurrency(Math.round(totalBillAmount / participants.length))}
                  </span>
                </div>
              </div>

              {/* Individual Participants Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {computedParticipants.map((p) => {
                  const net = p.paidAmount - p.shareAmount;
                  const isYou = p.id === 'you' || p.name.toLowerCase() === 'you';
                  return (
                    <div
                      key={p.id}
                      className={`p-3 rounded-2xl border flex flex-col gap-1.5 transition-all ${
                        isYou ? 'bg-[#eff4ff] border-[#005c55]/40 shadow-xs' : 'bg-[#f8fafc] border-[#bdc9c6]/40'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full text-white text-[12px] font-bold flex items-center justify-center shrink-0"
                            style={{ backgroundColor: p.avatarColor || '#005c55' }}
                          >
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[13px] font-bold text-[#0b1c30]">
                            {p.name} {isYou ? '(You)' : ''}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            net > 0.01
                              ? 'bg-[#a3faef] text-[#005c55]'
                              : net < -0.01
                              ? 'bg-[#ffdad6] text-[#ba1a1a]'
                              : 'bg-[#eff4ff] text-[#6e7977]'
                          }`}
                        >
                          {net > 0.01
                            ? `Gets back ${formatCurrency(net)}`
                            : net < -0.01
                            ? `Owes ${formatCurrency(Math.abs(net))}`
                            : 'Settled'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[12px] text-[#6e7977] pt-1 border-t border-[#bdc9c6]/20">
                        <span>Paid: <strong className="text-[#0b1c30]">{formatCurrency(p.paidAmount)}</strong></span>
                        <span>Share: <strong className="text-[#0b1c30]">{formatCurrency(p.shareAmount)}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* WHO OWES WHOM SETTLEMENT INSTRUCTIONS */}
              <div className="p-4 bg-gradient-to-r from-[#eff4ff] via-[#f8fafc] to-[#eef7f6] rounded-2xl border border-[#005c55]/20 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#005c55]">
                      account_balance_wallet
                    </span>
                    <span className="text-[13px] font-bold text-[#0b1c30] uppercase tracking-wider">
                      Settlement Instructions (Who Owes Whom)
                    </span>
                  </div>
                  {settlements.length > 0 && (
                    <span className="text-[11px] font-semibold text-[#6e7977]">
                      Pay to Original Payer
                    </span>
                  )}
                </div>

                {settlements.length === 0 ? (
                  <p className="text-[13px] text-[#005c55] font-semibold italic">
                    🎉 Everyone is already settled up evenly! No transfers needed.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {settlements.map((s, idx) => {
                      const isSettled = draftSettledMap[idx] || s.settled;
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl shadow-xs border text-[13px] gap-2 transition-all ${
                            isSettled
                              ? 'bg-[#f8fafc] border-[#bdc9c6]/40 opacity-80'
                              : 'bg-white border-[#005c55]/30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[12px] ${
                              isSettled ? 'bg-[#e5eeff] text-[#004eaa]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                            }`}>
                              <span className="material-symbols-outlined text-[18px]">
                                {isSettled ? 'check_circle' : 'payments'}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-[#ba1a1a]">{s.from}</span>
                                <span className="text-[#6e7977] text-[12px]">pays</span>
                                <span className="font-bold text-[#005c55]">{s.to}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#eef7f6] text-[#005c55] font-semibold border border-[#005c55]/20">
                                  Original Payer
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6e7977]">
                                {isSettled ? 'Marked as settled' : 'Pending payment settlement'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#eff4ff]">
                            <span className={`font-display font-extrabold text-[15px] ${isSettled ? 'line-through text-[#6e7977]' : 'text-[#0b1c30]'}`}>
                              {formatCurrency(s.amount)}
                            </span>

                            {isSettled ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setDraftSettledMap((prev) => ({
                                    ...prev,
                                    [idx]: false,
                                  }))
                                }
                                className="px-2.5 py-1 rounded-xl bg-[#e5eeff] text-[#004eaa] text-[11px] font-bold hover:bg-[#dce9ff] flex items-center gap-1 transition-all"
                              >
                                <span className="material-symbols-outlined text-[14px]">check</span>
                                Settled • Undo
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setSettleModalData({
                                    settlementIndex: idx,
                                    from: s.from,
                                    to: s.to,
                                    amount: s.amount,
                                    billTitle: title.trim() || 'Split Expense Draft',
                                    category,
                                    isLiveDraft: true,
                                  })
                                }
                                className="px-3 py-1.5 rounded-xl bg-[#005c55] hover:bg-[#004d47] text-white text-[12px] font-bold shadow-xs flex items-center gap-1.5 active:scale-98 transition-all"
                              >
                                <span className="material-symbols-outlined text-[15px]">handshake</span>
                                <span>Settle with {s.to}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                {/* 1-Click Add My Share to Digi Track */}
                {myParticipant && myParticipant.shareAmount > 0 && (
                  <button
                    type="button"
                    onClick={handleLogMyShare}
                    className="flex-1 py-3 px-3 rounded-2xl bg-[#005c55] hover:bg-[#004d47] active:scale-98 text-white font-display text-[14px] font-bold shadow-md shadow-[#005c55]/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {loggedShareSuccess ? 'check_circle' : 'add_task'}
                    </span>
                    <span>
                      {loggedShareSuccess
                        ? 'Added to Digi Track!'
                        : `Log My Share (${formatCurrency(myParticipant.shareAmount)}) to Expenses`}
                    </span>
                  </button>
                )}

                {/* Copy for WhatsApp */}
                <button
                  type="button"
                  onClick={() => handleCopyWhatsApp()}
                  className="py-3 px-4 rounded-2xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#005c55] font-display text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all border border-[#005c55]/30"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  <span>Share on WhatsApp</span>
                </button>

                {/* Save Split Bill */}
                <button
                  type="button"
                  onClick={handleSaveSplit}
                  className="py-3 px-4 rounded-2xl bg-[#0b1c30] hover:bg-black text-white font-display text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">bookmark</span>
                  <span>Save Split Bill</span>
                </button>
              </div>
            </section>
          )}
        </div>
      )}

      {/* SAVED SPLITS HISTORY VIEW */}
      {viewMode === 'saved' && (
        <div className="flex flex-col gap-4">
          {splitBills.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-elevation-1 border border-[#eff4ff] flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#eff4ff] flex items-center justify-center mb-3 text-[#6e7977]">
                <span className="material-symbols-outlined text-[32px]">call_split</span>
              </div>
              <p className="font-display text-[16px] font-bold text-[#0b1c30]">
                No Saved Split Bills Yet
              </p>
              <p className="text-[13px] text-[#6e7977] mt-1 max-w-sm">
                Split your restaurant bills, groceries, or group trips and save them here to track who has paid.
              </p>
              <button
                type="button"
                onClick={() => setViewMode('create')}
                className="mt-4 px-4 py-2.5 bg-[#005c55] text-white text-[13px] font-bold rounded-2xl hover:bg-[#004d47] transition-all shadow-xs"
              >
                Create First Split
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-[12px] font-bold text-[#6e7977] uppercase tracking-wider">
                  {splitBills.length} Saved Split Record{splitBills.length !== 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode('create')}
                  className="text-[12px] font-bold text-[#005c55] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  New Split Bill
                </button>
              </div>

              {splitBills.map((bill) => {
                const totalUnsettled = bill.settlements.filter((s) => !s.settled).length;
                return (
                  <div
                    key={bill.id}
                    className="bg-white rounded-3xl p-4 sm:p-5 shadow-elevation-1 border border-[#eff4ff] flex flex-col gap-3.5"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#eff4ff] text-[#005c55] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                        </div>
                        <div>
                          <h4 className="font-display text-[16px] font-bold text-[#0b1c30]">
                            {bill.title}
                          </h4>
                          <p className="text-[12px] text-[#6e7977]">
                            {bill.date} • {bill.participants.length} Participants ({bill.splitType} split)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-display text-[17px] font-extrabold text-[#005c55]">
                          {formatCurrency(bill.totalAmount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteSplitBill(bill.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#6e7977] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                          title="Delete Split Record"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Participants Mini Avatars */}
                    <div className="flex items-center gap-2 flex-wrap text-[12px]">
                      {bill.participants.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#f8fafc] border border-[#bdc9c6]/40"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: p.avatarColor || '#005c55' }}
                          />
                          <span className="font-bold text-[#0b1c30]">{p.name}:</span>
                          <span className="text-[#6e7977]">{formatCurrency(p.shareAmount)}</span>
                          {p.paidAmount > 0 && (
                            <span className="text-[10px] text-[#005c55] font-semibold">
                              (Paid {formatCurrency(p.paidAmount)})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Settlements with Settle Button */}
                    <div className="bg-[#f8fafc] rounded-2xl p-3.5 border border-[#bdc9c6]/30 flex flex-col gap-2.5">
                      <div className="flex justify-between items-center text-[11px] font-bold text-[#6e7977] uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#005c55]">
                            handshake
                          </span>
                          Debts &amp; Settlements
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={totalUnsettled === 0 ? 'text-[#005c55]' : 'text-[#ba1a1a]'}>
                            {totalUnsettled === 0 ? 'All Settled ✓' : `${totalUnsettled} Pending`}
                          </span>
                          {totalUnsettled > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                settleAllDebtsInBill(bill.id);
                                showToast(`All payments in "${bill.title}" marked as settled!`);
                              }}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[#005c55] text-white font-bold hover:bg-[#004d47] transition-colors"
                            >
                              Settle All
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {bill.settlements.map((s, idx) => (
                          <div
                            key={idx}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl text-[12px] shadow-xs border transition-all gap-2 ${
                              s.settled
                                ? 'bg-white/70 border-[#bdc9c6]/30'
                                : 'bg-white border-[#005c55]/20'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {/* Quick checkbox toggle */}
                              <button
                                type="button"
                                onClick={() => toggleSettlementStatus(bill.id, idx)}
                                className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                  s.settled ? 'bg-[#005c55] text-white' : 'border border-[#bdc9c6] hover:border-[#005c55]'
                                }`}
                                title={s.settled ? 'Mark Unsettled' : 'Quick Mark Settled'}
                              >
                                {s.settled && <span className="material-symbols-outlined text-[14px]">check</span>}
                              </button>

                              <div>
                                <span className={s.settled ? 'line-through text-[#6e7977]' : 'text-[#0b1c30]'}>
                                  <strong className="text-[#ba1a1a]">{s.from}</strong> owes{' '}
                                  <strong className="text-[#005c55]">{s.to}</strong>
                                </span>
                                <span className="text-[10px] text-[#6e7977] block">
                                  {s.settled
                                    ? `Settled with ${s.to}${s.settledPaymentMode ? ` via ${s.settledPaymentMode}` : ''}`
                                    : `To be paid to ${s.to} (Original Payer)`}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-2.5">
                              <span className={`font-bold text-[13px] ${s.settled ? 'line-through text-[#6e7977]' : 'text-[#005c55]'}`}>
                                {formatCurrency(s.amount)}
                              </span>

                              {/* Prominent Settle Button */}
                              {s.settled ? (
                                <button
                                  type="button"
                                  onClick={() => toggleSettlementStatus(bill.id, idx)}
                                  className="px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#004eaa] text-[11px] font-bold hover:bg-[#dce9ff] flex items-center gap-1 transition-all"
                                >
                                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                                  Settled
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSettleModalData({
                                      splitId: bill.id,
                                      settlementIndex: idx,
                                      from: s.from,
                                      to: s.to,
                                      amount: s.amount,
                                      billTitle: bill.title,
                                      category: bill.category,
                                    })
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-[#005c55] hover:bg-[#004d47] text-white text-[11px] font-bold shadow-xs flex items-center gap-1 active:scale-98 transition-all"
                                >
                                  <span className="material-symbols-outlined text-[14px]">handshake</span>
                                  <span>Settle with {s.to}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleCopyWhatsApp(bill)}
                        className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#005c55] rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">share</span>
                        <span>Copy WhatsApp Summary</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SETTLE PAYMENT MODAL */}
      {settleModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-[#eff4ff] flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-2 border-b border-[#eff4ff]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#eff4ff] text-[#005c55] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">handshake</span>
                </div>
                <div>
                  <h3 className="font-display text-[17px] font-bold text-[#0b1c30]">
                    Settle Payment
                  </h3>
                  <p className="text-[12px] text-[#6e7977]">
                    Settle with <strong className="text-[#005c55]">{settleModalData.to}</strong> (Original Payer)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettleModalData(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6e7977] hover:bg-[#eff4ff] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Settlement Card Highlight */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#eff4ff] to-[#eef7f6] border border-[#005c55]/20 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[12px] text-[#6e7977]">
                <span>Bill: <strong>{settleModalData.billTitle}</strong></span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#005c55] text-white font-bold">
                  Settle Debt
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-[#005c55]/10">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#ba1a1a] text-[15px]">{settleModalData.from}</span>
                  <span className="material-symbols-outlined text-[16px] text-[#6e7977]">
                    trending_flat
                  </span>
                  <span className="font-bold text-[#005c55] text-[15px]">{settleModalData.to}</span>
                </div>
                <span className="font-display text-[22px] font-extrabold text-[#005c55]">
                  {formatCurrency(settleModalData.amount)}
                </span>
              </div>

              <p className="text-[11px] text-[#6e7977]">
                {settleModalData.from.toLowerCase() === 'you'
                  ? `You are paying ${settleModalData.to} for their upfront payment.`
                  : `${settleModalData.from} has paid back ${settleModalData.to}.`}
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#0b1c30] uppercase tracking-wider">
                Payment Method Used
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI', icon: 'qr_code_scanner' },
                  { id: 'Cash', label: 'Cash', icon: 'payments' },
                  { id: 'Card', label: 'Card', icon: 'credit_card' },
                  { id: 'NetBanking', label: 'Bank', icon: 'account_balance' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSettlePaymentMode(mode.id as any)}
                    className={`py-2 px-1 rounded-xl text-[12px] font-bold flex flex-col items-center gap-1 border transition-all ${
                      settlePaymentMode === mode.id
                        ? 'bg-[#005c55] text-white border-[#005c55] shadow-xs'
                        : 'bg-white text-[#6e7977] border-[#bdc9c6]/40 hover:border-[#005c55]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{mode.icon}</span>
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Record Expense Option for User */}
            {settleModalData.from.toLowerCase() === 'you' && (
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f8fafc] border border-[#bdc9c6]/30 cursor-pointer text-[12px]">
                <input
                  type="checkbox"
                  checked={autoRecordSettlementExpense}
                  onChange={(e) => setAutoRecordSettlementExpense(e.target.checked)}
                  className="mt-0.5 rounded text-[#005c55] focus:ring-[#005c55]"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-[#0b1c30]">
                    Record {formatCurrency(settleModalData.amount)} as Digi Track Expense
                  </span>
                  <span className="text-[#6e7977] text-[11px]">
                    Automatically logs this settlement into your monthly expenses.
                  </span>
                </div>
              </label>
            )}

            {/* Confirm & Cancel Buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSettleModalData(null)}
                className="flex-1 py-3 rounded-2xl bg-[#eff4ff] text-[#6e7977] font-display text-[14px] font-bold hover:bg-[#e5eeff] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSettlement}
                className="flex-2 py-3 rounded-2xl bg-[#005c55] hover:bg-[#004d47] text-white font-display text-[14px] font-bold shadow-md shadow-[#005c55]/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Mark Settled with {settleModalData.to}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
