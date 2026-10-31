'use client';

import React, { useState, useEffect } from 'react';
import { 
  Repeat, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight, 
  Ban, 
  FileText, 
  PhoneCall, 
  Mail, 
  ExternalLink 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { ActionAuthorizationModal } from '@/components/ActionAuthorizationModal';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { Subscription, AuditLog } from '@/lib/types';

export default function SubscriptionsPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [selectedSubForCancel, setSelectedSubForCancel] = useState<Subscription | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;
  const entitySubscriptions = state.subscriptions.filter((s) => s.entityId === activeEntity.id);

  const totalAnnualizedMinor = entitySubscriptions.reduce((sum, s) => sum + s.annualizedCostMinor, 0);

  const handleAuthorizeCancellation = (authRecord: { termsHash: string; authMethod: string; timestamp: string }) => {
    if (!selectedSubForCancel) return;

    const sub = selectedSubForCancel;
    const auditEntry: AuditLog = {
      id: `audit-${Date.now()}`,
      tenantId: state.currentTenant.id,
      userId: state.currentUser.id,
      userName: state.currentUser.fullName,
      action: 'AUTHORIZE_CANCELLATION',
      entityType: 'subscription',
      entityId: sub.id,
      details: `User explicitly authorized cancellation for ${sub.merchant}. Scope: Non-renewal at period end. Terms hash: ${authRecord.termsHash}. Method: ${authRecord.authMethod}.`,
      termsHash: authRecord.termsHash,
      ipAddress: '198.51.100.42 (Toronto, ON)',
      createdAt: authRecord.timestamp,
    };

    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((item) =>
        item.id === sub.id ? { ...item, status: 'cancellation_requested' as const } : item
      ),
      auditLogs: [auditEntry, ...prev.auditLogs],
    }));

    setSelectedSubForCancel(null);
    setStatusMessage(`✓ Explicit authorization recorded (Hash: ${authRecord.termsHash.substring(0, 16)}...). Cancellation initiated for ${sub.merchant}.`);
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
                <Repeat className="w-6 h-6 text-emerald-400" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Subscriptions & Recurring Bills
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-semibold border border-emerald-500/20">
                  {entitySubscriptions.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Detected via cadence analysis and merchant normalization. Consequential cancellations require explicit step-up authorization.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Total Annualized Commitments
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {formatCAD(totalAnnualizedMinor)}<span className="text-xs text-slate-400 font-normal">/yr</span>
              </span>
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

          {/* Subscriptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entitySubscriptions.map((sub) => {
              const hasPriceSpike = (sub.priceDeltaMinor || 0) > 0;

              return (
                <div
                  key={sub.id}
                  className={`rounded-2xl border p-5 space-y-4 shadow-lg bg-slate-900/60 transition-colors ${
                    hasPriceSpike ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-100 text-base">{sub.merchant}</h3>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            sub.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          }`}
                        >
                          {sub.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {sub.category} &middot; Renewal: {sub.nextBillingDate}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-bold font-mono text-white">
                        {formatCAD(sub.amountMinor)}
                      </span>
                      <span className="text-xs text-slate-400 block font-sans">
                        per {sub.frequency}
                      </span>
                    </div>
                  </div>

                  {/* Price Spike Alert Callout */}
                  {hasPriceSpike && (
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        <strong>Price Spike Detected: </strong>
                        Increased by {formatCAD(sub.priceDeltaMinor)}/mo (last paid {formatCAD(sub.lastPriceMinor)}). Candidate for bill negotiation or cancellation!
                      </span>
                    </div>
                  )}

                  {/* Annualized Cost & Route */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Annual Cost:</span>
                      <span className="font-mono font-semibold text-slate-200">
                        {formatCAD(sub.annualizedCostMinor)}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Cancellation Route:</span>
                      <span className="font-medium text-slate-300 capitalize flex items-center gap-1">
                        {sub.cancellationRoute === 'provider_api' && <ExternalLink className="w-3 h-3 text-emerald-400" />}
                        {sub.cancellationRoute === 'phone_script' && <PhoneCall className="w-3 h-3 text-amber-400" />}
                        {sub.cancellationRoute === 'email_draft' && <Mail className="w-3 h-3 text-blue-400" />}
                        {sub.cancellationRoute.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 flex justify-end">
                    {sub.status === 'active' ? (
                      <button
                        onClick={() => setSelectedSubForCancel(sub)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel Subscription (Requires Auth)</span>
                      </button>
                    ) : (
                      <span className="text-xs text-amber-300 font-mono">
                        Cancellation In Progress &middot; Monitoring Next Cycle
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Explicit Consequential Action Authorization Modal */}
      <ActionAuthorizationModal
        isOpen={Boolean(selectedSubForCancel)}
        onClose={() => setSelectedSubForCancel(null)}
        targetSubscription={selectedSubForCancel}
        actionType="cancellation"
        onAuthorize={handleAuthorizeCancellation}
      />
    </div>
  );
}

