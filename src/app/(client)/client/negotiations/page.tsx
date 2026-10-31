'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  ShieldAlert, 
  Lock, 
  X 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { ActionAuthorizationModal } from '@/components/ActionAuthorizationModal';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { BillNegotiation } from '@/lib/types';

export default function NegotiationsPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [selectedNegForAuth, setSelectedNegForAuth] = useState<BillNegotiation | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;
  const entityNegotiations = state.negotiations.filter((n) => n.entityId === activeEntity.id);

  const handleAuthorizeNegotiation = (authRecord: {
    termsHash: string;
    authMethod: string;
    timestamp: string;
  }) => {
    if (!selectedNegForAuth) return;
    const neg = selectedNegForAuth;

    setState((prev) => ({
      ...prev,
      negotiations: prev.negotiations.map((n) =>
        n.id === neg.id ? { ...n, status: 'accepted' as const } : n
      ),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          tenantId: prev.currentTenant.id,
          userId: prev.currentUser.id,
          userName: prev.currentUser.fullName,
          entityType: activeEntity.type,
          action: 'AUTHORIZE_CONSEQUENTIAL_COUNTEROFFER',
          details: `Explicit human step-up authorization confirmed. Accepted counteroffer with ${neg.providerName} for rate ${formatCAD(
            neg.counterofferReceived?.offeredBillMinor || 0
          )}/mo. Verified terms hash logged.`,
          termsHash: authRecord.termsHash,
          createdAt: authRecord.timestamp,
          ipAddress: '127.0.0.1 (Web Companion Step-up PIN)',
        },
        ...prev.auditLogs,
      ],
    }));

    setSelectedNegForAuth(null);
    setStatusMessage(`Explicit authorization recorded. Counteroffer accepted with ${neg.providerName}. New rate is active on your billing profile.`);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
        pendingProposalsCount={pendingProposalsCount}
      />

      <div className="flex-1 flex">
        <ClientSidebar pendingProposalsCount={pendingProposalsCount} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-foreground" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Permissioned Bill Negotiation
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono font-medium border border-border">
                  Target: Lower Fixed Costs
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Deterministic target price and walk-away bounds. Any term change, fee, or contract extension requires explicit human approval.
              </p>
            </div>
          </div>

          {/* Status Toast */}
          {statusMessage && (
            <div className="rounded-3xl border border-border bg-secondary/50 p-4 flex items-center justify-between text-xs text-foreground shadow-xs animate-in fade-up">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-foreground" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Active Negotiations */}
          <div className="space-y-4">
            {entityNegotiations.map((neg) => (
              <div
                key={neg.id}
                className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-5">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-foreground">{neg.providerName}</h3>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-secondary text-foreground font-semibold border border-border">
                        Acct ending {neg.accountNumberLast4}
                      </span>
                      <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                        Mode: {neg.mode.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Gigabit Fibre Internet &middot; Price recently jumped from $95 to $115/mo
                    </p>
                  </div>

                  <div className="flex items-center gap-5 text-right">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-mono">Current Bill</span>
                      <span className="text-xl font-bold font-mono text-foreground tabular-nums">
                        {formatCAD(neg.currentBillMinor)}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-mono">Target Rate</span>
                      <span className="text-xl font-bold font-mono text-foreground tabular-nums">
                        {formatCAD(neg.targetBillMinor)}/mo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Script and Evidence Box */}
                <div className="rounded-3xl border border-border bg-secondary/40 p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Sparkles className="w-4 h-4 text-muted-foreground" />
                      Generated Negotiation Script & Counter-Arguments:
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Acceptable Range: {formatCAD(neg.targetBillMinor)} - {formatCAD(neg.minAcceptableBillMinor)}/mo
                    </span>
                  </div>
                  <p className="text-xs text-foreground font-mono bg-card p-4 rounded-2xl border border-border leading-relaxed">
                    &ldquo;{neg.scriptDraft}&rdquo;
                  </p>
                </div>

                {/* Counteroffer Review Card */}
                {neg.counterofferReceived && (
                  <div className="rounded-3xl border border-border bg-secondary/30 p-6 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-full bg-secondary text-foreground border border-border">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Counteroffer Received from Retention Department
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-foreground font-bold tabular-nums">
                        Verified Savings: CAD $420.00/yr
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border text-xs space-y-1.5 shadow-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Offered New Monthly Rate:</span>
                        <span className="font-mono font-bold text-foreground tabular-nums">
                          {formatCAD(neg.counterofferReceived.offeredBillMinor)}/mo (Saved $35/mo)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contract Term Commitment:</span>
                        <span className="font-medium text-foreground">
                          {neg.counterofferReceived.termMonths} Months (No early exit penalty)
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground pt-1.5 border-t border-border">
                        {neg.counterofferReceived.notes}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-1">
                      {neg.status !== 'accepted' ? (
                        <button
                          onClick={() => setSelectedNegForAuth(neg)}
                          className="px-5 py-2.5 bg-foreground hover:opacity-90 text-background font-semibold text-xs rounded-full transition-opacity flex items-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Authorize & Accept Counteroffer</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-foreground flex items-center gap-1.5 bg-secondary px-3.5 py-1.5 rounded-full border border-border">
                          <CheckCircle2 className="w-4 h-4" />
                          Accepted and active on account!
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <ActionAuthorizationModal
        isOpen={Boolean(selectedNegForAuth)}
        onClose={() => setSelectedNegForAuth(null)}
        targetNegotiation={selectedNegForAuth}
        actionType="counteroffer_acceptance"
        onAuthorize={handleAuthorizeNegotiation}
      />
    </div>
  );
}
