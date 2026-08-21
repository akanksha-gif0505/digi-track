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
  private getClient(): GoogleGenAI | null {
    return ENV.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY }) : null;
  }

  generateHeuristicInsight(data: SpendingAnalysisInput): SpendingAnalysisOutput {
    const { expenses, categoryBreakdown, totalSpent = 0, currencySymbol = '₹' } = data;
    const top = categoryBreakdown?.length ? [...categoryBreakdown].sort((a: any, b: any) => (b.total || 0) - (a.total || 0))[0] : null;
    const catName = top?.category?.name || top?.name || 'Dining & Shopping';
    const catSpent = top?.total || 0;
    const catPct = top?.percentage || (totalSpent > 0 ? Math.round((catSpent / totalSpent) * 100) : 35);
    const savings = Math.max(250, Math.round(catSpent * 0.18));
    const counts: Record<string, number> = {};
    if (Array.isArray(expenses)) expenses.forEach((e: any) => { if (e.title) counts[e.title] = (counts[e.title] || 0) + 1; });
    const topItem = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const tip = topItem && topItem[1] > 1
      ? `You logged "${topItem[0]}" ${topItem[1]} times. Batching purchases can save ${currencySymbol}${savings.toLocaleString()}/mo.`
      : `Cap ${catName} with a weekly threshold to reduce unplanned spends by ~18%.`;
    return { patternObservation: `Your largest expenditure is ${catName}, accounting for ${currencySymbol}${catSpent.toLocaleString()} (${catPct}% of total).`, actionableTip: tip, estimatedMonthlySavings: `${currencySymbol}${savings.toLocaleString()}/mo`, categoryFocus: catName, keyMetric: `${catPct}% in ${catName}`, isAiGenerated: false };
  }

  async analyzeSpending(data: SpendingAnalysisInput): Promise<SpendingAnalysisOutput> {
    const { expenses, categoryBreakdown, totalSpent = 0, monthlyBudget = 0, currencySymbol = '₹', currencyCode = 'INR' } = data;
    const ai = this.getClient();
    if (!ai) return this.generateHeuristicInsight(data);

    try {
      const expSummary = Array.isArray(expenses) ? expenses.slice(0, 25).map((e: any) => `- ${e.title}: ${currencySymbol}${e.amount} (${e.category}, ${e.date})`).join('\n') : 'No transactions.';
      const catSummary = Array.isArray(categoryBreakdown) ? categoryBreakdown.map((c: any) => `- ${c.category?.name || c.name}: ${currencySymbol}${c.total} (${c.percentage}%)`).join('\n') : 'No breakdown.';
      const prompt = `You are a personal finance advisor for Digi Track.\nAnalyze spending data and return JSON with: patternObservation, actionableTip, estimatedMonthlySavings, categoryFocus, keyMetric.\nCurrency: ${currencyCode} (${currencySymbol})\nTotal Spent: ${currencySymbol}${totalSpent}\nMonthly Budget: ${currencySymbol}${monthlyBudget}\nCategories:\n${catSummary}\nTransactions:\n${expSummary}`;
      const schema = { type: Type.OBJECT, properties: { patternObservation: { type: Type.STRING }, actionableTip: { type: Type.STRING }, estimatedMonthlySavings: { type: Type.STRING }, categoryFocus: { type: Type.STRING }, keyMetric: { type: Type.STRING } }, required: ['patternObservation', 'actionableTip', 'estimatedMonthlySavings', 'categoryFocus', 'keyMetric'] };

      for (const model of ['gemini-flash-latest', 'gemini-3.7-flash', 'gemini-3.1-flash-lite']) {
        try {
          const resp = await ai.models.generateContent({ model, contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema } });
          const parsed = JSON.parse(resp.text?.trim() || '{}');
          if (parsed.actionableTip) return { ...parsed, isAiGenerated: true };
        } catch (e: any) { logger.debug(`AI model ${model} skipped:`, e?.status); }
      }
      return this.generateHeuristicInsight(data);
    } catch (err) {
      logger.warn('AI analysis fallback to heuristic:', err);
      return this.generateHeuristicInsight(data);
    }
  }
}

export const aiService = new AiService();
