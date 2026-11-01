'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  Sparkles, 
  LineChart, 
  Coins, 
  DollarSign,
  Download,
  Filter
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';

export default function InvestmentsPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const investments = state.investments.filter((i) => i.entityId === activeEntity.id);

  const totalValue = investments.reduce((sum, i) => sum + i.currentValueMinor, 0);
  const totalCost = investments.reduce((sum, i) => sum + i.costBasisMinor, 0);
  const totalGain = totalValue - totalCost;
  const overallReturn = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(2) : '0.00';

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
                  <TrendingUp className="w-5 h-5" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Investments Portfolio
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Track portfolio performance, asset allocation, cost bases, and returns in structured ledger tables.
              </p>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground block">Current Portfolio Value</span>
              <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono mt-1 block">
                {formatCAD(totalValue)}
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground block">Total Cost Basis</span>
              <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono mt-1 block">
                {formatCAD(totalCost)}
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground block">Unrealized Capital Gain</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
                  +{formatCAD(totalGain)}
                </span>
                <span className="text-xs font-bold font-mono text-foreground flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {overallReturn}%
                </span>
              </div>
            </div>
          </div>

          {/* Clean Data Table for Holdings */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground">Holdings & Asset Inventory</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Itemized valuation and returns per asset</p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-secondary text-foreground border border-border">
                {investments.length} Assets
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 font-mono uppercase text-[10px] text-muted-foreground">
                    <th className="py-3 px-5">Symbol / Ticker</th>
                    <th className="py-3 px-4">Asset Name</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4 text-right">Shares</th>
                    <th className="py-3 px-4 text-right">Cost Basis</th>
                    <th className="py-3 px-4 text-right">Current Value</th>
                    <th className="py-3 px-4 text-right">Unrealized Gain</th>
                    <th className="py-3 px-5 text-right">Return %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-sans">
                  {investments.map((pos) => {
                    const gain = pos.currentValueMinor - pos.costBasisMinor;

                    return (
                      <tr key={pos.id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3.5 px-5 font-mono font-bold text-foreground">
                          {pos.symbol}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground">
                          {pos.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground font-mono uppercase border border-border">
                            {pos.assetClass}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-foreground">
                          {pos.shares}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-muted-foreground">
                          {formatCAD(pos.costBasisMinor)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-foreground">
                          {formatCAD(pos.currentValueMinor)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-foreground">
                          +{formatCAD(gain)}
                        </td>
                        <td className="py-3.5 px-5 text-right font-mono tabular-nums font-bold text-foreground">
                          +{pos.returnPercentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border bg-secondary/30 font-semibold font-mono text-xs">
                    <td colSpan={4} className="py-3 px-5 text-foreground">
                      Total Consolidated Portfolio
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground tabular-nums">
                      {formatCAD(totalCost)}
                    </td>
                    <td className="py-3 px-4 text-right text-foreground font-bold tabular-nums">
                      {formatCAD(totalValue)}
                    </td>
                    <td className="py-3 px-4 text-right text-foreground font-bold tabular-nums">
                      +{formatCAD(totalGain)}
                    </td>
                    <td className="py-3 px-5 text-right text-foreground font-bold tabular-nums">
                      +{overallReturn}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
