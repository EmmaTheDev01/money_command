'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Sliders, 
  Building2, 
  FileCheck2, 
  CheckCircle2, 
  User, 
  Lock 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';

export default function SettingsPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;

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
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-400" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Workspace Settings & Consent Receipts
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure multi-entity parameters, privacy scopes, and deterministic buffer thresholds.
            </p>
          </div>

          {notification && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-300">
              {notification}
            </div>
          )}

          {/* Entities List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Configured Entities ({state.entities.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {state.entities.map((ent) => (
                <div
                  key={ent.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    ent.id === state.selectedEntityId
                      ? 'border-emerald-500/50 bg-emerald-950/10'
                      : 'border-slate-800 bg-slate-950'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">{ent.name}</div>
                      <div className="text-[11px] text-slate-500 uppercase mt-0.5">
                        {ent.type.replace('_', ' ')} &middot; {ent.currency}
                      </div>
                      {ent.taxIdentifier && (
                        <div className="text-[11px] font-mono text-emerald-400 mt-1">
                          BN: {ent.taxIdentifier}
                        </div>
                      )}
                    </div>
                    {ent.isDefault && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Consent Records (Blueprint requirement) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-slate-100 text-sm">
                  User Consent Receipts (Policy v2.0)
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono">
                Revocable & Scoped
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-200">
                    WhatsApp Message OCR & Structured Extraction
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Permission to temporarily process inbound text & receipts to propose ledger candidate fields.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold self-start sm:self-auto">
                  Active Consent
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-200">
                    Accountant Read-Only Document Review
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Permit invited external CPA/bookkeeper to verify ledger transactions and export tax schedules.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold self-start sm:self-auto">
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
