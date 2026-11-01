'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { 
  ScrollText, 
  Search, 
  Hash, 
  Clock, 
  Copy 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { auditLedgerIntegrity } from '@/lib/ledger';

export default function AdminAuditPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(getInitialState());
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    const s = db.getCurrentSession();
    if (!s) {
      router.push('/login?redirect=/admin/audit');
    }
  }, [router]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const ledgerAudit = auditLedgerIntegrity(state.transactions);

  const filteredLogs = state.auditLogs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      (log.termsHash && log.termsHash.toLowerCase().includes(q)) ||
      log.userName.toLowerCase().includes(q)
    );
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
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
              <ScrollText className="w-5 h-5 text-foreground" />
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Append-Only Consequential Audit Stream
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground font-mono font-medium">
                Immutable Ledger & Action History
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Every financial mutation, proposal confirmation, reversal, and consequential step-up authorization is permanently logged.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-secondary/50 border border-border text-xs shadow-xs">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by action, terms hash, user, or details..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <span className="text-muted-foreground font-mono text-[11px] font-medium">
              {filteredLogs.length} events
            </span>
          </div>

          {/* Audit Logs Stream */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 sm:p-5 space-y-2.5 hover:bg-secondary/30 transition-colors text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-secondary text-foreground border border-border">
                        {log.action}
                      </span>
                      <span className="text-foreground font-semibold">{log.userName}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">({log.entityType})</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{log.createdAt}</span>
                      <span>&middot;</span>
                      <span>{log.ipAddress}</span>
                    </div>
                  </div>

                  <p className="text-foreground text-[11px] leading-relaxed">
                    {log.details}
                  </p>

                  {/* Cryptographic Terms Hash */}
                  {log.termsHash && (
                    <div className="p-2.5 rounded-xl bg-secondary/50 border border-border font-mono text-[10px] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-foreground truncate">
                        <Hash className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{log.termsHash}</span>
                      </div>
                      <button
                        onClick={() => handleCopyHash(log.termsHash!)}
                        className="px-2.5 py-1 rounded-full bg-card hover:bg-secondary text-foreground border border-border text-[9px] font-semibold shrink-0 transition-colors"
                      >
                        {copiedHash === log.termsHash ? 'Copied!' : 'Copy Hash'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
