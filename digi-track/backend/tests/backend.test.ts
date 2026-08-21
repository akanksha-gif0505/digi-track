import { createApp } from './src/app';
import http from 'http';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function assert(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  ✅ PASS: ${name}`);
  } catch (err: any) {
    results.push({ name, passed: false, error: err?.message || String(err) });
    console.error(`  ❌ FAIL: ${name} ->`, err?.message || err);
  }
}

async function runTests() {
  console.log('\n========================================');
  console.log('  RUNNING DIGI TRACK BACKEND TEST SUITE  ');
  console.log('========================================\n');

  const app = await createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  let authToken = '';
  let testUserId = '';
  let createdExpenseId = '';
  let createdSplitId = '';
  let createdGoalId = '';

  try {
    // 1. Health Check
    await assert('Health Check Endpoint (GET /api/health)', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body = await res.json();
      if (body.status !== 'ok') throw new Error(`Expected body.status === 'ok', got ${body.status}`);
    });

    // 2. Auth - Demo Login
    await assert('Auth: Demo Login (POST /api/v1/auth/demo-login)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'anjali.sharma@example.com' }),
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body = await res.json();
      if (!body.data?.token) throw new Error('Expected token in response');
      authToken = body.data.token;
      testUserId = body.data.user.id;
    });

    // 3. Auth - Get Profile
    await assert('Auth: Get Profile (GET /api/v1/auth/me)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body = await res.json();
      if (body.data?.email !== 'anjali.sharma@example.com') {
        throw new Error(`Expected anjali email, got ${body.data?.email}`);
      }
    });

    // 4. Categories - List Categories
    await assert('Categories: List Categories (GET /api/v1/categories)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/categories`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body = await res.json();
      if (!Array.isArray(body.data) || body.data.length === 0) {
        throw new Error('Expected non-empty categories array');
      }
    });

    // 5. Expenses - Create Expense
    await assert('Expenses: Create Expense (POST /api/v1/expenses)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Office Coffee & Snacks',
          amount: 220,
          category: 'food',
          date: '2026-08-21',
          time: '04:15 PM',
          paymentMode: 'UPI',
          note: 'Evening filter coffee',
        }),
      });
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
      const body = await res.json();
      if (!body.data?.id || body.data.amount !== 220) {
        throw new Error('Expense creation data mismatch');
      }
      createdExpenseId = body.data.id;
    });

    // 6. Expenses - List & Filter Expenses
    await assert('Expenses: List & Filter (GET /api/v1/expenses?search=Coffee)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/expenses?search=Coffee`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body = await res.json();
      if (!body.data?.expenses || body.data.expenses.length === 0) {
        throw new Error('Expected at least 1 matching expense');
      }
    });

    // 7. Budget - Get Budget & Safe Spend Today
    await assert('Budget: Get Budget Config (GET /api/v1/budget)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/budget`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body = await res.json();
      if (typeof body.data?.safeSpendToday !== 'number') {
        throw new Error('Expected numeric safeSpendToday in response');
      }
    });

    // 8. Savings - Vault Dashboard & State Machine
    await assert('Savings: Vault Dashboard (GET /api/v1/savings)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/savings`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body = await res.json();
      if (!body.data?.savingsHealth) {
        throw new Error('Expected savingsHealth status');
      }
      if (typeof body.data?.spendableBudget !== 'number') {
        throw new Error('Expected numeric spendableBudget');
      }
    });

    // 9. Savings - Create Sub-Goal & Deposit
    await assert('Savings: Add Sub-Goal & Deposit (POST /api/v1/savings/goals)', async () => {
      const createRes = await fetch(`${baseUrl}/api/v1/savings/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'Kyoto Vacation',
          targetAmount: 80000,
          currentAmount: 20000,
          category: 'vacation',
        }),
      });
      if (createRes.status !== 201) throw new Error(`Expected 201, got ${createRes.status}`);
      const goalBody = await createRes.json();
      createdGoalId = goalBody.data.id;

      // Deposit
      const depositRes = await fetch(`${baseUrl}/api/v1/savings/goals/${createdGoalId}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ amount: 5000 }),
      });
      if (depositRes.status !== 200) throw new Error(`Expected 200, got ${depositRes.status}`);
      const depositBody = await depositRes.json();
      if (depositBody.data.currentAmount !== 25000) {
        throw new Error(`Expected currentAmount 25000, got ${depositBody.data.currentAmount}`);
      }
    });

    // 10. Splits - Create Split Bill with Settlements
    await assert('Splits: Create Group Split Bill (POST /api/v1/splits)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/splits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Weekend Brunch',
          totalAmount: 3000,
          category: 'food',
          splitType: 'equal',
          participants: [
            { id: 'you', name: 'You', paidAmount: 3000, shareAmount: 1000 },
            { id: 'p1', name: 'Rahul', paidAmount: 0, shareAmount: 1000 },
            { id: 'p2', name: 'Priya', paidAmount: 0, shareAmount: 1000 },
          ],
        }),
      });
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
      const body = await res.json();
      if (!body.data?.settlements || body.data.settlements.length !== 2) {
        throw new Error(`Expected 2 settlement debts, got ${body.data?.settlements?.length}`);
      }
      createdSplitId = body.data.id;
    });

    // 11. Splits - Settle Debt
    await assert('Splits: Settle Debt (POST /api/v1/splits/:id/settle)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/splits/${createdSplitId}/settle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          settlementIndex: 0,
          paymentMode: 'UPI',
          recordAsExpense: false,
        }),
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body = await res.json();
      if (!body.data?.split?.settlements[0]?.settled) {
        throw new Error('Expected settlement to be marked settled');
      }
    });

    // 12. AI Spending Analysis (Dynamic / Heuristic Fallback)
    await assert('AI Insights: Analyze Spending (POST /api/v1/insights/analyze-spending)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/insights/analyze-spending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenses: [
            { title: 'Reliance Fresh', amount: 4500, category: 'Shopping', date: '2026-08-20' },
            { title: 'Fine Dine Restaurant', amount: 3500, category: 'Food', date: '2026-08-19' },
          ],
          totalSpent: 8000,
          monthlyBudget: 40000,
          currencySymbol: '₹',
        }),
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body = await res.json();
      if (!body.patternObservation || !body.actionableTip || !body.estimatedMonthlySavings) {
        throw new Error('AI Response does not conform to required output schema');
      }
    });

    // 13. AI Spending Analysis (Legacy Endpoint Compatibility)
    await assert('AI Insights: Legacy Route (POST /api/analyze-spending)', async () => {
      const res = await fetch(`${baseUrl}/api/analyze-spending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenses: [{ title: 'Uber', amount: 300, category: 'Transport', date: '2026-08-21' }],
          totalSpent: 300,
          monthlyBudget: 40000,
        }),
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body = await res.json();
      if (!body.actionableTip) {
        throw new Error('Legacy AI endpoint failed to return actionableTip');
      }
    });

    // 14. Export - CSV Export
    await assert('Export: CSV (GET /api/v1/export/csv)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/export/csv`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const text = await res.text();
      if (!text.includes('Title,Amount,Currency')) {
        throw new Error('Expected CSV headers in response');
      }
    });

    // 15. Offline Sync - Pull & Push
    await assert('Sync: Pull Snapshot (GET /api/v1/sync/pull)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/sync/pull`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const body = await res.json();
      if (!Array.isArray(body.data?.expenses) || !Array.isArray(body.data?.categories)) {
        throw new Error('Sync pull data structure mismatch');
      }
    });

  } finally {
    server.close();
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n========================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
