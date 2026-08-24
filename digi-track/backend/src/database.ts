import fs from 'fs';
import path from 'path';
import { ENV } from './env';
import { logger } from './logger';
import { DEFAULT_SYSTEM_CATEGORIES, DEMO_USERS } from '../constants/defaultData';

export interface DatabaseSchema {
  users: Record<string, any>;
  expenses: Record<string, any>;
  categories: Record<string, any>;
  budgets: Record<string, any>;
  savings: Record<string, any>;
  savingsGoals: Record<string, any>;
  splits: Record<string, any>;
}

class Database {
  private data: DatabaseSchema = {
    users: {},
    expenses: {},
    categories: {},
    budgets: {},
    savings: {},
    savingsGoals: {},
    splits: {},
  };

  private filePath: string;
  private isInitialized = false;

  constructor() {
    const dir = ENV.DATA_DIR;
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (err) {
        logger.warn('Could not create data directory, using memory store:', err);
      }
    }
    this.filePath = path.join(dir, 'digitrack_db.json');
  }

  public init() {
    if (this.isInitialized) return;

    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
        logger.info('Database loaded successfully from persistent storage.');
      } else {
        this.seedInitialData();
        this.save();
        logger.info('Initialized new database with seed data.');
      }
    } catch (err) {
      logger.error('Error initializing database file, initializing defaults:', err);
      this.seedInitialData();
    }

    this.isInitialized = true;
  }

  public getCollection<T = any>(name: keyof DatabaseSchema): Record<string, T> {
    if (!this.isInitialized) {
      this.init();
    }
    if (!this.data[name]) {
      this.data[name] = {};
    }
    return this.data[name] as Record<string, T>;
  }

  public save() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      logger.error('Failed to persist database to disk:', err);
    }
  }

  private seedInitialData() {
    const now = new Date();
    const getISO = (daysAgo: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString().split('T')[0];
    };

    // 1. Seed Categories
    DEFAULT_SYSTEM_CATEGORIES.forEach((cat) => {
      this.data.categories[cat.id] = {
        ...cat,
        userId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    });

    // 2. Seed Demo Users
    DEMO_USERS.forEach((u) => {
      this.data.users[u.id] = {
        id: u.id,
        name: u.name,
        email: u.email.toLowerCase(),
        passwordHash: '$2a$10$wE9K2sT/dG8sJ21YvQvKZuVzW4J5jF5YF9s4J3Gz5F5YF9s4J3Gz5', // dummy salted hash
        avatarUrl: u.avatarUrl,
        currencySymbol: u.currencySymbol,
        currencyCode: u.currencyCode,
        isPremium: u.isPremium,
        onboarded: u.onboarded,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Seed Savings Config
      this.data.savings[u.id] = {
        id: `sav-${u.id}`,
        userId: u.id,
        monthlySalary: u.monthlySalary,
        monthlySavingsGoal: u.monthlySavingsGoal,
        emergencyFundReserve: 50000,
        savingsLockEnabled: true,
        autoDeductSavings: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Seed Budget Config
      const spendable = Math.max(0, u.monthlySalary - u.monthlySavingsGoal);
      this.data.budgets[u.id] = {
        id: `bud-${u.id}`,
        userId: u.id,
        totalMonthlyBudget: spendable,
        selectedMonth: `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`,
        categoryCaps: {
          food: 10000,
          shopping: 20000,
          travel: 5000,
          entertainment: 4000,
          housing: 20000,
          utilities: 5000,
          transport: 5000,
          other: 3000,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    });

    // 3. Seed Initial Expenses for Primary Demo User (Anjali)
    const anjaliId = 'user-anjali';
    const initialExpenses = [
      {
        id: 'exp-1',
        userId: anjaliId,
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
        userId: anjaliId,
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
        userId: anjaliId,
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
        userId: anjaliId,
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
        userId: anjaliId,
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
        userId: anjaliId,
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
        userId: anjaliId,
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
        userId: anjaliId,
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
        userId: anjaliId,
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
        userId: anjaliId,
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

    initialExpenses.forEach((exp) => {
      this.data.expenses[exp.id] = { ...exp, updatedAt: exp.createdAt };
    });

    // 4. Seed Savings Sub-Goals for Anjali
    const initialGoals = [
      {
        id: 'goal-1',
        userId: anjaliId,
        name: 'Emergency Fund Vault',
        targetAmount: 100000,
        currentAmount: 45000,
        category: 'emergency',
        icon: 'shield_locked',
        targetDate: '2026-12-31',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'goal-2',
        userId: anjaliId,
        name: 'Goa Holiday Trip',
        targetAmount: 25000,
        currentAmount: 18000,
        category: 'vacation',
        icon: 'beach_access',
        targetDate: '2026-11-15',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'goal-3',
        userId: anjaliId,
        name: 'New MacBook Pro',
        targetAmount: 120000,
        currentAmount: 60000,
        category: 'purchase',
        icon: 'laptop_mac',
        targetDate: '2027-03-31',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    initialGoals.forEach((g) => {
      this.data.savingsGoals[g.id] = g;
    });

    // 5. Seed Initial Split Bills
    const initialSplits = [
      {
        id: 'split-1',
        userId: anjaliId,
        title: 'Weekend Social Dinner & Drinks',
        totalAmount: 4800,
        category: 'food',
        date: getISO(2),
        splitType: 'equal',
        participants: [
          { id: 'p1', name: 'You', paidAmount: 4800, shareAmount: 1200, avatarColor: '#005c55' },
          { id: 'p2', name: 'Rahul', paidAmount: 0, shareAmount: 1200, avatarColor: '#004eaa' },
          { id: 'p3', name: 'Priya', paidAmount: 0, shareAmount: 1200, avatarColor: '#ba1a1a' },
          { id: 'p4', name: 'Vikram', paidAmount: 0, shareAmount: 1200, avatarColor: '#fd761a' },
        ],
        settlements: [
          { from: 'Rahul', to: 'You', amount: 1200, settled: false },
          { from: 'Priya', to: 'You', amount: 1200, settled: true, settledAt: Date.now() - 3600000, settledPaymentMode: 'UPI' },
          { from: 'Vikram', to: 'You', amount: 1200, settled: false },
        ],
        notes: 'Pizza, pasta and drinks at Social CyberHub',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      },
      {
        id: 'split-2',
        userId: anjaliId,
        title: 'Goa Roadtrip Fuel & Fastag',
        totalAmount: 3600,
        category: 'travel',
        date: getISO(6),
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
        notes: 'Highway diesel filling + tolls',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
      },
    ];

    initialSplits.forEach((s) => {
      this.data.splits[s.id] = s;
    });
  }
}

export const db = new Database();
