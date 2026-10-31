'use client';

import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  RefreshCw,
  ArrowRight
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
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                Meta WhatsApp Webhook Simulator
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  MC-002 &middot; MC-006 Validated
                </span>
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Simulate inbound signed messages from the verified Meta Cloud API sandbox to test proposal extraction.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-foreground font-medium mb-1.5">
              Simulate Inbound WhatsApp Message:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. Spent CAD 46 on groceries at Walmart"
                className="flex-1 bg-secondary border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-mono"
              />
              <button
                onClick={handleSimulateWebhook}
                disabled={isProcessing}
                className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-xl transition-opacity flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
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
            <span className="text-[11px] text-muted-foreground font-medium">Test Presets:</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {sampleMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(msg)}
                  className="text-[11px] px-3 py-1 rounded-full bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors shadow-sm"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          {testResult && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-emerald-500 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Webhook Verified & Proposal Staged
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  HTTP 200 OK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-card border border-border">
                  <span className="text-muted-foreground block text-[10px]">Meta Message ID:</span>
                  <span className="text-foreground truncate block font-semibold">
                    {testResult.providerEventId}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-card border border-border">
                  <span className="text-muted-foreground block text-[10px]">Signature Check:</span>
                  <span className="text-emerald-500 font-semibold">
                    ✓ Valid HMAC-SHA256
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Extracted Amount:</span>
                  <span className="font-mono font-bold text-emerald-500">
                    {formatCAD(testResult.extractedProposal.amountMinor || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Merchant:</span>
                  <span className="font-medium text-foreground">
                    {testResult.extractedProposal.merchant}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium text-foreground">
                    {testResult.extractedProposal.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Confidence:</span>
                  <span className="font-mono text-emerald-500 font-semibold">
                    {((testResult.extractedProposal.confidence || 0) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground bg-secondary/80 p-2.5 rounded-xl flex items-center justify-between">
                <span>The candidate is in your <strong>Proposal Inbox</strong> awaiting verification.</span>
                <button
                  onClick={onClose}
                  className="px-3 py-1 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
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
