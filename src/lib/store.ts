'use client';

import { useState, useEffect } from 'react';
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
import { createReversalTransaction } from './ledger';

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
}

const STORAGE_KEY = 'money_command_state_v1';

export function getInitialState(): AppState {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
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
  };
}

export function saveState(state: AppState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

