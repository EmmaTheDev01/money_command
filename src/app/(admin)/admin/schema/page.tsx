'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Copy, 
  CheckCircle2, 
  Table, 
  ShieldCheck, 
  FileCode,
  Download
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { auditLedgerIntegrity } from '@/lib/ledger';

export default function AdminSchemaPage() {
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const ledgerAudit = auditLedgerIntegrity(state.transactions);

  const tables = [
    { name: 'tenants', purpose: 'Multi-tenant organization boundary and billing tier', rows: '1 active' },
    { name: 'users', purpose: 'Tenant-scoped users, roles, and WhatsApp binding credentials', rows: '1 owner' },
    { name: 'entities', purpose: 'Personal vs Sole Proprietorship vs Corporation context', rows: '2 entities' },
    { name: 'accounts', purpose: 'Double-entry Chart of Accounts with exact integer minor units', rows: '11 accounts' },
    { name: 'transactions', purpose: 'Immutable posted journal core (MC-010 reversals only)', rows: `${state.transactions.length} journals` },
    { name: 'transaction_lines', purpose: 'Opposing debit/credit lines (debit_minor = credit_minor)', rows: '24+ lines' },
    { name: 'proposals', purpose: 'AI/OCR extracted candidates awaiting user review and confirmation', rows: `${state.proposals.length} proposals` },
    { name: 'source_events', purpose: 'Inbound raw Meta WhatsApp webhooks with provider ID replay checks', rows: 'Replay safe' },
    { name: 'documents', purpose: 'Encrypted receipt and statement files with SHA-256 integrity hash', rows: 'AES-GCM-256' },
    { name: 'budgets', purpose: 'Monthly spending allocations and threshold alert guardrails', rows: '3 active' },
    { name: 'safe_to_spend_configs', purpose: 'Deterministic formula inputs: buffer, horizon, obligations, tax reserve', rows: 'Configured' },
    { name: 'obligations', purpose: 'Protected essential expenses (rent, utilities, debt minimums)', rows: '3 obligations' },
    { name: 'subscriptions', purpose: 'Recurring charges, renewal dates, price delta, and cancellation route', rows: '4 tracked' },
    { name: 'actions', purpose: 'Consequential action state machine with material terms shown', rows: 'Permissioned' },
    { name: 'authorizations', purpose: 'Cryptographic terms_hash, step-up MFA tokens, and explicit approval scopes', rows: 'Immutable' },
    { name: 'tax_profiles', purpose: 'Ontario CRA tax year profile, 13% HST, and T2125/T1 categories', rows: 'CA_ON 2026' },
  ];

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-foreground" />
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  Supabase PostgreSQL Financial Schema
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-foreground font-mono font-semibold border border-border">
                  16 Tables Ready
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Schema file located at <code>supabase/schema.sql</code> and seed at <code>supabase/seed.sql</code>.
              </p>
            </div>
          </div>

          {/* Tables Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {tables.map((t) => (
              <div key={t.name} className="p-4 rounded-2xl border border-border bg-card space-y-1.5 text-xs shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground">{t.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{t.rows}</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {t.purpose}
                </p>
              </div>
            ))}
          </div>

          {/* Invariant Rules Information */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-foreground" />
              PostgreSQL Triggers & Invariant Enforcement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-1.5">
                <span className="text-foreground font-bold block">1. verify_transaction_balance()</span>
                <p className="text-muted-foreground font-sans text-[11px] leading-relaxed">
                  Enforces that for any posted transaction, <code>SUM(debit_minor) == SUM(credit_minor)</code>. Imbalanced entries are rejected before commit.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-1.5">
                <span className="text-foreground font-bold block">2. protect_posted_transaction() (MC-010)</span>
                <p className="text-muted-foreground font-sans text-[11px] leading-relaxed">
                  Prevents direct SQL updates to amounts, currencies, or accounts of posted transactions. Corrections must occur through linked reversal journals.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
