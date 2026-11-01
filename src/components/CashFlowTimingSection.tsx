'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  Clock,
  ShieldCheck,
  Check,
  ArrowLeft,
  Key,
  Receipt,
  Building,
  FileText,
  Lock,
  Sparkles
} from 'lucide-react';
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
    <section id="timing" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
      <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
        {/* Section Header */}
        <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
          <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
            <p className="flex items-center gap-2 font-mono text-xs font-medium">
              <span className="tabular-nums text-foreground">07</span>
              <span aria-hidden="true" className="text-muted-foreground">·</span>
              <span className="text-muted-foreground lowercase">the next action</span>
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

        {/* Central Interactive Chart & Mobile Modal Interface (Exact replica of Image 2) */}
        <div className="relative pt-8 sm:pt-12 pb-6 max-w-5xl mx-auto">
          {/* Connecting Line from Tuesday Highlight to Floating Window */}
          <div className="hidden lg:block absolute top-[138px] left-[26%] w-[16%] h-[1px] bg-border z-10" />

          {/* Floating Pill Card: 'Your best time · now' */}
          <div className="hidden lg:flex items-center gap-3 absolute top-[108px] left-[4%] z-20 p-3.5 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-md">
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

          {/* Background Card (Top-Right of modal): Liquidity & Reserve Safety */}
          <div className="hidden xl:block absolute top-[85px] right-[4%] z-20 p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-border/80 shadow-xl rotate-4 animate-float-delayed pointer-events-none select-none max-w-[220px]">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase pb-1">
              <span>ZERO RESERVE RISK</span>
              <span className="text-emerald-500 font-bold">100% SAFE</span>
            </div>
            <div className="text-xs font-semibold text-foreground">Continuous CRA Vault</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Untouched during settlement</div>
            <div className="mt-2 flex items-center gap-1.5 text-[9px] font-mono text-emerald-500">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Full tax buffer maintained</span>
            </div>
          </div>

          {/* Center Mobile Modal: Action Execution (Creatively Restyled) */}
          <div className="relative z-30 max-w-sm sm:max-w-md mx-auto shadow-2xl rounded-[32px] sm:rounded-[36px] border border-border bg-card/95 backdrop-blur-2xl p-5 sm:p-6 space-y-4 pro-card overflow-hidden">
            {/* Top ambient illumination line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#fb923c]/40 to-transparent" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Back"
                  className="w-7 h-7 rounded-full bg-secondary hover:bg-secondary/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-foreground" />
                  <span className="text-foreground font-extrabold text-xs sm:text-sm tracking-tight">Authorize Action</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary border border-border text-[10px] font-mono font-semibold text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>tx_8842</span>
              </div>
            </div>

            {/* Action Item Card (AWS Cloud Infrastructure) */}
            <div className="p-4 rounded-2xl bg-secondary/60 border border-border/80 text-left space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-foreground text-background flex items-center justify-center shrink-0 shadow-md p-2">
                    <MoneyCommandLogo variant="mark" className="w-full h-full text-current" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground text-xs sm:text-sm truncate">
                        AWS Cloud Infrastructure
                      </span>
                      <span className="px-1.5 py-0.2 rounded-sm bg-emerald-500/10 text-emerald-500 text-[9px] font-mono font-bold">
                        Verified
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground block truncate">
                      Amazon Web Services Canada Inc.
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base sm:text-lg font-black font-mono text-foreground tracking-tight block">
                    CAD 312.40
                  </span>
                </div>
              </div>

              {/* Sub-banner: Due Friday & Negotiation Discount */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-background/80 border border-border/60 text-[11px]">
                <span className="text-muted-foreground text-[10px] sm:text-[11px]">
                  Due Friday &middot; Auto-negotiation applied
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px]">
                  -15% monthly write-off
                </span>
              </div>
            </div>

            {/* Interactive Decision Rows */}
            <div className="space-y-2 text-xs">
              {/* Row 1: Verify CRA tax write-off */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 hover:bg-secondary/80 border border-border/60 hover:border-border cursor-pointer transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-foreground font-semibold block text-xs truncate">Verify CRA tax write-off</span>
                    <span className="text-[10px] text-muted-foreground/75 block truncate">Section 18(1)(a) IT-Act deductible</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    100% Eligible
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                </div>
              </div>

              {/* Row 2: Assign entity */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 hover:bg-secondary/80 border border-border/60 hover:border-border cursor-pointer transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-foreground font-semibold block text-xs truncate">Assign entity</span>
                    <span className="text-[10px] text-muted-foreground/75 block truncate">Tenant corporate separation</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary border border-border font-mono text-[10px] font-semibold text-foreground">
                    Founder Corp
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                </div>
              </div>

              {/* Row 3: Ledger account */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 hover:bg-secondary/80 border border-border/60 hover:border-border cursor-pointer transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-[#fb923c]/10 border border-[#fb923c]/20 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5 text-[#fb923c]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-foreground font-semibold block text-xs truncate">Ledger account</span>
                    <span className="text-[10px] text-muted-foreground/75 block truncate">Operating expense category</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary border border-border font-mono text-[10px] font-semibold text-foreground">
                    5100 Software Hosting
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                </div>
              </div>
            </div>

            {/* User Avatar & Authorize Action Button */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between px-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-[9px] font-mono shadow-xs">
                    SF
                  </div>
                  <div className="text-left">
                    <span className="font-mono text-xs font-semibold text-foreground block leading-tight">sarah.founder</span>
                    <span className="text-[9px] font-mono text-muted-foreground block">Authorized Keyholder</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-mono text-emerald-500 font-bold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Replay-safe
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActionAuthorized(!actionAuthorized)}
                className={`group w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-98 ${
                  actionAuthorized
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25'
                    : 'bg-foreground text-background hover:opacity-95'
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
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
                      <span className="text-[10px] sm:text-[11px] font-mono text-orange-500 font-bold tracking-tight mb-1 animate-pulse whitespace-nowrap">
                        Tuesday, 2 PM
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] font-mono text-transparent mb-1 select-none">
                        &nbsp;
                      </span>
                    )}

                    {/* Cluster of 6 Vertical Bars */}
                    <div className="flex items-end gap-0.5 sm:gap-1.5 h-[140px] sm:h-[180px] pb-2">
                      {d.bars.map((height, bIdx) => {
                        const isHighlightedSpike = isTue && bIdx === 3;
                        return (
                          <div
                            key={bIdx}
                            style={{ height: `${height}px` }}
                            className={`w-1 sm:w-2.5 rounded-t-full transition-all duration-300 ${
                              isHighlightedSpike
                                ? 'bg-orange-500 shadow-lg shadow-orange-500/30'
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

