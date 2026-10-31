'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  Check, 
  X 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { auditLedgerIntegrity } from '@/lib/ledger';

export default function AdminFlagsPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const ledgerAudit = auditLedgerIntegrity(state.transactions);

  const toggleFlag = (flagId: string) => {
    setState((prev) => ({
      ...prev,
      featureFlags: prev.featureFlags.map((f) =>
        f.id === flagId ? { ...f, enabled: !f.enabled } : f
      ),
    }));
    setToastMessage('Feature flag updated across all cluster instances.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
        unreconciledCount={ledgerAudit.unreconciledCount}
      />

      <div className="flex-1 flex">
        <AdminSidebar unreconciledCount={ledgerAudit.unreconciledCount} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-foreground" />
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Feature Flags & Operational Risk Controls
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground font-mono font-medium">
                Dynamic Circuit Breakers
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Safely isolate capabilities, halt third-party messaging integrations, or restrict action authorizations in real time.
            </p>
          </div>

          {toastMessage && (
            <div className="rounded-3xl border border-border bg-secondary/50 p-4 text-xs text-foreground flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-foreground" />
              <span>{toastMessage}</span>
            </div>
          )}

          <div className="space-y-3.5">
            {state.featureFlags.map((flag) => (
              <div
                key={flag.id}
                className="p-5 rounded-3xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-semibold text-foreground text-sm">
                      {flag.key}
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold bg-secondary text-foreground border border-border">
                      {flag.enabled ? 'Active (100% Rollout)' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {flag.description}
                  </p>
                </div>

                <button
                  onClick={() => toggleFlag(flag.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs ${
                    flag.enabled
                      ? 'border border-border bg-secondary hover:bg-muted text-foreground'
                      : 'bg-foreground text-background hover:opacity-90'
                  }`}
                >
                  {flag.enabled ? (
                    <>
                      <X className="w-3.5 h-3.5" />
                      <span>Disable Circuit</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Enable Flag</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
