'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  MessageSquare, 
  Lock, 
  Layers, 
  Sparkles, 
  Building2, 
  User, 
  FileCheck2, 
  Activity, 
  ChevronRight,
  Database,
  CheckCircle2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { WhatsAppSimulatorModal } from '@/components/WhatsAppSimulatorModal';
import { AskMyMoneyModal } from '@/components/AskMyMoneyModal';
import { getInitialState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';

export default function HomePage() {
  const [state, setState] = useState(getInitialState());
  const [showWhatsAppSim, setShowWhatsAppSim] = useState(false);
  const [showAskMoney, setShowAskMoney] = useState(false);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposalsCount = state.proposals.filter((p) => p.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
        onOpenWhatsAppSimulator={() => setShowWhatsAppSim(true)}
        onOpenAskMoney={() => setShowAskMoney(true)}
        pendingProposalsCount={pendingProposalsCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Canada-First Financial Operating System &middot; v2.0 Execution Blueprint</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Personal AI CFO. Founder Financial OS.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Deterministic Financial Truth.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              AI interprets natural language, voice notes, and receipts into structured proposals.
              The authoritative PostgreSQL ledger, Safe-to-Spend, and tax rules remain 100% deterministic and auditable.
            </p>

            {/* Surface Launcher CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/client"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 group"
              >
                <User className="w-4 h-4" />
                <span>Launch Client Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/admin"
                className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Open Admin Console</span>
              </Link>

              <button
                onClick={() => setShowWhatsAppSim(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Simulate WhatsApp Webhook</span>
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Ledger Invariant:</span>
                <span className="text-emerald-400 font-semibold">Debits = Credits</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Posting Math:</span>
                <span className="text-emerald-400 font-semibold">Integer Minor Units</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">First Slice:</span>
                <span className="text-emerald-400 font-semibold">CAD 46 Grocery Verified</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Supabase DB:</span>
                <span className="text-emerald-400 font-semibold">16 Tables Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Surfaces Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Integrated Product Surfaces
              </h2>
              <p className="text-xs text-slate-400">
                Each surface is purpose-built for its user persona while backed by the single PostgreSQL financial core.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Surface 1: Client UI */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-100 text-base">
                  Client & Founder Dashboard
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Personal & business financial health, unposted proposal inbox, double-entry ledger, deterministic Safe-to-Spend, and subscription cancellation assistant.
                </p>
                <div className="space-y-1.5 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Multi-entity switcher (Personal vs Sole Prop)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Safe-to-Spend horizon calculation (7d / 14d / 30d)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ask My Money AI with deterministic citations</span>
                  </div>
                </div>
              </div>

              <Link
                href="/client"
                className="mt-4 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/80"
              >
                <span>Enter Client UI</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Surface 2: Admin Console */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-100 text-base">
                  Admin Console & Governance
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  System health metrics, zero unreconciled journal verification, multi-tenant operations, SHA-256 action audit trail, and Meta webhook inspector.
                </p>
                <div className="space-y-1.5 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>0 Unreconciled Journals Gate Enforcement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Cryptographic terms_hash audit trail</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Live feature flags & rate-limiting toggles</span>
                  </div>
                </div>
              </div>

              <Link
                href="/admin"
                className="mt-4 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/80"
              >
                <span>Enter Admin Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Surface 3: Accountant Portal */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-100 text-base">
                  Accountant & Tax Readiness
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Revocable client grants, source document review status, CRA T2125/T1 category mapping, and standardized CSV export packages.
                </p>
                <div className="space-y-1.5 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ontario 13% HST collected payable tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Document review state (Unreviewed / Reviewed)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Audit-tied CSV export for tax filing software</span>
                  </div>
                </div>
              </div>

              <Link
                href="/accountant"
                className="mt-4 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/80"
              >
                <span>Enter Accountant Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Pricing Tiers (From Blueprint) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-bold text-white">
              Launch Pricing Structure
            </h2>
            <p className="text-xs text-slate-400">
              Clear Canada-first pricing for individual freelancers, founders, and cohort organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Personal
              </span>
              <div className="text-3xl font-extrabold text-white font-mono">
                CAD $5<span className="text-xs font-normal text-slate-400">/month</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                For solo freelancers and creators. WhatsApp capture, double-entry personal ledger, Safe-to-Spend, and receipt parsing.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/40 bg-slate-950 p-5 space-y-3 relative shadow-md">
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase">
                Most Popular
              </span>
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Founder
              </span>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                CAD $10<span className="text-xs font-normal text-slate-400">/month</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-entity separation (Personal & Sole Prop/Corp), CRA tax reserve, bill negotiation coach, and accountant export package.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Organization Pilot
              </span>
              <div className="text-3xl font-extrabold text-white font-mono">
                CAD $5,000<span className="text-xs font-normal text-slate-400">/60-day pilot</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                For accelerator cohorts and institutions. Aggregated privacy-safe metrics, dedicated onboarding, and tenant isolation.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <WhatsAppSimulatorModal
        isOpen={showWhatsAppSim}
        onClose={() => setShowWhatsAppSim(false)}
        onNewProposal={(newProp) => {
          setState((prev) => ({
            ...prev,
            proposals: [newProp, ...prev.proposals],
          }));
        }}
        entityId={activeEntity.id}
        tenantId={state.currentTenant.id}
        userId={state.currentUser.id}
      />

      <AskMyMoneyModal
        isOpen={showAskMoney}
        onClose={() => setShowAskMoney(false)}
        accounts={state.accounts.filter((a) => a.entityId === activeEntity.id)}
        transactions={state.transactions.filter((t) => t.entityId === activeEntity.id)}
        pendingProposals={state.proposals.filter((p) => p.entityId === activeEntity.id)}
        safeToSpendMinor={state.safeToSpendBufferMinor + 120000}
      />
    </div>
  );
}
