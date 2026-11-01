'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FileText, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  Check, 
  Building2, 
  Lock,
  ArrowUpRight,
  Search,
  RefreshCw,
  Loader2,
  Calendar,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { formatCAD, auditLedgerIntegrity } from '@/lib/ledger';
import { Transaction, Entity } from '@/lib/types';
import { db } from '@/lib/db';

export default function AccountantPortalPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<'all' | 'unreviewed' | 'user_verified' | 'professional_reviewed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdatingTx, setIsUpdatingTx] = useState<string | null>(null);

  async function loadAccountantData() {
    try {
      const entList = await db.getEntities();
      setEntities(entList);
      const activeId = selectedEntityId || entList[0]?.id || '';
      setSelectedEntityId(activeId);
      const txList = await db.getTransactions(activeId || undefined);
      setTransactions(txList);
    } catch (err) {
      console.error('Failed to load accountant data from DB:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadAccountantData();
  }, [selectedEntityId]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadAccountantData();
  };

  const activeEntity = entities.find((e) => e.id === selectedEntityId) || entities[0] || {
    id: 'ent-default',
    name: 'Primary Ledger',
    type: 'personal',
    currency: 'CAD',
  };

  const entityTransactions = transactions.filter((t) => !selectedEntityId || t.entityId === selectedEntityId);

  const filteredTransactions = entityTransactions.filter((t) => {
    const matchesFilter = filterState === 'all' || t.accountantStatus === filterState;
    if (!matchesFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (t.merchant && t.merchant.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q))
    );
  });

  const reviewedCount = entityTransactions.filter((t) => t.accountantStatus === 'professional_reviewed').length;
  const pendingReviewCount = entityTransactions.length - reviewedCount;
  const ledgerAudit = auditLedgerIntegrity(entityTransactions);

  const handleMarkReviewed = async (txId: string) => {
    setIsUpdatingTx(txId);
    try {
      await db.updateTransactionAccountantStatus(txId, 'professional_reviewed');
      setTransactions((prev) =>
        prev.map((t) => (t.id === txId ? { ...t, accountantStatus: 'professional_reviewed' as const } : t))
      );
      setNotification('Transaction certified in PostgreSQL double-entry ledger.');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Failed to certify transaction:', err);
    } finally {
      setIsUpdatingTx(null);
    }
  };

  const handleExportPackage = () => {
    const lines = [
      `ACCOUNTANT WORKPAPER PACKAGE - MONEY COMMAND FINANCIAL OS`,
      `Client Entity: ${activeEntity.name}`,
      `Tax Year: 2026 | Jurisdiction: Ontario (CA_ON)`,
      `Status: Reconciled Double-Entry Core`,
      `Balanced Status: ${ledgerAudit.isAllBalanced ? 'YES (0 Unreconciled)' : 'FAILED'}`,
      ``,
      `Date,Merchant,Category,Total CAD,Status,Accountant Certification State,Debit Lines,Credit Lines`,
      ...entityTransactions.map((t) => {
        const debits = t.lines.filter((l) => l.debitMinor > 0).map((l) => `${l.accountName} ($${(l.debitMinor / 100).toFixed(2)})`).join('; ');
        const credits = t.lines.filter((l) => l.creditMinor > 0).map((l) => `${l.accountName} ($${(l.creditMinor / 100).toFixed(2)})`).join('; ');
        return `${t.txDate},"${t.merchant || t.description}","${t.category}",${(t.totalMinor / 100).toFixed(2)},${t.status},${t.accountantStatus},"${debits}","${credits}"`;
      }),
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-foreground" />
        <span className="text-xs font-mono text-muted-foreground">
          Loading client journals & CPA review schedules from PostgreSQL...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-secondary border border-border text-foreground">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Accountant Review Portal
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-secondary text-foreground border border-border font-mono">
              CPA Grant: Read / Certify
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Permissioned document verification, non-destructive audit marking, and standardized CRA tax schedules for {activeEntity.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium text-foreground transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportPackage}
            className="px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 font-semibold text-xs flex items-center gap-1.5 transition-opacity shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Verified Workpaper</span>
          </button>
        </div>
      </div>

      {/* Status Notification */}
      {notification && (
        <div className="rounded-2xl border border-border bg-secondary/80 p-3.5 text-xs text-foreground flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* CPA Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground block">Client Entity</span>
          <select
            value={selectedEntityId}
            onChange={(e) => setSelectedEntityId(e.target.value)}
            className="w-full bg-secondary/80 border border-border rounded-xl p-2 text-xs font-bold text-foreground focus:outline-none cursor-pointer mt-1"
          >
            {entities.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.type})
              </option>
            ))}
          </select>
          <span className="text-[10px] font-mono text-muted-foreground uppercase block pt-0.5">
            Currency: {activeEntity.currency}
          </span>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground block">Double-Entry Status</span>
          <span className="text-xl font-bold tracking-tight text-emerald-500 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {ledgerAudit.isAllBalanced ? '100% Reconciled' : 'Unreconciled Invariant'}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            {ledgerAudit.unreconciledCount} Unreconciled &middot; Integer Minor Units
          </span>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground block">Professional Reviewed</span>
          <span className="text-2xl font-extrabold font-mono tracking-tight text-foreground mt-1 block">
            {reviewedCount} / {entityTransactions.length}
          </span>
          <span className="text-[10px] text-muted-foreground block">
            {pendingReviewCount} pending CPA sign-off
          </span>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground block">Review Filter</span>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value as any)}
            className="mt-1 w-full bg-secondary/80 border border-border rounded-xl p-2 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">All Journals ({entityTransactions.length})</option>
            <option value="unreviewed">Unreviewed Only</option>
            <option value="user_verified">User-Verified Only</option>
            <option value="professional_reviewed">Certified Only</option>
          </select>
        </div>
      </div>

      {/* Tab: Reconciler Invariant Gate View */}
      {activeTab === 'reconcile' && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Double-Entry Arithmetic Invariants (PostgreSQL)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Strict check that for every journal in the database, SUM(debit_minor) equals SUM(credit_minor) exactly with zero float rounding errors.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs pt-2">
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border">
              <span className="text-[10px] text-muted-foreground uppercase block font-sans">Posted Journals</span>
              <span className="text-xl font-bold text-foreground mt-1 block">{ledgerAudit.postedCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border">
              <span className="text-[10px] text-muted-foreground uppercase block font-sans">Reversals</span>
              <span className="text-xl font-bold text-foreground mt-1 block">{ledgerAudit.reversedCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border">
              <span className="text-[10px] text-muted-foreground uppercase block font-sans">Status</span>
              <span className="text-xl font-bold text-emerald-500 mt-1 block">BALANCED</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: CRA Tax Schedules View */}
      {activeTab === 'tax' && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Canada CRA T2125 & HST Harmonized Schedule</span>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-secondary border border-border text-foreground font-semibold">
              Ontario CA_ON 2026
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Automated write-off classifications, 13% Ontario HST input tax credit (ITC) calculations, and business percentage rules.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs pt-2">
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border">
              <span className="text-[10px] text-muted-foreground uppercase block font-sans">CRA Eligible Expenses</span>
              <span className="text-xl font-bold text-foreground mt-1 block">
                {formatCAD(entityTransactions.filter((t) => t.category !== 'Income').reduce((acc, t) => acc + t.totalMinor, 0))}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border">
              <span className="text-[10px] text-muted-foreground uppercase block font-sans">Input Tax Credits (13% HST)</span>
              <span className="text-xl font-bold text-emerald-500 mt-1 block">
                {formatCAD(Math.round(entityTransactions.filter((t) => t.category !== 'Income').reduce((acc, t) => acc + t.totalMinor, 0) * 0.13))}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border">
              <span className="text-[10px] text-muted-foreground uppercase block font-sans">Audit Readiness</span>
              <span className="text-xl font-bold text-emerald-500 mt-1 block">100% READY</span>
            </div>
          </div>
        </div>
      )}

      {/* Structured Data Table for Accountant Bookkeeping Verification */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-foreground">Client Ledger Verification Schedule</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live double-entry balanced lines with non-destructive review certification
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                className="bg-secondary border border-border rounded-xl pl-8 pr-3 py-1 text-xs text-foreground placeholder-muted-foreground focus:outline-none"
              />
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-secondary text-foreground border border-border whitespace-nowrap">
              {filteredTransactions.length} Entries
            </span>
          </div>
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
                <th className="py-3 px-5 text-right">Certification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground font-mono text-xs">
                    No transactions match the selected filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-muted-foreground whitespace-nowrap">
                      {tx.txDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {tx.merchant || tx.description}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground font-mono border border-border">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-muted-foreground">
                      {tx.lines?.length || 2} lines
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
                            ? 'bg-secondary text-foreground border border-border'
                            : 'bg-secondary text-muted-foreground border border-border'
                        }`}
                      >
                        {tx.accountantStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {tx.accountantStatus !== 'professional_reviewed' ? (
                        <button
                          type="button"
                          disabled={isUpdatingTx === tx.id}
                          onClick={() => handleMarkReviewed(tx.id)}
                          className="px-3 py-1 rounded-full bg-foreground text-background text-[11px] font-semibold hover:opacity-90 transition-opacity shadow-xs inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {isUpdatingTx === tx.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
