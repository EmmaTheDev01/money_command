'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Server,
  Building,
  ScrollText,
  Activity,
  Sliders,
  Webhook,
  Database
} from 'lucide-react';

interface AdminSidebarProps {
  unreconciledCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ unreconciledCount = 0 }) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'System Health & Metrics',
      href: '/admin',
      icon: Activity,
      badge: unreconciledCount === 0 ? '0 Errors' : `${unreconciledCount} Errors`,
      badgeColor: unreconciledCount === 0 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500 text-white',
    },
    {
      label: 'Tenants & Entities',
      href: '/admin/tenants',
      icon: Building,
      badge: 'Isolated',
      badgeColor: 'bg-muted text-muted-foreground',
    },
    {
      label: 'Append-Only Audit Stream',
      href: '/admin/audit',
      icon: ScrollText,
      badge: 'SHA-256',
      badgeColor: 'bg-muted text-muted-foreground',
    },
    {
      label: 'Meta Webhooks & Replay',
      href: '/admin/webhooks',
      icon: Webhook,
      badge: 'Meta Cloud',
      badgeColor: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    },
    {
      label: 'Feature Flags & Risk',
      href: '/admin/flags',
      icon: Sliders,
      badge: null,
    },
    {
      label: 'Supabase SQL & Schema',
      href: '/admin/schema',
      icon: Database,
      badge: '16 Tables',
      badgeColor: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-[var(--background)] p-4 hidden md:flex flex-col justify-between transition-colors">
      <div className="space-y-6">
        <div>
          <div className="px-3 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Admin Operations
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
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-muted-foreground'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        item.badgeColor || 'bg-muted text-muted-foreground'
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

        {/* Security Rule Gate Card */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs">
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
            Security Gate MC-001
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Strict tenant isolation enforced at RLS & DB layer. No cross-tenant record leakage or existence probing permitted.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-border text-[11px] text-muted-foreground">
        <p className="font-medium text-foreground">Ops Environment: PROD-READY</p>
        <p className="text-[10px]">Zero Unreconciled Invariant Active</p>
      </div>
    </aside>
  );
};
