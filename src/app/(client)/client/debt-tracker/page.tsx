'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  ShieldAlert, 
  ArrowDownRight, 
  TrendingDown, 
  Calendar,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { DebtItem } from '@/lib/types';

export default function DebtTrackerPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [payoffStrategy, setPayoffStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<DebtItem['type']>('credit_card');
  const [balance, setBalance] = useState('');
  const [rate, setRate] = useState('');
  const [minPayment, setMinPayment] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-20');

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const debts = state.debts.filter((d) => d.entityId === activeEntity.id);

  const totalDebt = debts.reduce((sum, d) => sum + d.balanceMinor, 0);
  const totalMinPayment = debts.reduce((sum, d) => sum + d.minimumPaymentMinor, 0);

  const sortedDebts = [...debts].sort((a, b) => {
    if (payoffStrategy === 'avalanche') {
      return b.interestRate - a.interestRate;
    }
    return a.balanceMinor - b.balanceMinor;
  });

  const handleMakePayment = (debtId: string, amountDollars: number) => {
    const nextDebts = state.debts.map((d) => {
      if (d.id === debtId) {
        return { ...d, balanceMinor: Math.max(0, d.balanceMinor - Math.round(amountDollars * 100)) };
      }
      return d;
    });
    const nextState = { ...state, debts: nextDebts };
    setState(nextState);
    saveState(nextState);
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const balMinor = Math.round(parseFloat(balance) * 100) || 0;
    const minMinor = Math.round(parseFloat(minPayment) * 100) || 0;
    const rateNum = parseFloat(rate) || 0;
    if (!name.trim() || balMinor <= 0) return;

    const newDebt: DebtItem = {
      id: `debt-${Date.now()}`,
      entityId: activeEntity.id,
      name: name.trim(),
      type,
      balanceMinor: balMinor,
      interestRate: rateNum,
      minimumPaymentMinor: minMinor,
      dueDate,
    };

    const nextState = { ...state, debts: [...state.debts, newDebt] };
    setState(nextState);
    saveState(nextState);
    setShowAddModal(false);
    setName('');
    setBalance('');
    setRate('');
    setMinPayment('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background">
      <Navbar />

      <div className="flex-1 flex">
        <ClientSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-secondary text-foreground">
                  <CreditCard className="w-5 h-5" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Debt Tracker
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Make payments, eliminate high interest, reduce debt, and track payoff schedules in tabular format.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-secondary p-1 rounded-full border border-border text-xs">
                <button
                  onClick={() => setPayoffStrategy('avalanche')}
                  className={`px-3.5 py-1 rounded-full font-medium transition-all ${
                    payoffStrategy === 'avalanche'
                      ? 'bg-foreground text-background font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Debt Avalanche
                </button>
                <button
                  onClick={() => setPayoffStrategy('snowball')}
                  className={`px-3.5 py-1 rounded-full font-medium transition-all ${
                    payoffStrategy === 'snowball'
                      ? 'bg-foreground text-background font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Debt Snowball
                </button>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-full bg-foreground text-background text-xs font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Debt</span>
              </button>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground block">Total Outstanding Debt</span>
              <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono mt-1 block">
                {formatCAD(totalDebt)}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 block font-mono">
                Across {debts.length} active liabilities
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground block">Total Monthly Minimums</span>
              <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono mt-1 block">
                {formatCAD(totalMinPayment)}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Protected in Safe-to-Spend formula
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground block">Focus Priority Target</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold tracking-tight text-foreground block truncate">
                  {sortedDebts[0]?.name || 'All debts cleared!'}
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {sortedDebts[0] ? `${sortedDebts[0].interestRate}% APR` : ''}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Recommended by {payoffStrategy === 'avalanche' ? 'interest savings math' : 'momentum psychology'}
              </span>
            </div>
          </div>

          {/* Structured Table for Liabilities */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground">Active Liabilities Ledger</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ordered by {payoffStrategy === 'avalanche' ? 'Highest Interest Rate (Avalanche)' : 'Lowest Balance (Snowball)'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-secondary text-foreground border border-border">
                {sortedDebts.length} Accounts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 font-mono uppercase text-[10px] text-muted-foreground">
                    <th className="py-3 px-5">Priority</th>
                    <th className="py-3 px-4">Account / Creditor</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Interest (APR)</th>
                    <th className="py-3 px-4 text-right">Remaining Balance</th>
                    <th className="py-3 px-4 text-right">Min. Due</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-5 text-right">Quick Pay Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-sans">
                  {sortedDebts.map((debt, index) => (
                    <tr key={debt.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-foreground">
                        #{index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {debt.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono uppercase border border-border">
                          {debt.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                        {debt.interestRate}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground tabular-nums">
                        {formatCAD(debt.balanceMinor)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-muted-foreground tabular-nums">
                        {formatCAD(debt.minimumPaymentMinor)}/mo
                      </td>
                      <td className="py-3.5 px-4 font-mono text-muted-foreground">
                        {debt.dueDate}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleMakePayment(debt.id, 50)}
                            className="px-2.5 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-foreground text-[11px] font-medium border border-border transition-colors shadow-xs"
                          >
                            +$50
                          </button>
                          <button
                            onClick={() => handleMakePayment(debt.id, 250)}
                            className="px-3 py-1 rounded-full bg-foreground text-background text-[11px] font-semibold hover:opacity-90 transition-opacity shadow-xs"
                          >
                            +$250
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border bg-secondary/30 font-semibold font-mono text-xs">
                    <td colSpan={4} className="py-3 px-5 text-foreground">
                      Total Monthly Commitments & Balances
                    </td>
                    <td className="py-3 px-4 text-right text-foreground font-extrabold tabular-nums">
                      {formatCAD(totalDebt)}
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground tabular-nums">
                      {formatCAD(totalMinPayment)}/mo
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Debt Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Add Debt Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-xs text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDebt} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Account / Lender Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. TD Aeroplan Visa, Student Loan"
                  className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Debt Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground focus:outline-none focus:border-foreground"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="loan">Personal Loan</option>
                    <option value="line_of_credit">Line of Credit</option>
                    <option value="student_debt">Student Debt</option>
                    <option value="mortgage">Mortgage</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Interest Rate (% APR)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="19.99"
                    className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Total Balance (CAD $)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="2500.00"
                    className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Monthly Min (CAD $)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={minPayment}
                    onChange={(e) => setMinPayment(e.target.value)}
                    placeholder="75.00"
                    className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-border bg-secondary text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-foreground text-background font-semibold shadow-xs hover:opacity-90 transition-opacity"
                >
                  Save Debt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
