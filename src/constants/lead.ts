export const LEAD_STATUSES = ['NEW', 'CONTACTED', 'CLOSED'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const BUDGET_RANGES = [
  'UNDER_1K',
  'BETWEEN_1K_5K',
  'BETWEEN_5K_10K',
  'ABOVE_10K',
  'NOT_SURE',
] as const;
export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  UNDER_1K: 'Under $1,000',
  BETWEEN_1K_5K: '$1,000 - $5,000',
  BETWEEN_5K_10K: '$5,000 - $10,000',
  ABOVE_10K: 'Above $10,000',
  NOT_SURE: 'Not Sure / Undecided',
};
