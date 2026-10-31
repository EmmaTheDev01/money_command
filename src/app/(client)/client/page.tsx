'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  User, 
  ArrowUpRight, 
  ArrowDownRight, 
  Inbox, 
  Sparkles, 
  MessageSquare,
  ChevronDown,
  Calendar,
  SlidersHorizontal,
  Download,
  FileText,
  Briefcase,
  TrendingUp,
  Coins,
  CheckCircle2,
  Clock,
  MoreVertical,
  Pencil,
  Info,
  Plus
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { AskMyMoneyModal } from '@/components/AskMyMoneyModal';
import { WhatsAppSimulatorModal } from '@/components/WhatsAppSimulatorModal';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';

export default function ClientDashboardPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [showAskMoney, setShowAskMoney] = useState(false);
  const [showWhatsAppSim, setShowWhatsAppSim] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [outcomeInterval, setOutcomeInterval] = useState<'weekly' | 'monthly'>('weekly');
  const [budgetFlowPeriod, setBudgetFlowPeriod] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposals = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending');

  const handleExportCSV = () => {
    const csvContent = [
      'MONEY COMMAND - CLIENT BUDGET OVERVIEW',
      `Entity: ${activeEntity.name}`,
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      'Category,Amount CAD,Status,Type',
      'School tuition,500.00,Paid,Expense',
      'Birthday gift,89.00,Paid,Expense',
      'Vet visit,45.00,Paid,Expense',
      'Shopping,450.00,Pending,Expense',
      'Shopping,260.00,Pending,Expense',
      'Electricity,128.00,Overdue,Bill',
      'Gas,89.50,Overdue,Bill',
      'Water,112.59,Paid,Bill',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Budget_Overview_${activeEntity.name.replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
        onOpenWhatsAppSimulator={() => setShowWhatsAppSim(true)}
        onOpenAskMoney={() => setShowAskMoney(true)}
        pendingProposalsCount={pendingProposals.length}
      />

      <div className="flex-1 flex">
        <ClientSidebar pendingProposalsCount={pendingProposals.length} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full">
          {/* Top Greeting & Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Hello, Susan!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Here is a brief overview of your home budget.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Period Dropdown */}
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-full bg-card hover:bg-secondary border border-border text-xs font-medium text-foreground flex items-center gap-2 transition-colors shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span>This month</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {/* Filter Button */}
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-full bg-card hover:bg-secondary border border-border text-xs font-medium text-foreground flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Filter</span>
              </button>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-1.5 rounded-full bg-foreground text-background hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 transition-opacity shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              {/* Quick AI & WhatsApp Sandboxes */}
              <button
                type="button"
                onClick={() => setShowAskMoney(true)}
                className="hidden sm:flex px-3 py-1.5 rounded-full bg-secondary hover:bg-muted text-foreground border border-border text-xs font-medium items-center gap-1.5 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Ask My Money</span>
              </button>
            </div>
          </div>

          {/* DASHBOARD GRID: EXACT 8-CARD LAYOUT */}
          <div className="space-y-6">
            {/* ROW 1: Budget Hero, Saving Goal, Upcoming Bills */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Card 1: Budget (Hero) */}
              <div className="lg:col-span-5 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/70 tracking-widest text-[10px]">:::</span>
                    <span>Budget</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end mt-4">
                  {/* Left Column: Big Amount & Delta */}
                  <div className="sm:col-span-7 space-y-1.5">
                    <div className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-mono">
                      $192,390.00
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-foreground">
                      <ArrowUpRight className="w-3.5 h-3.5 text-foreground" />
                      <span>12% more vs last month</span>
                    </div>

                    <div className="pt-4">
                      <Link
                        href="/client/budgets"
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-card hover:bg-secondary border border-border text-foreground text-xs font-medium transition-colors shadow-xs"
                      >
                        <Pencil className="w-3 h-3 text-muted-foreground" />
                        <span>Manage</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: 3-Bar Vertical Chart */}
                  <div className="sm:col-span-5 flex items-end justify-end gap-3 h-32 pt-2">
                    {/* Y-axis markers */}
                    <div className="flex flex-col justify-between text-[9px] font-mono text-muted-foreground/80 h-full py-1 text-right pr-1">
                      <span>100K</span>
                      <span>75K</span>
                      <span>50K</span>
                      <span>25K</span>
                      <span>0</span>
                    </div>

                    {/* Bars */}
                    <div className="flex items-end gap-2.5 h-full">
                      {/* Bar 1: Salary */}
                      <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-6 rounded-t-lg bg-foreground h-[85%] transition-all" />
                        <span className="text-[9px] text-muted-foreground font-sans truncate w-10 text-center">Salary</span>
                      </div>

                      {/* Bar 2: Investments */}
                      <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-6 rounded-t-lg bg-muted-foreground/60 h-[55%] transition-all" />
                        <span className="text-[9px] text-muted-foreground font-sans truncate w-12 text-center">Investements</span>
                      </div>

                      {/* Bar 3: Savings */}
                      <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-6 rounded-t-lg bg-muted-foreground/30 h-[40%] transition-all" />
                        <span className="text-[9px] text-muted-foreground font-sans truncate w-10 text-center">Savings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Saving Goal */}
              <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/70 tracking-widest text-[10px]">:::</span>
                    <span>Saving goal</span>
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                    $4,500.00
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-foreground">
                    <ArrowUpRight className="w-3.5 h-3.5 text-foreground" />
                    <span>23% more vs last month</span>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="text-xs text-muted-foreground font-medium">
                    Current: <strong className="text-foreground">25%</strong>
                  </div>

                  {/* Segmented Progress Blocks (10 blocks) */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 h-5 rounded-md bg-foreground transition-all" />
                    ))}
                    {[4, 5, 6, 7, 8, 9, 10].map((i) => (
                      <div key={i} className="flex-1 h-5 rounded-md bg-secondary border border-border/50 transition-all" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 3: Upcoming Bills */}
              <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/70 tracking-widest text-[10px]">:::</span>
                    <span>Upcoming bills</span>
                  </div>
                </div>

                <div className="space-y-3 mt-3 divide-y divide-border">
                  {/* Bill 1 */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-[9px] uppercase font-mono shrink-0">
                        PDF
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">Electricity</div>
                        <div className="text-[11px] font-mono text-muted-foreground">$128.00</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      Overdue
                    </span>
                  </div>

                  {/* Bill 2 */}
                  <div className="flex items-center justify-between pt-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-[9px] uppercase font-mono shrink-0">
                        PDF
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">Gas</div>
                        <div className="text-[11px] font-mono text-muted-foreground">$89.50</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      Overdue
                    </span>
                  </div>

                  {/* Bill 3 */}
                  <div className="flex items-center justify-between pt-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-[9px] uppercase font-mono shrink-0">
                        PDF
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">Water</div>
                        <div className="text-[11px] font-mono text-muted-foreground">$112.59</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      Paid
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Income Breakdown, Expenses Breakdown, Outcome */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Card 4: Income Breakdown */}
              <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/70 tracking-widest text-[10px]">:::</span>
                    <span>Income breakdown</span>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mt-3">
                    <span className="flex items-center gap-1 text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      Salary
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      Investments
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      Bank deposits
                    </span>
                  </div>
                </div>

                {/* Horizontal Rounded Pill Stack */}
                <div className="space-y-2.5 mt-5">
                  {/* Pill 1: Salary */}
                  <div className="w-[95%] h-8 rounded-full bg-foreground text-background flex items-center px-3 gap-2 shadow-xs transition-all">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium font-sans">Salary (CAD $8,500.00)</span>
                  </div>

                  {/* Pill 2: Investments */}
                  <div className="w-[78%] h-8 rounded-full bg-muted-foreground/70 text-background flex items-center px-3 gap-2 shadow-xs transition-all">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium font-sans">Investments (CAD $2,400.00)</span>
                  </div>

                  {/* Pill 3: Bank deposits */}
                  <div className="w-[58%] h-8 rounded-full bg-muted-foreground/35 text-foreground flex items-center px-3 gap-2 shadow-xs transition-all">
                    <Coins className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium font-sans">Bank deposits (CAD $890.00)</span>
                  </div>
                </div>
              </div>

              {/* Card 5: Expenses Breakdown (Semi-Circular Donut Arc) */}
              <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/70 tracking-widest text-[10px]">:::</span>
                    <span>Expenses breakdown</span>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-2.5 text-[10.5px] text-muted-foreground mt-2.5">
                    <span className="flex items-center gap-1 text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      Bills
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      Groceries
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70" />
                      Gas
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      Insurance
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                      Other
                    </span>
                  </div>
                </div>

                {/* Semi-Circular Radial Gauge Visual */}
                <div className="flex items-center justify-center pt-2">
                  <svg viewBox="0 0 200 110" className="w-48 h-28 overflow-visible">
                    {/* Background Arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="20"
                      className="text-secondary"
                      strokeLinecap="round"
                    />

                    {/* Segment 1: Bills (Foreground) */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 45 45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="20"
                      className="text-foreground"
                    />

                    {/* Segment 2: Groceries */}
                    <path
                      d="M 50 40 A 80 80 0 0 1 95 21"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="20"
                      className="text-muted-foreground"
                    />

                    {/* Segment 3: Gas */}
                    <path
                      d="M 102 21 A 80 80 0 0 1 145 36"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="20"
                      className="text-muted-foreground/70"
                    />

                    {/* Segment 4: Insurance */}
                    <path
                      d="M 150 42 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="20"
                      className="text-muted-foreground/40"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 6: Outcome */}
              <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/70 tracking-widest text-[10px]">:::</span>
                    <span>Outcome</span>
                  </div>

                  <button
                    type="button"
                    className="text-[11px] text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 border border-border px-2 py-0.5 rounded-full bg-secondary/50"
                  >
                    <span>Weekly</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1 mt-2">
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                    $2,048.00
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-foreground">
                    <ArrowUpRight className="w-3.5 h-3.5 text-foreground" />
                    <span>4.5% more vs last month</span>
                  </div>
                </div>

                {/* Spline Area Chart */}
                <div className="h-20 w-full mt-2 relative">
                  <svg viewBox="0 0 240 70" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="outcomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" className="text-foreground" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" className="text-foreground" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 55 Q 60 40 120 48 T 240 15 L 240 70 L 0 70 Z"
                      fill="url(#outcomeGradient)"
                    />
                    <path
                      d="M 0 55 Q 60 40 120 48 T 240 15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-foreground"
                    />
                  </svg>
                  <div className="flex justify-between text-[9px] font-mono text-muted-foreground pt-1">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span>How to plan expenses? <strong className="text-foreground underline cursor-pointer">Find out!</strong></span>
                </div>
              </div>
            </div>

            {/* ROW 3: Planned Expenses & Budget Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Card 7: Planned Expenses (Wide Left) */}
              <div className="lg:col-span-7 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/70 tracking-widest text-[10px]">:::</span>
                    <span>Planned expenses</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowWhatsAppSim(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-card hover:bg-secondary border border-border text-xs font-medium text-foreground transition-colors shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add expense</span>
                  </button>
                </div>

                {/* Planned Expenses List Table */}
                <div className="divide-y divide-border text-xs">
                  {[
                    { title: 'School tuition', amount: '$500.00', status: 'Paid', date: '11 Nov 2026' },
                    { title: 'Birthday gift', amount: '$89.00', status: 'Paid', date: '21 Nov 2026' },
                    { title: 'Vet visit', amount: '$45.00', status: 'Paid', date: '21 Nov 2026' },
                    { title: 'Shopping', amount: '$450.00', status: 'Pending', date: '25 Nov 2026' },
                    { title: 'Shopping', amount: '$260.00', status: 'Pending', date: '25 Nov 2026' },
                  ].map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3 hover:bg-secondary/30 transition-colors px-1 rounded-lg">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-foreground text-background flex items-center justify-center font-bold text-[8px] uppercase font-mono shrink-0">
                          PDF
                        </div>
                        <span className="font-medium text-foreground">{item.title}</span>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6 font-mono">
                        <span className="font-semibold text-foreground">{item.amount}</span>

                        <span className="text-[11px] font-sans flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Paid' ? 'bg-foreground' : 'bg-muted-foreground'}`} />
                          <span className={item.status === 'Paid' ? 'text-foreground' : 'text-muted-foreground'}>{item.status}</span>
                        </span>

                        <span className="text-[11px] text-muted-foreground hidden sm:inline">{item.date}</span>

                        <button type="button" className="text-muted-foreground hover:text-foreground">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 8: Budget Flow (Wide Right) */}
              <div className="lg:col-span-5 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                      <span className="font-mono text-muted-foreground/70 tracking-widest text-[10px]">:::</span>
                      <span>Budget flow</span>
                    </div>

                    <button
                      type="button"
                      className="text-[11px] text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 border border-border px-2 py-0.5 rounded-full bg-secondary/50"
                    >
                      <span>Monthly</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                    <span className="flex items-center gap-1 text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      Income
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      Outcome
                    </span>
                  </div>
                </div>

                {/* 12-Month Dual Directional Column Chart */}
                <div className="pt-4 space-y-2">
                  <div className="h-32 flex items-end justify-between gap-1.5 px-1">
                    {[
                      { m: 'Jan', inc: 75, out: 30 },
                      { m: 'Feb', inc: 60, out: 40 },
                      { m: 'Mar', inc: 85, out: 25 },
                      { m: 'Apr', inc: 65, out: 35 },
                      { m: 'May', inc: 70, out: 45 },
                      { m: 'Jun', inc: 90, out: 20 },
                      { m: 'Jul', inc: 75, out: 30 },
                      { m: 'Aug', inc: 80, out: 25 },
                      { m: 'Sep', inc: 95, out: 35 },
                      { m: 'Oct', inc: 68, out: 42 },
                      { m: 'Nov', inc: 88, out: 28 },
                      { m: 'Dec', inc: 92, out: 30 },
                    ].map((col) => (
                      <div key={col.m} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        {/* Top Bar: Income */}
                        <div
                          className="w-full max-w-[14px] rounded-t-md bg-foreground transition-all"
                          style={{ height: `${col.inc}%` }}
                        />
                        {/* Bottom Bar: Outcome */}
                        <div
                          className="w-full max-w-[14px] rounded-b-md bg-muted-foreground/40 transition-all"
                          style={{ height: `${col.out}%` }}
                        />
                        {/* Month Label */}
                        <span className="text-[8.5px] font-mono text-muted-foreground/80 mt-1">{col.m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Interactive Modals */}
      <AskMyMoneyModal
        isOpen={showAskMoney}
        onClose={() => setShowAskMoney(false)}
        accounts={state.accounts}
        transactions={state.transactions}
        pendingProposals={pendingProposals}
        safeToSpendMinor={19239000}
      />

      <WhatsAppSimulatorModal
        isOpen={showWhatsAppSim}
        onClose={() => setShowWhatsAppSim(false)}
        onNewProposal={(newProp) => {
          setState((prev) => ({
            ...prev,
            proposals: [newProp, ...prev.proposals],
          }));
        }}
        entityId={activeEntity.id}
        tenantId={state.currentTenant.id}
        userId={state.currentUser.id}
      />
    </div>
  );
}
