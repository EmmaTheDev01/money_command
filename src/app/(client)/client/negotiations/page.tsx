'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  FileText,
  Clock,
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
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
                <Scale className="w-6 h-6 text-emerald-400" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Permissioned Bill Negotiation
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-semibold border border-emerald-500/20">
                  Target: Lower Fixed Costs
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Deterministic target price and walk-away bounds. Any term change, fee, or contract extension requires explicit human approval.
              </p>
            </div>
          </div>

          {/* Status Toast */}
          {statusMessage && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage(null)}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          )}

          {/* Active Negotiations */}
          <div className="space-y-4">
            {entityNegotiations.map((neg) => (
              <div
                key={neg.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-white">{neg.providerName}</h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        Acct ending {neg.accountNumberLast4}
                      </span>
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        Mode: {neg.mode.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Gigabit Fibre Internet &middot; Price recently jumped from $95 to $115/mo
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Current Bill</span>
                      <span className="text-xl font-bold font-mono text-rose-400">
                        {formatCAD(neg.currentBillMinor)}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">Target Rate</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">
                        {formatCAD(neg.targetBillMinor)}/mo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Script and Evidence Box */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Generated Negotiation Script & Counter-Arguments:
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Acceptable Range: {formatCAD(neg.targetBillMinor)} - {formatCAD(neg.minAcceptableBillMinor)}/mo
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono bg-slate-900/90 p-3 rounded-lg border border-slate-800 leading-relaxed">
                    &ldquo;{neg.scriptDraft}&rdquo;
                  </p>
                </div>

                {/* Counteroffer Review Card */}
                {neg.counterofferReceived && (
                  <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-cyan-500/20 text-cyan-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                        <h4 className="text-xs font-bold text-cyan-200 uppercase tracking-wider">
                          Counteroffer Received from Retention Department
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        Verified Savings: CAD $420.00/yr
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Offered New Monthly Rate:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {formatCAD(neg.counterofferReceived.offeredBillMinor)}/mo (Saved $35/mo)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contract Term Commitment:</span>
                        <span className="font-medium text-slate-200">
                          {neg.counterofferReceived.termMonths} Months (No early exit fee)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        {neg.counterofferReceived.notes}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-1">
                      {neg.status !== 'accepted' ? (
                        <button
                          onClick={() => setSelectedNegForAuth(neg)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                        >
                          <Check className="w-4 h-4" />
                          <span>Authorize & Accept Counteroffer</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-500/30">
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

