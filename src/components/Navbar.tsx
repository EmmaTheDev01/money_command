'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  User, 
  ShieldAlert, 
  MessageSquare, 
  FileText, 
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { Entity } from '@/lib/types';

interface NavbarProps {
  entities: Entity[];
  selectedEntityId: string;
  onSelectEntity: (entityId: string) => void;
  onOpenWhatsAppSimulator?: () => void;
  onOpenAskMoney?: () => void;
  unreconciledCount?: number;
  pendingProposalsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  entities,
  selectedEntityId,
  onSelectEntity,
  onOpenWhatsAppSimulator,
  onOpenAskMoney,
  unreconciledCount = 0,
  pendingProposalsCount = 0,
}) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isAccountant = pathname.startsWith('/accountant');
  const isClient = pathname.startsWith('/client');
  const currentEntity = entities.find((e) => e.id === selectedEntityId) || entities[0];

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const currentTheme = document.documentElement.dataset.theme;
    setIsDark(currentTheme !== 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem('theme', nextTheme);
    } catch {}
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[var(--chrome-glass)] backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Surface Switcher */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
              M
            </div>
            <div>
              <span className="font-semibold tracking-tight text-foreground flex items-center gap-1.5 text-sm">
                MONEY COMMAND
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                  v2.0
                </span>
              </span>
              <p className="text-[11px] text-muted-foreground -mt-0.5 hidden sm:block">
                Personal AI CFO &middot; Founder Financial OS
              </p>
            </div>
          </Link>

          {/* Navigation Hub Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-secondary rounded-full border border-border text-xs">
            <Link
              href="/client"
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                isClient
                  ? 'bg-foreground text-background font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Client Dashboard</span>
              {pendingProposalsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-background text-foreground font-bold text-[10px]">
                  {pendingProposalsCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin"
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                isAdmin
                  ? 'bg-foreground text-background font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Console</span>
              {unreconciledCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-background text-foreground font-bold text-[10px]">
                  !
                </span>
              )}
            </Link>

            <Link
              href="/accountant"
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                isAccountant
                  ? 'bg-foreground text-background font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Accountant Portal</span>
            </Link>

            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <span>Sessions</span>
            </Link>
          </nav>
        </div>

        {/* Right: Actions, Entity Switcher & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Ask My Money button */}
          {onOpenAskMoney && (
            <button
              onClick={onOpenAskMoney}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card border border-border text-foreground hover:bg-secondary text-xs font-medium transition-colors shadow-xs"
              title="Query deterministic financial metrics with natural language"
            >
              <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Ask My Money</span>
            </button>
          )}

          {/* WhatsApp Simulator trigger */}
          {onOpenWhatsAppSimulator && (
            <button
              onClick={onOpenWhatsAppSimulator}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary hover:bg-muted border border-border text-foreground text-xs font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">WhatsApp Sandbox</span>
            </button>
          )}

          {/* Entity Switcher dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1.5 bg-card border border-border rounded-full p-1 pr-2 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                {currentEntity?.type === 'personal' ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Building2 className="w-3.5 h-3.5" />
                )}
              </div>
              <select
                value={selectedEntityId}
                onChange={(e) => onSelectEntity(e.target.value)}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer pr-1"
              >
                {entities.map((entity) => (
                  <option key={entity.id} value={entity.id} className="bg-card text-foreground">
                    {entity.name} ({entity.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Theme Toggle Button (Patensify style) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="size-9 grid place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border"
          >
            {isDark ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>

          {/* Ledger Health Status Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border text-[11px] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-foreground" />
            <span className="text-muted-foreground">Core Ledger:</span>
            <span className="text-foreground font-mono font-medium">Reconciled (0 Err)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
