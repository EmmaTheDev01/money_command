'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  Check
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { ActionAuthorizationModal } from '@/components/ActionAuthorizationModal';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { BillNegotiation, AuditLog } from '@/lib/types';

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

  const handleAuthorizeNegotiation = (authRecord: { termsHash: string; authMethod: string; timestamp: string }) => {
    if (!selectedNegForAuth) return;

    const neg = selectedNegForAuth;
    const auditEntry: AuditLog = {
      id: `audit-${Date.now()}`,
      tenantId: state.currentTenant.id,
      userId: state.currentUser.id,
      userName: state.currentUser.fullName,
      action: 'APPROVE_NEGOTIATED_COUNTEROFFER',
      entityType: 'bill_negotiation',
      entityId: neg.id,
      details: `User approved negotiated rate for ${neg.providerName}. New rate: CAD 80.00/month (Term: 12 months). Verified Annual Savings: CAD 420.00. Terms hash: ${authRecord.termsHash}.`,
      termsHash: authRecord.termsHash,
      ipAddress: '198.51.100.42 (Toronto, ON)',
      createdAt: authRecord.timestamp,
    };

    setState((prev) => ({
      ...prev,
      negotiations: prev.negotiations.map((item) =>
        item.id === neg.id ? { ...item, status: 'accepted' } : item
      ),
      auditLogs: [auditEntry, ...prev.auditLogs],
    }));

    setSelectedNegForAuth(null);
    setStatusMessage(`✓ Counteroffer accepted and recorded in audit log. You saved CAD 420.00/year on ${neg.providerName}!`);
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
                <Scale className="w-6 h-6 text-emerald-500" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Permissioned Bill Negotiation
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono font-semibold border border-emerald-500/20">
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
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex items-center justify-between text-xs text-foreground animate-in fade-up">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage(null)}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </button>
            </div>
          )}

          {/* Active Negotiations */}
          <div className="space-y-4">
            {entityNegotiations.map((neg) => (
              <div
                key={neg.id}
                className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-5">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-foreground">{neg.providerName}</h3>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-semibold border border-emerald-500/20">
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
                      <span className="text-xl font-bold font-mono text-rose-500">
                        {formatCAD(neg.currentBillMinor)}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-500 uppercase tracking-wider block font-mono">Target Rate</span>
                      <span className="text-xl font-bold font-mono text-emerald-500">
                        {formatCAD(neg.targetBillMinor)}/mo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Script and Evidence Box */}
                <div className="rounded-2xl border border-border bg-secondary/40 p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-1.5 text-amber-500">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Generated Negotiation Script & Counter-Arguments:
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Acceptable Range: {formatCAD(neg.targetBillMinor)} - {formatCAD(neg.minAcceptableBillMinor)}/mo
                    </span>
                  </div>
                  <p className="text-xs text-foreground font-mono bg-card p-4 rounded-xl border border-border leading-relaxed">
                    &ldquo;{neg.scriptDraft}&rdquo;
                  </p>
                </div>

                {/* Counteroffer Review Card */}
                {neg.counterofferReceived && (
                  <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/5 p-5 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-cyan-500/20 text-cyan-500">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Counteroffer Received from Retention Department
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-emerald-500 font-bold">
                        Verified Savings: CAD $420.00/yr
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-card border border-border text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Offered New Monthly Rate:</span>
                        <span className="font-mono font-bold text-emerald-500">
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
                          className="px-5 py-2.5 bg-primary hover:opacity-90 text-primary-foreground font-bold text-xs rounded-full transition-opacity flex items-center gap-1.5 shadow-md"
                        >
                          <Check className="w-4 h-4" />
                          <span>Authorize & Accept Counteroffer</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-emerald-500 flex items-center gap-1.5 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
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
