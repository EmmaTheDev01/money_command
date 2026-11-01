'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Flame, 
  CheckCircle2, 
  Award, 
  PieChart, 
  Info,
  Sliders
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';

export default function GoalsRulesPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const metrics = state.ruleMetrics;

  const handleIncrementStreak = () => {
    const nextMetrics = { ...metrics, noSpendStreakDays: metrics.noSpendStreakDays + 1 };
    const nextState = { ...state, ruleMetrics: nextMetrics };
    setState(nextState);
    saveState(nextState);
  };

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
                  <Target className="w-5 h-5" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Goals & Financial Rules
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Follow the 50/30/20 rule, track no-spend challenge streaks, and build healthier financial habits.
              </p>
            </div>
          </div>

          {/* 50 / 30 / 20 Framework Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground">The 50 / 30 / 20 Budget Rule</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  50% Needs &middot; 30% Wants &middot; 20% Savings & Debt Elimination
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-primary border border-border">
                On Track
              </span>
            </div>

            {/* Segmented Horizontal Pill Bar */}
            <div className="space-y-2">
              <div className="w-full h-8 rounded-full bg-secondary overflow-hidden p-1 flex items-center gap-1 border border-border/50">
                <div
                  className="h-full rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-xs transition-all"
                  style={{ width: `${metrics.needsPercent}%` }}
                >
                  Needs ({metrics.needsPercent}%)
                </div>
                <div
                  className="h-full rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs transition-all"
                  style={{ width: `${metrics.wantsPercent}%` }}
                >
                  Wants ({metrics.wantsPercent}%)
                </div>
                <div
                  className="h-full rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs transition-all"
                  style={{ width: `${metrics.savingsPercent}%` }}
                >
                  Savings ({metrics.savingsPercent}%)
                </div>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Target: 50% max</span>
                <span>Target: 30% max</span>
                <span>Target: 20% min</span>
              </div>
            </div>

            {/* Explanation 3 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span>Essential Needs</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Rent, utilities, groceries, insurance, and minimum required debt payments. Currently consuming 48% of net income.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Discretionary Wants</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Dining out, entertainment, shopping, and hobbies. Currently at 28% (under the 30% boundary).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Savings & Investments</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Emergency fund sinking, ETF investments, and extra debt principal payments. Currently at 24% (+4% above goal!).
                </p>
              </div>
            </div>
          </div>

          {/* No-Spend Challenge Tracker */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg text-foreground">No-Spend Streak Challenge</h3>
              </div>
              <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                Log consecutive days with zero discretionary spending. Essential bills and groceries are exempt.
              </p>

              <div className="flex items-center gap-2 pt-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] font-mono border ${
                      i < metrics.noSpendStreakDays
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-secondary text-muted-foreground border-border'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-3xl font-extrabold font-mono text-foreground block">
                  {metrics.noSpendStreakDays} / {metrics.noSpendGoalDays} Days
                </span>
                <span className="text-xs text-muted-foreground">Current streak progress</span>
              </div>

              <button
                onClick={handleIncrementStreak}
                className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Log No-Spend Day</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

