'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { Entity } from '@/lib/types';
import MoneyCommandLogo from './MoneyCommandLogo';

interface NavbarProps {
  entities?: Entity[];
  selectedEntityId?: string;
  onSelectEntity?: (entityId: string) => void;
  onOpenWhatsAppSimulator?: () => void;
  onOpenAskMoney?: () => void;
  unreconciledCount?: number;
  pendingProposalsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.dataset.theme;
    setIsDark(currentTheme === 'dark');
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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[var(--chrome-glass)] backdrop-blur-md transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Official Brand Logo Lockup */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <MoneyCommandLogo variant="mark" className="h-7 w-auto transition-transform group-hover:scale-105" />
          <span className="font-extrabold tracking-tight text-foreground flex items-center gap-1.5 text-sm sm:text-base uppercase font-sans">
            MONEY COMMAND
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
              v2.0
            </span>
          </span>
        </Link>

        {/* Right: Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="size-9 grid place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border"
          >
            {isDark ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4 text-neutral-800" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
