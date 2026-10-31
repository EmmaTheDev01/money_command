'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Inbox, 
  Check, 
  X, 
  Edit3, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Sparkles, 
  FileText,
  Clock,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { Proposal, Transaction, TransactionLine, AuditLog } from '@/lib/types';

export default function ProposalsPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [editingProposalId, setEditingProposalId] = useState<string | null>(null);
  const [editMerchant, setEditMerchant] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editAmountCAD, setEditAmountCAD] = useState('');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposals = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending');
  const pastProposals = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status !== 'pending');

  const startEdit = (p: Proposal) => {
    setEditingProposalId(p.id);
    setEditMerchant(p.merchant);
    setEditCategory(p.category);
    setEditAmountCAD((p.amountMinor / 100).toFixed(2));
  };

  const handleSaveEdit = (p: Proposal) => {
    const updatedMinor = Math.round(parseFloat(editAmountCAD || '0') * 100);
    setState((prev) => ({
      ...prev,
      proposals: prev.proposals.map((item) =>
        item.id === p.id
          ? {
              ...item,
              merchant: editMerchant,
              category: editCategory,
              amountMinor: updatedMinor,
              status: 'modified' as const,
            }
          : item
      ),
    }));
    setEditingProposalId(null);
  };

  const handleConfirmProposal = (proposal: Proposal) => {
    // Idempotency check: if already confirmed, do not post duplicate journal
    if (proposal.status === 'confirmed') {
      setStatusNotification(`Proposal ${proposal.id.substring(0, 8)} is already confirmed. Replay prevented (MC-007).`);
      return;
    }

    const newTxId = `tx-${Date.now()}`;

    // Resolve debit and credit accounts based on proposal and entity
    const debitAccount = state.accounts.find(
      (a) => a.entityId === activeEntity.id && (a.id === proposal.proposedDebitAccountId || a.type === 'expense')
    ) || state.accounts[0];

    const creditAccount = state.accounts.find(
      (a) => a.entityId === activeEntity.id && (a.id === proposal.proposedCreditAccountId || (a.type === 'asset' && a.subtype === 'checking'))
    ) || state.accounts[1];

    // Build atomic balanced double-entry lines (Debit Expense, Credit Asset/Checking)
    const lines: TransactionLine[] = [
      {
        id: `line-${Math.random().toString(36).substring(2, 9)}`,
        transactionId: newTxId,
        accountId: debitAccount.id,
        accountName: debitAccount.name,
        accountCode: debitAccount.code,
        debitMinor: proposal.amountMinor,
        creditMinor: 0,
        currency: proposal.currency,
        description: `${proposal.category} expense at ${proposal.merchant}`,
        category: proposal.category,
      },
      {
        id: `line-${Math.random().toString(36).substring(2, 9)}`,
        transactionId: newTxId,
        accountId: creditAccount.id,
        accountName: creditAccount.name,
        accountCode: creditAccount.code,
        debitMinor: 0,
        creditMinor: proposal.amountMinor,
        currency: proposal.currency,
        description: `Paid via ${creditAccount.name}`,
        category: creditAccount.subtype || 'Cash',
      },
    ];

    const newTransaction: Transaction = {
      id: newTxId,
      tenantId: state.currentTenant.id,
      entityId: activeEntity.id,
      type: proposal.type,
      status: 'posted',
      currency: proposal.currency,
      totalMinor: proposal.amountMinor,
      txDate: proposal.txDate,
      description: `${proposal.merchant} - ${proposal.category}`,
      merchant: proposal.merchant,
      category: proposal.category,
      source: 'whatsapp_text',
      sourceId: proposal.id,
      accountantStatus: 'user_verified',
      lines,
      createdAt: new Date().toISOString(),
    };

    const newAuditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      tenantId: state.currentTenant.id,
      userId: state.currentUser.id,
      userName: state.currentUser.fullName,
      action: 'CONFIRM_PROPOSAL_POST_JOURNAL',
      entityType: 'proposal',
      entityId: proposal.id,
      details: `User confirmed proposal. Balanced journal ${newTxId.substring(0, 8)} posted: Dr ${debitAccount.code} CAD ${formatCAD(proposal.amountMinor)}, Cr ${creditAccount.code} CAD ${formatCAD(proposal.amountMinor)}.`,
      ipAddress: '198.51.100.42 (Toronto, ON)',
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
      proposals: prev.proposals.map((p) =>
        p.id === proposal.id
          ? {
              ...p,
              status: 'confirmed' as const,
              userVerified: true,
              confirmedTransactionId: newTxId,
            }
          : p
      ),
      auditLogs: [newAuditLog, ...prev.auditLogs],
    }));

    setStatusNotification(`✓ Balanced journal posted! ${proposal.merchant} (${formatCAD(proposal.amountMinor)}) is now committed in PostgreSQL ledger.`);
  };

  const handleRejectProposal = (proposal: Proposal) => {
    setState((prev) => ({
      ...prev,
      proposals: prev.proposals.map((p) =>
        p.id === proposal.id ? { ...p, status: 'rejected' as const } : p
      ),
    }));
    setStatusNotification(`Proposal rejected and will not be posted to the financial ledger.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
        pendingProposalsCount={pendingProposals.length}
      />

      <div className="flex-1 flex">
        <ClientSidebar pendingProposalsCount={pendingProposals.length} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Inbox className="w-6 h-6 text-amber-400" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Proposal Inbox & Review
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold">
                  {pendingProposals.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                AI extraction generates candidate proposals. You review and confirm before anything posts to your double-entry ledger.
              </p>
            </div>
          </div>

          {/* Status Notification Toast */}
          {statusNotification && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{statusNotification}</span>
              </div>
              <button
                onClick={() => setStatusNotification(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Pending Proposals Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Unposted Proposals Awaiting Confirmation
            </h2>

            {pendingProposals.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="font-semibold text-slate-200 text-sm">All caught up!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Zero pending proposals. Use the WhatsApp simulator or send a message to trigger an AI extraction candidate.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingProposals.map((proposal) => {
                  const isEditing = editingProposalId === proposal.id;

                  return (
                    <div
                      key={proposal.id}
                      className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-5 space-y-4 shadow-lg hover:border-amber-500/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">
                              Candidate Proposal
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              ID: {proposal.id.substring(0, 12)}
                            </span>
                            <span className="text-xs text-emerald-400 font-mono">
                              AI Confidence: {(proposal.confidence * 100).toFixed(0)}%
                            </span>
                          </div>

                          {proposal.rawText && (
                            <p className="text-xs text-slate-300 italic bg-slate-950 p-2 rounded-lg border border-slate-800">
                              &ldquo;{proposal.rawText}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Top Amount Display */}
                        <div className="text-right">
                          <span className="text-2xl font-bold font-mono text-emerald-400">
                            {formatCAD(proposal.amountMinor)}
                          </span>
                          <span className="block text-[11px] text-slate-400">
                            {proposal.txDate}
                          </span>
                        </div>
                      </div>

                      {/* Editable Fields or Details */}
                      {isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                          <div>
                            <label className="text-slate-400 block mb-1">Merchant:</label>
                            <input
                              type="text"
                              value={editMerchant}
                              onChange={(e) => setEditMerchant(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Category:</label>
                            <input
                              type="text"
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">Amount CAD:</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editAmountCAD}
                              onChange={(e) => setEditAmountCAD(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                            />
                          </div>
                          <div className="sm:col-span-3 flex justify-end gap-2 pt-1">
                            <button
                              onClick={() => setEditingProposalId(null)}
                              className="px-3 py-1 rounded bg-slate-800 text-slate-300"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(proposal)}
                              className="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold"
                            >
                              Save Edits
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Merchant</span>
                            <span className="font-semibold text-slate-200">{proposal.merchant}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Category</span>
                            <span className="font-semibold text-slate-200">{proposal.category}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Proposed Journal</span>
                            <span className="font-semibold text-emerald-300 font-mono text-[11px]">
                              Dr Expense / Cr Checking
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Tax Relevance</span>
                            <span className="font-semibold text-slate-200 capitalize">
                              {proposal.taxRelevance}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Confirmation Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                          {!isEditing && (
                            <button
                              onClick={() => startEdit(proposal)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Fields</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleRejectProposal(proposal)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors flex items-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleConfirmProposal(proposal)}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                        >
                          <Check className="w-4 h-4" />
                          <span>Confirm & Post Journal (Balanced)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Resolved Proposals History */}
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Resolved Proposals History
            </h2>

            <div className="space-y-2">
              {pastProposals.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        p.status === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {p.status}
                    </span>
                    <div>
                      <div className="font-medium text-slate-200">{p.merchant}</div>
                      <div className="text-[10px] text-slate-500">{p.category} &middot; {p.txDate}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-semibold text-slate-200">
                      {formatCAD(p.amountMinor)}
                    </div>
                    {p.confirmedTransactionId && (
                      <span className="text-[9px] font-mono text-emerald-400">
                        Linked Tx: {p.confirmedTransactionId.substring(0, 10)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

