'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building, 
  ShieldCheck, 
  Users, 
  Database, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { auditLedgerIntegrity } from '@/lib/ledger';

export default function AdminTenantsPage() {
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const ledgerAudit = auditLedgerIntegrity(state.transactions);

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
              <Building className="w-6 h-6 text-rose-400" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Tenants & Multi-Entity Operations
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                RLS Scoped Isolation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verify database Row-Level Security policies, entity permissions, and organization boundaries.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-slate-100 text-base">{state.currentTenant.name}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Tenant ID: {state.currentTenant.id}
                </span>
              </div>
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Plan: {state.currentTenant.plan}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block text-[11px]">Primary Tenant User</span>
                <div className="font-semibold text-slate-200">{state.currentUser.fullName}</div>
                <div className="text-slate-400">{state.currentUser.email}</div>
                <div className="text-[11px] font-mono text-emerald-400">
                  WhatsApp: {state.currentUser.whatsappPhone} (Verified)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block text-[11px]">RLS Isolation Status (MC-001)</span>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enforced at PostgreSQL Engine Layer</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Zero cross-tenant record visibility. Queries without valid tenant context return 0 records or fail at RLS filter.
                </p>
              </div>
            </div>

            {/* Entities under this tenant */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-slate-300">
                Managed Entities under Tenant ({state.entities.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {state.entities.map((e) => (
                  <div key={e.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-semibold text-slate-200">{e.name}</div>
                    <div className="text-[11px] text-slate-400 uppercase font-mono">
                      Type: {e.type} &middot; Currency: {e.currency}
                    </div>
                    {e.taxIdentifier && (
                      <div className="text-[10px] text-emerald-400 font-mono">
                        Tax BN: {e.taxIdentifier}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

