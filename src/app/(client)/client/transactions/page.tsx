'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Filter 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD, createReversalTransaction, validateBalancedJournal } from '@/lib/ledger';
import { Transaction } from '@/lib/types';

export default function TransactionsPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [reversalModalTx, setReversalModalTx] = useState<Transaction | null>(null);
  const [reversalReason, setReversalReason] = useState<string>('Incorrect categorization / duplicate');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;

  const entityTransactions = state.transactions
    .filter((t) => t.entityId === activeEntity.id)
    .filter((t) => (filterCategory === 'all' ? true : t.category.toLowerCase() === filterCategory.toLowerCase()));

  const categories = Array.from(
    new Set(state.transactions.filter((t) => t.entityId === activeEntity.id).map((t) => t.category))
  );

  const handleExecuteReversal = () => {
    if (!reversalModalTx) return;

    try {
      const revTxId = `tx-rev-${Date.now()}`;
      const { reversalTx, updatedOriginal } = createReversalTransaction(
        reversalModalTx,
        reversalReason,
        revTxId
      );

      setState((prev) => ({
        ...prev,
        transactions: [
          reversalTx,
          ...prev.transactions.map((t) => (t.id === reversalModalTx.id ? updatedOriginal : t)),
        ],
        auditLogs: [
          {
            id: `audit-${Date.now()}`,
            tenantId: prev.currentTenant.id,
            userId: prev.currentUser.id,
            userName: prev.currentUser.fullName,
            entityType: activeEntity.type,
            action: 'EXECUTE_MC010_REVERSAL',
            details: `Committed reversal transaction ${reversalTx.id} for posted transaction ${reversalModalTx.id} (${reversalModalTx.merchant}). Reason: ${reversalReason}. Double-entry invariant preserved.`,
            termsHash: `sha256:rev-${reversalTx.id.substring(0, 8)}`,
            createdAt: new Date().toISOString(),
            ipAddress: '127.0.0.1 (Web Companion)',
          },
          ...prev.auditLogs,
        ],
      }));

      setStatusMessage(`Transaction ${reversalModalTx.merchant || reversalModalTx.id} successfully reversed.`);
      setReversalModalTx(null);
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      alert(`Reversal failed: ${err.message}`);
    }
  };

  const handleExportCSV = () => {
    const headers = ['id', 'txDate', 'type', 'category', 'merchant', 'description', 'status', 'accountantStatus', 'totalCAD'];
    const rows = entityTransactions.map((t) => [
      t.id,
      t.txDate,
      t.type,
      `"${t.category}"`,
      `"${t.merchant || ''}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.status,
      t.accountantStatus,
      (t.totalMinor / 100).toFixed(2),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `money_command_ledger_${activeEntity.name.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMessage('Exported double-entry ledger to CSV.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
        pendingProposalsCount={pendingProposalsCount}
      />

      <div className="flex-1 flex">
        <ClientSidebar pendingProposalsCount={pendingProposalsCount} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-foreground" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Double-Entry Ledger
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-foreground font-mono font-medium border border-border">
                  Debits = Credits Verified
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                PostgreSQL immutable journal records. Corrections are applied via balanced reversals (MC-010).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-full bg-card hover:bg-secondary text-foreground border border-border text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Export Ledger CSV</span>
              </button>
            </div>
          </div>

          {/* Status Toast */}
          {statusMessage && (
            <div className="rounded-3xl border border-border bg-secondary/50 p-4 flex items-center justify-between text-xs text-foreground shadow-xs animate-in fade-up">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-foreground" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-card border border-border text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Filter Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-secondary border border-border rounded-full px-3 py-1 text-foreground font-medium cursor-pointer"
              >
                <option value="all">All Categories ({entityTransactions.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="text-[11px] font-mono text-muted-foreground">
              Showing {entityTransactions.length} journal entries for {activeEntity.name}
            </div>
          </div>

          {/* Transactions Ledger Table */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="divide-y divide-border">
              {entityTransactions.length === 0 ? (
                <div className="p-10 text-center text-xs text-muted-foreground">
                  No transactions match the selected filter.
                </div>
              ) : (
                entityTransactions.map((tx) => {
                  const isExpanded = expandedTxId === tx.id;
                  const balanceCheck = validateBalancedJournal(tx.lines);

                  return (
                    <div key={tx.id} className="transition-colors hover:bg-secondary/30">
                      {/* Main Transaction Summary Row */}
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                            className="p-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground mt-0.5 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-sm">
                                {tx.merchant || tx.description}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-secondary text-muted-foreground border border-border">
                                {tx.status}
                              </span>
                              {tx.reversalOfId && (
                                <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-secondary text-foreground border border-border">
                                  Reversal of {tx.reversalOfId.substring(0, 8)}
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
                              <span>Date: {tx.txDate}</span>
                              <span>&middot;</span>
                              <span>Category: {tx.category}</span>
                              <span>&middot;</span>
                              <span className="font-mono text-[10px]">Source: {tx.source}</span>
                            </div>
                          </div>
                        </div>

                        {/* Amount & Actions */}
                        <div className="flex items-center gap-4 self-end sm:self-auto">
                          <div className="text-right">
                            <div className="text-base font-bold font-mono text-foreground tabular-nums">
                              {tx.type === 'income' ? '+' : '-'}{formatCAD(tx.totalMinor)}
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {balanceCheck.isBalanced ? '✓ Balanced' : '⚠ Imbalanced'}
                            </span>
                          </div>

                          {/* Reversal action button */}
                          {tx.status === 'posted' && (
                            <button
                              onClick={() => setReversalModalTx(tx)}
                              className="p-2 rounded-full bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="Reverse transaction (MC-010)"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded Double-Entry Lines Sub-table */}
                      {isExpanded && (
                        <div className="px-6 pb-5 pt-2 bg-secondary/30 border-t border-border">
                          <span className="text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
                            Double-Entry Ledger Lines (Debit = Credit = {formatCAD(tx.totalMinor)})
                          </span>

                          <div className="rounded-2xl border border-border overflow-hidden text-xs bg-card">
                            <table className="w-full text-left">
                              <thead className="bg-secondary/60 text-muted-foreground text-[10px] uppercase font-mono">
                                <tr>
                                  <th className="p-3">Account Code</th>
                                  <th className="p-3">Account Name</th>
                                  <th className="p-3">Description</th>
                                  <th className="p-3 text-right">Debit (CAD)</th>
                                  <th className="p-3 text-right">Credit (CAD)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border font-mono text-[11px]">
                                {tx.lines.map((line) => (
                                  <tr key={line.id} className="hover:bg-secondary/30">
                                    <td className="p-3 text-muted-foreground">{line.accountCode || 'N/A'}</td>
                                    <td className="p-3 text-foreground font-sans font-medium">{line.accountName || 'Unknown'}</td>
                                    <td className="p-3 text-muted-foreground font-sans">{line.description || tx.description}</td>
                                    <td className="p-3 text-right text-foreground font-bold tabular-nums">
                                      {line.debitMinor > 0 ? (line.debitMinor / 100).toFixed(2) : '-'}
                                    </td>
                                    <td className="p-3 text-right text-foreground font-bold tabular-nums">
                                      {line.creditMinor > 0 ? (line.creditMinor / 100).toFixed(2) : '-'}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-secondary/70 font-bold">
                                  <td colSpan={3} className="p-3 text-right text-foreground font-sans">
                                    Total Balanced:
                                  </td>
                                  <td className="p-3 text-right text-foreground font-mono tabular-nums">
                                    {(balanceCheck.totalDebit / 100).toFixed(2)}
                                  </td>
                                  <td className="p-3 text-right text-foreground font-mono tabular-nums">
                                    {(balanceCheck.totalCredit / 100).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MC-010 Reversal Modal */}
      {reversalModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 space-y-4 text-foreground">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                <span>Post Correcting Reversal (MC-010)</span>
              </div>
              <button onClick={() => setReversalModalTx(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Financial engineering rules prohibit overwriting posted journals.
              To reverse <strong>{reversalModalTx.merchant || reversalModalTx.description}</strong> ({formatCAD(reversalModalTx.totalMinor)}), a balanced opposing journal will be atomically committed and linked.
            </p>

            <div>
              <label className="block text-foreground text-xs font-medium mb-1">Reason for Reversal:</label>
              <input
                type="text"
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setReversalModalTx(null)}
                className="px-4 py-2 rounded-full bg-secondary text-muted-foreground hover:text-foreground text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReversal}
                className="px-5 py-2 rounded-full bg-foreground text-background font-semibold text-xs shadow-xs hover:opacity-90 transition-opacity"
              >
                Post Balanced Reversal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
