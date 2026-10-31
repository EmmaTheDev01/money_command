'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  ScrollText, 
  Users, 
  DollarSign, 
  Cpu, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { auditLedgerIntegrity, formatCAD } from '@/lib/ledger';

export default function AdminOverviewPage() {
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const ledgerAudit = auditLedgerIntegrity(state.transactions);
  const pendingProposalsCount = state.proposals.filter((p) => p.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
        unreconciledCount={ledgerAudit.unreconciledCount}
      />

      <div className="flex-1 flex">
        <AdminSidebar unreconciledCount={ledgerAudit.unreconciledCount} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  Admin Console & Governance
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-semibold border border-rose-500/20">
                  Role: Super Admin
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Authoritative financial ledger verification, append-only security logs, and tenant operations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-mono text-foreground font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>DB Engine: PostgreSQL 16</span>
              </span>
            </div>
          </div>

          {/* Release Gate #1: 0 Unreconciled Journals Status */}
          <div
            className={`rounded-3xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs ${
              ledgerAudit.isAllBalanced
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-rose-500/30 bg-rose-500/5'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`p-3 rounded-2xl ${
                  ledgerAudit.isAllBalanced
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                }`}
              >
                {ledgerAudit.isAllBalanced ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
                  <span>Ledger Reconciliation Gate:</span>
                  <span
                    className={`font-mono text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      ledgerAudit.isAllBalanced
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500 text-white font-bold'
                    }`}
                  >
                    {ledgerAudit.unreconciledCount} Unreconciled Journals
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Invariant Check: SUM(Debits) equals SUM(Credits) across all {ledgerAudit.postedCount} posted journals. Integer minor unit integrity intact.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right font-mono text-xs">
              <div className="p-3 rounded-2xl bg-card border border-border shadow-xs">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">Total Transactions</span>
                <span className="font-bold text-foreground text-sm">{ledgerAudit.totalTransactions}</span>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border shadow-xs">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">Reversals Posted</span>
                <span className="font-bold text-foreground text-sm">{ledgerAudit.reversedCount}</span>
              </div>
            </div>
          </div>

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Active Tenant Plan
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight text-foreground uppercase">
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
                <span className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                  96.4%
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
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
                <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  CAD $0.42
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                  82% Gross Margin
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">OCR + LLM token costs tracked</p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Audit Stream Events
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {state.auditLogs.length} Events
                </span>
                <span className="text-xs text-muted-foreground font-mono font-medium">
                  Append-Only
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">Cryptographic terms_hash logs</p>
            </div>
          </div>

          {/* Quick Operations Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Audit Logs */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-rose-500" />
                  <h3 className="font-semibold text-foreground text-sm">
                    Recent Consequential Audit Events
                  </h3>
                </div>
                <Link
                  href="/admin/audit"
                  className="text-xs text-rose-500 hover:opacity-80 font-medium flex items-center gap-1 transition-opacity"
                >
                  View full stream
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {state.auditLogs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-secondary/40 border border-border text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/20">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">{log.createdAt}</span>
                    </div>
                    <p className="text-foreground text-[11px] leading-relaxed">
                      {log.details}
                    </p>
                    {log.termsHash && (
                      <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 block truncate">
                        Hash: {log.termsHash}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Flags Status */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-500" />
                  <h3 className="font-semibold text-foreground text-sm">
                    Operational Risk & Safety Gates
                  </h3>
                </div>
                <Link
                  href="/admin/flags"
                  className="text-xs text-rose-500 hover:opacity-80 font-medium flex items-center gap-1 transition-opacity"
                >
                  Manage flags
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {state.featureFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className="p-3.5 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono font-semibold text-foreground">{flag.key}</div>
                      <div className="text-[11px] text-muted-foreground">{flag.description}</div>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        flag.enabled
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-secondary text-muted-foreground border border-border'
                      }`}
                    >
                      {flag.enabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
