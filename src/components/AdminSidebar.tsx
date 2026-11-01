'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MoneyCommandLogo from './MoneyCommandLogo';
import { db, AuthSession } from '@/lib/db';
import {
  Building,
  ScrollText,
  Activity,
  Sliders,
  Webhook,
  Database,
  Search,
  LogOut,
  ShieldAlert
} from 'lucide-react';

interface AdminSidebarProps {
  unreconciledCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ unreconciledCount = 0 }) => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
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
      label: 'Tenants & Multi-Entity',
      href: '/admin/tenants',
      icon: Building,
      badge: 'RLS',
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
      badge: 'Live',
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
      badge: '28 Tables',
    },
  ];

  const filteredItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/70 backdrop-blur-md p-4 hidden md:flex flex-col justify-between transition-colors min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-1">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-xl bg-secondary border border-border flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs text-foreground">
              <MoneyCommandLogo variant="mark" className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-foreground block">
                MONEY COMMAND
              </span>
              <span className="text-[10px] text-muted-foreground -mt-0.5 block font-mono">
                Admin Console
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
            placeholder="Search console..."
            className="w-full bg-secondary/80 border border-border rounded-xl pl-9 pr-10 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground font-sans transition-colors"
          />
          <div className="absolute right-2 top-2 flex items-center px-1.5 py-0.5 rounded-md bg-card border border-border text-[9px] font-mono text-muted-foreground">
            <span>⌘F</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-0.5 text-xs">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
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
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono shrink-0 ${
                      isActive
                        ? 'bg-background text-foreground'
                        : 'bg-secondary text-foreground border border-border'
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

      {/* Database Status & Admin Profile */}
      <div className="space-y-3 pt-3 border-t border-border">
        <div className="rounded-2xl border border-border bg-secondary/40 p-3 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              PostgreSQL 16
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-card border border-border text-foreground font-bold">
              RLS Active
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Append-only journals, tenant isolation, sha-256 audit log.
          </p>
        </div>

        <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-secondary/60 transition-colors border border-transparent">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">{adminName}</div>
              <div className="text-[10px] text-muted-foreground truncate font-mono">
                {session?.roleLabel || 'Super Admin'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              db.logout();
              window.location.href = '/login';
            }}
            title="Sign out of Admin Console"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
