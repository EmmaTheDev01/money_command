'use client';

import React, { useState } from 'react';
import { 
  WalletCards, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  Sliders, 
  Info,
  DollarSign
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';

export default function PaycheckPlannerPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];

  const [paycheckTotalDollars, setPaycheckTotalDollars] = useState('4750.00');
  const paycheckMinor = Math.round(parseFloat(paycheckTotalDollars) * 100) || 0;

  const allocatedMinor = state.paycheckPlan.reduce((sum, item) => sum + item.allocatedMinor, 0);
  const remainingToZeroMinor = paycheckMinor - allocatedMinor;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <div className="flex-1 flex">
        <ClientSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-secondary text-primary">
                  <WalletCards className="w-5 h-5" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Paycheck Planner
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Zero-based budgeting. Plan every dollar of your upcoming income before you spend.
              </p>
            </div>
          </div>

          {/* Zero-Based Status Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Incoming Paycheck Amount
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold font-mono text-muted-foreground">CAD $</span>
                <input
                  type="number"
                  step="0.01"
                  value={paycheckTotalDollars}
                  onChange={(e) => setPaycheckTotalDollars(e.target.value)}
                  className="text-3xl sm:text-4xl font-extrabold font-mono text-foreground bg-secondary/60 border border-border px-3 py-1.5 rounded-2xl w-52 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-secondary/70 border border-border text-right min-w-[220px]">
              <span className="text-[10px] text-muted-foreground uppercase font-mono block">Left to Assign</span>
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${
                remainingToZeroMinor === 0 ? 'text-primary' : 'text-foreground'
              }`}>
                {formatCAD(remainingToZeroMinor)}
              </span>
              <div className="flex items-center justify-end gap-1 text-[11px] font-medium text-muted-foreground mt-1">
                {remainingToZeroMinor === 0 ? (
                  <span className="text-primary flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Every dollar assigned (Zero-based goal achieved!)
                  </span>
                ) : (
                  <span>Assign until CAD $0.00 remains</span>
                )}
              </div>
            </div>
          </div>

          {/* Allocated Categories List */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-foreground">Budget Allocation Categories</h3>
              <span className="text-xs font-mono font-bold text-primary">
                Total Allocated: {formatCAD(allocatedMinor)}
              </span>
            </div>

            <div className="space-y-3 divide-y divide-border">
              {state.paycheckPlan.map((item) => {
                const percentSpent = Math.min(100, Math.round((item.spentMinor / item.allocatedMinor) * 100));

                return (
                  <div key={item.id} className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1 sm:w-1/3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{item.category}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                          {item.type}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-[11px]">
                        Spent: {formatCAD(item.spentMinor)} of {formatCAD(item.allocatedMinor)}
                      </span>
                    </div>

                    <div className="sm:w-1/3">
                      <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden border border-border/40">
                        <div
                          className="h-full rounded-full transition-all bg-primary"
                          style={{ width: `${percentSpent}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right sm:w-1/4 font-mono font-bold text-sm text-foreground">
                      {formatCAD(item.allocatedMinor)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

