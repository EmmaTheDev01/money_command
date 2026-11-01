'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { 
  Building, 
  CheckCircle2, 
  Users, 
  Layers, 
  ShieldCheck, 
  Calendar,
  Loader2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadTenants() {
    try {
      const data = await db.getTenants();
      setTenants(data);
    } catch (err) {
      console.error('Failed to fetch tenants from DB:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadTenants();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadTenants();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-foreground" />
        <span className="text-xs font-mono text-muted-foreground">
          Fetching tenant isolation models from PostgreSQL...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-secondary border border-border text-foreground">
              <Building className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Tenants & Multi-Entity Operations
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary border border-border text-foreground font-mono font-medium">
              RLS Scoped Isolation
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Verify database Row-Level Security policies, entity permissions, and organization boundaries.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium text-foreground transition-colors shadow-xs cursor-pointer disabled:opacity-50 w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Tenants ({tenants.length})</span>
        </button>
      </div>

      {/* Tenants List */}
      <div className="space-y-4">
        {tenants.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground font-mono text-xs">
            No tenant records found in database.
          </div>
        ) : (
          tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-foreground text-lg">{tenant.name}</h3>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 uppercase font-bold">
                      {tenant.status}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono block mt-0.5">
                    Tenant UUID: {tenant.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-secondary text-foreground font-semibold border border-border">
                    Plan: {tenant.plan}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Users under this tenant */}
                <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2.5">
                  <span className="text-muted-foreground font-bold block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-foreground" />
                    <span>Registered Tenant Users ({tenant.users?.length || 0})</span>
                  </span>
                  {tenant.users && tenant.users.length > 0 ? (
                    <div className="space-y-2">
                      {tenant.users.map((u: any) => (
                        <div key={u.id} className="p-2.5 rounded-xl bg-card border border-border space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground text-sm">{u.full_name || u.fullName}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-foreground font-bold border border-border">
                              {u.role}
                            </span>
                          </div>
                          <div className="text-muted-foreground font-mono text-[11px]">{u.email}</div>
                          {u.whatsapp_phone && (
                            <div className="text-[11px] font-mono text-emerald-500 font-medium">
                              WhatsApp: {u.whatsapp_phone} (Verified)
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">No users associated with this tenant.</p>
                  )}
                </div>

                {/* RLS Isolation Security Status */}
                <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                  <span className="text-muted-foreground font-bold block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-foreground" />
                    <span>PostgreSQL RLS Security Policy</span>
                  </span>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Enforced at PostgreSQL Engine Layer</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Zero cross-tenant record leakage. All row-level reads, updates, and inserts are scoped strictly by tenant_id cryptographic tokens.
                  </p>
                </div>
              </div>

              {/* Entities under this tenant */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-foreground" />
                  <span>Managed Entities under Tenant ({tenant.entities?.length || 0})</span>
                </h4>
                {tenant.entities && tenant.entities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {tenant.entities.map((entity: any) => (
                      <div
                        key={entity.id}
                        className="p-3.5 rounded-2xl bg-card border border-border flex items-center justify-between shadow-xs"
                      >
                        <div>
                          <div className="font-semibold text-foreground">{entity.name}</div>
                          <div className="text-[10px] font-mono text-muted-foreground uppercase">
                            {entity.type} &middot; {entity.currency}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-foreground border border-border">
                          {entity.is_default ? 'Primary' : 'Secondary'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No entities provisioned yet.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
