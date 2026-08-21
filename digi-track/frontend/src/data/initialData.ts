import { CategoryInfo, Expense, UserProfile, BudgetConfig, SplitBill, SavingsConfig, SavingsGoal } from '../types';

export const HERO_IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgjdodfASI-Z10jxthySrI2jCjEYGBKX-vQPIopMXB1A8zTtsrdvimJqQiX8XUyEa0OoxKQxj42jdAlj0JZZE_qHpkfpGLFIQToKNKc4Qqe9BnrzSV5hhmpQNcdtUunP26SFZ16wOxBHChQ3dHO9B9TLOHZQea0cUB6jA6jchCCnl38fNoDubMayvgMZ-tni_eyfDstMmAVooah_fP2zSsHO9pkdIJD1E6Rx_XVa3Q7ZNVSt0eTvxk_Q';

export const USER_AVATAR_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuALJHF-hvH31xNBqTITD_O-8KMerMQELXYXRYccFFIwNqqcr6ojnfHfV6pj4Bfb009_ZBb9WVs_Tt8IqECY-GzBKDYhVT5SzkZVhEMmNpwkQD5oSQOQ-BYVNI1nA1LakhO05K7hVJ7OO7jqdAqiKryDQzPlUquhhqAbJoNbn5CZ0n78FZ_AMu7N_96xg0VRkCPhf-svK5yjI4-bOhkxLjtB3izHs-UHwkkQwB167rzegPaTepK7IPMhcw';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Anjali Sharma',
  email: 'anjali.sharma@example.com',
  avatarUrl: USER_AVATAR_URL,
  currencySymbol: '₹',
  currencyCode: 'INR',
  isPremium: false,
  onboarded: true,
  isAuthenticated: true,
};

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  {
    id: 'food',
    name: 'Food',
    icon: 'restaurant',
    bgClass: 'bg-[#d8e2ff]',
    iconColorClass: 'text-[#004eaa]',
    badgeBgClass: 'bg-[#e4eaff]',
    badgeTextClass: 'text-[#004eaa]',
    colorHex: '#fd761a',
    defaultCap: 10000,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'shopping_bag',
    bgClass: 'bg-[#ffdbca]',
    iconColorClass: 'text-[#9d4300]',
    badgeBgClass: 'bg-[#ffdbca]',
    badgeTextClass: 'text-[#9d4300]',
    colorHex: '#0f766e',
    defaultCap: 20000,
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'flight_takeoff',
    bgClass: 'bg-[#ffdad6]',
    iconColorClass: 'text-[#ba1a1a]',
    badgeBgClass: 'bg-[#ffdad6]',
    badgeTextClass: 'text-[#ba1a1a]',
    colorHex: '#ba1a1a',
    defaultCap: 5000,
  },
  {
    id: 'entertainment',
    name: 'Ent.',
    icon: 'movie',
    bgClass: 'bg-[#e5eeff]',
    iconColorClass: 'text-[#0165d8]',
    badgeBgClass: 'bg-[#dce9ff]',
    badgeTextClass: 'text-[#0165d8]',
    colorHex: '#0165d8',
    defaultCap: 4000,
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: 'home',
    bgClass: 'bg-[#dce9ff]',
    iconColorClass: 'text-[#004eaa]',
    badgeBgClass: 'bg-[#e4eaff]',
    badgeTextClass: 'text-[#004eaa]',
    colorHex: '#0165d8',
    defaultCap: 20000,
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: 'bolt',
    bgClass: 'bg-[#d8e2ff]',
    iconColorClass: 'text-[#004eaa]',
    badgeBgClass: 'bg-[#d8e2ff]',
    badgeTextClass: 'text-[#004eaa]',
    colorHex: '#004eaa',
    defaultCap: 5000,
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'directions_car',
    bgClass: 'bg-[#ffdad6]',
    iconColorClass: 'text-[#ba1a1a]',
    badgeBgClass: 'bg-[#ffdad6]',
    badgeTextClass: 'text-[#ba1a1a]',
    colorHex: '#ff7b72',
    defaultCap: 5000,
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'category',
    bgClass: 'bg-[#d3e4fe]',
    iconColorClass: 'text-[#005c55]',
    badgeBgClass: 'bg-[#e5eeff]',
    badgeTextClass: 'text-[#005c55]',
    colorHex: '#6e7977',
    defaultCap: 3000,
  },
];

// Seed transactions that match the design mockups
const now = new Date();
const getISO = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Lunch at Cafe',
    amount: 350,
    category: 'food',
    date: getISO(0),
    time: '01:15 PM',
    paymentMode: 'Cash',
    note: 'Team lunch with colleagues',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'exp-2',
    title: 'Uber to Office',
    amount: 280,
    category: 'transport',
    date: getISO(0),
    time: '09:10 AM',
    paymentMode: 'UPI',
    note: 'Morning cab ride',
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: 'exp-3',
    title: 'Reliance Fresh',
    amount: 1240,
    category: 'shopping',
    date: getISO(0),
    time: '10:42 AM',
    paymentMode: 'Card',
    note: 'Weekly vegetables and pantry',
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: 'exp-4',
    title: 'Groceries - Reliance',
    amount: 1450,
    category: 'shopping',
    date: getISO(1),
    time: '06:30 PM',
    paymentMode: 'Card',
    note: 'Household essentials and snacks',
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: 'exp-5',
    title: 'Electricity Bill',
    amount: 920,
    category: 'utilities',
    date: getISO(1),
    time: '04:15 PM',
    paymentMode: 'UPI',
    note: 'Auto-pay scheduled',
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
  },
  {
    id: 'exp-6',
    title: 'Electricity Board',
    amount: 2450,
    category: 'utilities',
    date: getISO(1),
    time: '11:00 AM',
    paymentMode: 'UPI',
    note: 'Main home power bill',
    createdAt: Date.now() - 1000 * 60 * 60 * 32,
  },
  {
    id: 'exp-7',
    title: 'Indian Oil',
    amount: 3000,
    category: 'transport',
    date: getISO(8),
    time: '08:20 AM',
    paymentMode: 'Card',
    note: 'Full tank petrol for car',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: 'exp-8',
    title: 'Apartment Rent',
    amount: 20000,
    category: 'housing',
    date: getISO(15),
    time: '10:00 AM',
    paymentMode: 'NetBanking',
    note: 'Monthly rental transfer',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
  },
  {
    id: 'exp-9',
    title: 'Supermarket Groceries',
    amount: 9710,
    category: 'shopping',
    date: getISO(18),
    time: '05:40 PM',
    paymentMode: 'Card',
    note: 'Bulk monthly supplies',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
  },
  {
    id: 'exp-10',
    title: 'Fine Dine Restaurant',
    amount: 5830,
    category: 'food',
    date: getISO(20),
    time: '09:00 PM',
    paymentMode: 'Card',
    note: 'Family anniversary dinner',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
];

export const DEFAULT_SAVINGS_CONFIG: SavingsConfig = {
  monthlySalary: 60000,
  monthlySavingsGoal: 20000,
  emergencyFundReserve: 50000,
  savingsLockEnabled: true,
  autoDeductSavings: true,
  savingsGoals: [
    {
      id: 'goal-1',
      name: 'Emergency Fund Vault',
      targetAmount: 100000,
      currentAmount: 45000,
      category: 'emergency',
      icon: 'shield_locked',
      targetDate: '2026-12-31',
    },
    {
      id: 'goal-2',
      name: 'Goa Holiday Trip',
      targetAmount: 25000,
      currentAmount: 18000,
      category: 'vacation',
      icon: 'beach_access',
      targetDate: '2026-11-15',
    },
    {
      id: 'goal-3',
      name: 'New MacBook Pro',
      targetAmount: 120000,
      currentAmount: 60000,
      category: 'purchase',
      icon: 'laptop_mac',
      targetDate: '2027-03-31',
    },
  ],
};

// Dynamically set the selected month to the current month
const _now = new Date();
const _currentMonth = `${_now.toLocaleString('default', { month: 'long' })} ${_now.getFullYear()}`;

export const DEFAULT_BUDGET: BudgetConfig = {
  totalMonthlyBudget: 40000, // Spendable remaining budget (60000 salary - 20000 savings)
  selectedMonth: _currentMonth,
  categoryCaps: {
    shopping: 15000, // Groceries cap
    food: 8000,     // Dining cap
    transport: 4000, // Transport cap
    utilities: 4000,
    housing: 15000,
    entertainment: 3000,
    travel: 4000,
    other: 2000,
  },
};

export const INITIAL_SPLITS: SplitBill[] = [
  {
    id: 'split-1',
    title: 'Weekend Social Dinner & Drinks',
    totalAmount: 4800,
    category: 'food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
    splitType: 'equal',
    participants: [
      { id: 'p1', name: 'You', paidAmount: 4800, shareAmount: 1200, avatarColor: '#005c55' },
      { id: 'p2', name: 'Rahul', paidAmount: 0, shareAmount: 1200, avatarColor: '#004eaa' },
      { id: 'p3', name: 'Priya', paidAmount: 0, shareAmount: 1200, avatarColor: '#ba1a1a' },
      { id: 'p4', name: 'Vikram', paidAmount: 0, shareAmount: 1200, avatarColor: '#fd761a' },
    ],
    settlements: [
      { from: 'Rahul', to: 'You', amount: 1200, settled: false },
      { from: 'Priya', to: 'You', amount: 1200, settled: true },
      { from: 'Vikram', to: 'You', amount: 1200, settled: false },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    notes: 'Pizza, pasta and drinks at Social CyberHub',
  },
  {
    id: 'split-2',
    title: 'Goa Roadtrip Fuel & Fastag',
    totalAmount: 3600,
    category: 'travel',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString().split('T')[0],
    splitType: 'equal',
    participants: [
      { id: 'p1', name: 'You', paidAmount: 0, shareAmount: 1200, avatarColor: '#005c55' },
      { id: 'p4', name: 'Vikram', paidAmount: 3600, shareAmount: 1200, avatarColor: '#fd761a' },
      { id: 'p5', name: 'Amit', paidAmount: 0, shareAmount: 1200, avatarColor: '#0165d8' },
    ],
    settlements: [
      { from: 'You', to: 'Vikram', amount: 1200, settled: false },
      { from: 'Amit', to: 'Vikram', amount: 1200, settled: false },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    notes: 'Highway diesel filling + tolls',
  },
];
