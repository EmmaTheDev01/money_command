'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Check, 
  Cloud,
  Sparkles,
  Zap
} from 'lucide-react';
import MoneyCommandLogo from './MoneyCommandLogo';

interface DayData {
  day: string;
  dayLabel?: string;
  isOptimal?: boolean;
  bars: number[]; // heights in %
}

const WEEK_DATA: DayData[] = [
  { day: 'Mon', bars: [12, 16, 22, 20, 28, 48, 64, 38] },
  { day: 'Tue', dayLabel: 'Tuesday, 2 PM', isOptimal: true, bars: [14, 20, 26, 22, 34, 56, 100, 48] },
  { day: 'Wed', bars: [10, 14, 18, 24, 30, 46, 68, 42] },
  { day: 'Thu', bars: [12, 22, 18, 26, 36, 54, 74, 44] },
  { day: 'Fri', bars: [16, 24, 22, 28, 34, 42, 50, 32] },
  { day: 'Sat', bars: [8, 12, 24, 32, 28, 24, 34, 22] },
  { day: 'Sun', bars: [10, 16, 28, 32, 28, 34, 50, 26] },
];

export default function CashFlowTimingSection() {
  const [selectedDay, setSelectedDay] = useState<string>('Tue');
  const [actionAuthorized, setActionAuthorized] = useState<boolean>(false);

  return (
    <section id="timing" className="relative min-h-[90svh] flex flex-col justify-center px-4 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors overflow-hidden">
      {/* Whole Section Ambient Background Light Aura */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] rounded-full border border-border/25 opacity-40 animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1050px] h-[750px] rounded-full border border-border/15 opacity-30 pointer-events-none" />
      </div>

      <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate in-view">
        {/* Section Header */}
        <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
          <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
            <p className="flex items-center gap-2 font-mono text-xs font-medium">
              <span className="tabular-nums text-foreground">07</span>
              <span aria-hidden="true" className="text-muted-foreground">·</span>
              <span className="text-muted-foreground lowercase">the next action</span>
              <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-[10px] font-mono font-bold text-orange-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                Live Timing
              </span>
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
              Settle at the right time.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
              When safe-to-spend is highest and your continuous CRA tax reserve is completely protected.
            </p>
          </div>
        </div>

        {/* Central Stage: Integrated Histogram Layer & Center Mobile Action Sheet */}
        <div className="relative w-full max-w-5xl mx-auto pt-6 sm:pt-10 pb-4">
          {/* 1. Full-Width Weekly Liquidity Histogram Grid (Behind the Sheet) */}
          <div 
            aria-hidden="true" 
            className="absolute inset-x-0 bottom-4 hidden md:grid grid-cols-7 gap-x-6 lg:gap-x-10 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] opacity-45 pointer-events-none select-none z-0"
          >
            {WEEK_DATA.map((d) => {
              const isTue = d.day === 'Tue';
              const isSelected = selectedDay === d.day;

              return (
                <div key={d.day} className="flex flex-col gap-2">
                  <div className="flex h-40 items-end gap-1 lg:gap-1.5">
                    {d.bars.map((heightPct, bIdx) => {
                      const isPeak = isTue && bIdx === 6;
                      return (
                        <span
                          key={bIdx}
                          style={{ height: `${heightPct}%` }}
                          className={`relative flex-1 rounded-t-[3px] transition-all duration-300 ${
                            isPeak
                              ? 'bg-orange-500 shadow-xl shadow-orange-500/50'
                              : isSelected
                              ? 'bg-foreground/35'
                              : 'bg-foreground/15'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className={`border-t border-border/60 pt-2 font-mono text-xs transition-colors ${
                    isTue ? 'text-orange-500 font-bold' : isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground'
                  }`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 2. Left Connected Side Card: 'Your best time' (Patensify Style) */}
          <div className="absolute top-[26%] right-[calc(50%+13.5rem)] z-20 hidden xl:block w-72 pointer-events-none select-none animate-float">
            <div className="flex items-center gap-3 rounded-2xl border border-foreground/20 bg-card/95 backdrop-blur-xl p-3.5 shadow-xl text-left">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-500">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-bold text-foreground truncate">Optimal pay window</span>
                  <span className="text-[10px] font-mono font-bold text-orange-500 uppercase px-1.5 py-0.2 rounded bg-orange-500/10">now</span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
                  Safe-to-spend is +CAD 4,820 above reserve.
                </p>
              </div>
            </div>
          </div>

          {/* Wire Leading From Left Card to Center Sheet */}
          <span aria-hidden="true" className="absolute top-[31%] right-[calc(50%+11.5rem)] z-10 hidden xl:block h-px w-8 bg-orange-500/60 pointer-events-none">
            <i className="absolute -top-[3px] -right-[3px] w-2 h-2 rounded-full bg-orange-500 shadow-sm animate-pulse" />
          </span>

          {/* 3. Right Connected Side Card: 'Continuous CRA Vault' (Patensify Style) */}
          <div className="absolute top-[26%] left-[calc(50%+13.5rem)] z-20 hidden xl:block w-72 pointer-events-none select-none animate-float-delayed">
            <div className="flex items-center gap-3 rounded-2xl border border-foreground/20 bg-card/95 backdrop-blur-xl p-3.5 shadow-xl text-left">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-bold text-foreground truncate">Continuous CRA Vault</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase px-1.5 py-0.2 rounded bg-emerald-500/10">100% safe</span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
                  Untouched tax reserve buffer maintained.
                </p>
              </div>
            </div>
          </div>

          {/* Wire Leading From Right Card to Center Sheet */}
          <span aria-hidden="true" className="absolute top-[31%] left-[calc(50%+11.5rem)] z-10 hidden xl:block h-px w-8 bg-emerald-500/60 pointer-events-none">
            <i className="absolute -top-[3px] -left-[3px] w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
          </span>

          {/* 4. Center Sheet Modal: Action Execution (Exact Patensify Pro Spec) */}
          <div className="relative z-20 w-full max-w-[340px] sm:max-w-[370px] mx-auto">
            {/* The Sheet Container */}
            <div className="overflow-hidden rounded-[28px] border border-border/80 bg-card/95 backdrop-blur-2xl text-left shadow-2xl space-y-0 transition-all hover:border-foreground/30">
              {/* Sheet Header */}
              <header className="relative flex items-center justify-between border-b border-border/60 px-4 py-3 bg-secondary/30">
                <div className="flex items-center gap-1.5 text-foreground font-semibold text-xs tracking-tight">
                  <button type="button" className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" aria-label="Go back">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>Authorize Action</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-secondary border border-border/60 text-muted-foreground">
                  tx_8842
                </span>
              </header>

              {/* Action Item Card */}
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/50 border border-border/60">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 shadow-xs p-2.5">
                    <Cloud className="w-full h-full text-orange-500" />
                  </div>
                  <div className="space-y-1 text-xs min-w-0 flex-1">
                    <div className="font-bold text-foreground leading-tight truncate">
                      AWS Cloud Infrastructure
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      <strong className="text-foreground">CAD 312.40</strong> · Due Friday. Auto-negotiation applied -15% monthly write-off.
                    </p>
                  </div>
                </div>

                {/* Interactive Action Rows */}
                <div className="divide-y divide-border/40 border-y border-border/50 text-xs">
                  {/* Row 1: CRA Verification */}
                  <div className="flex items-center justify-between py-2.5 px-1 hover:bg-secondary/40 transition-colors cursor-pointer rounded-lg">
                    <span className="text-muted-foreground font-medium text-[11px]">Verify CRA tax write-off</span>
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <span className="text-emerald-500 font-bold">100% Eligible</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Row 2: Entity Assignment */}
                  <div className="flex items-center justify-between py-2.5 px-1 hover:bg-secondary/40 transition-colors cursor-pointer rounded-lg">
                    <span className="text-muted-foreground font-medium text-[11px]">Assign entity</span>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-foreground">
                      <span>Founder Corp</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Row 3: Ledger Account */}
                  <div className="flex items-center justify-between py-2.5 px-1 hover:bg-secondary/40 transition-colors cursor-pointer rounded-lg">
                    <span className="text-muted-foreground font-medium text-[11px]">Ledger account</span>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-foreground">
                      <span>5100 Software Hosting</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* User Identity & Replay Badge */}
                <div className="flex items-center justify-between px-1 pt-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-[9px] text-foreground font-mono">
                      SF
                    </div>
                    <span className="font-mono text-muted-foreground">sarah.founder</span>
                  </div>
                  <span className="font-mono text-emerald-500 font-semibold flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Replay-safe
                  </span>
                </div>

                {/* Authorize & Execute Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActionAuthorized(!actionAuthorized)}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer ${
                      actionAuthorized
                        ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                        : 'bg-foreground text-background hover:opacity-90'
                    }`}
                  >
                    {actionAuthorized ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Authorized &amp; Posted to PostgreSQL Ledger</span>
                      </>
                    ) : (
                      <>
                        <span>Authorize &amp; Execute Action</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Safe-to-Spend Impact Pill (Money Command Financial OS) */}
            <div className="absolute -bottom-16 inset-x-2 sm:inset-x-3 z-30 flex items-center justify-between p-2.5 px-3.5 rounded-2xl bg-card border border-border shadow-2xl backdrop-blur-xl animate-float-slow text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-medium text-[11px] text-foreground truncate">Safe-to-Spend &amp; CRA reserve verified</span>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0 ml-2">
                +CAD 4,820 surplus
              </span>
            </div>
          </div>

          {/* 5. Mobile & Interactive Day Selector (Below Sheet) */}
          <div className="mt-12 pt-4 pb-2 max-w-2xl mx-auto px-4 overflow-x-auto">
            <div className="flex items-end justify-between min-w-[320px] sm:min-w-0">
              {WEEK_DATA.map((d) => {
                const isTue = d.day === 'Tue';
                const isSelected = selectedDay === d.day;

                return (
                  <button
                    type="button"
                    key={d.day}
                    onClick={() => setSelectedDay(d.day)}
                    className="flex flex-col items-center gap-2 cursor-pointer group flex-1 max-w-[64px] transition-transform active:scale-95"
                  >
                    {/* Spike Label for Tuesday */}
                    {isTue ? (
                      <span className="text-[10px] sm:text-[11px] font-mono text-orange-500 font-bold tracking-tight mb-1 animate-pulse whitespace-nowrap flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                        Tuesday, 2 PM
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] font-mono text-transparent mb-1 select-none">
                        &nbsp;
                      </span>
                    )}

                    {/* Cluster of Vertical Bars */}
                    <div className="flex items-end gap-0.5 sm:gap-1 h-[70px] sm:h-[90px] pb-1 group-hover:scale-y-105 transition-transform duration-300 origin-bottom">
                      {d.bars.slice(0, 6).map((heightPct, bIdx) => {
                        const isHighlighted = isTue && bIdx === 4;
                        return (
                          <div
                            key={bIdx}
                            style={{ height: `${heightPct}%` }}
                            className={`w-1 sm:w-2 rounded-t-[2px] transition-all duration-300 ${
                              isHighlighted
                                ? 'bg-orange-500 shadow-md shadow-orange-500/50'
                                : isSelected
                                ? 'bg-foreground/50'
                                : 'bg-secondary group-hover:bg-foreground/30'
                            }`}
                          />
                        );
                      })}
                    </div>

                    {/* Day Label */}
                    <span className={`text-[11px] font-mono border-t border-border/60 pt-1.5 w-full text-center transition-colors ${
                      isTue ? 'text-orange-500 font-bold' : isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground'
                    }`}>
                      {d.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
