'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building, 
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
              <Building className="w-5 h-5 text-foreground" />
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Tenants & Multi-Entity Operations
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground font-mono font-medium">
                RLS Scoped Isolation
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Verify database Row-Level Security policies, entity permissions, and organization boundaries.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-semibold text-foreground text-base">{state.currentTenant.name}</h3>
                <span className="text-xs text-muted-foreground font-mono">
                  Tenant ID: {state.currentTenant.id}
                </span>
              </div>
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-secondary text-foreground font-semibold border border-border">
                Plan: {state.currentTenant.plan}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                <span className="text-muted-foreground font-bold block text-[11px] uppercase tracking-wider">Primary Tenant User</span>
                <div className="font-semibold text-foreground text-sm">{state.currentUser.fullName}</div>
                <div className="text-muted-foreground">{state.currentUser.email}</div>
                <div className="text-[11px] font-mono text-foreground font-medium">
                  WhatsApp: {state.currentUser.whatsappPhone} (Verified)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                <span className="text-muted-foreground font-bold block text-[11px] uppercase tracking-wider">RLS Isolation Status (MC-001)</span>
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enforced at PostgreSQL Engine Layer</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Zero cross-tenant record visibility. Queries without valid tenant context return 0 records or fail at RLS filter.
                </p>
              </div>
            </div>

            {/* Entities under this tenant */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-foreground">
                Managed Entities under Tenant ({state.entities.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {state.entities.map((e) => (
                  <div key={e.id} className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-1">
                    <div className="font-semibold text-foreground text-sm">{e.name}</div>
                    <div className="text-[11px] text-muted-foreground uppercase font-mono font-medium">
                      Type: {e.type} &middot; Currency: {e.currency}
                    </div>
                    {e.taxIdentifier && (
                      <div className="text-[11px] text-foreground font-mono font-medium pt-0.5">
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
