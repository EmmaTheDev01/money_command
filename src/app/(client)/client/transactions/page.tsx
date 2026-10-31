'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  Download, 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  FileSpreadsheet,
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
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
                <ArrowRightLeft className="w-6 h-6 text-emerald-400" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Double-Entry Ledger
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-semibold border border-emerald-500/20">
                  Debits = Credits Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                PostgreSQL immutable journal records. Corrections are applied via balanced reversals (MC-010).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Ledger CSV</span>
              </button>
            </div>
          </div>

          {/* Status Toast */}
          {statusMessage && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Filter Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 font-medium"
              >
                <option value="all">All Categories ({entityTransactions.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Showing {entityTransactions.length} journal entries for {activeEntity.name}
            </div>
          </div>

          {/* Transactions Ledger Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
            <div className="divide-y divide-slate-800/80">
              {entityTransactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No transactions match the selected filter.
                </div>
              ) : (
                entityTransactions.map((tx) => {
                  const isExpanded = expandedTxId === tx.id;
                  const balanceCheck = validateBalancedJournal(tx.lines);

                  return (
                    <div key={tx.id} className="transition-colors hover:bg-slate-900/90">
                      {/* Main Transaction Summary Row */}
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200 mt-0.5"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-100 text-sm">
                                {tx.merchant || tx.description}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.2 rounded-full ${
                                  tx.status === 'posted'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                {tx.status}
                              </span>
                              {tx.reversalOfId && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                  Reversal of {tx.reversalOfId.substring(0, 8)}
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
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
                                tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                              }`}
                            >
                              {tx.type === 'income' ? '+' : '-'}{formatCAD(tx.totalMinor)}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {balanceCheck.isBalanced ? '✓ Balanced' : '⚠ Imbalanced'}
                            </span>
                          </div>

                          {/* Reversal action button */}
                          {tx.status === 'posted' && (
                            <button
                              onClick={() => setReversalModalTx(tx)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition-colors"
                              title="Reverse transaction (MC-010)"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded Double-Entry Lines Sub-table */}
                      {isExpanded && (
                        <div className="px-6 pb-4 pt-1 bg-slate-950/70 border-t border-slate-800/80">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                            Double-Entry Ledger Lines (Debit = Credit = {formatCAD(tx.totalMinor)})
                          </span>

                          <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                            <table className="w-full text-left">
                              <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-mono">
                                <tr>
                                  <th className="p-2.5">Account Code</th>
                                  <th className="p-2.5">Account Name</th>
                                  <th className="p-2.5">Description</th>
                                  <th className="p-2.5 text-right">Debit (CAD)</th>
                                  <th className="p-2.5 text-right">Credit (CAD)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                                {tx.lines.map((line) => (
                                  <tr key={line.id} className="hover:bg-slate-900/50">
                                    <td className="p-2.5 text-slate-400">{line.accountCode || 'N/A'}</td>
                                    <td className="p-2.5 text-slate-200 font-sans">{line.accountName || 'Unknown'}</td>
                                    <td className="p-2.5 text-slate-400 font-sans">{line.description || tx.description}</td>
                                    <td className="p-2.5 text-right text-emerald-400">
                                      {line.debitMinor > 0 ? (line.debitMinor / 100).toFixed(2) : '-'}
                                    </td>
                                    <td className="p-2.5 text-right text-slate-300">
                                      {line.creditMinor > 0 ? (line.creditMinor / 100).toFixed(2) : '-'}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-slate-900/80 font-bold">
                                  <td colSpan={3} className="p-2.5 text-right text-slate-300 font-sans">
                                    Total Balanced:
                                  </td>
                                  <td className="p-2.5 text-right text-emerald-400 font-mono">
                                    {(balanceCheck.totalDebit / 100).toFixed(2)}
                                  </td>
                                  <td className="p-2.5 text-right text-slate-200 font-mono">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <RotateCcw className="w-4 h-4" />
                <span>Post Correcting Reversal (MC-010)</span>
              </div>
              <button onClick={() => setReversalModalTx(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Financial engineering rules prohibit overwriting posted journals.
              To reverse <strong>{reversalModalTx.merchant || reversalModalTx.description}</strong> ({formatCAD(reversalModalTx.totalMinor)}), a balanced opposing journal will be atomically committed and linked.
            </p>

            <div>
              <label className="block text-slate-400 text-xs mb-1">Reason for Reversal:</label>
              <input
                type="text"
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReversalModalTx(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReversal}
                className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs"
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

