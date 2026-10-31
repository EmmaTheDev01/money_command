'use client';

import React, { useState, useEffect } from 'react';
import { 
  Repeat, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
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
                <Repeat className="w-6 h-6 text-emerald-500" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Subscriptions & Recurring Bills
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono font-semibold border border-emerald-500/20">
                  {entitySubscriptions.length} Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Detected via cadence analysis and merchant normalization. Consequential cancellations require explicit step-up authorization.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border text-right shadow-sm">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-mono">
                Total Annualized Commitments
              </span>
              <span className="text-xl font-bold font-mono text-emerald-500">
                {formatCAD(totalAnnualizedMinor)}<span className="text-xs text-muted-foreground font-normal">/yr</span>
              </span>
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

          {/* Subscriptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entitySubscriptions.map((sub) => {
              const hasPriceSpike = (sub.priceDeltaMinor || 0) > 0;

              return (
                <div
                  key={sub.id}
                  className={`rounded-3xl border p-6 space-y-4 shadow-sm bg-card transition-colors ${
                    hasPriceSpike ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-base">{sub.merchant}</h3>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                            sub.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}
                        >
                          {sub.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {sub.category} &middot; Renewal: {sub.nextBillingDate}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-bold font-mono text-foreground">
                        {formatCAD(sub.amountMinor)}
                      </span>
                      <span className="text-xs text-muted-foreground block font-sans">
                        per {sub.frequency}
                      </span>
                    </div>
                  </div>

                  {/* Price Spike Alert Callout */}
                  {hasPriceSpike && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-foreground flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        <strong>Price Spike Detected: </strong>
                        Increased by {formatCAD(sub.priceDeltaMinor)}/mo (last paid {formatCAD(sub.lastPriceMinor)}). Candidate for bill negotiation or cancellation.
                      </span>
                    </div>
                  )}

                  {/* Annualized Cost & Route */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
                    <div className="p-2.5 rounded-xl bg-secondary/60 border border-border">
                      <span className="text-[10px] text-muted-foreground block">Annual Cost:</span>
                      <span className="font-mono font-semibold text-foreground">
                        {formatCAD(sub.annualizedCostMinor)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-secondary/60 border border-border">
                      <span className="text-[10px] text-muted-foreground block">Cancellation Route:</span>
                      <span className="font-medium text-foreground capitalize flex items-center gap-1">
                        {sub.cancellationRoute === 'provider_api' && <ExternalLink className="w-3 h-3 text-emerald-500" />}
                        {sub.cancellationRoute === 'phone_script' && <PhoneCall className="w-3 h-3 text-amber-500" />}
                        {sub.cancellationRoute === 'email_draft' && <Mail className="w-3 h-3 text-blue-500" />}
                        {sub.cancellationRoute.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 flex justify-end">
                    {sub.status === 'active' ? (
                      <button
                        onClick={() => setSelectedSubForCancel(sub)}
                        className="px-4 py-2 rounded-full bg-secondary hover:bg-rose-500/10 text-rose-500 border border-border hover:border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel Subscription (Requires Auth)</span>
                      </button>
                    ) : (
                      <span className="text-xs text-amber-500 font-mono">
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
