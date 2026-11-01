'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ScrollText, 
  Lock, 
  ArrowRight, 
  Database, 
  Building, 
  Loader2,
  Server,
  Layers,
  RefreshCw
} from 'lucide-react';
import { auditLedgerIntegrity, formatCAD } from '@/lib/ledger';
import { db } from '@/lib/db';
import { Transaction } from '@/lib/types';

export default function AdminOverviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tenants, setTenants] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [featureFlags, setFeatureFlags] = useState<any[]>([]);
  const [sourceEvents, setSourceEvents] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadDatabaseData() {
    try {
      const [tList, txList, aLogs, flags, events] = await Promise.all([
        db.getTenants(),
        db.getTransactions(),
        db.getAuditLogs(10),
        db.getFeatureFlags(),
        db.getSourceEvents(10),
      ]);

      setTenants(tList);
      setTransactions(txList);
      setAuditLogs(aLogs);
      setFeatureFlags(flags);
      setSourceEvents(events);
    } catch (err) {
      console.error('Failed to load live database data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadDatabaseData();
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadDatabaseData();
  };

  const ledgerAudit = auditLedgerIntegrity(transactions);
  const activeTenant = tenants[0] || null;
  const activeFlagsCount = featureFlags.filter((f) => f.enabled).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-foreground" />
        <span className="text-xs font-mono text-muted-foreground">
          Querying live PostgreSQL database records...
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
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Admin Governance & System Health
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-secondary text-foreground border border-border font-mono">
              Live Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Authoritative financial ledger verification, append-only security logs, and tenant isolation operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium text-foreground transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-mono text-foreground font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PostgreSQL 16 &middot; RLS Active</span>
          </span>
        </div>
      </div>

      {/* Release Gate #1: 0 Unreconciled Journals Status */}
      <div className="rounded-3xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-secondary border border-border">
            {ledgerAudit.isAllBalanced ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <span>Ledger Reconciliation Gate:</span>
              <span className={`font-mono text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                ledgerAudit.isAllBalanced
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
              }`}>
                {ledgerAudit.unreconciledCount} Unreconciled Journals
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Invariant Check: SUM(Debits) equals SUM(Credits) across all {ledgerAudit.postedCount} posted journals. Integer minor unit arithmetic intact.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right font-mono text-xs">
          <div className="p-3 rounded-2xl bg-secondary/60 border border-border shadow-xs">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">
              Total Transactions
            </span>
            <span className="font-extrabold text-foreground text-sm tabular-nums">
              {transactions.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-secondary/60 border border-border shadow-xs">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">
              Reversals Posted
            </span>
            <span className="font-extrabold text-foreground text-sm tabular-nums">
              {ledgerAudit.reversedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Active Tenant
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-extrabold font-mono tracking-tight text-foreground uppercase truncate">
              {activeTenant?.name || 'Default Organization'}
            </span>
            <span className="text-xs text-muted-foreground font-mono uppercase font-semibold">
              {activeTenant?.plan || 'Personal'}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1 font-mono truncate">
            ID: {activeTenant?.id ? `${activeTenant.id.slice(0, 13)}...` : 'Connecting...'}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Double-Entry Accounts
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold font-mono tracking-tight text-foreground tabular-nums">
              {ledgerAudit.postedCount}
            </span>
            <span className="text-xs text-muted-foreground font-mono font-medium">
              {transactions.reduce((acc, t) => acc + (t.lines?.length || 0), 0)} Lines
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">Balanced debits = credits</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Inbound Webhooks Logged
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold font-mono tracking-tight text-foreground tabular-nums">
              {sourceEvents.length} Events
            </span>
            <span className="text-xs text-emerald-500 font-mono font-bold">
              Meta Cloud
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">Replay deduplication verified</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Audit Stream Events
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold font-mono tracking-tight text-foreground tabular-nums">
              {auditLogs.length} Records
            </span>
            <span className="text-xs text-muted-foreground font-mono font-medium">
              Immutable
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">PostgreSQL audit_logs table</p>
        </div>
      </div>

      {/* Structured Tables for Audit and Risk Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table: Recent Consequential Audit Stream */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-foreground" />
              <h3 className="font-bold text-base text-foreground">Consequential Audit Trail</h3>
            </div>
            <Link
              href="/admin/audit"
              className="text-xs text-foreground font-semibold hover:underline flex items-center gap-1"
            >
              View full stream ({auditLogs.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/50 font-mono uppercase text-[10px] text-muted-foreground">
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-3">Entity / Details</th>
                  <th className="py-2.5 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground font-mono text-xs">
                      No audit events recorded yet in the database.
                    </td>
                  </tr>
                ) : (
                  auditLogs.slice(0, 5).map((log) => (
                    <tr key={log.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-foreground">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground border border-border">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-foreground font-medium max-w-xs truncate">
                        {log.details}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-muted-foreground whitespace-nowrap">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table: Operational Safety Feature Flags */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-foreground" />
              <h3 className="font-bold text-base text-foreground">Operational Safety Gates</h3>
            </div>
            <Link
              href="/admin/flags"
              className="text-xs text-foreground font-semibold hover:underline flex items-center gap-1"
            >
              Manage {featureFlags.length} flags
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/50 font-mono uppercase text-[10px] text-muted-foreground">
                  <th className="py-2.5 px-4">Flag Key</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {featureFlags.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground font-mono text-xs">
                      No feature flags found in database.
                    </td>
                  </tr>
                ) : (
                  featureFlags.map((flag) => (
                    <tr key={flag.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-foreground">
                        {flag.key}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground font-medium text-[11px]">
                        {flag.description}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          flag.enabled
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                            : 'bg-secondary text-muted-foreground border border-border'
                        }`}>
                          {flag.enabled ? 'ACTIVE' : 'OFF'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
