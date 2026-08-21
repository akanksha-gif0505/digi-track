import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useExpense } from '../context/ExpenseContext';
import { PaymentMode } from '../types';

export const AddExpenseScreen: React.FC = () => {
  const { categories, addExpense, setActiveTab, userProfile } = useExpense();

  const [amountStr, setAmountStr] = useState<string>('0');
  const [selectedCategory, setSelectedCategory] = useState<string>('food');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [title, setTitle] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Keypad handling
  const appendDigit = (digit: string) => {
    if (amountStr === '0' && digit !== '.') {
      setAmountStr(digit);
    } else {
      if (digit === '.' && amountStr.includes('.')) return;
      if (amountStr.includes('.')) {
        const parts = amountStr.split('.');
        if (parts[1] && parts[1].length >= 2) return;
      }
      if (amountStr.length > 9) return;
      setAmountStr((prev) => prev + digit);
    }
  };

  const backspace = () => {
    if (amountStr.length > 1) {
      setAmountStr((prev) => prev.slice(0, -1));
    } else {
      setAmountStr('0');
    }
  };

  const clearAmount = () => {
    setAmountStr('0');
  };

  const handleSave = () => {
    const numericAmount = parseFloat(amountStr);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    const catObj = categories.find((c) => c.id === selectedCategory);
    const finalTitle = title.trim() || `${catObj?.name || 'General'} Expense`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    addExpense({
      title: finalTitle,
      amount: numericAmount,
      category: selectedCategory,
      date: selectedDate,
      time: timeStr,
      paymentMode: paymentMode,
      note: note.trim() || undefined,
    });

    // Confetti effect
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#005c55', '#0f766e', '#fd761a', '#0165d8'],
      });
    } catch {
      // ignore
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveTab('dashboard');
    }, 700);
  };

  const dateLabel = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    if (selectedDate === todayStr) return 'Today';
    if (selectedDate === yesterdayStr) return 'Yesterday';
    return selectedDate;
  };

  return (
    <div className="flex flex-col flex-grow pb-24 md:pb-8 max-w-lg mx-auto w-full px-4 pt-2">
      {/* 1. Amount Display Section */}
      <section className="flex flex-col items-center justify-center py-6 bg-white rounded-2xl shadow-elevation-1 border border-[#eff4ff] mb-3 relative">
        <div className="text-[#6e7977] font-sans text-[12px] font-semibold uppercase mb-1 tracking-wider">
          Amount
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-[32px] sm:text-[38px] font-bold text-[#005c55]">
            {userProfile.currencySymbol}
          </span>
          <span className="font-display text-[36px] sm:text-[44px] font-extrabold text-[#0b1c30] tracking-tight">
            {amountStr}
          </span>
        </div>

        {/* Date & Note quick input */}
        <div className="flex gap-2 mt-4 px-4 w-full">
          {/* Date button */}
          <button
            type="button"
            onClick={() => setShowDatePicker(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#bdc9c6]/60 bg-[#f8f9ff] text-[#3e4947] hover:bg-[#eff4ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#005c55]">
              calendar_today
            </span>
            <span className="font-sans text-[13px] font-medium">{dateLabel()}</span>
          </button>

          {/* Note button */}
          <button
            type="button"
            onClick={() => setShowNoteModal(true)}
            className="flex-[2] flex items-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#bdc9c6]/60 bg-[#f8f9ff] text-[#3e4947] hover:bg-[#eff4ff] transition-colors overflow-hidden"
          >
            <span className="material-symbols-outlined text-[18px] text-[#005c55]">
              edit_note
            </span>
            <span className="font-sans text-[13px] font-medium truncate">
              {note || title ? `${title ? title + ': ' : ''}${note || ''}` : 'Add a note...'}
            </span>
          </button>
        </div>
      </section>

      {/* 2. Category Selection */}
      <section className="mb-3">
        <div className="text-[#6e7977] font-sans text-[12px] font-semibold uppercase mb-2 tracking-wider px-1">
          Category
        </div>
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center justify-center w-[72px] h-[72px] rounded-2xl border transition-all duration-150 active:scale-95 group ${
                  isSelected
                    ? 'bg-[#0f766e] text-white border-[#0f766e] shadow-sm'
                    : 'bg-white border-[#bdc9c6]/50 text-[#3e4947] hover:bg-[#eff4ff]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] mb-1 transition-colors ${
                    isSelected ? 'fill-1 text-white' : 'text-[#3e4947] group-hover:text-[#005c55]'
                  }`}
                >
                  {cat.icon}
                </span>
                <span
                  className={`font-sans text-[11px] leading-tight font-medium ${
                    isSelected ? 'text-white font-semibold' : 'text-[#3e4947]'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Payment mode selector */}
      <section className="mb-3 bg-white p-3 rounded-2xl border border-[#eff4ff]">
        <div className="text-[#6e7977] font-sans text-[11px] font-semibold uppercase mb-2 tracking-wider">
          Payment Mode
        </div>
        <div className="grid grid-cols-4 gap-2">
          {(['UPI', 'Cash', 'Card', 'NetBanking'] as PaymentMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPaymentMode(mode)}
              className={`py-1.5 px-2 rounded-xl text-[12px] font-semibold transition-all ${
                paymentMode === mode
                  ? 'bg-[#0f766e] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#3e4947] hover:bg-[#e5eeff]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Numeric Keypad Section */}
      <section className="mt-auto px-2 pb-2 pt-3 bg-white rounded-2xl shadow-elevation-1 border border-[#eff4ff]">
        <div className="grid grid-cols-3 gap-2 mb-3 max-w-sm mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => appendDigit(digit)}
              className="h-[50px] rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] active:scale-95 active:bg-[#dce9ff] font-display text-[20px] font-bold text-[#0b1c30] flex items-center justify-center transition-all shadow-xs"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={backspace}
            onDoubleClick={clearAmount}
            className="h-[50px] rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] active:scale-95 active:bg-[#dce9ff] text-[#0b1c30] flex items-center justify-center transition-all shadow-xs"
            title="Backspace (Double click to clear)"
          >
            <span className="material-symbols-outlined text-[24px]">backspace</span>
          </button>
        </div>

        {/* Save Expense Action Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={savedSuccess}
          className={`w-full h-[54px] rounded-xl font-display text-[17px] font-bold flex items-center justify-center shadow-md active:scale-98 transition-all duration-200 ${
            savedSuccess
              ? 'bg-[#005c55] text-[#a3faef]'
              : 'bg-[#005c55] hover:bg-[#0f766e] text-white'
          }`}
        >
          {savedSuccess ? (
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              Expense Saved!
            </span>
          ) : (
            'Save Expense'
          )}
        </button>
      </section>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-xl border border-[#bdc9c6]/40 flex flex-col gap-4">
            <h3 className="font-display text-[16px] font-bold text-[#0b1c30]">
              Select Transaction Date
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-[#bdc9c6] rounded-xl font-sans text-[15px]"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(new Date().toISOString().split('T')[0]);
                  setShowDatePicker(false);
                }}
                className="flex-1 py-2 bg-[#eff4ff] text-[#005c55] text-[13px] font-semibold rounded-xl"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="flex-1 py-2 bg-[#005c55] text-white text-[13px] font-semibold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note & Custom Title Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl border border-[#bdc9c6]/40 flex flex-col gap-3">
            <h3 className="font-display text-[16px] font-bold text-[#0b1c30]">
              Add Details & Note
            </h3>
            <div>
              <label className="text-[12px] font-semibold text-[#6e7977] uppercase block mb-1">
                Merchant / Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Reliance Fresh, Uber Ride"
                className="w-full px-3 py-2.5 border border-[#bdc9c6] rounded-xl text-[14px] focus:outline-none focus:border-[#005c55]"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#6e7977] uppercase block mb-1">
                Notes & Remarks
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add tags, auto-pay info, or specifics..."
                className="w-full px-3 py-2 border border-[#bdc9c6] rounded-xl text-[13px] focus:outline-none focus:border-[#005c55]"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowNoteModal(false)}
              className="w-full py-2.5 bg-[#005c55] text-white font-semibold text-[14px] rounded-xl mt-1"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
