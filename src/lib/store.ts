'use client';

import {
  Entity,
  Account,
  Transaction,
  Proposal,
  Budget,
  Subscription,
  BillNegotiation,
  AuditLog,
  FeatureFlag,
  SinkingFund,
  DebtItem,
  InvestmentPosition,
  PaycheckPlanItem,
  BudgetRuleMetrics,
} from './types';
import {
  INITIAL_TENANT,
  INITIAL_USER,
  INITIAL_ENTITIES,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_PROPOSALS,
  INITIAL_BUDGETS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_NEGOTIATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_FEATURE_FLAGS,
} from './sample-data';

export interface AppState {
  currentTenant: typeof INITIAL_TENANT;
  currentUser: typeof INITIAL_USER;
  entities: Entity[];
  selectedEntityId: string;
  accounts: Account[];
  transactions: Transaction[];
  proposals: Proposal[];
  budgets: Budget[];
  subscriptions: Subscription[];
  negotiations: BillNegotiation[];
  auditLogs: AuditLog[];
  featureFlags: FeatureFlag[];
  safeToSpendBufferMinor: number;
  safeToSpendHorizonDays: number;
  // BudgetFlow feature data
  sinkingFunds: SinkingFund[];
  debts: DebtItem[];
  investments: InvestmentPosition[];
  paycheckPlan: PaycheckPlanItem[];
  ruleMetrics: BudgetRuleMetrics;
}

const STORAGE_KEY = 'money_command_state_v2';

export const INITIAL_SINKING_FUNDS: SinkingFund[] = [
  {
    id: 'sink-1',
    entityId: 'ent-personal-01',
    name: 'Emergency Fund',
    targetMinor: 1500000, // $15,000.00
    currentMinor: 1125000, // $11,250.00 (75%)
    targetDate: '2026-12-31',
    category: 'Safety',
  },
  {
    id: 'sink-2',
    entityId: 'ent-personal-01',
    name: 'Annual Auto Insurance & Maintenance',
    targetMinor: 320000, // $3,200.00
    currentMinor: 210000, // $2,100.00 (65%)
    targetDate: '2026-08-15',
    category: 'Vehicle',
  },
  {
    id: 'sink-3',
    entityId: 'ent-personal-01',
    name: 'Vacation / Travel Fund',
    targetMinor: 450000, // $4,500.00
    currentMinor: 180000, // $1,800.00 (40%)
    targetDate: '2026-10-01',
    category: 'Lifestyle',
  },
];

export const INITIAL_DEBTS: DebtItem[] = [
  {
    id: 'debt-1',
    entityId: 'ent-personal-01',
    name: 'Visa Infinite Cashback',
    type: 'credit_card',
    balanceMinor: 285000, // $2,850.00
    interestRate: 19.99,
    minimumPaymentMinor: 8500, // $85.00
    dueDate: '2026-11-18',
  },
  {
    id: 'debt-2',
    entityId: 'ent-personal-01',
    name: 'Home Equity Line of Credit',
    type: 'line_of_credit',
    balanceMinor: 1450000, // $14,500.00
    interestRate: 6.95,
    minimumPaymentMinor: 12500, // $125.00
    dueDate: '2026-11-28',
  },
  {
    id: 'debt-3',
    entityId: 'ent-personal-01',
    name: 'Auto Loan (Scotiabank)',
    type: 'loan',
    balanceMinor: 890000, // $8,900.00
    interestRate: 4.99,
    minimumPaymentMinor: 38500, // $385.00
    dueDate: '2026-11-15',
  },
];

export const INITIAL_INVESTMENTS: InvestmentPosition[] = [
  {
    id: 'inv-1',
    entityId: 'ent-personal-01',
    symbol: 'VFV.TO',
    name: 'Vanguard S&P 500 Index ETF (CAD)',
    shares: 180,
    costBasisMinor: 1980000,
    currentValueMinor: 2542000,
    assetClass: 'etf',
    returnPercentage: 28.38,
  },
  {
    id: 'inv-2',
    entityId: 'ent-personal-01',
    symbol: 'XEQT.TO',
    name: 'iShares All-Equity ETF Portfolio',
    shares: 420,
    costBasisMinor: 1150000,
    currentValueMinor: 1410000,
    assetClass: 'etf',
    returnPercentage: 22.61,
  },
  {
    id: 'inv-3',
    entityId: 'ent-personal-01',
    symbol: 'RY.TO',
    name: 'Royal Bank of Canada',
    shares: 65,
    costBasisMinor: 850000,
    currentValueMinor: 1045000,
    assetClass: 'equity',
    returnPercentage: 22.94,
  },
];

export const INITIAL_PAYCHECK_PLAN: PaycheckPlanItem[] = [
  { id: 'pay-1', entityId: 'ent-personal-01', category: 'Rent / Mortgage', allocatedMinor: 240000, spentMinor: 240000, type: 'need' },
  { id: 'pay-2', entityId: 'ent-personal-01', category: 'Groceries & Household', allocatedMinor: 75000, spentMinor: 52000, type: 'need' },
  { id: 'pay-3', entityId: 'ent-personal-01', category: 'Utilities & Hydro', allocatedMinor: 22000, spentMinor: 21750, type: 'need' },
  { id: 'pay-4', entityId: 'ent-personal-01', category: 'Dining Out & Fun', allocatedMinor: 40000, spentMinor: 38500, type: 'want' },
  { id: 'pay-5', entityId: 'ent-personal-01', category: 'Emergency Fund Sinking', allocatedMinor: 50000, spentMinor: 50000, type: 'savings' },
  { id: 'pay-6', entityId: 'ent-personal-01', category: 'Extra Debt Paydown', allocatedMinor: 45000, spentMinor: 45000, type: 'debt' },
];

export const INITIAL_RULE_METRICS: BudgetRuleMetrics = {
  needsPercent: 48,
  wantsPercent: 28,
  savingsPercent: 24,
  noSpendStreakDays: 6,
  noSpendGoalDays: 14,
};

export function getInitialState(): AppState {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          sinkingFunds: parsed.sinkingFunds || INITIAL_SINKING_FUNDS,
          debts: parsed.debts || INITIAL_DEBTS,
          investments: parsed.investments || INITIAL_INVESTMENTS,
          paycheckPlan: parsed.paycheckPlan || INITIAL_PAYCHECK_PLAN,
          ruleMetrics: parsed.ruleMetrics || INITIAL_RULE_METRICS,
        };
      } catch {
        // fallback
      }
    }
  }

  return {
    currentTenant: INITIAL_TENANT,
    currentUser: INITIAL_USER,
    entities: INITIAL_ENTITIES,
    selectedEntityId: INITIAL_ENTITIES[0].id,
    accounts: INITIAL_ACCOUNTS,
    transactions: INITIAL_TRANSACTIONS,
    proposals: INITIAL_PROPOSALS,
    budgets: INITIAL_BUDGETS,
    subscriptions: INITIAL_SUBSCRIPTIONS,
    negotiations: INITIAL_NEGOTIATIONS,
    auditLogs: INITIAL_AUDIT_LOGS,
    featureFlags: INITIAL_FEATURE_FLAGS,
    safeToSpendBufferMinor: 30000, // $300.00
    safeToSpendHorizonDays: 14,
    sinkingFunds: INITIAL_SINKING_FUNDS,
    debts: INITIAL_DEBTS,
    investments: INITIAL_INVESTMENTS,
    paycheckPlan: INITIAL_PAYCHECK_PLAN,
    ruleMetrics: INITIAL_RULE_METRICS,
  };
}

export function saveState(state: AppState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}
