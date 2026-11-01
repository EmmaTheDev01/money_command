'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Clock, ShieldCheck, Check } from 'lucide-react';
import MoneyCommandLogo from './MoneyCommandLogo';

interface DayData {
  day: string;
  timeLabel?: string;
  isOptimal?: boolean;
  bars: number[]; // heights in px
}

const WEEK_DATA: DayData[] = [
  { day: 'Mon', bars: [24, 38, 48, 62, 75, 42] },
  { day: 'Tue', dayLabel: 'Tuesday, 2 PM', isOptimal: true, bars: [28, 45, 60, 140, 72, 50] } as any,
  { day: 'Wed', bars: [20, 32, 44, 55, 38, 30] },
  { day: 'Thu', bars: [35, 52, 68, 80, 60, 45] },
  { day: 'Fri', bars: [30, 48, 65, 78, 55, 40] },
  { day: 'Sat', bars: [18, 25, 32, 40, 30, 22] },
  { day: 'Sun', bars: [15, 20, 28, 35, 25, 18] },
];

export default function CashFlowTimingSection() {
  const [selectedDay, setSelectedDay] = useState<string>('Tue');
  const [actionAuthorized, setActionAuthorized] = useState<boolean>(false);

  return (
    <section id="timing" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors overflow-hidden">
      {/* WHOLE SECTION AMBIENT ANIMATED BACKGROUND AURA */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Breathing Radial Light Aura (Top Right) */}
        <div className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent blur-3xl animate-pulse-slow" />
        {/* Breathing Radial Light Aura (Bottom Left) */}
        <div className="absolute -bottom-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl animate-pulse-slow" />
        {/* Center Animated Ambient Orbit Rings */}
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
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[9px] font-mono font-bold text-orange-500 uppercase tracking-wider">
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

        {/* Central Interactive Chart & Mobile Modal Interface */}
        <div className="relative pt-8 sm:pt-12 pb-6 max-w-5xl mx-auto">
          {/* SECTION BACKGROUND ANIMATIONS */}
          {/* 1. Concentric Ambient Pulse Radar Circles */}
          <div aria-hidden="true" className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-[660px] h-[660px] rounded-full border border-border/40 animate-pulse-slow" />
            <div className="absolute w-[480px] h-[480px] rounded-full border border-border/30" />
            <div className="absolute w-[300px] h-[300px] rounded-full border border-border/20" />
          </div>

          {/* 2. Animated Connecting Flow Beam from Tuesday Highlight */}
          <div className="hidden lg:block absolute top-[138px] left-[26%] w-[16%] h-[12px] z-10 pointer-events-none">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 12">
              <line
                x1="0"
                y1="6"
                x2="100"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground animate-dotted-flow"
              />
            </svg>
          </div>

          {/* 3. Floating Background Card: 'Your best time · now' (Left) */}
          <div className="hidden lg:flex items-center gap-3 absolute top-[108px] left-[4%] z-20 p-3.5 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-md animate-float pointer-events-none select-none">
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground shrink-0 shadow-xs">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-left space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">Optimal pay window</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-[10px] font-bold border border-emerald-500/20">
                  now
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground block">
                Safe-to-spend is +CAD 4,820 above reserve.
              </span>
            </div>
          </div>

          {/* 4. Floating Background Card: 'Continuous CRA Vault' (Right) */}
          <div className="hidden xl:flex items-center gap-3 absolute top-[108px] right-[4%] z-20 p-3.5 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-md rotate-3 animate-float-delayed pointer-events-none select-none">
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-left space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">Continuous CRA Vault</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-[10px] font-bold border border-emerald-500/20">
                  100% safe
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground block">
                Untouched tax reserve buffer maintained.
              </span>
            </div>
          </div>

          {/* 5. Floating Background Pill: Auto-Negotiation (Bottom Left) */}
          <div className="hidden xl:flex items-center gap-2.5 absolute -bottom-2 left-[6%] z-20 p-2.5 px-3.5 rounded-2xl bg-card/90 border border-border shadow-lg backdrop-blur-md animate-float-slow -rotate-2 pointer-events-none select-none">
            <span className="w-2 h-2 rounded-full bg-[#fb923c] animate-pulse" />
            <div className="text-left text-xs">
              <span className="font-semibold text-foreground block text-[11px]">Auto-Negotiation</span>
              <span className="text-[10px] text-muted-foreground block">-15% monthly write-off applied</span>
            </div>
          </div>

          {/* Center Mobile Modal: Action Execution (Exact Original Style Preserved) */}
          <div className="relative z-30 max-w-sm mx-auto shadow-2xl rounded-[32px] sm:rounded-[36px] border border-border bg-card/95 backdrop-blur-xl p-5 sm:p-6 space-y-4 pro-card overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                <span className="text-muted-foreground">&larr;</span>
                <span>Authorize Action</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">tx_8842</span>
            </div>

            {/* Action Item Card */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/70 border border-border text-left overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 shadow-xs p-2">
                <MoneyCommandLogo variant="mark" className="w-full h-full text-foreground" />
              </div>
              <div className="space-y-1 text-xs min-w-0">
                <div className="font-bold text-foreground leading-tight truncate">
                  AWS Cloud Infrastructure
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  CAD 312.40 &middot; Due Friday. Auto-negotiation applied -15% monthly write-off.
                </p>
              </div>
            </div>

            {/* Interactive Action Rows */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary cursor-pointer transition-colors border border-transparent hover:border-border">
                <span className="text-muted-foreground font-medium">Verify CRA tax write-off</span>
                <div className="flex items-center gap-1.5 text-foreground font-mono text-[11px]">
                  <span className="text-emerald-500 font-bold">100% Eligible</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary cursor-pointer transition-colors border border-transparent hover:border-border">
                <span className="text-muted-foreground font-medium">Assign entity</span>
                <div className="flex items-center gap-1.5 text-foreground font-mono text-[11px]">
                  <span>Founder Corp</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary cursor-pointer transition-colors border border-transparent hover:border-border">
                <span className="text-muted-foreground font-medium">Ledger account</span>
                <div className="flex items-center gap-1.5 text-foreground font-mono text-[11px]">
                  <span>5100 Software Hosting</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* User Avatar & Authorize Action Button */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between px-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-[9px] text-foreground font-mono">
                    SF
                  </div>
                  <span className="font-mono text-muted-foreground">sarah.founder</span>
                </div>
                <span className="font-mono text-emerald-500 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Replay-safe
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActionAuthorized(!actionAuthorized)}
                className={`w-full py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  actionAuthorized
                    ? 'bg-emerald-500 text-white'
                    : 'bg-foreground text-background hover:opacity-90'
                }`}
              >
                {actionAuthorized ? (
                  <>
                    <Check className="w-4 h-4" />
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

          {/* Weekly Histogram Clusters (Background & Bottom - Matching Image 2) */}
          <div className="mt-8 pt-4 pb-2 max-w-4xl mx-auto px-2 sm:px-8 border-b border-border overflow-x-auto">
            <div className="flex items-end justify-between min-w-[340px] sm:min-w-0">
              {WEEK_DATA.map((d) => {
                const isTue = d.day === 'Tue';
                const isSelected = selectedDay === d.day;

                return (
                  <div
                    key={d.day}
                    onClick={() => setSelectedDay(d.day)}
                    className="flex flex-col items-center gap-2 cursor-pointer group flex-1 max-w-[56px]"
                  >
                    {/* Spike Label for Tuesday */}
                    {isTue ? (
                      <span className="text-[10px] sm:text-[11px] font-mono text-orange-500 font-bold tracking-tight mb-1 animate-pulse whitespace-nowrap flex items-center gap-1">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
                        </span>
                        Tuesday, 2 PM
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] font-mono text-transparent mb-1 select-none">
                        &nbsp;
                      </span>
                    )}

                    {/* Cluster of 6 Vertical Bars */}
                    <div className="flex items-end gap-0.5 sm:gap-1.5 h-[140px] sm:h-[180px] pb-2 group-hover:scale-y-105 transition-transform duration-300 origin-bottom">
                      {d.bars.map((height, bIdx) => {
                        const isHighlightedSpike = isTue && bIdx === 3;
                        return (
                          <div
                            key={bIdx}
                            style={{ height: `${height}px` }}
                            className={`w-1 sm:w-2.5 rounded-t-full transition-all duration-300 ${
                              isHighlightedSpike
                                ? 'bg-orange-500 shadow-xl shadow-orange-500/50 animate-pulse'
                                : isSelected
                                ? 'bg-foreground/60'
                                : 'bg-secondary group-hover:bg-foreground/40'
                            }`}
                          />
                        );
                      })}
                    </div>

                    {/* Day Label */}
                    <span className={`text-[11px] font-mono transition-colors ${
                      isTue ? 'text-orange-500 font-bold' : isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground'
                    }`}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

