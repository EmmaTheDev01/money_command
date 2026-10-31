'use client';

import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  AlertTriangle 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';

export default function BudgetsPage() {
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;
  const entityBudgets = state.budgets.filter((b) => b.entityId === activeEntity.id);

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <PieChart className="w-6 h-6 text-emerald-500" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Budgets & Spending Guardrails
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono border border-border">
                  Monthly Cadence
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Deterministic threshold alerts without shame or compulsive streak mechanics.
              </p>
            </div>
          </div>

          {/* Budget Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entityBudgets.map((b) => {
              const percent = Math.min(100, Math.round((b.spentMinor / b.amountMinor) * 100));
              const isOverThreshold = percent >= b.alertThresholdPercent;

              return (
                <div
                  key={b.id}
                  className={`rounded-3xl border p-6 space-y-4 bg-card shadow-sm ${
                    isOverThreshold ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-base">{b.category}</h3>
                      <p className="text-xs text-muted-foreground">
                        Threshold alert at {b.alertThresholdPercent}% of limit
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-bold font-mono text-foreground">
                        {formatCAD(b.spentMinor)}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        of {formatCAD(b.amountMinor)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={isOverThreshold ? 'text-amber-500 font-bold' : 'text-emerald-500'}>
                        {percent}% utilized
                      </span>
                      <span className="text-muted-foreground">
                        Remaining: {formatCAD(b.amountMinor - b.spentMinor)}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOverThreshold ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Behaviour Engine Guardrail Alert */}
                  {isOverThreshold && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-foreground flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        <strong>Guardrail Trigger: </strong>
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
