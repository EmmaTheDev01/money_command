'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  User, 
  ArrowUpRight, 
  ArrowDownRight, 
  Inbox, 
  ArrowRightLeft, 
  Sparkles, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { SafeToSpendWidget } from '@/components/SafeToSpendWidget';
import { AskMyMoneyModal } from '@/components/AskMyMoneyModal';
import { WhatsAppSimulatorModal } from '@/components/WhatsAppSimulatorModal';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';

export default function ClientDashboardPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [showAskMoney, setShowAskMoney] = useState(false);
  const [showWhatsAppSim, setShowWhatsAppSim] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const entityAccounts = state.accounts.filter((a) => a.entityId === activeEntity.id);
  const entityTransactions = state.transactions.filter((t) => t.entityId === activeEntity.id);
  const pendingProposals = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending');

  const totalAssetsMinor = entityAccounts
    .filter((a) => a.type === 'asset')
    .reduce((sum, a) => sum + a.balanceMinor, 0);

  const totalLiabilitiesMinor = entityAccounts
    .filter((a) => a.type === 'liability')
    .reduce((sum, a) => sum + a.balanceMinor, 0);

  const netWorthMinor = totalAssetsMinor - totalLiabilitiesMinor;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
        onOpenWhatsAppSimulator={() => setShowWhatsAppSim(true)}
        onOpenAskMoney={() => setShowAskMoney(true)}
        pendingProposalsCount={pendingProposals.length}
      />

      <div className="flex-1 flex">
        <ClientSidebar pendingProposalsCount={pendingProposals.length} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Title with Persona Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {activeEntity.name}
                </h1>
                <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                  {activeEntity.type.replace('_', ' ')}
                </span>
                {activeEntity.taxIdentifier && (
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-secondary text-foreground border border-border">
                    BN: {activeEntity.taxIdentifier}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Deterministic Financial Position &middot; Multi-Entity Separation
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowAskMoney(true)}
                className="px-3.5 py-1.5 rounded-full bg-card hover:bg-secondary border border-border text-foreground text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Ask My Money</span>
              </button>

              <button
                onClick={() => setShowWhatsAppSim(true)}
                className="px-3.5 py-1.5 rounded-full bg-secondary hover:bg-muted text-foreground border border-border text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Capture via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Pending Proposal Inbox Notification Banner */}
          {pendingProposals.length > 0 && (
            <div className="rounded-3xl border border-border bg-secondary/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-card border border-border text-foreground">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                    {pendingProposals.length} Inbound Proposal{pendingProposals.length > 1 ? 's' : ''} Awaiting Confirmation
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Latest: <strong>{pendingProposals[0].merchant}</strong> ({formatCAD(pendingProposals[0].amountMinor)}) extracted via WhatsApp AI. Untrusted until verified.
                  </p>
                </div>
              </div>

              <Link
                href="/client/proposals"
                className="self-start sm:self-auto px-4 py-2 rounded-full bg-foreground text-background font-semibold text-xs transition-all flex items-center gap-1 shadow-xs hover:opacity-90"
              >
                <span>Review & Post Journal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Financial Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block font-medium">
                Total Liquid Assets
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground tabular-nums">
                  {formatCAD(totalAssetsMinor)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-mono border border-border">
                  {entityAccounts.filter((a) => a.type === 'asset').length} Accounts
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Checking, Emergency HISA & Reserves
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block font-medium">
                Current Liabilities
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground tabular-nums">
                  {formatCAD(totalLiabilitiesMinor)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-mono border border-border">
                  Credit & Tax Due
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Credit cards & collected CRA GST/HST
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block font-medium">
                Net Entity Position
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground tabular-nums">
                  {formatCAD(netWorthMinor)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-foreground text-[10px] font-mono border border-border">
                  Reconciled
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Assets minus liabilities (Double-entry)
              </p>
            </div>
          </div>

          {/* Deterministic Safe-to-Spend Engine */}
          <SafeToSpendWidget
            accounts={entityAccounts}
            pendingProposals={pendingProposals}
            bufferMinor={state.safeToSpendBufferMinor}
            horizonDays={state.safeToSpendHorizonDays}
            onBufferChange={(newBuffer) => setState((prev) => ({ ...prev, safeToSpendBufferMinor: newBuffer }))}
            onHorizonChange={(newHorizon) => setState((prev) => ({ ...prev, safeToSpendHorizonDays: newHorizon }))}
          />

          {/* Accounts Breakdown & Recent Ledger Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Accounts Subledger */}
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  Chart of Accounts ({activeEntity.type})
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Source: PostgreSQL
                </span>
              </div>

              <div className="space-y-2">
                {entityAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-3.5 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between text-xs hover:border-foreground/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-lg bg-card text-muted-foreground border border-border">
                        {acc.code}
                      </span>
                      <div>
                        <div className="font-medium text-foreground">{acc.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{acc.type} &middot; {acc.subtype}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-foreground tabular-nums">
                        {formatCAD(acc.balanceMinor)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Posted Double-Entry Transactions */}
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground text-sm">
                    Recent Posted Journals
                  </h3>
                </div>
                <Link
                  href="/client/transactions"
                  className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors"
                >
                  View full ledger
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {entityTransactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No posted transactions yet for this entity.
                </div>
              ) : (
                <div className="space-y-2">
                  {entityTransactions.slice(0, 4).map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between text-xs hover:border-foreground/30 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="font-medium text-foreground flex items-center gap-2">
                          <span>{tx.merchant || tx.description}</span>
                          <span className="text-[9px] px-2 py-0.2 rounded-full font-mono bg-secondary text-muted-foreground border border-border">
                            {tx.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {tx.txDate} &middot; {tx.category} &middot; {tx.lines.length} balanced lines
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-semibold text-foreground tabular-nums">
                          {tx.type === 'income' ? '+' : '-'}{formatCAD(tx.totalMinor)}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {tx.accountantStatus.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

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
        accounts={entityAccounts}
        transactions={entityTransactions}
        pendingProposals={pendingProposals}
        safeToSpendMinor={state.safeToSpendBufferMinor + 120000}
      />
    </div>
  );
}
