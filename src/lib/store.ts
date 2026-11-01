'use client';

import {
  Tenant,
  User,
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

export interface AppState {
  currentTenant: Tenant | null;
  currentUser: User | null;
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
  sinkingFunds: SinkingFund[];
  debts: DebtItem[];
  investments: InvestmentPosition[];
  paycheckPlan: PaycheckPlanItem[];
  ruleMetrics: BudgetRuleMetrics;
}

const STORAGE_KEY = 'money_command_live_state';

const DEFAULT_EMPTY_STATE: AppState = {
  currentTenant: null,
  currentUser: null,
  entities: [],
  selectedEntityId: '',
  accounts: [],
  transactions: [],
  proposals: [],
  budgets: [],
  subscriptions: [],
  negotiations: [],
  auditLogs: [],
  featureFlags: [],
  safeToSpendBufferMinor: 0,
  safeToSpendHorizonDays: 14,
  sinkingFunds: [],
  debts: [],
  investments: [],
  paycheckPlan: [],
  ruleMetrics: {
    needsPercent: 0,
    wantsPercent: 0,
    savingsPercent: 0,
    noSpendStreakDays: 0,
    noSpendGoalDays: 0,
  },
};

export function getInitialState(): AppState {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_EMPTY_STATE,
          ...parsed,
        };
      } catch {
        // Fallback to empty state
      }
    }
  }

  return DEFAULT_EMPTY_STATE;
}

export function saveState(state: AppState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function clearState() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
