'use client';

import React, { useState, useEffect } from 'react';
import { 
  ScrollText, 
  Search, 
  ShieldCheck, 
  Hash, 
  Clock, 
  Filter, 
  Copy, 
  CheckCircle2 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { auditLedgerIntegrity } from '@/lib/ledger';

export default function AdminAuditPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

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
              <ScrollText className="w-6 h-6 text-rose-400" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Append-Only Consequential Audit Stream
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                Immutable Ledger & Action History
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Every financial mutation, proposal confirmation, reversal, and consequential step-up authorization is permanently logged.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by action, terms hash, user, or details..."
              className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <span className="text-slate-500 font-mono text-[11px]">
              {filteredLogs.length} events
            </span>
          </div>

          {/* Audit Logs Stream */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 space-y-2 hover:bg-slate-900/80 transition-colors text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        {log.action}
                      </span>
                      <span className="text-slate-300 font-semibold">{log.userName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">({log.entityType})</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{log.createdAt}</span>
                      <span>&middot;</span>
                      <span>{log.ipAddress}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                    {log.details}
                  </p>

                  {/* Cryptographic Terms Hash */}
                  {log.termsHash && (
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-amber-300 truncate">
                        <Hash className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{log.termsHash}</span>
                      </div>
                      <button
                        onClick={() => handleCopyHash(log.termsHash!)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] shrink-0"
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

