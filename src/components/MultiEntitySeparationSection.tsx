'use client';

import React, { useState } from 'react';

interface ColumnMetric {
  id: string;
  label: string;
  sublabel: string;
  topHeight: number; // in px
  bottomHeight: number; // in px
  isHighlighted?: boolean;
  topText?: string;
  bottomText?: string;
}

const COLUMNS: ColumnMetric[] = [
  {
    id: 'personal',
    label: 'Personal Living',
    sublabel: 'Lifestyle & Housing',
    topHeight: 120,
    bottomHeight: 32,
    topText: 'CAD 6,200',
    bottomText: 'CAD 850',
  },
  {
    id: 'founder',
    label: 'Founder Corp',
    sublabel: 'Retained Operating Profit',
    topHeight: 88,
    bottomHeight: 170, // Tall, dropping down in orange!
    isHighlighted: true,
    topText: 'CAD 4,100',
    bottomText: 'CAD 14,850',
  },
  {
    id: 'tax',
    label: 'CRA Tax Reserve',
    sublabel: 'GST/HST & Corporate Surtax',
    topHeight: 75,
    bottomHeight: 75,
    topText: 'CAD 3,840',
    bottomText: 'CAD 3,840',
  },
  {
    id: 'buffer',
    label: 'Sinking Buffer',
    sublabel: '6-Month Emergency',
    topHeight: 48,
    bottomHeight: 48,
    topText: 'CAD 2,500',
    bottomText: 'CAD 2,500',
  },
];

export default function MultiEntitySeparationSection() {
  const [activeCol, setActiveCol] = useState<string>('founder');

  return (
    <section id="multi-entity" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
      <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
        {/* Section Header */}
        <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
          <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
            <p className="flex items-center gap-2 font-mono text-xs font-medium">
              <span className="tabular-nums text-foreground">08</span>
              <span aria-hidden="true" className="text-muted-foreground">·</span>
              <span className="text-muted-foreground lowercase">your real audience</span>
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
              Who you invoice isn&apos;t what you keep.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
              The top-line swells with reimbursables and client passes. What you actually own is a different balance, and Money Command gives you exact separation.
            </p>
          </div>
        </div>

        {/* Bi-directional Interactive Chart (Exact Replica of Image 1 Layout) */}
        <div className="relative max-w-4xl mx-auto py-12 sm:py-16">
          {/* Top-left Caption: 'Gross invoicing looks like CAD 48,200.' */}
          <div className="text-xs sm:text-sm font-mono text-muted-foreground pb-8 text-left">
            Gross invoicing looks like <strong className="text-foreground">CAD 48,200</strong>.
          </div>

          {/* Central Bi-directional Columns Container */}
          <div className="relative py-16 sm:py-24 flex items-center justify-between sm:justify-around gap-2 overflow-x-auto">
            {/* Center Dividing Horizontal Baseline */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-border z-0" />

            {/* 4 Interactive Columns */}
            {COLUMNS.map((col) => {
              const isFounder = col.isHighlighted;
              const isSelected = activeCol === col.id;

              return (
                <div
                  key={col.id}
                  onClick={() => setActiveCol(col.id)}
                  className="relative z-10 flex flex-col items-center cursor-pointer group flex-1 max-w-[120px]"
                >
                  {/* Top Floating Pill Bar (Above Baseline) */}
                  <div className="flex flex-col items-center justify-end mb-2 sm:mb-3">
                    <span className={`text-[9.5px] sm:text-[10px] font-mono text-muted-foreground mb-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                      {col.topText}
                    </span>
                    <div
                      style={{ height: `${col.topHeight}px` }}
                      className="w-10 sm:w-16 md:w-20 rounded-2xl transition-all duration-300 bg-secondary border border-border shadow-xs group-hover:bg-secondary/80"
                    />
                  </div>

                  {/* Center Column Label (Sitting on the Baseline) */}
                  <div className="py-1 px-1.5 sm:px-2.5 rounded-full bg-card border border-border shadow-xs max-w-full">
                    <span
                      className={`text-[9px] sm:text-xs font-mono font-bold tracking-tight transition-colors block truncate text-center ${
                        isFounder ? 'text-orange-500' : 'text-foreground'
                      }`}
                    >
                      {col.label}
                    </span>
                  </div>

                  {/* Bottom Floating Pill Bar (Below Baseline) */}
                  <div className="flex flex-col items-center justify-start mt-2 sm:mt-3">
                    <div
                      style={{ height: `${col.bottomHeight}px` }}
                      className={`w-10 sm:w-16 md:w-20 rounded-2xl transition-all duration-300 ${
                        isFounder
                          ? 'bg-orange-500 shadow-xl shadow-orange-500/25 group-hover:scale-105'
                          : 'bg-secondary border border-border group-hover:bg-secondary/80'
                      }`}
                    />
                    <span
                      className={`text-[9.5px] sm:text-[10px] font-mono mt-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'} ${
                        isFounder ? 'text-orange-500 font-bold' : 'text-muted-foreground'
                      }`}
                    >
                      {col.bottomText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom-right Caption */}
          <div className="text-right text-xs sm:text-sm font-mono text-muted-foreground pt-8">
            What you safely keep is mostly net retained{' '}
            <span className="text-orange-500 font-bold">CAD 14,850</span>.
          </div>

          {/* Bottom-left Monospace Footnote */}
          <div className="text-left text-[11px] font-mono text-muted-foreground/70 pt-6">
            Totals from double-entry PostgreSQL ledger, reconciled with bank statements
          </div>
        </div>
      </div>
    </section>
  );
}

