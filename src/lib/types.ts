export type TenantPlan = 'personal' | 'founder' | 'organization';
export type EntityType = 'personal' | 'sole_proprietorship' | 'corporation';
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type TransactionType = 'expense' | 'income' | 'transfer' | 'receivable' | 'payable' | 'adjustment';
export type TransactionStatus = 'draft' | 'posted' | 'reversed';
export type SourceChannel = 'whatsapp_text' | 'whatsapp_voice' | 'whatsapp_receipt' | 'web_manual' | 'web_upload' | 'statement' | 'system';
export type ProposalStatus = 'pending' | 'confirmed' | 'rejected' | 'modified';
export type TaxRelevance = 'none' | 'possible' | 'confirmed' | 'unknown';
export type SubscriptionStatus = 'suspected' | 'confirmed' | 'active' | 'cancellation_requested' | 'cancelled' | 'recurrence_detected';
export type ActionStatus = 'draft' | 'authorization_required' | 'authorized' | 'initiated' | 'provider_pending' | 'confirmed' | 'failed' | 'manual_action_required';
export type ActionType = 'subscription_cancellation' | 'bill_negotiation' | 'reminder' | 'refund_request';
export type NegotiationMode = 'coach_me' | 'draft_for_me' | 'initiate_for_me';
export type AccountantReviewState = 'unreviewed' | 'user_verified' | 'professional_reviewed';

export interface Tenant {
  id: string;
  name: string;
  plan: TenantPlan;
  status: string;
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  role: 'owner' | 'admin' | 'member' | 'accountant_viewer';
  fullName: string;
  email: string;
  phone?: string;
  whatsappPhone?: string;
  whatsappVerified: boolean;
  whatsappLinkCode?: string;
}

export interface Entity {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  type: EntityType;
  currency: string;
  taxIdentifier?: string;
  isDefault: boolean;
}

export interface Account {
  id: string;
  tenantId: string;
  entityId: string;
  code: string;
  name: string;
  type: AccountType;
  subtype?: string;
  currency: string;
  balanceMinor: number;
  isActive: boolean;
}

export interface TransactionLine {
  id: string;
  transactionId: string;
  accountId: string;
  accountName?: string;
  accountCode?: string;
  debitMinor: number;
  creditMinor: number;
  currency: string;
  description?: string;
  category?: string;
  taxRate?: number;
  taxAmountMinor?: number;
}

export interface Transaction {
  id: string;
  tenantId: string;
  entityId: string;
  type: TransactionType;
  status: TransactionStatus;
  currency: string;
  totalMinor: number;
  txDate: string;
  description: string;
  merchant?: string;
  category: string;
  source: SourceChannel;
  sourceId?: string;
  reversalOfId?: string;
  accountantStatus: AccountantReviewState;
  lines: TransactionLine[];
  createdAt: string;
}

export interface Proposal {
  id: string;
  tenantId: string;
  entityId: string;
  userId: string;
  sourceEventId?: string;
  type: TransactionType;
  amountMinor: number;
  currency: string;
  merchant: string;
  category: string;
  proposedDebitAccountId?: string;
  proposedCreditAccountId?: string;
  txDate: string;
  taxRelevance: TaxRelevance;
  confidence: number;
  userVerified: boolean;
  status: ProposalStatus;
  confirmedTransactionId?: string;
  rawText?: string;
  createdAt: string;
}

export interface SafeToSpendBreakdown {
  liquidCash: number;
  expectedIncome: number;
  essentialObligations: number;
  minimumDebtPayments: number;
  taxReserveRequirement: number;
  committedSavings: number;
  userDefinedBuffer: number;
  pendingOutflows: number;
  safeToSpend: number;
  horizonDays: number;
  currency: string;
  isNegative: boolean;
}

export interface Budget {
  id: string;
  entityId: string;
  category: string;
  period: 'monthly' | 'weekly' | 'yearly';
  amountMinor: number;
  spentMinor: number;
  alertThresholdPercent: number;
  currency: string;
}

export interface Subscription {
  id: string;
  entityId: string;
  merchant: string;
  category: string;
  amountMinor: number;
  currency: string;
  frequency: 'monthly' | 'annual' | 'weekly';
  status: SubscriptionStatus;
  nextBillingDate: string;
  lastPriceMinor: number;
  priceDeltaMinor: number;
  annualizedCostMinor: number;
  cancellationRoute: 'provider_api' | 'email_draft' | 'phone_script' | 'manual';
  cancellationNotes?: string;
}

export interface Action {
  id: string;
  tenantId: string;
  userId: string;
  type: ActionType;
  targetId?: string;
  targetMerchant: string;
  status: ActionStatus;
  termsShown: {
    serviceName: string;
    monthlyCost: string;
    actionScope: string;
    effectiveDate: string;
    consequences: string;
    feesIfAny: string;
  };
  termsHash: string;
  createdAt: string;
}

export interface BillNegotiation {
  id: string;
  entityId: string;
  providerName: string;
  accountNumberLast4: string;
  currentBillMinor: number;
  targetBillMinor: number;
  minAcceptableBillMinor: number;
  mode: NegotiationMode;
  status: string;
  scriptDraft: string;
  counterofferReceived?: {
    offeredBillMinor: number;
    termMonths: number;
    notes: string;
  };
  verifiedSavingsMinor: number;
}

export interface TaxProfile {
  id: string;
  entityId: string;
  jurisdiction: string;
  taxYear: number;
  reportingMethod: 'cash' | 'accrual';
  gstHstRegistered: boolean;
  gstHstNumber?: string;
  defaultReserveRate: number;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  termsHash?: string;
  ipAddress: string;
  createdAt: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  enabled: boolean;
  description: string;
  rolloutPercentage: number;
}
