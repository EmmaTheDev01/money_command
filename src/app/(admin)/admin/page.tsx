'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  KeyRound 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { auditLedgerIntegrity, formatCAD } from '@/lib/ledger';
import { db } from '@/lib/db';

export default function AdminOverviewPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    const session = db.getCurrentSession();
    if (!session) {
      router.push('/login?redirect=/admin');
    }
  }, [router]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const ledgerAudit = auditLedgerIntegrity(state.transactions);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <div className="flex-1 flex">
        <AdminSidebar unreconciledCount={ledgerAudit.unreconciledCount} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-secondary text-primary">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Admin Governance & System Health
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-primary border border-border">
                  Super Admin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Authoritative financial ledger verification, append-only security logs, and tenant isolation operations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-mono text-foreground font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>DB Engine: PostgreSQL 16</span>
              </span>
            </div>
          </div>

          {/* Release Gate #1: 0 Unreconciled Journals Status */}
          <div className="rounded-3xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-secondary text-primary border border-border">
                {ledgerAudit.isAllBalanced ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                  <span>Ledger Reconciliation Gate:</span>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full font-bold bg-secondary text-primary border border-border">
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
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">Total Transactions</span>
                <span className="font-extrabold text-foreground text-sm tabular-nums">{ledgerAudit.totalTransactions}</span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/60 border border-border shadow-xs">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">Reversals Posted</span>
                <span className="font-extrabold text-foreground text-sm tabular-nums">{ledgerAudit.reversedCount}</span>
              </div>
            </div>
          </div>

          {/* Operational Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Active Tenant Plan
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold font-mono tracking-tight text-foreground uppercase">
                  {state.currentTenant.plan}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  CAD $10/mo
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">Tenant: {state.currentTenant.name}</p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                AI Extraction Benchmark
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold font-mono tracking-tight text-emerald-500 tabular-nums">
                  96.4%
                </span>
                <span className="text-xs text-muted-foreground font-mono font-medium">
                  Target: &ge;95%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">Abstentions routed to review</p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Model COGS / Active User
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold font-mono tracking-tight text-foreground tabular-nums">
                  CAD $0.42
                </span>
                <span className="text-xs text-primary font-mono font-bold">
                  82% Margin
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">OCR + LLM token costs tracked</p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Audit Stream Events
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold font-mono tracking-tight text-foreground tabular-nums">
                  {state.auditLogs.length} Events
                </span>
                <span className="text-xs text-muted-foreground font-mono font-medium">
                  Append-Only
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">Cryptographic terms_hash logs</p>
            </div>
          </div>

          {/* Structured Tables for Audit and Risk Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table: Recent Consequential Audit Stream */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-base text-foreground">Consequential Audit Trail</h3>
                </div>
                <Link
                  href="/admin/audit"
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  View full stream
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 font-mono uppercase text-[10px] text-muted-foreground">
                      <th className="py-2.5 px-4">Action</th>
                      <th className="py-2.5 px-3">Details</th>
                      <th className="py-2.5 px-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {state.auditLogs.slice(0, 4).map((log) => (
                      <tr key={log.id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-primary">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground border border-border">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-foreground font-medium max-w-xs truncate">
                          {log.details}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-muted-foreground whitespace-nowrap">
                          {log.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table: Operational Safety Feature Flags */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-base text-foreground">Operational Safety Gates</h3>
                </div>
                <Link
                  href="/admin/flags"
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  Manage flags
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
                    {state.featureFlags.map((flag) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
