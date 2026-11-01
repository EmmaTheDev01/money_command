'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { 
  Settings, 
  Building2, 
  FileCheck2, 
  CheckCircle2 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';

export default function SettingsPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(getInitialState());
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const s = db.getCurrentSession();
    if (!s) {
      router.push('/login?redirect=/client/settings');
    }
  }, [router]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0] || {
    id: 'ent-default',
    name: 'Primary Ledger',
  };
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;

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
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-foreground" />
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Workspace Settings & Consent Receipts
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Configure multi-entity parameters, privacy scopes, and deterministic buffer thresholds.
            </p>
          </div>

          {notification && (
            <div className="rounded-3xl border border-border bg-secondary/50 p-4 text-xs text-foreground flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-foreground" />
              <span>{notification}</span>
            </div>
          )}

          {/* Entities List */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              Configured Entities ({state.entities.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              {state.entities.map((ent) => (
                <div
                  key={ent.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    ent.id === state.selectedEntityId
                      ? 'border-foreground/40 bg-secondary/50 shadow-xs'
                      : 'border-border bg-secondary/20 hover:bg-secondary/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-foreground text-sm">{ent.name}</div>
                      <div className="text-[11px] text-muted-foreground uppercase mt-0.5 font-medium font-mono">
                        {ent.type.replace('_', ' ')} &middot; {ent.currency}
                      </div>
                      {ent.taxIdentifier && (
                        <div className="text-[11px] font-mono text-foreground mt-1 font-medium">
                          BN: {ent.taxIdentifier}
                        </div>
                      )}
                    </div>
                    {ent.isDefault && (
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground font-medium">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Consent Records */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-sm">
                  User Consent Receipts (Policy v2.0)
                </h3>
              </div>
              <span className="text-xs text-muted-foreground font-mono font-medium">
                Revocable & Scoped
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-foreground">
                    WhatsApp Message OCR & Structured Extraction
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Permission to temporarily process inbound text & receipts to propose ledger candidate fields.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-secondary text-foreground font-semibold border border-border self-start sm:self-auto shrink-0">
                  Active Consent
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-foreground">
                    Accountant Read-Only Document Review
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Permit invited external CPA/bookkeeper to verify ledger transactions and export tax schedules.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-secondary text-foreground font-semibold border border-border self-start sm:self-auto shrink-0">
                  Active Consent
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
