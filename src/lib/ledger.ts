import { Transaction, TransactionLine } from './types';

export function formatCAD(minorUnits: number): string {
  const isNegative = minorUnits < 0;
  const absUnits = Math.abs(minorUnits);
  const dollars = (absUnits / 100).toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${isNegative ? '-' : ''}$${dollars} CAD`;
}

export function formatCADPlain(minorUnits: number): string {
  const isNegative = minorUnits < 0;
  const absUnits = Math.abs(minorUnits);
  const dollars = (absUnits / 100).toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${isNegative ? '-' : ''}$${dollars}`;
}

export function validateBalancedJournal(lines: TransactionLine[]): {
  isBalanced: boolean;
  totalDebit: number;
  totalCredit: number;
  imbalance: number;
} {
  const totalDebit = lines.reduce((acc, line) => acc + (line.debitMinor || 0), 0);
  const totalCredit = lines.reduce((acc, line) => acc + (line.creditMinor || 0), 0);
  const imbalance = Math.abs(totalDebit - totalCredit);

  return {
    isBalanced: imbalance === 0 && totalDebit > 0,
    totalDebit,
    totalCredit,
    imbalance,
  };
}

export function createReversalTransaction(
  original: Transaction,
  reversalReason: string,
  reversalTxId: string
): { reversalTx: Transaction; updatedOriginal: Transaction } {
  // Reversal flips debits and credits exactly
  const reversedLines: TransactionLine[] = original.lines.map((line) => ({
    id: `rev-line-${Math.random().toString(36).substring(2, 9)}`,
    transactionId: reversalTxId,
    accountId: line.accountId,
    accountName: line.accountName,
    accountCode: line.accountCode,
    debitMinor: line.creditMinor, // Flip
    creditMinor: line.debitMinor, // Flip
    currency: line.currency,
    description: `Reversal: ${line.description || original.description}`,
    category: line.category,
    taxRate: line.taxRate,
    taxAmountMinor: line.taxAmountMinor,
  }));

  const reversalTx: Transaction = {
    id: reversalTxId,
    tenantId: original.tenantId,
    entityId: original.entityId,
    type: 'adjustment',
    status: 'posted',
    currency: original.currency,
    totalMinor: original.totalMinor,
    txDate: new Date().toISOString().split('T')[0],
    description: `[REVERSAL] ${reversalReason} (Ref: ${original.id.substring(0, 8)})`,
    merchant: original.merchant,
    category: 'Adjustment / Reversal',
    source: 'system',
    reversalOfId: original.id,
    accountantStatus: 'user_verified',
    lines: reversedLines,
    createdAt: new Date().toISOString(),
  };

  const updatedOriginal: Transaction = {
    ...original,
    status: 'reversed',
  };

  return { reversalTx, updatedOriginal };
}

export function auditLedgerIntegrity(transactions: Transaction[]): {
  totalTransactions: number;
  postedCount: number;
  reversedCount: number;
  unreconciledCount: number;
  isAllBalanced: boolean;
} {
  let unreconciledCount = 0;
  let postedCount = 0;
  let reversedCount = 0;

  for (const tx of transactions) {
    if (tx.status === 'posted') {
      postedCount++;
      const check = validateBalancedJournal(tx.lines);
      if (!check.isBalanced) {
        unreconciledCount++;
      }
    } else if (tx.status === 'reversed') {
      reversedCount++;
    }
  }

  return {
    totalTransactions: transactions.length,
    postedCount,
    reversedCount,
    unreconciledCount,
    isAllBalanced: unreconciledCount === 0,
  };
}
