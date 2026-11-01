'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { 
  Repeat, 
  ShieldAlert, 
  ExternalLink, 
  PhoneCall, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  X 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { ActionAuthorizationModal } from '@/components/ActionAuthorizationModal';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { Subscription } from '@/lib/types';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(getInitialState());
  const [selectedSubForCancel, setSelectedSubForCancel] = useState<Subscription | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const s = db.getCurrentSession();
    if (!s) {
      router.push('/login?redirect=/client/subscriptions');
      return;
    }
    async function load() {
      const activeId = state.selectedEntityId;
      const subs = await db.getSubscriptions(activeId);
      setState((prev) => ({ ...prev, subscriptions: subs }));
    }
    load();
  }, [router, state.selectedEntityId]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0] || {
    id: 'ent-default',
    name: 'Primary Ledger',
  };
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;
  const entitySubscriptions = state.subscriptions.filter((s) => s.entityId === activeEntity.id);

  const totalAnnualizedMinor = entitySubscriptions.reduce((sum, s) => sum + s.annualizedCostMinor, 0);

  const handleAuthorizeCancellation = (authRecord: {
    termsHash: string;
    authMethod: string;
    timestamp: string;
  }) => {
    if (!selectedSubForCancel) return;
    const sub = selectedSubForCancel;

    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === sub.id ? { ...s, status: 'cancellation_requested' as const } : s
      ),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          tenantId: prev.currentTenant?.id || 'ten-default',
          userId: prev.currentUser?.id || 'usr-default',
          userName: prev.currentUser?.fullName || 'User',
          entityType: activeEntity.type,
          action: 'AUTHORIZE_CONSEQUENTIAL_CANCELLATION',
          details: `Explicit authorization granted to cancel subscription ${sub.merchant} (${formatCAD(sub.amountMinor)}/${sub.frequency}). Terms hash verified. Route: ${sub.cancellationRoute}.`,
          termsHash: authRecord.termsHash,
          createdAt: authRecord.timestamp,
          ipAddress: '127.0.0.1 (Web Companion Step-up PIN)',
        },
        ...prev.auditLogs,
      ],
    }));

    setSelectedSubForCancel(null);
    setStatusMessage(`Explicit authorization recorded (Hash: ${authRecord.termsHash.substring(0, 16)}...). Cancellation initiated for ${sub.merchant}.`);
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
                <Repeat className="w-5 h-5 text-foreground" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Subscriptions & Recurring Bills
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono font-medium border border-border">
                  {entitySubscriptions.length} Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Detected via cadence analysis and merchant normalization. Consequential cancellations require explicit step-up authorization.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-card border border-border text-right shadow-xs">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-mono">
                Total Annualized Commitments
              </span>
              <span className="text-xl font-bold font-mono text-foreground tabular-nums">
                {formatCAD(totalAnnualizedMinor)}<span className="text-xs text-muted-foreground font-normal">/yr</span>
              </span>
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

          {/* Subscriptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entitySubscriptions.map((sub) => {
              const hasPriceSpike = (sub.priceDeltaMinor || 0) > 0;

              return (
                <div
                  key={sub.id}
                  className="rounded-3xl border border-border p-6 space-y-4 shadow-xs bg-card transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-base">{sub.merchant}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase bg-secondary text-muted-foreground border border-border">
                          {sub.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {sub.category} &middot; Renewal: {sub.nextBillingDate}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-bold font-mono text-foreground tabular-nums">
                        {formatCAD(sub.amountMinor)}
                      </span>
                      <span className="text-xs text-muted-foreground block font-sans">
                        per {sub.frequency}
                      </span>
                    </div>
                  </div>

                  {/* Price Spike Alert Callout */}
                  {hasPriceSpike && (
                    <div className="p-3.5 rounded-2xl bg-secondary/80 border border-border text-xs text-foreground flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span>
                        <strong>Price increase detected: </strong>
                        Charged {formatCAD(sub.amountMinor || 0)}, which is +{formatCAD(sub.priceDeltaMinor || 0)} higher than baseline.
                      </span>
                    </div>
                  )}

                  {/* Route & Action Trigger */}
                  <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span>Supported Route:</span>
                      <span className="font-mono text-foreground capitalize flex items-center gap-1">
                        {sub.cancellationRoute === 'provider_api' && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                        {sub.cancellationRoute === 'phone_script' && <PhoneCall className="w-3 h-3 text-muted-foreground" />}
                        {sub.cancellationRoute === 'email_draft' && <Mail className="w-3 h-3 text-muted-foreground" />}
                        {sub.cancellationRoute.replace('_', ' ')}
                      </span>
                    </div>

                    {sub.status !== 'cancellation_requested' && sub.status !== 'cancelled' ? (
                      <button
                        onClick={() => setSelectedSubForCancel(sub)}
                        className="px-4 py-2 rounded-full bg-secondary hover:bg-muted text-foreground border border-border text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Request Cancel</span>
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground font-mono">
                        Cancellation in Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Action Authorization Modal (Explicit Step-Up) */}
      <ActionAuthorizationModal
        isOpen={!!selectedSubForCancel}
        onClose={() => setSelectedSubForCancel(null)}
        targetSubscription={selectedSubForCancel}
        actionType="cancellation"
        onAuthorize={handleAuthorizeCancellation}
      />
    </div>
  );
}
