'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Landmark, 
  DollarSign, 
  PieChart 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { db } from '@/lib/db';

export default function NetWorthPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    const session = db.getCurrentSession();
    if (!session) {
      router.push('/login?redirect=/client/net-worth');
      return;
    }

    async function load() {
      const activeId = state.selectedEntityId;
      const [accounts, investments, sinkingFunds, debts] = await Promise.all([
        db.getAccounts(activeId),
        db.getInvestments(activeId),
        db.getSinkingFunds(activeId),
        db.getDebts(activeId),
      ]);
      setState((prev) => ({
        ...prev,
        accounts,
        investments,
        sinkingFunds,
        debts,
      }));
    }
    load();
  }, [router, state.selectedEntityId]);
  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0] || {
    id: 'ent-default',
    name: 'Primary Ledger',
  };

  // Assets
  const liquidCash = state.accounts
    .filter((a) => a.entityId === activeEntity.id && a.type === 'asset')
    .reduce((sum, a) => sum + Math.max(0, a.balanceMinor), 0);

  const investments = state.investments
    .filter((i) => i.entityId === activeEntity.id)
    .reduce((sum, i) => sum + i.currentValueMinor, 0);

  const sinkingFunds = state.sinkingFunds
    .filter((s) => s.entityId === activeEntity.id)
    .reduce((sum, s) => sum + s.currentMinor, 0);

  const totalAssets = liquidCash + investments + sinkingFunds;

  // Liabilities
  const totalDebts = state.debts
    .filter((d) => d.entityId === activeEntity.id)
    .reduce((sum, d) => sum + d.balanceMinor, 0);

  const accountLiabilities = state.accounts
    .filter((a) => a.entityId === activeEntity.id && a.type === 'liability')
    .reduce((sum, a) => sum + Math.max(0, a.balanceMinor), 0);

  const totalLiabilities = totalDebts + accountLiabilities;
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background">
      <Navbar />

      <div className="flex-1 flex">
        <ClientSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-secondary text-foreground">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Net Worth Tracker
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Consolidated balance sheet of all assets and liabilities in tabular format.
              </p>
            </div>
          </div>

          {/* Big Net Worth Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Total Consolidated Net Worth
              </span>
              <div className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground font-mono tabular-nums">
                {formatCAD(netWorth)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold pt-1">
                <ArrowUpRight className="w-4 h-4" />
                <span>+8.4% since last quarter</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-secondary border border-border text-right min-w-[150px]">
                <span className="text-[10px] text-muted-foreground uppercase font-mono block">Total Assets</span>
                <span className="text-xl font-bold font-mono text-foreground tabular-nums">
                  +{formatCAD(totalAssets)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-secondary border border-border text-right min-w-[150px]">
                <span className="text-[10px] text-muted-foreground uppercase font-mono block">Total Liabilities</span>
                <span className="text-xl font-bold font-mono text-muted-foreground tabular-nums">
                  -{formatCAD(totalLiabilities)}
                </span>
              </div>
            </div>
          </div>

          {/* Balance Sheet Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assets Table */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-foreground" />
                  <h3 className="font-bold text-base text-foreground">Assets Schedule</h3>
                </div>
                <span className="font-mono text-xs font-bold text-foreground">{formatCAD(totalAssets)}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary font-mono uppercase text-[10px] text-muted-foreground">
                      <th className="py-2.5 px-4">Asset Class</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-4 text-right">Balance CAD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {state.accounts.filter(a => a.entityId === activeEntity.id && a.type === 'asset').map(acc => (
                      <tr key={acc.id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-foreground capitalize">{acc.subtype || 'Cash'}</td>
                        <td className="py-3 px-3 text-foreground font-medium">{acc.name}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-foreground tabular-nums">{formatCAD(acc.balanceMinor)}</td>
                      </tr>
                    ))}
                    {state.investments.filter(i => i.entityId === activeEntity.id).map(inv => (
                      <tr key={inv.id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-foreground uppercase">{inv.assetClass}</td>
                        <td className="py-3 px-3 text-foreground font-medium">{inv.name}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-foreground tabular-nums">{formatCAD(inv.currentValueMinor)}</td>
                      </tr>
                    ))}
                    {state.sinkingFunds.filter(s => s.entityId === activeEntity.id).map(sink => (
                      <tr key={sink.id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-foreground">Sinking Fund</td>
                        <td className="py-3 px-3 text-foreground font-medium">{sink.name}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-foreground tabular-nums">{formatCAD(sink.currentMinor)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-border bg-secondary font-semibold font-mono text-xs">
                      <td colSpan={2} className="py-3 px-4 text-foreground">Total Assets</td>
                      <td className="py-3 px-4 text-right text-foreground font-bold tabular-nums">+{formatCAD(totalAssets)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Liabilities Table */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-bold text-base text-foreground">Liabilities Schedule</h3>
                </div>
                <span className="font-mono text-xs font-bold text-muted-foreground">-{formatCAD(totalLiabilities)}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary font-mono uppercase text-[10px] text-muted-foreground">
                      <th className="py-2.5 px-4">Liability Class</th>
                      <th className="py-2.5 px-3">Creditor / Account</th>
                      <th className="py-2.5 px-3 text-right">APR</th>
                      <th className="py-2.5 px-4 text-right">Balance CAD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {state.debts.filter(d => d.entityId === activeEntity.id).map(debt => (
                      <tr key={debt.id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-muted-foreground uppercase">{debt.type.replace('_', ' ')}</td>
                        <td className="py-3 px-3 text-foreground font-medium">{debt.name}</td>
                        <td className="py-3 px-3 text-right font-mono text-muted-foreground">{debt.interestRate}%</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-muted-foreground tabular-nums">-{formatCAD(debt.balanceMinor)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-border bg-secondary font-semibold font-mono text-xs">
                      <td colSpan={3} className="py-3 px-4 text-foreground">Total Liabilities</td>
                      <td className="py-3 px-4 text-right text-muted-foreground font-bold tabular-nums">-{formatCAD(totalLiabilities)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
