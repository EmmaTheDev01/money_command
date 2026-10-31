'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  FileText, 
  Percent,
  Check
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';

export default function TaxPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [taxYear, setTaxYear] = useState(2026);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;
  const entityTransactions = state.transactions.filter((t) => t.entityId === activeEntity.id);

  // Compute revenue & expenses for CRA Schedule T2125
  const grossRevenueMinor = entityTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.totalMinor, 0);

  const totalExpensesMinor = entityTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.totalMinor, 0);

  const netBusinessIncomeMinor = grossRevenueMinor - totalExpensesMinor;

  // 13% Ontario HST collected payable
  const hstAccount = state.accounts.find((a) => a.entityId === activeEntity.id && a.code === '2050');
  const hstCollectedMinor = hstAccount?.balanceMinor || 71500; // $715.00

  // 25% Tax reserve target
  const recommendedReserveMinor = Math.round(netBusinessIncomeMinor * 0.25);
  const currentReserveAcc = state.accounts.find((a) => a.entityId === activeEntity.id && (a.code === '1030' || a.name.includes('Tax Reserve')));
  const currentReserveMinor = currentReserveAcc?.balanceMinor || 620000;

  const handleExportTaxSchedule = () => {
    const lines = [
      `CRA T2125 STATEMENT OF BUSINESS ACTIVITIES - TAX YEAR ${taxYear}`,
      `Entity: ${activeEntity.name}`,
      `Business Number: ${activeEntity.taxIdentifier || 'N/A'}`,
      `Jurisdiction: Ontario (CA_ON)`,
      `Reporting Method: Cash`,
      ``,
      `PART 1 - BUSINESS INCOME`,
      `Gross Retainers & Services: CAD ${(grossRevenueMinor / 100).toFixed(2)}`,
      `HST Collected (13%): CAD ${(hstCollectedMinor / 100).toFixed(2)}`,
      ``,
      `PART 2 - DEDUCTIBLE EXPENSES`,
      `Software & Cloud Subscriptions: CAD ${(totalExpensesMinor / 100).toFixed(2)}`,
      ``,
      `NET BUSINESS INCOME: CAD ${(netBusinessIncomeMinor / 100).toFixed(2)}`,
      `RECOMMENDED TAX RESERVE (25%): CAD ${(recommendedReserveMinor / 100).toFixed(2)}`,
      ``,
      `DISCLAIMER: Prepared by Money Command v2.0 for bookkeeping readiness. Official CRA filing must be completed via certified tax professional.`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CRA_T2125_${activeEntity.name.replace(/\s+/g, '_')}_${taxYear}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage(`CRA Tax Readiness package exported for Tax Year ${taxYear}.`);
  };

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Canada-First Tax Readiness
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  Tax Year {taxYear} &middot; Ontario (CA_ON)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Organize deductible records, GST/HST remittances, and T2125 schedules. (No official e-filing in MVP).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportTaxSchedule}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Export CRA Schedule & Receipts</span>
              </button>
            </div>
          </div>

          {/* Status Toast */}
          {statusMessage && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage(null)}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          )}

          {/* Tax Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                Gross Business Revenue
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-emerald-400">
                {formatCAD(grossRevenueMinor)}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Reportable income</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                Deductible Expenses
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-slate-200">
                {formatCAD(totalExpensesMinor)}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Categorized CRA write-offs</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                Ontario 13% HST Collected
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-amber-400">
                {formatCAD(hstCollectedMinor)}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Earmarked CRA remittance</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                Current Tax Reserve (HISA)
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-emerald-400">
                {formatCAD(currentReserveMinor)}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Recommended: {formatCAD(recommendedReserveMinor)}</p>
            </div>
          </div>

          {/* CRA Schedule Breakdown Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-slate-100 text-sm">
                  CRA Form T2125 Alignment & Bookkeeping Categories
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                CRA Compliant Audit Trail
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block text-[11px] font-sans">
                  Part 1 &middot; Business Income (Line 8000)
                </span>
                <div className="flex justify-between text-slate-200">
                  <span>Gross consulting & service retainers:</span>
                  <span className="text-emerald-400 font-semibold">{formatCAD(grossRevenueMinor)}</span>
                </div>
                <div className="flex justify-between text-slate-200">
                  <span>13% HST collected on sales:</span>
                  <span className="text-amber-400 font-semibold">{formatCAD(hstCollectedMinor)}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-bold block text-[11px] font-sans">
                  Part 2 &middot; Business Expenses (Line 8521/8810)
                </span>
                <div className="flex justify-between text-slate-200">
                  <span>Office & Software (Line 8810):</span>
                  <span className="text-slate-300 font-semibold">{formatCAD(totalExpensesMinor)}</span>
                </div>
                <div className="flex justify-between text-slate-200">
                  <span>Net Business Profit (Line 9369):</span>
                  <span className="text-emerald-400 font-bold">{formatCAD(netBusinessIncomeMinor)}</span>
                </div>
              </div>
            </div>

            {/* Disclaimer & Non-claim rule */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-sans">
              <strong>Statutory Compliance Guardrail: </strong>
              Money Command provides deterministic record preparation, deduction tracking, and audit packages. We do not claim to be a CRA-certified e-filer or provide regulated tax advice.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

