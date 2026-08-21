import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper for lazy Gemini client
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Gemini AI Spending Analysis Endpoint
  app.post('/api/analyze-spending', async (req, res) => {
    const { expenses, categoryBreakdown, totalSpent, monthlyBudget, currencySymbol, currencyCode } = req.body;
    const symbol = currencySymbol || '₹';

    // Helper to generate dynamic, personalized fallback insight based on real data
    const generateHeuristicInsight = () => {
      const topCategory = (categoryBreakdown && categoryBreakdown.length > 0)
        ? [...categoryBreakdown].sort((a: any, b: any) => (b.total || 0) - (a.total || 0))[0]
        : null;

      const catName = topCategory?.category?.name || 'Dining & Lifestyle';
      const catSpent = topCategory?.total || 0;
      const catPercent = topCategory?.percentage || (totalSpent > 0 ? Math.round((catSpent / totalSpent) * 100) : 35);
      const potentialSavings = Math.max(250, Math.round(catSpent * 0.18));

      // Check most frequent merchant / item in expenses
      const itemCounts: Record<string, number> = {};
      if (Array.isArray(expenses)) {
        expenses.forEach((e: any) => {
          const title = e.title?.trim();
          if (title) itemCounts[title] = (itemCounts[title] || 0) + 1;
        });
      }
      const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0];

      let tip = `Cap ${catName} expenses with a weekly threshold to reduce unplanned spends by ~18%.`;
      if (topItem && topItem[1] > 1) {
        tip = `You logged "${topItem[0]}" ${topItem[1]} times recently. Batching or setting a dedicated allowance for frequent items can save ${symbol}${potentialSavings.toLocaleString()}/mo.`;
      }

      return {
        patternObservation: `Your largest expenditure is currently in ${catName}, accounting for ${symbol}${catSpent.toLocaleString()} (${catPercent}% of total outlays).`,
        actionableTip: tip,
        estimatedMonthlySavings: `${symbol}${potentialSavings.toLocaleString()}/mo`,
        categoryFocus: catName,
        keyMetric: `${catPercent}% in ${catName}`,
        isAiGenerated: false,
      };
    };

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json(generateHeuristicInsight());
      }

      // Format expense summary for prompt
      const expenseSummaries = Array.isArray(expenses)
        ? expenses.slice(0, 20).map((e: any) => `- ${e.title}: ${symbol}${e.amount} (${e.category}, on ${e.date})`).join('\n')
        : 'No transaction details provided.';

      const categorySummary = Array.isArray(categoryBreakdown)
        ? categoryBreakdown.map((c: any) => `- ${c.category?.name || c.category}: ${symbol}${c.total} (${c.percentage}%)`).join('\n')
        : 'No category breakdown.';

      const prompt = `You are a savvy personal finance advisor for Digi Track expense manager.
Analyze the following recent spending data and return a JSON object with:
1. patternObservation: One concise 1-2 sentence observation on spending patterns and frequency.
2. actionableTip: Exactly ONE realistic, high-impact tip to save money based on these transactions.
3. estimatedMonthlySavings: Estimated realistic monthly savings with currency symbol "${symbol}".
4. categoryFocus: The primary category focus (e.g. Food & Dining).
5. keyMetric: A short 2-5 word metric (e.g. "${categoryBreakdown?.[0]?.percentage || 35}% spent on Food").

Current Monthly Total Spent: ${symbol}${totalSpent || 0}
Monthly Budget: ${symbol}${monthlyBudget || 0}
Currency: ${currencyCode || 'INR'} (${symbol})

Category Breakdown:
${categorySummary}

Recent Transactions:
${expenseSummaries}
`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          patternObservation: { type: Type.STRING },
          actionableTip: { type: Type.STRING },
          estimatedMonthlySavings: { type: Type.STRING },
          categoryFocus: { type: Type.STRING },
          keyMetric: { type: Type.STRING },
        },
        required: ['patternObservation', 'actionableTip', 'estimatedMonthlySavings', 'categoryFocus', 'keyMetric'],
      };

      // Model candidate list with fallbacks for high-availability (using valid aliases & models)
      const candidateModels = [
        'gemini-flash-latest',
        'gemini-3.7-flash',
        'gemini-3.1-flash-lite',
        'gemini-3.1-pro-preview',
      ];
      let parsedData: any = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: 'You are an expert personal finance advisor specializing in practical micro-savings opportunities. Return your advice in the exact JSON schema.',
              responseMimeType: 'application/json',
              responseSchema: schema,
            },
          });

          const responseText = response.text?.trim() || '{}';
          parsedData = JSON.parse(responseText);
          if (parsedData && parsedData.actionableTip) {
            break;
          }
        } catch (modelErr: any) {
          // Log transient status cleanly without loud console error spam
          console.log(`Candidate ${modelName} transient status: ${modelErr?.status || modelErr?.code || 'retrying'}`);
        }
      }

      if (parsedData && parsedData.actionableTip) {
        return res.json({
          ...parsedData,
          isAiGenerated: true,
        });
      }

      // If all models hit capacity/demand limit, return dynamic data-driven fallback
      return res.json(generateHeuristicInsight());
    } catch (error: any) {
      console.warn('Handling spending analysis with dynamic fallback due to:', error?.message || error);
      return res.json(generateHeuristicInsight());
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
