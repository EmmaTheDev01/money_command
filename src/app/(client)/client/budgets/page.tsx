'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PieChart, 
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { db } from '@/lib/db';

export default function BudgetsPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    const session = db.getCurrentSession();
    if (!session) {
      router.push('/login?redirect=/client/budgets');
      return;
    }

    async function load() {
      const activeId = state.selectedEntityId;
      const [budgets, txs] = await Promise.all([
        db.getBudgets(activeId),
        db.getTransactions(activeId),
      ]);
      setState((prev) => ({ ...prev, budgets, transactions: txs }));
    }
    load();
  }, [router, state.selectedEntityId]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0] || {
    id: 'ent-default',
    name: 'Primary Ledger',
  };
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;
  const entityBudgets = state.budgets.filter((b) => b.entityId === activeEntity.id);
  const entityTransactions = state.transactions.filter((t) => t.entityId === activeEntity.id && t.type === 'expense');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
        pendingProposalsCount={pendingProposalsCount}
      />

      <div className="flex-1 flex">
        <ClientSidebar pendingProposalsCount={pendingProposalsCount} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-secondary text-foreground">
                  <PieChart className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Budgets & Spending Guardrails
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono border border-border">
                  Monthly Cadence
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Deterministic threshold alerts without shame or compulsive streak mechanics for <strong className="text-foreground">{activeEntity.name}</strong>.
              </p>
            </div>
          </div>

          {/* Budget Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entityBudgets.map((b) => {
              // Calculate actual dynamic spent from transactions for this category
              const txSpent = entityTransactions
                .filter((t) => t.category.toLowerCase().includes(b.category.toLowerCase().slice(0, 4)))
                .reduce((sum, t) => sum + t.totalMinor, 0);

              const effectiveSpentMinor = txSpent > 0 ? txSpent : b.spentMinor;
              const percent = Math.min(100, Math.round((effectiveSpentMinor / b.amountMinor) * 100));
              const isOverThreshold = percent >= b.alertThresholdPercent;

              return (
                <div
                  key={b.id}
                  className="rounded-3xl border border-border p-6 space-y-4 bg-card shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-base">{b.category}</h3>
                      <p className="text-xs text-muted-foreground">
                        Threshold alert at {b.alertThresholdPercent}% of limit
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-bold font-mono text-foreground tabular-nums">
                        {formatCAD(effectiveSpentMinor)}
                      </span>
                      <span className="text-xs text-muted-foreground block font-mono">
                        of {formatCAD(b.amountMinor)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar with Standard App Colors */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={`font-semibold tabular-nums ${isOverThreshold ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {percent}% utilized
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        Remaining: {formatCAD(Math.max(0, b.amountMinor - effectiveSpentMinor))}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOverThreshold ? 'bg-orange-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Behaviour Engine Guardrail Alert */}
                  {isOverThreshold && (
                    <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-foreground flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>
                        <strong className="text-orange-500">Guardrail Trigger: </strong>
                        You have crossed {b.alertThresholdPercent}% of your {b.category} allocation. Suggest slowing discretionary spend until next payday.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
