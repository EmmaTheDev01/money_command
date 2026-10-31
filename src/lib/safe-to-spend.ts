import { SafeToSpendBreakdown } from './types';

export interface SafeToSpendInput {
  liquidCashMinor: number;
  expectedIncomeMinor: number;
  essentialObligationsMinor: number;
  minimumDebtPaymentsMinor: number;
  taxReserveRequirementMinor: number;
  committedSavingsMinor: number;
  userDefinedBufferMinor: number;
  pendingOutflowsMinor: number;
  horizonDays: number;
  currency?: string;
}

export function calculateSafeToSpend(input: SafeToSpendInput): SafeToSpendBreakdown {
  const currency = input.currency || 'CAD';
  
  // Deterministic formula strictly from Section 3 of Money Command Architecture:
  // SAFE_TO_SPEND = liquid + income - obligations - debt - tax - savings - buffer - pending
  const safeToSpend = 
    input.liquidCashMinor +
    input.expectedIncomeMinor -
    input.essentialObligationsMinor -
    input.minimumDebtPaymentsMinor -
    input.taxReserveRequirementMinor -
    input.committedSavingsMinor -
    input.userDefinedBufferMinor -
    input.pendingOutflowsMinor;

  return {
    liquidCash: input.liquidCashMinor,
    expectedIncome: input.expectedIncomeMinor,
    essentialObligations: input.essentialObligationsMinor,
    minimumDebtPayments: input.minimumDebtPaymentsMinor,
    taxReserveRequirement: input.taxReserveRequirementMinor,
    committedSavings: input.committedSavingsMinor,
    userDefinedBuffer: input.userDefinedBufferMinor,
    pendingOutflows: input.pendingOutflowsMinor,
    safeToSpend,
    horizonDays: input.horizonDays,
    currency,
    isNegative: safeToSpend < 0,
  };
}
