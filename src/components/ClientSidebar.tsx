'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  CreditCard,
  TrendingUp,
  FileSpreadsheet,
  Search,
  ChevronDown,
  ChevronRight,
  Info,
  Sparkles,
  Command,
  ArrowUpRight,
  Inbox,
  LogOut
} from 'lucide-react';

interface ClientSidebarProps {
  pendingProposalsCount?: number;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({ pendingProposalsCount = 0 }) => {
  const pathname = usePathname();
  const [expensesOpen, setExpensesOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const isOverview = pathname === '/client';
  const isBudget = pathname === '/client/budgets';
  const isBills = pathname === '/client/subscriptions';
  const isExpenses = pathname === '/client/transactions' || pathname === '/client/proposals';
  const isInvestments = pathname === '/client/negotiations';
  const isReports = pathname === '/client/tax';

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/60 backdrop-blur-md p-4 hidden md:flex flex-col justify-between transition-colors min-h-[calc(100vh-4rem)]">
      <div className="space-y-5">
        {/* Brand & Info */}
        <div className="flex items-center justify-between px-1">
          <Link href="/client" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-xs tracking-tight transition-transform group-hover:scale-105">
              MC
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">
              Money Command
            </span>
          </Link>
          <button 
            type="button" 
            title="Money Command v2.0 Architecture"
            className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search Bar with ⌘ F badge */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-secondary/80 border border-border rounded-xl pl-9 pr-11 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-sans"
          />
          <div className="absolute right-2 top-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-card border border-border text-[9px] font-mono text-muted-foreground">
            <span>⌘</span>
            <span>F</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1 text-xs">
          {/* Overview */}
          <Link
            href="/client"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
              isOverview
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </Link>

          {/* Budget */}
          <Link
            href="/client/budgets"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
              isBudget
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Budget</span>
          </Link>

          {/* Bills */}
          <Link
            href="/client/subscriptions"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
              isBills
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Bills</span>
          </Link>

          {/* Expenses (collapsible) */}
          <div>
            <button
              type="button"
              onClick={() => setExpensesOpen(!expensesOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                isExpenses
                  ? 'text-foreground font-semibold bg-secondary/60'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4" />
                <span>Expenses</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expensesOpen ? 'rotate-0' : '-rotate-90'}`} />
            </button>

            {expensesOpen && (
              <div className="pl-9 pr-1 pt-1 pb-1 space-y-1">
                <Link
                  href="/client/transactions"
                  className={`block px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                    pathname === '/client/transactions'
                      ? 'font-semibold text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                  }`}
                >
                  Double-Entry Ledger
                </Link>
                <Link
                  href="/client/proposals"
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                    pathname === '/client/proposals'
                      ? 'font-semibold text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                  }`}
                >
                  <span>Proposal Inbox</span>
                  {pendingProposalsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-foreground text-background font-mono font-bold text-[9px]">
                      {pendingProposalsCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </div>

          {/* Investments / Negotiations */}
          <Link
            href="/client/negotiations"
            className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
              isInvestments
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4" />
              <span>Investments</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground -rotate-90" />
          </Link>

          {/* Reports / Tax */}
          <Link
            href="/client/tax"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
              isReports
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Reports</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Section: Upgrade Card & User Profile */}
      <div className="space-y-4 pt-4 border-t border-border">
        {/* Upgrade Card */}
        <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center">
            <span className="font-bold text-xs text-foreground font-mono">⌘</span>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-foreground">Upgrade for more</h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Take your budgeting to the next level with Money Command Pro feature.
            </p>
          </div>
          <Link
            href="/#pricing"
            className="block w-full text-center py-2 px-3 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
          >
            Upgrade now
          </Link>
        </div>

        {/* User Profile Card */}
        <Link
          href="/login"
          title="Switch session or log out"
          className="flex items-center justify-between p-2 rounded-2xl hover:bg-secondary/60 transition-colors border border-transparent hover:border-border"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs shrink-0">
              SM
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">Susan Meyers</div>
              <div className="text-[10px] text-muted-foreground truncate">susanm@gmail.com</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </Link>
      </div>
    </aside>
  );
};
