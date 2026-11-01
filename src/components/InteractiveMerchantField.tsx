'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Mic, Image as ImageIcon, Send, ArrowRight, ShieldCheck } from 'lucide-react';
import MoneyCommandLogo from './MoneyCommandLogo';

interface MerchantNode {
  id: string;
  name: string;
  handle: string;
  amount: string;
  category: string;
  status: 'Zombie SaaS' | 'CRA Write-Off' | 'Auto-Negotiated' | 'Dormant';
  ringColor: 'orange' | 'cyan' | 'emerald';
  top: string;
  left: string;
  logo: string;
}

const MERCHANTS: MerchantNode[] = [
  {
    id: 'aws',
    name: 'AWS Cloud',
    handle: '@aws.corp',
    amount: 'CAD 312.40/mo',
    category: 'Hosting & Compute',
    status: 'Auto-Negotiated',
    ringColor: 'orange',
    top: '22%',
    left: '12%',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'adobe',
    name: 'Adobe CC',
    handle: '@adobe.creative',
    amount: 'CAD 84.99/mo',
    category: 'Software Subscription',
    status: 'Zombie SaaS',
    ringColor: 'orange',
    top: '38%',
    left: '6%',
    logo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'figma',
    name: 'Figma Organization',
    handle: '@figma.design',
    amount: 'CAD 60.00/mo',
    category: 'Product Tools',
    status: 'CRA Write-Off',
    ringColor: 'cyan',
    top: '68%',
    left: '15%',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'notion',
    name: 'Notion AI Plus',
    handle: '@notion.workspace',
    amount: 'CAD 24.00/mo',
    category: 'Knowledge Base',
    status: 'CRA Write-Off',
    ringColor: 'cyan',
    top: '18%',
    left: '84%',
    logo: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'google',
    name: 'Google Workspace',
    handle: '@google.cloud',
    amount: 'CAD 42.00/mo',
    category: 'Corporate Email',
    status: 'CRA Write-Off',
    ringColor: 'emerald',
    top: '52%',
    left: '90%',
    logo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'slack',
    name: 'Slack Pro',
    handle: '@slack.hq',
    amount: 'CAD 18.00/mo',
    category: 'Team Messaging',
    status: 'Zombie SaaS',
    ringColor: 'orange',
    top: '76%',
    left: '82%',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'github',
    name: 'GitHub Enterprise',
    handle: '@github.dev',
    amount: 'CAD 21.00/mo',
    category: 'Developer Tools',
    status: 'CRA Write-Off',
    ringColor: 'cyan',
    top: '84%',
    left: '32%',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'cra',
    name: 'CRA GST/HST Remit',
    handle: '@cra.tax',
    amount: 'CAD 1,840.00/qtr',
    category: 'Tax Reserve',
    status: 'CRA Write-Off',
    ringColor: 'emerald',
    top: '14%',
    left: '38%',
    logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=80',
  },
];

export default function InteractiveMerchantField() {
  const [hoveredMerchant, setHoveredMerchant] = useState<MerchantNode | null>(null);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12 sm:py-20 px-4 select-none">
      {/* Background Starry Dot Matrix Field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="merchant-grid-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" className="fill-foreground/40" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#merchant-grid-dots)" />
        </svg>
      </div>

      {/* Scattered Merchant Nodes with Halo Rings */}
      <div className="hidden md:block absolute inset-0 pointer-events-auto">
        {MERCHANTS.map((m) => {
          const isOrange = m.ringColor === 'orange';
          const isCyan = m.ringColor === 'cyan';
          const ringColorClass = isOrange
            ? 'border-[#fb923c] shadow-orange-500/30'
            : isCyan
            ? 'border-cyan-400 shadow-cyan-500/30'
            : 'border-emerald-400 shadow-emerald-500/30';

          const badgeBg = isOrange
            ? 'bg-orange-500/10 text-[#fb923c] border-orange-500/30'
            : isCyan
            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

          return (
            <div
              key={m.id}
              style={{ top: m.top, left: m.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
              onMouseEnter={() => setHoveredMerchant(m)}
              onMouseLeave={() => setHoveredMerchant(null)}
            >
              {/* Outer pulsing ring */}
              <div className={`relative w-10 h-10 rounded-full border-2 p-0.5 shadow-md transition-all duration-300 group-hover:scale-125 ${ringColorClass}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.logo}
                  alt={m.name}
                  className="w-full h-full rounded-full object-cover"
                />
                {/* Live pulsing dot indicator */}
                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${isOrange ? 'bg-[#fb923c]' : isCyan ? 'bg-cyan-400' : 'bg-emerald-400'} animate-ping`} />
                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${isOrange ? 'bg-[#fb923c]' : isCyan ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
              </div>

              {/* Monospace Quick Handle Tag */}
              <span className="block mt-1 text-[10px] font-mono text-muted-foreground text-center opacity-70 group-hover:opacity-100 group-hover:text-foreground transition-all">
                {m.handle}
              </span>

              {/* Hover Tooltip Popover */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 min-w-[180px]">
                <div className="p-3 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-md space-y-1 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-foreground">{m.name}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${badgeBg}`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-[#fb923c]">
                    {m.amount}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {m.category}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CENTRAL FLOATING MOBILE DM / ACTION MODAL (Identical to Image 3 Layout) */}
      <div className="relative z-20 max-w-sm sm:max-w-md mx-auto">
        <div className="rounded-[32px] sm:rounded-[36px] border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-5 sm:p-6 space-y-5 pro-card">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3.5">
            <div className="flex items-center gap-3">
              <button type="button" className="text-muted-foreground hover:text-foreground">
                <span className="text-base font-bold">&larr;</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-bold text-xs shadow-sm">
                <MoneyCommandLogo variant="mark" className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-foreground text-xs uppercase tracking-tight">MONEY COMMAND</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground block">Verified Meta Cloud API</span>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground text-xs">
              i
            </div>
          </div>

          {/* Central DM Chat Flow */}
          <div className="space-y-3 font-sans py-2">
            {/* Outgoing command badge (corresponds to ANTECIPAR pill) */}
            <div className="flex flex-col items-end gap-1">
              <div className="px-5 py-2.5 rounded-full bg-foreground text-background font-mono font-bold text-xs tracking-wider shadow-md hover:scale-105 transition-transform cursor-pointer">
                COMMAND &middot; AUDIT
              </div>
              <span className="text-[10px] font-mono text-muted-foreground pr-1">
                Seen &middot; Replay Safe
              </span>
            </div>

            {/* Incoming AI CFO Proposal Message */}
            <div className="flex justify-start">
              <div className="p-3.5 sm:p-4 rounded-2xl rounded-tl-xs bg-secondary border border-border text-foreground text-xs leading-relaxed max-w-[92%] space-y-2 shadow-sm text-left">
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold border-b border-border/60 pb-1.5">
                  <span>LEDGER RECONCILIATION COMPLETE</span>
                  <span>99.4% CONFIDENCE</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Identified <strong className="text-foreground">CAD 1,420/yr</strong> in recurring zombie SaaS and <strong className="text-foreground">CAD 680</strong> in unclaimed CRA input tax credits across 4 accounts.
                </p>
                <div className="pt-1 flex items-center gap-2 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                    2 Actions Prepared
                  </span>
                  <span className="text-muted-foreground">Requires your 1-click OK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Input Bar with Icons */}
          <div className="flex items-center gap-2 pt-1 border-t border-border">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full bg-secondary border border-border text-muted-foreground text-xs">
              <Camera className="w-4 h-4 shrink-0 hover:text-foreground cursor-pointer transition-colors" />
              <input
                type="text"
                readOnly
                placeholder="Type /command or snap receipt..."
                className="bg-transparent border-none outline-hidden text-xs text-foreground placeholder:text-muted-foreground w-full"
              />
              <Mic className="w-4 h-4 shrink-0 hover:text-foreground cursor-pointer transition-colors" />
              <ImageIcon className="w-4 h-4 shrink-0 hover:text-foreground cursor-pointer transition-colors" />
            </div>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity shadow-sm"
              aria-label="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Button */}
          <div className="pt-1">
            <Link
              href="/client"
              className="w-full py-3 rounded-full bg-foreground text-background font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md"
            >
              <span>Get Early Access on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Monospace Sub-caption (Exact format from Image 3: 'Send ANTECIPAR in a DM to @patensify') */}
        <div className="text-center pt-4">
          <span className="text-[11px] font-mono text-muted-foreground tracking-wide">
            Send <strong className="text-foreground font-semibold">AUDIT</strong> in WhatsApp to <span className="text-[#fb923c] font-semibold">+1 (647) 555-CASH</span>.
          </span>
        </div>
      </div>
    </div>
  );
}

