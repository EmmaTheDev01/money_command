'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
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
              <Sliders className="w-6 h-6 text-rose-400" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Feature Flags & Operational Risk Controls
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                Dynamic Circuit Breakers
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Safely isolate capabilities, halt third-party messaging integrations, or restrict action authorizations in real time.
            </p>
          </div>

          {toastMessage && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            {state.featureFlags.map((flag) => (
              <div
                key={flag.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-100 text-sm">
                      {flag.key}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        flag.enabled
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {flag.enabled ? 'Active (100% Rollout)' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {flag.description}
                  </p>
                </div>

                <button
                  onClick={() => toggleFlag(flag.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto ${
                    flag.enabled
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
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
