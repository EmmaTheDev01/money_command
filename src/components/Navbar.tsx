'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  User, 
  ShieldAlert, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronDown,
  Sparkles
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
  const currentEntity = entities.find((e) => e.id === selectedEntityId) || entities[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Surface Switcher */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg group-hover:border-emerald-400 transition-colors">
              M
            </div>
            <div>
              <span className="font-bold tracking-tight text-white flex items-center gap-1.5 text-base">
                MONEY COMMAND
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  OS v2.0
                </span>
              </span>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                Personal AI CFO &middot; Founder Financial OS
              </p>
            </div>
          </Link>

          {/* Navigation Hub Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 rounded-lg border border-slate-800 text-xs">
            <Link
              href="/client"
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                !isAdmin && !isAccountant
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Client Dashboard
              {pendingProposalsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                  {pendingProposalsCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                isAdmin
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin Console
              {unreconciledCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold text-[10px]">
                  !
                </span>
              )}
            </Link>

            <Link
              href="/accountant"
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                isAccountant
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Accountant Portal
            </Link>
          </nav>
        </div>

        {/* Right: Actions, Entity Switcher & Simulators */}
        <div className="flex items-center gap-3">
          {/* Ask My Money button */}
          {onOpenAskMoney && (
            <button
              onClick={onOpenAskMoney}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium hover:border-emerald-400 transition-all shadow-sm"
              title="Query deterministic financial metrics with natural language"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Ask My Money</span>
            </button>
          )}

          {/* WhatsApp Simulator trigger */}
          {onOpenWhatsAppSimulator && (
            <button
              onClick={onOpenWhatsAppSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs font-medium hover:bg-emerald-900/40 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp Meta Sandbox</span>
            </button>
          )}

          {/* Entity Switcher dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 pr-2">
              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-300">
                {currentEntity?.type === 'personal' ? (
                  <User className="w-3.5 h-3.5 text-blue-400" />
                ) : (
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <select
                value={selectedEntityId}
                onChange={(e) => onSelectEntity(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                {entities.map((entity) => (
                  <option key={entity.id} value={entity.id} className="bg-slate-900 text-slate-200">
                    {entity.name} ({entity.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ledger Health Status Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400">PostgreSQL Core:</span>
            <span className="text-emerald-400 font-mono font-medium">Reconciled (0 Err)</span>
          </div>
        </div>
      </div>
    </header>
  );
};

