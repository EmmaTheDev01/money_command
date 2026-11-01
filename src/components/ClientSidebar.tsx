'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MoneyCommandLogo from './MoneyCommandLogo';
import { db, AuthSession } from '@/lib/db';
import {
  LayoutDashboard,
  Receipt,
  Landmark,
  Repeat,
  PieChart,
  CalendarDays,
  Target,
  PiggyBank,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  WalletCards,
  Search,
  ChevronDown,
  LogOut
} from 'lucide-react';

export const ClientSidebar: React.FC<{ pendingProposalsCount?: number }> = ({ pendingProposalsCount = 0 }) => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const s = db.getCurrentSession();
    if (s) {
      setSession(s);
    }
  }, []);

  const userName = session?.name || 'Account User';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const menuItems = [
    { label: 'Dashboard', href: '/client', icon: LayoutDashboard },
    { label: 'Transactions', href: '/client/transactions', icon: Receipt, badge: pendingProposalsCount },
    { label: 'Bank Accounts', href: '/client/accounts', icon: Landmark },
    { label: 'Recurring', href: '/client/subscriptions', icon: Repeat },
    { label: 'Budgets', href: '/client/budgets', icon: PieChart },
    { label: 'Monthly & Weekly', href: '/client/period-views', icon: CalendarDays },
    { label: 'Goals & Rules', href: '/client/goals-rules', icon: Target },
    { label: 'Sinking Funds', href: '/client/sinking-funds', icon: PiggyBank },
    { label: 'Debt Tracker', href: '/client/debt-tracker', icon: CreditCard },
    { label: 'Net Worth', href: '/client/net-worth', icon: ShieldCheck },
    { label: 'Investments', href: '/client/investments', icon: TrendingUp },
    { label: 'Paycheck Planner', href: '/client/paycheck-planner', icon: WalletCards },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/70 backdrop-blur-md p-4 hidden md:flex flex-col justify-between transition-colors min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-1">
          <Link href="/client" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-xl bg-secondary border border-border flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs text-foreground">
              <MoneyCommandLogo variant="mark" className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-foreground block">
                MONEY COMMAND
              </span>
              <span className="text-[10px] text-muted-foreground -mt-0.5 block font-mono">
                Financial OS v2.0
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features..."
            className="w-full bg-secondary/80 border border-border rounded-xl pl-9 pr-10 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground font-sans transition-colors"
          />
          <div className="absolute right-2 top-2 flex items-center px-1.5 py-0.5 rounded-md bg-card border border-border text-[9px] font-mono text-muted-foreground">
            <span>⌘F</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-0.5 text-xs">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-foreground text-background font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    isActive ? 'bg-background text-foreground' : 'bg-secondary text-foreground border border-border'
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-secondary/60 transition-colors border border-transparent">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">{userName}</div>
              <div className="text-[10px] text-muted-foreground truncate font-mono">
                {session?.whatsappPhone || session?.email || 'Active Session'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              db.logout();
              window.location.href = '/login';
            }}
            title="Sign out of Financial OS"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
