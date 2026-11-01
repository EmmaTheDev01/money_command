'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Plus,
  PiggyBank,
  CreditCard,
  ShieldCheck,
  WalletCards,
  Loader2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { AskMyMoneyModal } from '@/components/AskMyMoneyModal';
import { WhatsAppSimulatorModal } from '@/components/WhatsAppSimulatorModal';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { db, AuthSession } from '@/lib/db';

export default function ClientDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Initialize with empty dashboard data that will be populated strictly from the database
  const [state, setState] = useState<AppState>(() => {
    const initial = getInitialState();
    return {
      ...initial,
      accounts: [],
      transactions: [],
      proposals: [],
      budgets: [],
      subscriptions: [],
      sinkingFunds: [],
      investments: [],
    };
  });

  const [showAskMoney, setShowAskMoney] = useState(false);
  const [showWhatsAppSim, setShowWhatsAppSim] = useState(false);

  // 1. Session verification guard: Must login before viewing dashboard
  useEffect(() => {
    const currentSession = db.getCurrentSession();
    if (!currentSession) {
      router.push('/login?redirect=/client');
      return;
    }
    setSession(currentSession);
    setIsLoadingAuth(false);
  }, [router]);

  // 2. Fetch live data from database service
  useEffect(() => {
    if (!session) return;

    let isMounted = true;
    async function fetchDatabaseData() {
      setIsLoadingData(true);
      try {
        const entities = await db.getEntities();
        const activeEntityId = state.selectedEntityId || entities[0]?.id || '33333333-3333-3333-3333-333333333331';

        const [
          accounts,
          transactions,
          budgets,
          subscriptions,
          proposals,
          sinkingFunds,
          investments,
        ] = await Promise.all([
          db.getAccounts(activeEntityId),
          db.getTransactions(activeEntityId),
          db.getBudgets(activeEntityId),
          db.getSubscriptions(activeEntityId),
          db.getProposals(activeEntityId),
          db.getSinkingFunds(activeEntityId),
          db.getInvestments(activeEntityId),
        ]);

        if (isMounted) {
          setState((prev) => ({
            ...prev,
            entities: entities.length > 0 ? entities : prev.entities,
            selectedEntityId: activeEntityId,
            accounts,
            transactions,
            budgets,
            subscriptions,
            proposals,
            sinkingFunds,
            investments,
          }));
        }
      } catch (err) {
        console.warn('Database fetch error:', err);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }

    fetchDatabaseData();
    return () => {
      isMounted = false;
    };
  }, [session, state.selectedEntityId]);

  useEffect(() => {
    if (!isLoadingData && !isLoadingAuth) {
      saveState(state);
    }
  }, [state, isLoadingData, isLoadingAuth]);

  // Active entity calculations
  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0] || {
    id: 'ent-1',
    name: 'Personal Account',
    type: 'personal',
    currency: 'CAD',
  };

  const pendingProposals = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending');
  const entityAccounts = state.accounts.filter((a) => a.entityId === activeEntity.id);
  const entityTransactions = state.transactions.filter((t) => t.entityId === activeEntity.id);
  const entityBudgets = state.budgets.filter((b) => b.entityId === activeEntity.id);
  const entitySubscriptions = state.subscriptions.filter((s) => s.entityId === activeEntity.id);
  const entitySinkingFunds = state.sinkingFunds.filter((s) => s.entityId === activeEntity.id);
  const entityInvestments = state.investments.filter((i) => i.entityId === activeEntity.id);

  // Dynamic user name
  const userName = session?.name || state.currentUser?.fullName || 'Account User';
  const firstName = userName.split(' ')[0];

  // 1. Budget Card Dynamic Values
  const totalBudgetLimitMinor = entityBudgets.reduce((sum, b) => sum + b.amountMinor, 0);
  const totalBudgetSpentMinor = entityBudgets.reduce((sum, b) => sum + b.spentMinor, 0);

  // 3-Bar Chart dynamic amounts (Salary / Income, Investments, Savings)
  const salaryMinor = entityTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.totalMinor, 0);

  const investmentsMinor = entityInvestments.reduce((sum, i) => sum + i.currentValueMinor, 0);
  
  const savingsMinor = entityAccounts
    .filter((a) => a.type === 'asset' && a.subtype === 'savings')
    .reduce((sum, a) => sum + a.balanceMinor, 0) || 
    entitySinkingFunds.reduce((sum, s) => sum + s.currentMinor, 0);

  const maxBarValue = Math.max(salaryMinor, investmentsMinor, savingsMinor, 1);
  const salaryBarHeight = salaryMinor > 0 ? Math.max(12, Math.min(100, Math.round((salaryMinor / maxBarValue) * 100))) : 4;
  const investBarHeight = investmentsMinor > 0 ? Math.max(12, Math.min(100, Math.round((investmentsMinor / maxBarValue) * 100))) : 4;
  const savingsBarHeight = savingsMinor > 0 ? Math.max(12, Math.min(100, Math.round((savingsMinor / maxBarValue) * 100))) : 4;

  // 2. Saving Goal Dynamic Values
  const totalSavingsTarget = entitySinkingFunds.reduce((sum, f) => sum + f.targetMinor, 0);
  const totalSavingsCurrent = entitySinkingFunds.reduce((sum, f) => sum + f.currentMinor, 0);
  const savingPercent = totalSavingsTarget > 0 ? Math.min(100, Math.round((totalSavingsCurrent / totalSavingsTarget) * 100)) : 0;
  const activeSavingBlocks = Math.round(savingPercent / 10);

  // 3. Upcoming Bills (Dynamic from subscriptions)
  const displayBills = entitySubscriptions.slice(0, 3);

  // 4. Income Breakdown
  const totalIncomeMinor = entityTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.totalMinor, 0);

  // 5. Expenses Breakdown by Category
  const expenseTransactions = entityTransactions.filter((t) => t.type === 'expense');
  const totalExpenseMinor = expenseTransactions.reduce((sum, t) => sum + t.totalMinor, 0);

  const expensesByCategory: Record<string, number> = {};
  expenseTransactions.forEach((t) => {
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.totalMinor;
  });

  const categoryEntries = Object.entries(expensesByCategory);

  // 6. Outcome (Net Cash Flow)
  const netOutcomeMinor = totalIncomeMinor - totalExpenseMinor;

  // 7. Planned Expenses / Recent Activity (Merged real transactions & pending proposals)
  const combinedPlannedList = [
    ...pendingProposals.map((p) => ({
      id: p.id,
      title: p.merchant,
      category: p.category,
      amount: formatCAD(p.amountMinor),
      status: 'Pending',
      date: p.txDate,
    })),
    ...entityTransactions.slice(0, 5).map((t) => ({
      id: t.id,
      title: t.merchant || t.description,
      category: t.category,
      amount: formatCAD(t.totalMinor),
      status: t.status === 'posted' ? 'Paid' : 'Pending',
      date: t.txDate,
    })),
  ].slice(0, 5);

  // 8. Dynamic Budget Flow (12 Months grouped by transaction date)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyFlowData = monthNames.map((m, idx) => {
    const monthNum = (idx + 1).toString().padStart(2, '0');
    const monthTxs = entityTransactions.filter((t) => {
      if (!t.txDate) return false;
      return t.txDate.includes(`-${monthNum}-`);
    });
    const incMinor = monthTxs.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.totalMinor, 0);
    const expMinor = monthTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.totalMinor, 0);
    return { m, incMinor, expMinor };
  });

  const maxMonthMinor = Math.max(...monthlyFlowData.map((d) => Math.max(d.incMinor, d.expMinor)), 1);
  const monthlyBars = monthlyFlowData.map((d) => ({
    m: d.m,
    inc: d.incMinor > 0 ? Math.max(8, Math.min(100, Math.round((d.incMinor / maxMonthMinor) * 100))) : 0,
    out: d.expMinor > 0 ? Math.max(8, Math.min(100, Math.round((d.expMinor / maxMonthMinor) * 100))) : 0,
  }));

  const handleExportCSV = () => {
    const csvRows = [
      'MONEY COMMAND - AUTHORITATIVE CLIENT FINANCIAL LEDGER',
      `Entity: ${activeEntity.name}`,
      `Generated: ${new Date().toISOString()}`,
      '',
      '--- TRANSACTIONS ---',
      'Date,Merchant,Category,Amount CAD,Type,Status,Source',
      ...entityTransactions.map((t) => 
        `"${t.txDate}","${t.merchant || ''}","${t.category}",${(t.totalMinor / 100).toFixed(2)},"${t.type}","${t.status}","${t.source}"`
      ),
      '',
      '--- ACTIVE BUDGETS ---',
      'Category,Period,Allocated CAD,Spent CAD,Utilization %',
      ...entityBudgets.map((b) => 
        `"${b.category}","${b.period}",${(b.amountMinor / 100).toFixed(2)},${(b.spentMinor / 100).toFixed(2)},${Math.round((b.spentMinor / b.amountMinor) * 100)}%`
      ),
      '',
      '--- SUBSCRIPTIONS & RECURRING OBLIGATIONS ---',
      'Merchant,Category,Frequency,Amount CAD,Annualized CAD,Status',
      ...entitySubscriptions.map((s) => 
        `"${s.merchant}","${s.category}","${s.frequency}",${(s.amountMinor / 100).toFixed(2)},${(s.annualizedCostMinor / 100).toFixed(2)},"${s.status}"`
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MoneyCommand_${activeEntity.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-foreground" />
          <span className="text-xs font-mono text-muted-foreground">Verifying authenticated session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background">
      <Navbar />

      <div className="flex-1 flex">
        <ClientSidebar pendingProposalsCount={pendingProposals.length} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full overflow-hidden">
          {/* Top Greeting & Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground whitespace-nowrap">
                  Hello, {firstName}!
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-foreground border border-border uppercase font-semibold shrink-0">
                  Live DB
                </span>
                {isLoadingData && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Syncing...</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                Real-time double-entry overview for <strong className="text-foreground">{activeEntity.name}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-full bg-card hover:bg-secondary border border-border text-xs font-medium text-foreground flex items-center gap-2 transition-colors shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="whitespace-nowrap">This month</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-1.5 rounded-full bg-foreground text-background hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 transition-opacity shadow-xs cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* QUICK ACCESS TILES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/client/sinking-funds"
              className="p-4 rounded-3xl border border-border bg-card hover:border-foreground/40 transition-all flex items-center gap-3 shadow-xs group overflow-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-mono block truncate whitespace-nowrap">Sinking Funds</span>
                <span className="text-xs font-bold text-foreground block truncate whitespace-nowrap">{entitySinkingFunds.length} Active Goals</span>
              </div>
            </Link>

            <Link
              href="/client/debt-tracker"
              className="p-4 rounded-3xl border border-border bg-card hover:border-foreground/40 transition-all flex items-center gap-3 shadow-xs group overflow-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground group-hover:scale-105 transition-transform shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-mono block truncate whitespace-nowrap">Debt Tracker</span>
                <span className="text-xs font-bold text-foreground block truncate whitespace-nowrap">Avalanche Focus</span>
              </div>
            </Link>

            <Link
              href="/client/net-worth"
              className="p-4 rounded-3xl border border-border bg-card hover:border-foreground/40 transition-all flex items-center gap-3 shadow-xs group overflow-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-mono block truncate whitespace-nowrap">True Net Worth</span>
                <span className="text-xs font-bold text-foreground block truncate whitespace-nowrap">+8.4% This Qtr</span>
              </div>
            </Link>

            <Link
              href="/client/paycheck-planner"
              className="p-4 rounded-3xl border border-border bg-card hover:border-foreground/40 transition-all flex items-center gap-3 shadow-xs group overflow-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground group-hover:scale-105 transition-transform shrink-0">
                <WalletCards className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-mono block truncate whitespace-nowrap">Zero-Based</span>
                <span className="text-xs font-bold text-foreground block truncate whitespace-nowrap">Paycheck Planner</span>
              </div>
            </Link>
          </div>

          {/* 8-CARD LAYOUT: PROPORTIONALLY FIT CHARTS (NUMBERS STRICTLY ON 1 ROW) */}
          <div className="space-y-6">
            {/* ROW 1: Budget Hero, Saving Goal, Upcoming Bills */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Card 1: Monthly Budget (Hero) */}
              <div className="lg:col-span-5 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/60 tracking-widest text-[11px]">:::</span>
                    <span className="font-semibold text-foreground whitespace-nowrap">Monthly Budget</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                    {totalBudgetLimitMinor > 0 ? `${Math.round((totalBudgetSpentMinor / totalBudgetLimitMinor) * 100)}% utilized` : 'No limits set'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end mt-4">
                  <div className="sm:col-span-7 space-y-1.5 min-w-0">
                    {/* Number strictly on 1 row */}
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-mono tabular-nums whitespace-nowrap truncate block">
                      {formatCAD(totalBudgetLimitMinor)}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500 whitespace-nowrap truncate">
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{formatCAD(Math.max(0, totalBudgetLimitMinor - totalBudgetSpentMinor))} safe capacity</span>
                    </div>

                    <div className="pt-4">
                      <Link
                        href="/client/budgets"
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-card hover:bg-secondary border border-border text-foreground text-xs font-semibold transition-colors shadow-xs whitespace-nowrap"
                      >
                        <Pencil className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span>Manage Limits</span>
                      </Link>
                    </div>
                  </div>

                  {/* 3-Bar Dynamic Chart */}
                  <div className="sm:col-span-5 flex items-end justify-end gap-2.5 h-32 pt-2 overflow-hidden">
                    <div className="flex flex-col justify-between text-[9px] font-mono text-muted-foreground/80 h-full py-1 text-right pr-1 shrink-0 whitespace-nowrap">
                      <span>Max</span>
                      <span>75%</span>
                      <span>50%</span>
                      <span>25%</span>
                      <span>0</span>
                    </div>

                    <div className="flex items-end gap-2 h-full">
                      {/* Bar 1: Salary (Green) */}
                      <div className="flex flex-col items-center gap-1.5 h-full justify-end min-w-0">
                        <div 
                          className="w-5 sm:w-6 rounded-t-lg bg-emerald-500 transition-all shadow-xs"
                          style={{ height: `${salaryBarHeight}%` }}
                          title={`Salary: ${formatCAD(salaryMinor)}`}
                        />
                        <span className="text-[9px] text-muted-foreground font-sans truncate w-9 text-center block whitespace-nowrap">Salary</span>
                      </div>

                      {/* Bar 2: Investments (Orange) */}
                      <div className="flex flex-col items-center gap-1.5 h-full justify-end min-w-0">
                        <div 
                          className="w-5 sm:w-6 rounded-t-lg bg-orange-500 transition-all shadow-xs"
                          style={{ height: `${investBarHeight}%` }}
                          title={`Investments: ${formatCAD(investmentsMinor)}`}
                        />
                        <span className="text-[9px] text-muted-foreground font-sans truncate w-9 text-center block whitespace-nowrap">Invest</span>
                      </div>

                      {/* Bar 3: Savings (Foreground: Black / White) */}
                      <div className="flex flex-col items-center gap-1.5 h-full justify-end min-w-0">
                        <div 
                          className="w-5 sm:w-6 rounded-t-lg bg-foreground transition-all shadow-xs"
                          style={{ height: `${savingsBarHeight}%` }}
                          title={`Savings: ${formatCAD(savingsMinor)}`}
                        />
                        <span className="text-[9px] text-muted-foreground font-sans truncate w-9 text-center block whitespace-nowrap">Save</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Saving Goal */}
              <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs overflow-hidden">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium min-w-0">
                    <span className="font-mono text-muted-foreground/60 tracking-widest text-[11px] shrink-0">:::</span>
                    <span className="font-semibold text-foreground truncate whitespace-nowrap">Saving goal</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap shrink-0">
                    Target {formatCAD(totalSavingsTarget)}
                  </span>
                </div>

                <div className="space-y-1 mt-3 min-w-0">
                  {/* Number strictly on 1 row */}
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono tabular-nums whitespace-nowrap truncate block">
                    {formatCAD(totalSavingsCurrent)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500 whitespace-nowrap truncate">
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{savingPercent}% of goal accumulated</span>
                  </div>
                </div>

                <div className="space-y-2.5 mt-4 min-w-0">
                  <div className="text-xs text-muted-foreground font-medium flex justify-between items-center whitespace-nowrap">
                    <span>Progress:</span>
                    <strong className="text-foreground font-bold font-mono">{savingPercent}%</strong>
                  </div>

                  {/* Segmented Green Progress Blocks */}
                  <div className="flex items-center gap-1 w-full min-w-0 overflow-hidden">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((blockIdx) => {
                      const isFilled = blockIdx <= activeSavingBlocks;
                      return (
                        <div
                          key={blockIdx}
                          className={`flex-1 h-4 sm:h-5 rounded-md transition-all shadow-xs ${
                            isFilled
                              ? 'bg-emerald-500'
                              : 'bg-secondary border border-border'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card 3: Upcoming Bills */}
              <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/60 tracking-widest text-[11px]">:::</span>
                    <span className="font-semibold text-foreground whitespace-nowrap">Upcoming bills</span>
                  </div>
                  <Link href="/client/subscriptions" className="text-[11px] text-muted-foreground hover:text-foreground whitespace-nowrap shrink-0">
                    View all &rarr;
                  </Link>
                </div>

                <div className="space-y-3 mt-3 divide-y divide-border">
                  {displayBills.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-xs font-mono">
                      No active recurring subscriptions found in database.
                    </div>
                  ) : (
                    displayBills.map((bill, bIdx) => {
                      const hasPriceIncrease = (bill.priceDeltaMinor || 0) > 0;
                      return (
                        <div key={bill.id || bIdx} className="flex items-center justify-between pt-2 gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-7 h-7 rounded-lg ${hasPriceIncrease ? 'bg-orange-500' : 'bg-emerald-500'} text-white flex items-center justify-center font-bold text-[9px] uppercase font-mono shrink-0 shadow-xs`}>
                              {bill.frequency === 'monthly' ? 'MO' : 'YR'}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-foreground truncate max-w-[120px] sm:max-w-[150px]">{bill.merchant}</div>
                              <div className="text-[11px] font-mono text-muted-foreground whitespace-nowrap tabular-nums">{formatCAD(bill.amountMinor)}</div>
                            </div>
                          </div>

                          <span className={`text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5 border px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                            hasPriceIncrease
                              ? 'text-orange-500 border-orange-500/20 bg-orange-500/10'
                              : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${hasPriceIncrease ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                            {hasPriceIncrease ? 'Price Bump' : 'Active'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* ROW 2: Income Breakdown, Expenses Breakdown, Outcome */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Card 4: Income Breakdown */}
              <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs overflow-hidden">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/60 tracking-widest text-[11px]">:::</span>
                    <span className="font-semibold text-foreground whitespace-nowrap">Income breakdown</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-muted-foreground mt-3">
                    <span className="flex items-center gap-1.5 font-medium text-foreground whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      Total Income
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 mt-5">
                  {totalIncomeMinor === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-xs font-mono">
                      No income records in current period.
                    </div>
                  ) : (
                    <>
                      <div className="w-full h-8 rounded-full bg-emerald-500 text-white flex items-center px-3 gap-2 shadow-xs transition-all overflow-hidden">
                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[11px] font-semibold font-sans truncate whitespace-nowrap">Primary Inflow ({formatCAD(totalIncomeMinor)})</span>
                      </div>

                      {salaryMinor > 0 && (
                        <div className="w-[85%] h-8 rounded-full bg-orange-500 text-white flex items-center px-3 gap-2 shadow-xs transition-all overflow-hidden">
                          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[11px] font-semibold font-sans truncate whitespace-nowrap">Salary / Operations ({formatCAD(salaryMinor)})</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Card 5: Expenses Breakdown (Semi-Circular Donut Arc in App Colors) */}
              <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs overflow-hidden">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/60 tracking-widest text-[11px]">:::</span>
                    <span className="font-semibold text-foreground whitespace-nowrap">Expenses breakdown</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[10.5px] text-muted-foreground mt-2.5">
                    {categoryEntries.length === 0 ? (
                      <span className="text-muted-foreground font-mono text-[10px]">No categories recorded</span>
                    ) : (
                      categoryEntries.slice(0, 4).map(([cat, amt], cIdx) => {
                        const colors = ['bg-orange-500', 'bg-emerald-500', 'bg-foreground', 'bg-muted-foreground'];
                        return (
                          <span key={cat} className="flex items-center gap-1 font-medium text-foreground whitespace-nowrap">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${colors[cIdx % colors.length]}`} />
                            <span className="truncate max-w-[80px]">{cat}</span>
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>

                {categoryEntries.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-xs font-mono">
                    No expense transactions found in ledger.
                  </div>
                ) : (
                  <div className="flex items-center justify-center pt-2">
                    <svg viewBox="0 0 200 115" className="w-48 sm:w-52 h-24 sm:h-28 overflow-visible">
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="18"
                        className="text-secondary"
                        strokeLinecap="round"
                      />
                      {/* Segment 1: Orange */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 35 68"
                        fill="none"
                        stroke="#fb923c"
                        strokeWidth="18"
                        strokeLinecap="round"
                      />
                      {/* Segment 2: Foreground (Black/White) */}
                      <path
                        d="M 38 64 A 80 80 0 0 1 75 32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="18"
                        className="text-foreground"
                        strokeLinecap="round"
                      />
                      {/* Segment 3: Green */}
                      <path
                        d="M 80 30 A 80 80 0 0 1 140 36"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="18"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}

                <div className="text-center text-xs font-mono text-muted-foreground pt-1 whitespace-nowrap truncate">
                  Total Expensed: <strong className="text-foreground">{formatCAD(totalExpenseMinor)}</strong>
                </div>
              </div>

              {/* Card 6: Outcome */}
              <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/60 tracking-widest text-[11px]">:::</span>
                    <span className="font-semibold text-foreground whitespace-nowrap">Outcome</span>
                  </div>

                  <span className="text-[10px] text-muted-foreground font-mono px-2 py-0.5 rounded-full bg-secondary border border-border whitespace-nowrap shrink-0">
                    Net Cash Flow
                  </span>
                </div>

                <div className="space-y-1 mt-2 min-w-0">
                  {/* Number strictly on 1 row */}
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono tabular-nums whitespace-nowrap truncate block">
                    {formatCAD(netOutcomeMinor)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500 whitespace-nowrap truncate">
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Double-entry reconciled surplus</span>
                  </div>
                </div>

                {/* Spline Area Chart */}
                <div className="h-20 w-full mt-2 relative overflow-hidden">
                  <svg viewBox="0 0 240 70" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="outcomeOrangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fb923c" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#fb923c" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 55 Q 60 40 120 48 T 240 15 L 240 70 L 0 70 Z"
                      fill="url(#outcomeOrangeGradient)"
                    />
                    <path
                      d="M 0 55 Q 60 40 120 48 T 240 15"
                      fill="none"
                      stroke="#fb923c"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <div className="flex justify-between text-[9px] font-mono text-muted-foreground pt-1 whitespace-nowrap">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
                  <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">CRA tax reserve completely isolated</span>
                </div>
              </div>
            </div>

            {/* ROW 3: Planned Expenses & Budget Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Card 7: Planned Expenses / Recent Activity (Wide Left) */}
              <div className="lg:col-span-7 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs overflow-hidden">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                    <span className="font-mono text-muted-foreground/60 tracking-widest text-[11px]">:::</span>
                    <span className="font-semibold text-foreground whitespace-nowrap">Planned & Recent Items</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowWhatsAppSim(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card hover:bg-secondary border border-border text-xs font-medium text-foreground transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>WhatsApp Capture</span>
                  </button>
                </div>

                <div className="divide-y divide-border text-xs">
                  {combinedPlannedList.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-xs font-mono">
                      No transactions in ledger yet. Send a receipt or text via WhatsApp simulator above.
                    </div>
                  ) : (
                    combinedPlannedList.map((item, idx) => (
                      <div key={item.id || idx} className="py-2.5 flex items-center justify-between gap-3 hover:bg-secondary/40 transition-colors px-2 rounded-xl">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-6 h-6 rounded-md ${item.status === 'Paid' ? 'bg-emerald-500' : 'bg-orange-500'} text-white flex items-center justify-center font-bold text-[8px] uppercase font-mono shrink-0 shadow-xs`}>
                            {item.status === 'Paid' ? 'LED' : 'WA'}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-foreground block truncate max-w-[140px] sm:max-w-[200px]">{item.title}</span>
                            <span className="text-[10px] text-muted-foreground block truncate max-w-[140px] sm:max-w-[200px]">{item.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-6 font-mono shrink-0">
                          <span className="font-bold text-foreground tabular-nums whitespace-nowrap">{item.amount}</span>

                          <span className="text-[11px] font-sans flex items-center gap-1.5 min-w-[70px] whitespace-nowrap">
                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Paid' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                            <span className={item.status === 'Paid' ? 'text-emerald-500 font-semibold' : 'text-orange-500 font-medium'}>
                              {item.status}
                            </span>
                          </span>

                          <span className="text-[11px] text-muted-foreground hidden sm:inline whitespace-nowrap">{item.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Card 8: Budget Flow (Dual Green & Orange Columns) */}
              <div className="lg:col-span-5 rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs overflow-hidden">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                      <span className="font-mono text-muted-foreground/60 tracking-widest text-[11px]">:::</span>
                      <span className="font-semibold text-foreground whitespace-nowrap">Budget flow</span>
                    </div>

                    <span className="text-[10px] text-muted-foreground font-mono px-2 py-0.5 rounded-full bg-secondary border border-border whitespace-nowrap shrink-0">
                      12 Months
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5 font-medium text-foreground whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      Income
                    </span>
                    <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                      Outcome
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2 overflow-hidden">
                  <div className="h-32 flex items-end justify-between gap-0.5 sm:gap-1.5 px-1 overflow-hidden">
                    {monthlyBars.map((col) => (
                      <div key={col.m} className="flex-1 flex flex-col items-center gap-0.5 sm:gap-1 h-full justify-end min-w-0 overflow-hidden">
                        {/* Top: Income (Green) */}
                        <div
                          className="w-full max-w-[10px] sm:max-w-[13px] rounded-t-md bg-emerald-500 shadow-xs transition-all"
                          style={{ height: `${col.inc}%` }}
                          title={`${col.m} Income: ${col.inc}%`}
                        />
                        {/* Bottom: Outcome (Orange) */}
                        <div
                          className="w-full max-w-[10px] sm:max-w-[13px] rounded-b-md bg-orange-500 shadow-xs transition-all"
                          style={{ height: `${col.out}%` }}
                          title={`${col.m} Outcome: ${col.out}%`}
                        />
                        <span className="text-[8px] sm:text-[8.5px] font-mono text-muted-foreground/80 mt-1 truncate text-center block w-full whitespace-nowrap">{col.m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AskMyMoneyModal
        isOpen={showAskMoney}
        onClose={() => setShowAskMoney(false)}
        accounts={state.accounts}
        transactions={state.transactions}
        pendingProposals={pendingProposals}
        safeToSpendMinor={totalBudgetLimitMinor - totalBudgetSpentMinor}
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
        tenantId={session?.tenantId || state.currentTenant?.id || 'ten-default'}
        userId={session?.userId || state.currentUser?.id || 'usr-default'}
      />
    </div>
  );
}
