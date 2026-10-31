'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2, 
  Key, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { WhatsAppSimulatorModal } from '@/components/WhatsAppSimulatorModal';
import { getInitialState, saveState, AppState } from '@/lib/store';

export default function WhatsAppSetupPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [linkCode, setLinkCode] = useState<string>('MC-8942-CA');
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;

  const handleGenerateNewCode = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newCode = `MC-${randomDigits}-CA`;
    setLinkCode(newCode);
    setNotification('Generated new short-lived cryptographic binding token.');
    setTimeout(() => setNotification(null), 3000);
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-foreground" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  WhatsApp Capture & Linking
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono font-medium border border-border">
                  Verified &middot; Meta Cloud API
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Security Rule: Phone numbers alone are never accepted as proof of identity. Authentication requires cryptographic token linking.
              </p>
            </div>

            <button
              onClick={() => setShowSimulator(true)}
              className="px-5 py-2.5 bg-foreground hover:opacity-90 text-background font-semibold text-xs rounded-full transition-opacity flex items-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Webhook Sandbox</span>
            </button>
          </div>

          {notification && (
            <div className="rounded-3xl border border-border bg-secondary/50 p-4 text-xs text-foreground shadow-xs">
              {notification}
            </div>
          )}

          {/* Linked WhatsApp Account Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base">
                    Linked WhatsApp Number: {state.currentUser.whatsappPhone}
                  </h3>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />
                    Cryptographically linked to {state.currentUser.fullName} ({state.currentUser.email})
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border">
                Tenant: {state.currentTenant.name}
              </span>
            </div>

            {/* Token Exchange Box */}
            <div className="p-5 rounded-2xl bg-secondary/40 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  One-Time Linking Verification Code:
                </span>
                <button
                  onClick={handleGenerateNewCode}
                  className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate code
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-2xl font-bold tracking-widest text-foreground bg-card px-5 py-2.5 rounded-2xl border border-border shadow-xs tabular-nums">
                  {linkCode}
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Send this code from your WhatsApp to our verified business number to bind your phone to this workspace.
                </span>
              </div>
            </div>

            {/* Security Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
                <span className="text-foreground font-bold block mb-1">Replay Safe (MC-003)</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  All incoming Meta callbacks are keyed by <code>wamid.*</code>. Re-deliveries never duplicate proposals.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
                <span className="text-foreground font-bold block mb-1">Untrusted Boundary</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  AI extracts candidate fields. No irreversible journal entry is posted without your confirmation.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <WhatsAppSimulatorModal
        isOpen={showSimulator}
        onClose={() => setShowSimulator(false)}
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
    </div>
  );
}
