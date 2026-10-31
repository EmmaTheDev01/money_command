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
      badgeColor: 'bg-foreground text-background font-bold',
    },
    {
      label: 'Double-Entry Ledger',
      href: '/client/transactions',
      icon: ArrowRightLeft,
      badge: 'Balanced',
      badgeColor: 'bg-secondary text-foreground border border-border',
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
      badgeColor: 'bg-secondary text-muted-foreground border border-border',
    },
    {
      label: 'Tax Readiness (CRA)',
      href: '/client/tax',
      icon: FileSpreadsheet,
      badge: 'CA-ON',
      badgeColor: 'bg-secondary text-muted-foreground border border-border',
    },
    {
      label: 'WhatsApp Setup',
      href: '/client/whatsapp',
      icon: MessageSquare,
      badge: 'Active',
      badgeColor: 'bg-secondary text-foreground border border-border',
    },
    {
      label: 'Settings & Consent',
      href: '/client/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-background p-4 hidden md:flex flex-col justify-between transition-colors">
      <div className="space-y-6">
        <div>
          <div className="px-3">
            <h2 className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
              Client Surfaces
            </h2>
          </div>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-full px-3.5 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-secondary text-foreground font-semibold border border-border shadow-xs'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                        item.badgeColor || 'bg-secondary text-muted-foreground border border-border'
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

        {/* Canada-First Compliance Badge */}
        <div className="rounded-3xl border border-border bg-secondary/30 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span>Jurisdiction</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border">
              CA_ON 2026
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            All subledgers calculate Ontario 13% HST and CRA T2125 line items deterministically.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-border px-3 text-[11px] text-muted-foreground font-mono">
        <div>Strict Invariant: MC-010</div>
        <div className="text-[10px] text-muted-foreground/80 mt-0.5">Immutable Double-Entry</div>
      </div>
    </aside>
  );
};
