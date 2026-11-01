'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PiggyBank, 
  Plus, 
  Target, 
  Calendar, 
  Sparkles, 
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { SinkingFund } from '@/lib/types';
import { db } from '@/lib/db';

export default function SinkingFundsPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    const session = db.getCurrentSession();
    if (!session) {
      router.push('/login?redirect=/client/sinking-funds');
      return;
    }

    async function load() {
      const activeId = state.selectedEntityId;
      const funds = await db.getSinkingFunds(activeId);
      setState((prev) => ({ ...prev, sinkingFunds: funds }));
    }
    load();
  }, [router, state.selectedEntityId]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFundName, setNewFundName] = useState('');
  const [newTargetDollars, setNewTargetDollars] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('2026-12-31');
  const [newCategory, setNewCategory] = useState('Savings');

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0] || {
    id: 'ent-default',
    name: 'Primary Ledger',
  };
  const funds = state.sinkingFunds.filter((f) => f.entityId === activeEntity.id);

  const totalTarget = funds.reduce((sum, f) => sum + f.targetMinor, 0);
  const totalSaved = funds.reduce((sum, f) => sum + f.currentMinor, 0);
  const totalRemaining = Math.max(0, totalTarget - totalSaved);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleAddFund = (e: React.FormEvent) => {
    e.preventDefault();
    const dollars = parseFloat(newTargetDollars) || 0;
    if (!newFundName.trim() || dollars <= 0) return;

    const newFund: SinkingFund = {
      id: `sink-${Date.now()}`,
      entityId: activeEntity.id,
      name: newFundName.trim(),
      targetMinor: Math.round(dollars * 100),
      currentMinor: 0,
      targetDate: newTargetDate,
      category: newCategory,
    };

    const nextState = {
      ...state,
      sinkingFunds: [...state.sinkingFunds, newFund],
    };
    setState(nextState);
    saveState(nextState);
    setShowAddModal(false);
    setNewFundName('');
    setNewTargetDollars('');
  };

  const handleAddDeposit = (fundId: string, depositDollars: number) => {
    const nextFunds = state.sinkingFunds.map((f) => {
      if (f.id === fundId) {
        return { ...f, currentMinor: Math.min(f.targetMinor, f.currentMinor + Math.round(depositDollars * 100)) };
      }
      return f;
    });
    const nextState = { ...state, sinkingFunds: nextFunds };
    setState(nextState);
    saveState(nextState);
  };

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
                  <PiggyBank className="w-5 h-5" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Sinking Funds
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Save for what matters. Track progress, targets, and upcoming maturity dates.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-full bg-foreground text-background text-xs font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Sinking Fund</span>
            </button>
          </div>

          {/* Metric Overview Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground block">Total Sinking Target</span>
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono mt-1 block">
                {formatCAD(totalTarget)}
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground block">Currently Saved</span>
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono mt-1 block">
                {formatCAD(totalSaved)}
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground block">Remaining to Target</span>
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono mt-1 block">
                {formatCAD(totalRemaining)}
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground block">Overall Completion</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  {overallProgress}%
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-foreground border border-border">
                  {funds.length} Active Goals
                </span>
              </div>
            </div>
          </div>

          {/* Sinking Funds List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {funds.map((fund) => {
              const percent = Math.min(100, Math.round((fund.currentMinor / fund.targetMinor) * 100));
              const isCompleted = percent >= 100;

              return (
                <div
                  key={fund.id}
                  className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border uppercase font-medium">
                          {fund.category}
                        </span>
                        <h3 className="font-bold text-foreground text-base mt-2">{fund.name}</h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-foreground tabular-nums">
                        {percent}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs pt-1">
                      <span className="font-mono text-xl font-extrabold text-foreground tabular-nums">
                        {formatCAD(fund.currentMinor)}
                      </span>
                      <span className="text-muted-foreground font-mono text-xs">
                        goal of {formatCAD(fund.targetMinor)}
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-secondary overflow-hidden p-0.5 border border-border">
                      <div
                        className="h-full rounded-full transition-all bg-foreground"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        Target: {fund.targetDate}
                      </span>
                      <span className="font-mono">
                        Need: {formatCAD(Math.max(0, fund.targetMinor - fund.currentMinor))}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <button
                      onClick={() => handleAddDeposit(fund.id, 50)}
                      className="flex-1 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border transition-colors"
                    >
                      + $50
                    </button>
                    <button
                      onClick={() => handleAddDeposit(fund.id, 200)}
                      className="flex-1 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border transition-colors"
                    >
                      + $200
                    </button>
                    {isCompleted && (
                      <span className="p-1.5 rounded-full bg-secondary text-foreground border border-border">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Add Sinking Fund Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Create New Sinking Fund</h3>
              <button onClick={() => setShowAddModal(false)} className="text-xs text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFund} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Fund Name</label>
                <input
                  type="text"
                  required
                  value={newFundName}
                  onChange={(e) => setNewFundName(e.target.value)}
                  placeholder="e.g. Vacation to Banff, Car Repairs"
                  className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Target Amount (CAD $)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newTargetDollars}
                    onChange={(e) => setNewTargetDollars(e.target.value)}
                    placeholder="3000.00"
                    className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  >
                    <option value="Safety">Safety</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Home">Home</option>
                    <option value="Medical">Medical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Target Completion Date</label>
                <input
                  type="date"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-border bg-secondary text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-foreground text-background font-semibold shadow-xs hover:opacity-90 transition-opacity"
                >
                  Save Fund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
