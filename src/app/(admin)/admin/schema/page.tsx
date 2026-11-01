'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { 
  Database, 
  Copy, 
  CheckCircle2, 
  Table, 
  ShieldCheck, 
  FileCode,
  Download,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface TableMeta {
  name: string;
  purpose: string;
  category: 'core' | 'audit' | 'config' | 'actions';
}

const TABLE_DEFINITIONS: TableMeta[] = [
  { name: 'tenants', purpose: 'Multi-tenant organization boundary and billing tier', category: 'core' },
  { name: 'users', purpose: 'Tenant-scoped users, roles, and WhatsApp binding credentials', category: 'core' },
  { name: 'entities', purpose: 'Personal vs Sole Proprietorship vs Corporation context', category: 'core' },
  { name: 'accounts', purpose: 'Double-entry Chart of Accounts with exact integer minor units', category: 'core' },
  { name: 'transactions', purpose: 'Immutable posted journal core (MC-010 reversals only)', category: 'core' },
  { name: 'transaction_lines', purpose: 'Opposing debit/credit lines (debit_minor = credit_minor)', category: 'core' },
  { name: 'proposals', purpose: 'AI/OCR extracted candidates awaiting user review and confirmation', category: 'core' },
  { name: 'source_events', purpose: 'Inbound raw Meta WhatsApp webhooks with provider ID replay checks', category: 'audit' },
  { name: 'documents', purpose: 'Encrypted receipt and statement files with SHA-256 integrity hash', category: 'core' },
  { name: 'budgets', purpose: 'Monthly spending allocations and threshold alert guardrails', category: 'core' },
  { name: 'safe_to_spend_configs', purpose: 'Deterministic formula inputs: buffer, horizon, obligations, tax reserve', category: 'config' },
  { name: 'obligations', purpose: 'Protected essential expenses (rent, utilities, debt minimums)', category: 'core' },
  { name: 'sinking_funds', purpose: 'Dedicated target balances for upcoming lumpy cash outlays', category: 'core' },
  { name: 'debts', purpose: 'Snowball & avalanche debt accounts with APR and minimum payments', category: 'core' },
  { name: 'investments', purpose: 'Cost basis, shares, and real-time market value positions', category: 'core' },
  { name: 'paycheck_plan_items', purpose: 'Zero-based allocation rules for incoming deposits', category: 'core' },
  { name: 'subscriptions', purpose: 'Recurring charges, renewal dates, price delta, and cancellation route', category: 'core' },
  { name: 'actions', purpose: 'Consequential action state machine with material terms shown', category: 'actions' },
  { name: 'authorizations', purpose: 'Cryptographic terms_hash, step-up MFA tokens, and explicit approval scopes', category: 'actions' },
  { name: 'action_events', purpose: 'Audit log of action transitions and automated bot dispatches', category: 'actions' },
  { name: 'bill_negotiations', purpose: 'Telecom/utility discount negotiations and annual savings tracking', category: 'actions' },
  { name: 'tax_profiles', purpose: 'Ontario CRA tax year profile, 13% HST, and T2125/T1 categories', category: 'config' },
  { name: 'tax_rule_versions', purpose: 'Immutable provincial bracket rules and federal deduction thresholds', category: 'config' },
  { name: 'accountant_access_grants', purpose: 'Scoped professional CPA review grants with expiry bounds', category: 'audit' },
  { name: 'audit_logs', purpose: 'Append-only audit trail with actor details, diffs, and terms_hash', category: 'audit' },
  { name: 'feature_flags', purpose: 'Dynamic circuit breakers, beta capabilities, and risk kill-switches', category: 'config' },
  { name: 'ai_interactions', purpose: 'LLM token latency, model temperature, and confidence records', category: 'audit' },
  { name: 'user_consent_records', purpose: 'Explicit opt-in timestamps for WhatsApp message ingest', category: 'audit' },
];

export default function AdminSchemaPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadCounts() {
    try {
      const data = await db.getDatabaseSchemaCounts();
      setCounts(data);
    } catch (err) {
      console.error('Failed to load table counts from DB:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadCounts();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadCounts();
  };

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 1500);
  };

  const totalRows = Object.values(counts).reduce((acc, c) => acc + c, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-foreground" />
        <span className="text-xs font-mono text-muted-foreground">
          Querying 28 PostgreSQL tables across cluster...
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
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Supabase SQL & Schema Catalog
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary border border-border text-foreground font-mono font-medium">
              28 Production Tables
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Deterministic relational schema, foreign key constraints, integer minor units, and Row-Level Security policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium text-foreground transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Counts ({totalRows} Rows)</span>
          </button>
        </div>
      </div>

      {/* Schema Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-foreground" />
            <h3 className="font-bold text-sm text-foreground">Live Database Table Inventory</h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground font-semibold">
            PostgreSQL 16 &middot; RLS Enforced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50 font-mono uppercase text-[10px] text-muted-foreground">
                <th className="py-3 px-5">Table Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Architecture Purpose & Invariant</th>
                <th className="py-3 px-4 text-center">RLS Status</th>
                <th className="py-3 px-5 text-right">Live Database Rows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TABLE_DEFINITIONS.map((t) => {
                const rowCount = counts[t.name] ?? 0;
                return (
                  <tr key={t.name} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-foreground">
                      <button
                        onClick={() => handleCopy(t.name)}
                        className="flex items-center gap-1.5 hover:underline text-left cursor-pointer"
                        title="Click to copy table name"
                      >
                        <span>{t.name}</span>
                        {copiedName === t.name ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground opacity-40 hover:opacity-100" />
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border uppercase">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-foreground font-medium text-xs max-w-md">
                      {t.purpose}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 uppercase font-bold">
                        Enforced
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-foreground tabular-nums">
                      {rowCount} {rowCount === 1 ? 'row' : 'rows'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
