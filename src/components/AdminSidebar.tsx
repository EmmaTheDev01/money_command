'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
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
      badgeColor: 'bg-secondary text-foreground border border-border',
    },
    {
      label: 'Tenants & Entities',
      href: '/admin/tenants',
      icon: Building,
      badge: 'Isolated',
      badgeColor: 'bg-secondary text-muted-foreground border border-border',
    },
    {
      label: 'Append-Only Audit Stream',
      href: '/admin/audit',
      icon: ScrollText,
      badge: 'SHA-256',
      badgeColor: 'bg-secondary text-muted-foreground border border-border',
    },
    {
      label: 'Meta Webhooks & Replay',
      href: '/admin/webhooks',
      icon: Webhook,
      badge: 'Meta Cloud',
      badgeColor: 'bg-secondary text-muted-foreground border border-border',
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
      badgeColor: 'bg-secondary text-muted-foreground border border-border',
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-background p-4 hidden md:flex flex-col justify-between transition-colors">
      <div className="space-y-6">
        <div>
          <div className="px-3">
            <h2 className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
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

        {/* PostgreSQL Engine Info */}
        <div className="rounded-3xl border border-border bg-secondary/30 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span>Core Database</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border">
              PostgreSQL 16
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            RLS tenant isolation, append-only trigger protection, and exact minor-unit arithmetic.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-border px-3 text-[11px] text-muted-foreground font-mono">
        <div>Release Gate #1</div>
        <div className="text-[10px] text-muted-foreground/80 mt-0.5">0 Unreconciled Journals</div>
      </div>
    </aside>
  );
};
