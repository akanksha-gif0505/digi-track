import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useExpense } from '../context/ExpenseContext';

type GraphMode = 'donut' | 'bars' | 'cards';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const CategorySpendingGraph: React.FC = () => {
  const { categoryBreakdown, totalSpentThisMonth, formatCurrency, userProfile, expenses } = useExpense();
  const [graphMode, setGraphMode] = useState<GraphMode>('donut');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter categories that have spending (or all if none spent yet)
  const chartData = useMemo(() => {
    const activeItems = categoryBreakdown.filter((item) => item.total > 0);
    if (activeItems.length === 0) {
      return categoryBreakdown.slice(0, 5).map((item) => ({
        name: item.category.name,
        id: item.category.id,
        value: 1,
        total: 0,
        percentage: 0,
        cap: item.cap,
        status: item.status,
        color: item.category.colorHex || '#0f766e',
        icon: item.category.icon,
        isEmptyPlaceholder: true,
      }));
    }

    return activeItems.map((item) => ({
      name: item.category.name,
      id: item.category.id,
      value: item.total,
      total: item.total,
      percentage: item.percentage,
      cap: item.cap,
      status: item.status,
      color: item.category.colorHex || '#0f766e',
      icon: item.category.icon,
      isEmptyPlaceholder: false,
    }));
  }, [categoryBreakdown]);

  const activeCategoryInfo = useMemo(() => {
    if (!selectedCategory) return null;
    return categoryBreakdown.find((c) => c.category.id === selectedCategory);
  }, [selectedCategory, categoryBreakdown]);

  const activeCategoryExpenses = useMemo(() => {
    if (!selectedCategory) return [];
    return expenses.filter((e) => e.category === selectedCategory).slice(0, 4);
  }, [selectedCategory, expenses]);

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.isEmptyPlaceholder) {
        return (
          <div className="bg-[#0b1c30] text-white p-2.5 rounded-xl text-[12px] shadow-lg border border-white/10">
            <span className="font-semibold">{data.name}</span>: No spending recorded
          </div>
        );
      }
      return (
        <div className="bg-[#0b1c30] text-white p-3 rounded-xl text-[12px] shadow-lg border border-white/10 flex flex-col gap-1 min-w-[140px]">
          <div className="flex items-center gap-1.5 font-bold text-white border-b border-white/10 pb-1">
            <span className="material-symbols-outlined text-[16px] text-[#a3faef]">
              {data.icon}
            </span>
            <span>{data.name}</span>
          </div>
          <div className="flex justify-between items-center text-[13px] font-bold text-[#a3faef] pt-0.5">
            <span>{formatCurrency(data.total)}</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/20 text-white">
              {data.percentage}%
            </span>
          </div>
          <div className="text-[10px] text-[#bdc9c6] flex justify-between">
            <span>Cap: {formatCurrency(data.cap)}</span>
            <span
              className={`font-semibold capitalize ${
                data.status === 'over'
                  ? 'text-[#ffb4ab]'
                  : data.status === 'warning'
                  ? 'text-[#ffdbca]'
                  : 'text-[#a3faef]'
              }`}
            >
              {data.status}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Bar Chart
  const CustomBarTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0b1c30] text-white p-3 rounded-xl text-[12px] shadow-lg border border-white/10 flex flex-col gap-1">
          <div className="font-bold border-b border-white/10 pb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#a3faef]">{data.icon}</span>
            <span>{data.name}</span>
          </div>
          <div className="text-[#a3faef] font-bold text-[13px] pt-1">
            Spent: {formatCurrency(data.total)} ({data.percentage}%)
          </div>
          <div className="text-[#bdc9c6] text-[11px]">
            Budget Cap: {formatCurrency(data.cap)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-white shadow-elevation-1 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 border border-[#eff4ff]">
      {/* Header & Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-[18px] sm:text-[20px] font-bold text-[#0b1c30]">
              Spending by Category
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#005c55] font-bold">
              {categoryBreakdown.filter((c) => c.total > 0).length} Active
            </span>
          </div>
          <p className="text-[12px] text-[#6e7977] mt-0.5">
            Visual breakdown of where your money goes this month
          </p>
        </div>

        {/* Graph Mode Buttons */}
        <div className="flex items-center bg-[#eff4ff] p-1 rounded-xl self-start sm:self-auto border border-[#bdc9c6]/30">
          <button
            type="button"
            onClick={() => setGraphMode('donut')}
            title="Donut Pie Chart"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-bold transition-all ${
              graphMode === 'donut'
                ? 'bg-white text-[#005c55] shadow-xs'
                : 'text-[#6e7977] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">pie_chart</span>
            <span>Donut</span>
          </button>

          <button
            type="button"
            onClick={() => setGraphMode('bars')}
            title="Comparison Bar Graph"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-bold transition-all ${
              graphMode === 'bars'
                ? 'bg-white text-[#005c55] shadow-xs'
                : 'text-[#6e7977] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bar_chart</span>
            <span>Bars</span>
          </button>

          <button
            type="button"
            onClick={() => setGraphMode('cards')}
            title="Category Progress Cards"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-bold transition-all ${
              graphMode === 'cards'
                ? 'bg-white text-[#005c55] shadow-xs'
                : 'text-[#6e7977] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            <span>List</span>
          </button>
        </div>
      </div>

      {/* 1. DONUT GRAPH VIEW */}
      {graphMode === 'donut' && (
        <div className="flex flex-col md:flex-row items-center gap-4 pt-1">
          {/* Donut Chart Container */}
          <div className="relative w-full md:w-1/2 h-60 sm:h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  stroke="none"
                  onClick={(entry: any) => {
                    const targetId = entry?.id || entry?.payload?.id;
                    if (targetId) {
                      setSelectedCategory(selectedCategory === targetId ? null : targetId);
                    }
                  }}
                  cursor="pointer"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isEmptyPlaceholder ? '#e2e8f0' : entry.color}
                      className="transition-all duration-200 hover:opacity-80"
                      stroke={selectedCategory === entry.id ? '#0b1c30' : 'none'}
                      strokeWidth={selectedCategory === entry.id ? 2 : 0}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Total Amount */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] font-bold text-[#6e7977] uppercase tracking-wider">
                Total Spent
              </span>
              <span className="font-display text-[19px] sm:text-[22px] font-extrabold text-[#0b1c30]">
                {formatCurrency(totalSpentThisMonth)}
              </span>
              <span className="text-[10px] text-[#005c55] font-semibold">
                {chartData.filter((c) => !c.isEmptyPlaceholder).length} Categories
              </span>
            </div>
          </div>

          {/* Category Interactive Legend Chips */}
          <div className="w-full md:w-1/2 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              {categoryBreakdown
                .filter((item) => item.total > 0)
                .map((item) => {
                  const isSelected = selectedCategory === item.category.id;
                  return (
                    <button
                      key={item.category.id}
                      type="button"
                      onClick={() =>
                        setSelectedCategory(isSelected ? null : item.category.id)
                      }
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#eff4ff] border-[#005c55] ring-2 ring-[#005c55]/20 shadow-xs'
                          : 'bg-[#f8fafc] border-[#eff4ff] hover:bg-[#eff4ff]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.category.colorHex || '#0f766e' }}
                        />
                        <div className="truncate">
                          <p className="text-[12px] font-bold text-[#0b1c30] truncate">
                            {item.category.name}
                          </p>
                          <p className="text-[10px] text-[#6e7977]">
                            {item.percentage}% of total
                          </p>
                        </div>
                      </div>
                      <span className="text-[12px] font-extrabold text-[#005c55] shrink-0">
                        {formatCurrency(item.total)}
                      </span>
                    </button>
                  );
                })}
            </div>

            {categoryBreakdown.filter((item) => item.total > 0).length === 0 && (
              <div className="py-6 text-center text-[#6e7977] text-[13px] bg-[#f8fafc] rounded-xl">
                No expense transactions logged yet this month.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. COMPARISON BARS VIEW */}
      {graphMode === 'bars' && (
        <div className="w-full h-64 sm:h-72 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.filter((c) => !c.isEmptyPlaceholder)}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#6e7977' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6e7977' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${userProfile.currencySymbol}${val}`}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={
                      entry.status === 'over'
                        ? '#ba1a1a'
                        : entry.status === 'warning'
                        ? '#fd761a'
                        : entry.color
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 3. PROGRESS LIST VIEW */}
      {graphMode === 'cards' && (
        <div className="flex flex-col gap-2.5">
          {categoryBreakdown.map((item) => {
            const isSelected = selectedCategory === item.category.id;
            return (
              <div
                key={item.category.id}
                onClick={() => setSelectedCategory(isSelected ? null : item.category.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#eff4ff] border-[#005c55] shadow-xs'
                    : 'bg-[#f8fafc] border-[#eff4ff] hover:bg-[#eff4ff]/40'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.category.bgClass}`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${item.category.iconColorClass}`}
                      >
                        {item.category.icon}
                      </span>
                    </div>
                    <span className="text-[13px] font-bold text-[#0b1c30]">
                      {item.category.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <span className="text-[13px] font-bold text-[#005c55]">
                      {formatCurrency(item.total)}
                    </span>
                    <span className="text-[11px] text-[#6e7977]">
                      / {formatCurrency(item.cap)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, item.cap > 0 ? (item.total / item.cap) * 100 : item.percentage)}%`,
                      backgroundColor:
                        item.status === 'over'
                          ? '#ba1a1a'
                          : item.status === 'warning'
                          ? '#fd761a'
                          : item.category.colorHex || '#0f766e',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Category Drilldown Card (if category is tapped) */}
      {activeCategoryInfo && (
        <div className="mt-2 p-3.5 bg-gradient-to-r from-[#eff4ff] to-[#e5eeff] rounded-xl border border-[#005c55]/20 flex flex-col gap-2 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#005c55]">
                {activeCategoryInfo.category.icon}
              </span>
              <div>
                <span className="font-display text-[14px] font-bold text-[#0b1c30]">
                  {activeCategoryInfo.category.name} Transactions
                </span>
                <span className="text-[11px] text-[#6e7977] ml-2">
                  Total: {formatCurrency(activeCategoryInfo.total)} ({activeCategoryInfo.percentage}%)
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-[#6e7977] hover:text-[#0b1c30] text-[12px] font-semibold"
            >
              Close
            </button>
          </div>

          {activeCategoryExpenses.length > 0 ? (
            <div className="divide-y divide-[#bdc9c6]/30 bg-white/80 rounded-lg p-2">
              {activeCategoryExpenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center py-1.5 text-[12px]">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0b1c30]">{exp.title}</span>
                    <span className="text-[10px] text-[#6e7977]">{exp.date} • {exp.paymentMode}</span>
                  </div>
                  <span className="font-extrabold text-[#ba1a1a]">
                    -{formatCurrency(exp.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-[#6e7977] italic">
              No recent transactions recorded in this category.
            </p>
          )}
        </div>
      )}
    </section>
  );
};
