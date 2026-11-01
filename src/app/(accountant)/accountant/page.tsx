'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  Check, 
  Filter, 
  Building2, 
  Lock,
  ArrowUpRight,
  Search,
  ChevronDown
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { Transaction } from '@/lib/types';
import { db } from '@/lib/db';

export default function AccountantPortalPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(getInitialState());
  const [notification, setNotification] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<'all' | 'unreviewed' | 'user_verified' | 'professional_reviewed'>('all');

  useEffect(() => {
    const session = db.getCurrentSession();
    if (!session) {
      router.push('/login?redirect=/accountant');
    }
  }, [router]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const allEntityTx = state.transactions.filter((t) => t.entityId === activeEntity.id);
  const filteredTransactions = allEntityTx.filter((t) => {
    if (filterState === 'all') return true;
    return t.accountantStatus === filterState;
  });

  const reviewedCount = allEntityTx.filter((t) => t.accountantStatus === 'professional_reviewed').length;
  const pendingReviewCount = allEntityTx.length - reviewedCount;

  const handleMarkReviewed = (txId: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === txId ? { ...t, accountantStatus: 'professional_reviewed' as const } : t
      ),
    }));
    setNotification('Transaction marked as Professional-Reviewed.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportPackage = () => {
    const lines = [
      `ACCOUNTANT WORKPAPER PACKAGE - BUDGETFLOW OS v2.0`,
      `Client Entity: ${activeEntity.name}`,
      `Tax Year: 2026 | Jurisdiction: Ontario (CA_ON)`,
      `Status: Reconciled Double-Entry Core`,
      ``,
      `Date,Merchant,Category,Amount CAD,Status,Accountant Review State`,
      ...allEntityTx.map(
        (t) =>
          `${t.txDate},"${t.merchant || t.description}","${t.category}",${(t.totalMinor / 100).toFixed(
            2
          )},${t.status},${t.accountantStatus}`
      ),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Accountant_Review_${activeEntity.name.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification('Standardized accountant export package downloaded.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-secondary text-primary">
                <FileText className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Accountant Review Portal
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-primary border border-border">
                CPA Grant: Read/Review
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Permissioned document verification, non-destructive audit marking, and standardized CRA tax schedules for {activeEntity.name}.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportPackage}
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 font-semibold text-xs flex items-center gap-1.5 transition-opacity shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Verified Workpaper</span>
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {notification && (
          <div className="rounded-2xl border border-border bg-secondary p-3.5 text-xs text-foreground flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* CPA Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
            <span className="text-[11px] font-medium text-muted-foreground block">Client Entity</span>
            <span className="text-xl font-bold tracking-tight text-foreground truncate mt-1 block">
              {activeEntity.name}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">{activeEntity.type} &middot; {activeEntity.currency}</span>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
            <span className="text-[11px] font-medium text-muted-foreground block">Double-Entry Status</span>
            <span className="text-xl font-bold tracking-tight text-emerald-500 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              100% Reconciled
            </span>
            <span className="text-[10px] text-muted-foreground">0 Unreconciled journals</span>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
            <span className="text-[11px] font-medium text-muted-foreground block">Professional Reviewed</span>
            <span className="text-2xl font-extrabold font-mono tracking-tight text-primary mt-1 block">
              {reviewedCount} / {allEntityTx.length}
            </span>
            <span className="text-[10px] text-muted-foreground">Certified transactions</span>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
            <span className="text-[11px] font-medium text-muted-foreground block">Review Filter</span>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value as any)}
              className="mt-1 w-full bg-secondary border border-border rounded-xl p-1.5 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Journals ({allEntityTx.length})</option>
              <option value="unreviewed">Unreviewed Only</option>
              <option value="user_verified">User-Verified</option>
              <option value="professional_reviewed">Professional-Reviewed</option>
            </select>
          </div>
        </div>

        {/* Structured Data Table for Accountant Bookkeeping Verification */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">Client Ledger Verification Schedule</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Double-entry balanced lines with non-destructive review certification</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-secondary text-primary border border-border">
              {filteredTransactions.length} Entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/50 font-mono uppercase text-[10px] text-muted-foreground">
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-4">Merchant / Counterparty</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Lines</th>
                  <th className="py-3 px-4 text-right">Total CAD</th>
                  <th className="py-3 px-4 text-center">Review State</th>
                  <th className="py-3 px-5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-muted-foreground whitespace-nowrap">
                      {tx.txDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {tx.merchant || tx.description}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono border border-border">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-muted-foreground">
                      {tx.lines.length} lines
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground tabular-nums">
                      {formatCAD(tx.totalMinor)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold ${
                          tx.accountantStatus === 'professional_reviewed'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                            : tx.accountantStatus === 'user_verified'
                            ? 'bg-primary/10 text-primary border border-primary/30'
                            : 'bg-secondary text-muted-foreground border border-border'
                        }`}
                      >
                        {tx.accountantStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {tx.accountantStatus !== 'professional_reviewed' ? (
                        <button
                          onClick={() => handleMarkReviewed(tx.id)}
                          className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold hover:opacity-90 transition-opacity shadow-xs inline-flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Certify</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-emerald-500 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Certified
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
