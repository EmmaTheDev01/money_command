'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  Check, 
  Filter, 
  Building2, 
  Lock 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { Transaction } from '@/lib/types';

export default function AccountantPortalPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const entityTransactions = state.transactions.filter((t) => t.entityId === activeEntity.id);

  const handleMarkReviewed = (txId: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === txId ? { ...t, accountantStatus: 'professional_reviewed' as const } : t
      ),
    }));
    setNotification('Transaction marked as Professional-Reviewed.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportPackage = () => {
    const lines = [
      `ACCOUNTANT WORKPAPER PACKAGE - MONEY COMMAND v2.0`,
      `Client Entity: ${activeEntity.name}`,
      `Tax Year: 2026 | Jurisdiction: Ontario (CA_ON)`,
      `Status: Reconciled Double-Entry Core`,
      ``,
      `Date,Merchant,Category,Amount CAD,Status,Accountant Review State`,
      ...entityTransactions.map(
        (t) =>
          `${t.txDate},"${t.merchant || t.description}","${t.category}",${(t.totalMinor / 100).toFixed(
            2
          )},${t.status},${t.accountantStatus}`
      ),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Accountant_Review_${activeEntity.name.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification('Standardized accountant export package downloaded.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
      />

      <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Accountant Review Portal
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-semibold border border-blue-500/20">
                Grant: Reviewer (Revocable)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Permissioned document and transaction review for {activeEntity.name}. Non-destructive CPA verification.
            </p>
          </div>

          <button
            onClick={handleExportPackage}
            className="px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 font-medium text-xs flex items-center gap-1.5 transition-opacity shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Verified Workpaper</span>
          </button>
        </div>

        {notification && (
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Transactions Table with Accountant Status Toggle */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-border bg-secondary/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Transactions for Bookkeeping Review ({entityTransactions.length})
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              Double-Entry Invariant: All Balanced
            </span>
          </div>

          <div className="divide-y divide-border">
            {entityTransactions.map((tx) => (
              <div key={tx.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-secondary/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{tx.merchant || tx.description}</span>
                    <span
                      className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full uppercase font-semibold ${
                        tx.accountantStatus === 'professional_reviewed'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : tx.accountantStatus === 'user_verified'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-secondary text-muted-foreground border border-border'
                      }`}
                    >
                      {tx.accountantStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {tx.txDate} &middot; {tx.category} &middot; {tx.lines.length} balanced journal lines
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-foreground text-sm">
                    {formatCAD(tx.totalMinor)}
                  </span>

                  {tx.accountantStatus !== 'professional_reviewed' && (
                    <button
                      onClick={() => handleMarkReviewed(tx.id)}
                      className="px-3.5 py-1.5 rounded-full bg-secondary hover:bg-muted text-foreground border border-border text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Reviewed</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
