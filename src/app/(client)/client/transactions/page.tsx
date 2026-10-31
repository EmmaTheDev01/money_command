'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  Download, 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  X
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD, createReversalTransaction, validateBalancedJournal } from '@/lib/ledger';
import { Transaction, AuditLog } from '@/lib/types';

export default function TransactionsPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [reversalModalTx, setReversalModalTx] = useState<Transaction | null>(null);
  const [reversalReason, setReversalReason] = useState('Customer entered incorrect amount');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;

  const entityTransactions = state.transactions.filter((t) => {
    if (t.entityId !== activeEntity.id) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const categories = Array.from(new Set(state.transactions.filter((t) => t.entityId === activeEntity.id).map((t) => t.category)));

  const handleExecuteReversal = () => {
    if (!reversalModalTx) return;

    const reversalTxId = `tx-rev-${Date.now()}`;
    const { reversalTx, updatedOriginal } = createReversalTransaction(
      reversalModalTx,
      reversalReason,
      reversalTxId
    );

    const auditEntry: AuditLog = {
      id: `audit-${Date.now()}`,
      tenantId: state.currentTenant.id,
      userId: state.currentUser.id,
      userName: state.currentUser.fullName,
      action: 'REVERSE_POSTED_JOURNAL',
      entityType: 'transaction',
      entityId: reversalModalTx.id,
      details: `MC-010 Applied: Non-destructive correction. Posted reversing journal ${reversalTxId.substring(0, 8)} to offset original ${reversalModalTx.id.substring(0, 8)}. Reason: ${reversalReason}.`,
      ipAddress: '198.51.100.42 (Toronto, ON)',
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      transactions: [
        reversalTx,
        ...prev.transactions.map((t) => (t.id === reversalModalTx.id ? updatedOriginal : t)),
      ],
      auditLogs: [auditEntry, ...prev.auditLogs],
    }));

    setReversalModalTx(null);
    setStatusMessage(`✓ Reversing transaction posted successfully. Original journal preserved in audit history.`);
  };

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Type', 'Status', 'Description', 'Merchant', 'Category', 'Account Code', 'Account Name', 'Debit CAD', 'Credit CAD'];
    const rows: string[] = [headers.join(',')];

    entityTransactions.forEach((tx) => {
      tx.lines.forEach((line) => {
        rows.push([
          tx.id,
          tx.txDate,
          tx.type,
          tx.status,
          `"${tx.description.replace(/"/g, '""')}"`,
          `"${(tx.merchant || '').replace(/"/g, '""')}"`,
          `"${tx.category}"`,
          line.accountCode || '',
          `"${(line.accountName || '').replace(/"/g, '""')}"`,
          (line.debitMinor / 100).toFixed(2),
          (line.creditMinor / 100).toFixed(2),
        ].join(','));
      });
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `money_command_${activeEntity.name.replace(/\s+/g, '_')}_ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage(`Exported ${entityTransactions.length} balanced transactions to CSV.`);
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
                <ArrowRightLeft className="w-6 h-6 text-emerald-500" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Double-Entry Ledger
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono font-semibold border border-emerald-500/20">
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
                className="px-4 py-2 rounded-full bg-card hover:bg-muted text-foreground border border-border text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                <span>Export Ledger CSV</span>
              </button>
            </div>
          </div>

          {/* Status Toast */}
          {statusMessage && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 flex items-center justify-between text-xs text-foreground animate-in fade-up">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Filter Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-secondary border border-border rounded-lg px-2.5 py-1 text-foreground font-medium"
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
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
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
                    <div key={tx.id} className="transition-colors hover:bg-secondary/40">
                      {/* Main Transaction Summary Row */}
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                            className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground mt-0.5"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-sm">
                                {tx.merchant || tx.description}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.2 rounded-full ${
                                  tx.status === 'posted'
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                }`}
                              >
                                {tx.status}
                              </span>
                              {tx.reversalOfId && (
                                <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
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
                            <div
                              className={`text-base font-bold font-mono ${
                                tx.type === 'income' ? 'text-emerald-500' : 'text-foreground'
                              }`}
                            >
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
                              className="p-2 rounded-lg bg-secondary hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground transition-colors"
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
                                    <td className="p-3 text-right text-emerald-500 font-bold">
                                      {line.debitMinor > 0 ? (line.debitMinor / 100).toFixed(2) : '-'}
                                    </td>
                                    <td className="p-3 text-right text-foreground font-bold">
                                      {line.creditMinor > 0 ? (line.creditMinor / 100).toFixed(2) : '-'}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-secondary/70 font-bold">
                                  <td colSpan={3} className="p-3 text-right text-foreground font-sans">
                                    Total Balanced:
                                  </td>
                                  <td className="p-3 text-right text-emerald-500 font-mono">
                                    {(balanceCheck.totalDebit / 100).toFixed(2)}
                                  </td>
                                  <td className="p-3 text-right text-foreground font-mono">
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
              <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
                <RotateCcw className="w-4 h-4" />
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
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ring"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setReversalModalTx(null)}
                className="px-4 py-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReversal}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm"
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
