import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Expense } from '../types';

interface DownloadExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredExpenses?: Expense[];
}

export const DownloadExpensesModal: React.FC<DownloadExpensesModalProps> = ({
  isOpen,
  onClose,
  filteredExpenses,
}) => {
  const { expenses, exportToCSV, exportToJSON, exportStatementText, formatCurrency, userProfile } = useExpense();
  const [downloadScope, setDownloadScope] = useState<'filtered' | 'all'>(filteredExpenses && filteredExpenses.length < expenses.length ? 'filtered' : 'all');
  const [format, setFormat] = useState<'csv' | 'json' | 'statement'>('csv');
  const [isCopied, setIsCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const targetExpenses = downloadScope === 'filtered' && filteredExpenses ? filteredExpenses : expenses;
  const totalAmount = targetExpenses.reduce((sum, item) => sum + item.amount, 0);

  const handleDownload = () => {
    if (format === 'csv') {
      exportToCSV(targetExpenses);
    } else if (format === 'json') {
      exportToJSON(targetExpenses);
    } else if (format === 'statement') {
      const text = exportStatementText(targetExpenses);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `digi_track_statement_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 1200);
  };

  const handleCopyStatement = () => {
    const text = exportStatementText(targetExpenses);
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-elevation-3 border border-[#bdc9c6]/40 flex flex-col gap-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#eff4ff] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#005c55]/10 text-[#005c55] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">download</span>
            </div>
            <div>
              <h3 className="font-display text-[18px] font-bold text-[#0b1c30]">
                Download Expenses
              </h3>
              <p className="text-[12px] text-[#6e7977]">
                Export transaction records & financial reports
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6e7977] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Data Scope Selector (if filtered list exists) */}
        {filteredExpenses && filteredExpenses.length < expenses.length && (
          <div>
            <label className="text-[12px] font-bold text-[#0b1c30] block mb-1.5 uppercase tracking-wider">
              Select Expense Scope
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDownloadScope('filtered')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  downloadScope === 'filtered'
                    ? 'bg-[#eff4ff] border-[#005c55] ring-2 ring-[#005c55]/20 shadow-xs'
                    : 'bg-[#f8fafc] border-[#bdc9c6]/40 hover:bg-[#eff4ff]/60'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] font-bold text-[#0b1c30]">Current Filtered</span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#005c55] text-white">
                    {filteredExpenses.length}
                  </span>
                </div>
                <span className="text-[11px] text-[#6e7977]">
                  {formatCurrency(filteredExpenses.reduce((s, e) => s + e.amount, 0))}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDownloadScope('all')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  downloadScope === 'all'
                    ? 'bg-[#eff4ff] border-[#005c55] ring-2 ring-[#005c55]/20 shadow-xs'
                    : 'bg-[#f8fafc] border-[#bdc9c6]/40 hover:bg-[#eff4ff]/60'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] font-bold text-[#0b1c30]">All Expenses</span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#6e7977] text-white">
                    {expenses.length}
                  </span>
                </div>
                <span className="text-[11px] text-[#6e7977]">
                  {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Export Format Selector */}
        <div>
          <label className="text-[12px] font-bold text-[#0b1c30] block mb-1.5 uppercase tracking-wider">
            Choose Export Format
          </label>
          <div className="flex flex-col gap-2">
            {[
              {
                id: 'csv',
                title: 'CSV Spreadsheet (.csv)',
                desc: 'Standard comma-separated table for Excel, Google Sheets, & Numbers',
                icon: 'table_view',
                color: 'text-[#005c55]',
              },
              {
                id: 'statement',
                title: 'Text Statement & Report (.txt)',
                desc: 'Print-ready expense summary with itemized dates and category subtotals',
                icon: 'receipt_long',
                color: 'text-[#004eaa]',
              },
              {
                id: 'json',
                title: 'JSON Data Backup (.json)',
                desc: 'Complete structured backup including budget caps and category settings',
                icon: 'code',
                color: 'text-[#fd761a]',
              },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setFormat(fmt.id as any)}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  format === fmt.id
                    ? 'bg-[#eff4ff] border-[#005c55] ring-2 ring-[#005c55]/20 shadow-xs'
                    : 'bg-[#f8fafc] border-[#bdc9c6]/40 hover:bg-[#eff4ff]/60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xs ${fmt.color}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{fmt.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#0b1c30] truncate">{fmt.title}</p>
                  <p className="text-[11px] text-[#6e7977] leading-tight mt-0.5">{fmt.desc}</p>
                </div>
                {format === fmt.id && (
                  <span className="material-symbols-outlined text-[#005c55] text-[20px]">
                    check_circle
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary info box */}
        <div className="p-3 bg-[#eff4ff]/60 rounded-2xl border border-[#005c55]/20 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#6e7977] uppercase tracking-wider">
              Ready to Download
            </p>
            <p className="text-[14px] font-extrabold text-[#0b1c30]">
              {targetExpenses.length} Records • {formatCurrency(totalAmount)}
            </p>
          </div>
          <span className="text-[12px] font-bold px-2 py-1 bg-white text-[#005c55] rounded-xl shadow-xs">
            {userProfile.currencyCode}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-1">
          {format === 'statement' && (
            <button
              type="button"
              onClick={handleCopyStatement}
              className="flex-1 py-3 px-3 rounded-2xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#005c55] font-display text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isCopied ? 'check' : 'content_copy'}
              </span>
              <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={targetExpenses.length === 0}
            className="flex-2 py-3 px-4 rounded-2xl bg-[#005c55] hover:bg-[#004d47] active:scale-[0.99] text-white font-display text-[15px] font-bold shadow-md shadow-[#005c55]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {downloadSuccess ? (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">file_download</span>
                <span>Download {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
