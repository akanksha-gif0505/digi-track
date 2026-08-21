import { GoogleGenAI, Type } from '@google/genai';
import { ENV } from '../config/env';
import { logger } from '../config/logger';

export interface SpendingAnalysisInput {
  expenses: any[];
  categoryBreakdown?: any[];
  totalSpent?: number;
  monthlyBudget?: number;
  currencySymbol?: string;
  currencyCode?: string;
}

export interface SpendingAnalysisOutput {
  patternObservation: string;
  actionableTip: string;
  estimatedMonthlySavings: string;
  categoryFocus: string;
  keyMetric: string;
  isAiGenerated: boolean;
}

export class AiService {
  private getGeminiClient(): GoogleGenAI | null {
    const apiKey = ENV.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'digitrack-backend',
        },
      },
    });
  }

  public generateHeuristicInsight(data: SpendingAnalysisInput): SpendingAnalysisOutput {
    const { expenses, categoryBreakdown, totalSpent = 0, currencySymbol = '₹' } = data;

    const topCategory = categoryBreakdown && categoryBreakdown.length > 0
      ? [...categoryBreakdown].sort((a: any, b: any) => (b.total || 0) - (a.total || 0))[0]
      : null;

    const catName = topCategory?.category?.name || topCategory?.name || 'Dining & Shopping';
    const catSpent = topCategory?.total || 0;
    const catPercent = topCategory?.percentage || (totalSpent > 0 ? Math.round((catSpent / totalSpent) * 100) : 35);
    const potentialSavings = Math.max(250, Math.round(catSpent * 0.18));

    // Check most frequent items in expenses
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
      tip = `You logged "${topItem[0]}" ${topItem[1]} times recently. Batching purchases or setting a dedicated allowance can save ${currencySymbol}${potentialSavings.toLocaleString()}/mo.`;
    }

    return {
      patternObservation: `Your largest expenditure is currently in ${catName}, accounting for ${currencySymbol}${catSpent.toLocaleString()} (${catPercent}% of total outlays).`,
      actionableTip: tip,
      estimatedMonthlySavings: `${currencySymbol}${potentialSavings.toLocaleString()}/mo`,
      categoryFocus: catName,
      keyMetric: `${catPercent}% in ${catName}`,
      isAiGenerated: false,
    };
  }

  async analyzeSpending(data: SpendingAnalysisInput): Promise<SpendingAnalysisOutput> {
    const { expenses, categoryBreakdown, totalSpent = 0, monthlyBudget = 0, currencySymbol = '₹', currencyCode = 'INR' } = data;

    const ai = this.getGeminiClient();
    if (!ai) {
      return this.generateHeuristicInsight(data);
    }

    try {
      const expenseSummaries = Array.isArray(expenses)
        ? expenses.slice(0, 25).map((e: any) => `- ${e.title}: ${currencySymbol}${e.amount} (${e.category}, on ${e.date})`).join('\n')
        : 'No transaction details provided.';

      const categorySummary = Array.isArray(categoryBreakdown)
        ? categoryBreakdown.map((c: any) => `- ${c.category?.name || c.category || c.name}: ${currencySymbol}${c.total} (${c.percentage}%)`).join('\n')
        : 'No category breakdown.';

      const prompt = `You are an expert personal finance advisor for Digi Track expense manager.
Analyze the following recent spending data and return a JSON object with:
1. patternObservation: One concise 1-2 sentence observation on spending patterns and frequency.
2. actionableTip: Exactly ONE realistic, high-impact tip to save money based on these transactions.
3. estimatedMonthlySavings: Estimated realistic monthly savings with currency symbol "${currencySymbol}".
4. categoryFocus: The primary category focus (e.g. Food & Dining).
5. keyMetric: A short 2-5 word metric (e.g. "${categoryBreakdown?.[0]?.percentage || 35}% spent on Food").

Current Monthly Total Spent: ${currencySymbol}${totalSpent}
Monthly Budget: ${currencySymbol}${monthlyBudget}
Currency: ${currencyCode} (${currencySymbol})

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

      const candidateModels = [
        'gemini-flash-latest',
        'gemini-3.7-flash',
        'gemini-3.1-flash-lite',
        'gemini-3.1-pro-preview',
      ];

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
          const parsedData = JSON.parse(responseText);
          if (parsedData && parsedData.actionableTip) {
            return {
              ...parsedData,
              isAiGenerated: true,
            };
          }
        } catch (modelErr: any) {
          logger.debug(`Candidate ${modelName} transient status:`, modelErr?.status || modelErr?.code);
        }
      }

      return this.generateHeuristicInsight(data);
    } catch (err) {
      logger.warn('AI Spending analysis handled with heuristic fallback:', err);
      return this.generateHeuristicInsight(data);
    }
  }
}

export const aiService = new AiService();
