'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  ArrowRightLeft,
  PieChart,
  Repeat,
  Sparkles,
  FileSpreadsheet,
  MessageSquare,
  Settings,
  Scale
} from 'lucide-react';

interface ClientSidebarProps {
  pendingProposalsCount?: number;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({ pendingProposalsCount = 0 }) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Financial Overview',
      href: '/client',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Proposal Inbox',
      href: '/client/proposals',
      icon: Inbox,
      badge: pendingProposalsCount > 0 ? `${pendingProposalsCount} new` : null,
      badgeColor: 'bg-amber-400 text-slate-950 font-bold',
    },
    {
      label: 'Double-Entry Ledger',
      href: '/client/transactions',
      icon: ArrowRightLeft,
      badge: 'Balanced',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      label: 'Budgets & Guardrails',
      href: '/client/budgets',
      icon: PieChart,
      badge: null,
    },
    {
      label: 'Subscriptions & Bills',
      href: '/client/subscriptions',
      icon: Repeat,
      badge: null,
    },
    {
      label: 'Bill Negotiations',
      href: '/client/negotiations',
      icon: Scale,
      badge: 'Savings',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    },
    {
      label: 'Tax Readiness (CRA)',
      href: '/client/tax',
      icon: FileSpreadsheet,
      badge: 'CA-ON',
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      label: 'WhatsApp Setup',
      href: '/client/whatsapp',
      icon: MessageSquare,
      badge: 'Active',
      badgeColor: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      label: 'Settings & Consent',
      href: '/client/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950/60 p-4 hidden md:flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Financial Core & Actions
          </h2>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Deterministic Guardrail Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Policy Boundary
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            AI interprets and drafts. Posting, tax math, and ledger balances are deterministic and require user confirmation.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
        <p className="font-medium text-slate-400">Money Command v2.0</p>
        <p className="text-[10px]">Canada-first &middot; Minor Units Exact</p>
      </div>
    </aside>
  );
};
