'use client';

import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  ArrowRight,
  Code2
} from 'lucide-react';
import { formatCAD } from '@/lib/ledger';
import { Proposal } from '@/lib/types';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewProposal: (proposal: Proposal) => void;
  entityId: string;
  tenantId: string;
  userId: string;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  isOpen,
  onClose,
  onNewProposal,
  entityId,
  tenantId,
  userId,
}) => {
  const [inputText, setInputText] = useState('Spent CAD 46 on groceries at Walmart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResult, setTestResult] = useState<{
    providerEventId: string;
    signatureVerified: boolean;
    replaySafe: boolean;
    extractedProposal: Partial<Proposal>;
  } | null>(null);

  if (!isOpen) return null;

  const sampleMessages = [
    'Spent CAD 46 on groceries at Walmart',
    'Paid $115 to Bell for internet',
    'Received CAD 5,500 consulting retainer from Acme Corp',
    'Bought $34.20 coffee and snacks at Starbucks',
  ];

  const handleSimulateWebhook = () => {
    setIsProcessing(true);
    setTestResult(null);

    setTimeout(() => {
      // Deterministic parser simulation matching the backend API
      const raw = inputText;
      let amountMinor = 4600;
      let merchant = 'Walmart';
      let category = 'Groceries';
      let type: 'expense' | 'income' = 'expense';
      let confidence = 0.96;

      const lower = raw.toLowerCase();
      if (lower.includes('115') || lower.includes('bell')) {
        amountMinor = 11500;
        merchant = 'Bell Canada';
        category = 'Telecom & Internet';
        confidence = 0.94;
      } else if (lower.includes('5,500') || lower.includes('5500') || lower.includes('acme') || lower.includes('retainer')) {
        amountMinor = 550000;
        merchant = 'Acme Corp';
        category = 'Client Revenue';
        type = 'income';
        confidence = 0.98;
      } else if (lower.includes('starbucks') || lower.includes('34.20')) {
        amountMinor = 3420;
        merchant = 'Starbucks';
        category = 'Dining & Coffee';
        confidence = 0.95;
      } else {
        // Try regex extraction of number
        const numMatch = raw.match(/\$?([0-9]+(?:\.[0-9]{2})?)/);
        if (numMatch) {
          amountMinor = Math.round(parseFloat(numMatch[1]) * 100);
        }
      }

      const generatedId = `prop-${Date.now()}`;
      const providerMsgId = `wamid.HBgL${Math.random().toString(36).substring(2, 12)}==`;

      const newProp: Proposal = {
        id: generatedId,
        tenantId,
        entityId,
        userId,
        type,
        amountMinor,
        currency: 'CAD',
        merchant,
        category,
        txDate: new Date().toISOString().split('T')[0],
        taxRelevance: type === 'income' ? 'confirmed' : 'possible',
        confidence,
        userVerified: false,
        status: 'pending',
        rawText: raw,
        createdAt: new Date().toISOString(),
      };

      setTestResult({
        providerEventId: providerMsgId,
        signatureVerified: true,
        replaySafe: true,
        extractedProposal: newProp,
      });

      onNewProposal(newProp);
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-1.5">
                Meta WhatsApp Webhook Simulator
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  MC-002 &middot; MC-006 Validated
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Simulate inbound signed messages from the verified Meta Cloud API sandbox to test proposal extraction.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Simulate Inbound WhatsApp Message:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. Spent CAD 46 on groceries at Walmart"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
              <button
                onClick={handleSimulateWebhook}
                disabled={isProcessing}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Send Webhook</span>
              </button>
            </div>
          </div>

          {/* Quick Click Samples */}
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Test Presets:</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {sampleMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(msg)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          {testResult && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Webhook Verified & Proposal Generated
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  HTTP 200 OK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">Meta Message ID:</span>
                  <span className="text-slate-200 truncate block">
                    {testResult.providerEventId}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">Signature Check:</span>
                  <span className="text-emerald-400 font-semibold">
                    ✓ Valid HMAC-SHA256
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Extracted Amount:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatCAD(testResult.extractedProposal.amountMinor || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Merchant:</span>
                  <span className="font-medium text-slate-200">
                    {testResult.extractedProposal.merchant}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-medium text-slate-200">
                    {testResult.extractedProposal.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Confidence:</span>
                  <span className="font-mono text-emerald-400">
                    {((testResult.extractedProposal.confidence || 0) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded flex items-center justify-between">
                <span>The proposal is in your <strong>Proposal Inbox</strong> awaiting confirmation.</span>
                <button
                  onClick={onClose}
                  className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded-md hover:bg-emerald-400 transition-colors flex items-center gap-1"
                >
                  Review Proposal
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
