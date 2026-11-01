'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { db, AuthSession } from '@/lib/db';
import {
  ShieldAlert,
  Building,
  ScrollText,
  Activity,
  Sliders,
  Webhook,
  Database,
  Search,
  ChevronDown
} from 'lucide-react';

interface AdminSidebarProps {
  unreconciledCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ unreconciledCount = 0 }) => {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(db.getCurrentSession());
  }, []);

  const adminName = session?.name || 'Administrator';
  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const navItems = [
    {
      label: 'System Health & Metrics',
      href: '/admin',
      icon: Activity,
      badge: unreconciledCount === 0 ? '0 Errors' : `${unreconciledCount} Errors`,
    },
    {
      label: 'Tenants & Entities',
      href: '/admin/tenants',
      icon: Building,
      badge: 'Isolated',
    },
    {
      label: 'Append-Only Audit Stream',
      href: '/admin/audit',
      icon: ScrollText,
      badge: 'SHA-256',
    },
    {
      label: 'Meta Webhooks & Replay',
      href: '/admin/webhooks',
      icon: Webhook,
      badge: 'Meta Cloud',
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
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/70 backdrop-blur-md p-4 hidden md:flex flex-col justify-between transition-colors min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-1">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs tracking-tight transition-transform group-hover:scale-105 shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-foreground block">
                Admin Console
              </span>
              <span className="text-[10px] text-muted-foreground -mt-0.5 block">
                Governance & Security
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit / flags..."
            className="w-full bg-secondary/80 border border-border rounded-xl pl-9 pr-10 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary font-sans transition-colors"
          />
          <div className="absolute right-2 top-2 flex items-center px-1.5 py-0.5 rounded-md bg-card border border-border text-[9px] font-mono text-muted-foreground">
            <span>⌘K</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-0.5 text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-muted-foreground border border-border'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Database Status Card & Admin User */}
      <div className="space-y-3 pt-3 border-t border-border">
        <div className="rounded-2xl border border-border bg-secondary/40 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              PostgreSQL 16
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-card border border-border text-foreground">
              Healthy
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Deterministic double-entry enforcement, row-level tenant isolation, append-only journals.
          </p>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-secondary/60 transition-colors border border-transparent">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">{adminName}</div>
              <div className="text-[10px] text-muted-foreground truncate">{session?.roleLabel || 'Super Administrator'}</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
      </div>
    </aside>
  );
};
