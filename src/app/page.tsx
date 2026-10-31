'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sun, 
  Moon, 
  Sparkles, 
  MessageSquare, 
  Lock, 
  Building2, 
  FileSpreadsheet, 
  ChevronDown,
  Key
} from 'lucide-react';
import { WhatsAppSimulatorModal } from '@/components/WhatsAppSimulatorModal';
import { AskMyMoneyModal } from '@/components/AskMyMoneyModal';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';

export default function PatensifyStyleLandingPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [isDark, setIsDark] = useState(true);
  const [showWhatsAppSim, setShowWhatsAppSim] = useState(false);
  const [showAskMoney, setShowAskMoney] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Interactive Live Safe-to-Spend demo state
  const [demoHorizon, setDemoHorizon] = useState<number>(14);
  const [demoBuffer, setDemoBuffer] = useState<number>(30000); // $300

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync theme with document and localStorage
  useEffect(() => {
    const currentTheme = document.documentElement.dataset.theme;
    setIsDark(currentTheme !== 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem('theme', nextTheme);
    } catch {}
    setIsDark(!isDark);
  };

  // Canvas ambient particles / light dust simulation like Patensify
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.6,
      alpha: Math.random() * 0.4 + 0.15,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${p.alpha * 0.5})`
          : `rgba(0, 0, 0, ${p.alpha * 0.2})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  // Demo calculation:
  const demoLiquid = 1845000; // CAD 18,450.00
  const demoIncome = demoHorizon <= 7 ? 0 : demoHorizon <= 14 ? 250000 : 550000;
  const demoBills = demoHorizon <= 7 ? 14500 : demoHorizon <= 14 ? 234500 : 255000;
  const demoDebt = 5000;
  const demoTax = Math.round(demoIncome * 0.25);
  const demoSavings = 25000;
  const demoSafeToSpend = Math.max(
    0,
    demoLiquid + demoIncome - demoBills - demoDebt - demoTax - demoSavings - demoBuffer
  );

  const faqs = [
    {
      q: 'How does Money Command connect to WhatsApp without sharing passwords?',
      a: 'We use Meta’s official Cloud API. You initiate account binding via our secure web companion, which generates a short-lived token (MC-8942-CA). You send that token to our verified business number. Phone numbers alone never authenticate a session.',
    },
    {
      q: 'Can the AI make financial decisions or cancel subscriptions automatically?',
      a: 'No. The AI proposes candidates and drafts negotiation or cancellation communications. Consequential actions (contract terminations, fee approvals, or ledger postings) require explicit human approval and step-up authorization.',
    },
    {
      q: 'Why a Canada-first ledger model?',
      a: 'Canada has specific tax compliance rules: Ontario 13% HST remittance, CRA T2125 Statement of Business Activities for sole proprietors, and strict expense eligibility boundaries. Money Command handles these natively in CAD integer minor units.',
    },
    {
      q: 'What is the Zero Overwrite Invariant (MC-010)?',
      a: 'Financial records in Money Command are append-only. Once a journal entry is posted, it cannot be modified or deleted. Any correction is executed via an explicit reversing journal with an auditable reference to the original entry.',
    },
    {
      q: 'Does Money Command officially file my Canadian taxes with the CRA?',
      a: 'No. Money Command provides year-round bookkeeping readiness, deduction tracking, and 13% Ontario HST collected subledgers. We organize your evidence and generate T2125/T1 schedule exports, but official filing remains with you and your certified CPA or tax software.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* 1. Header with Glassmorphism & Theme Switcher (Matching Patensify Header) */}
      <header className="fixed inset-x-0 top-0 z-50 w-full transition-colors">
        <div className="bg-[var(--chrome-glass)] backdrop-blur-md border-b border-border">
          <div className="px-6 sm:px-8 lg:px-10">
            <div className="mx-auto w-full max-w-7xl flex items-center justify-between gap-4 py-3.5">
              {/* Brand Logo */}
              <div className="flex items-center gap-8">
                <Link href="/" className="inline-flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
                    M
                  </div>
                  <span className="font-semibold tracking-tight text-sm sm:text-base flex items-center gap-2">
                    MONEY COMMAND
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                      OS v2.0
                    </span>
                  </span>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-muted-foreground">
                  <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
                  <a href="#showcase" className="hover:text-foreground transition-colors">Safe-to-Spend</a>
                  <a href="#features" className="hover:text-foreground transition-colors">Core Ledger</a>
                  <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
                  <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
                </nav>
              </div>

              {/* Right Controls: Surface CTAs & Theme Toggle Button */}
              <div className="flex items-center gap-2.5">
                {/* Theme Toggle Button (Exact Patensify Design) */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                  className="size-9 grid place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border"
                >
                  {isDark ? (
                    <Sun className="size-4" />
                  ) : (
                    <Moon className="size-4" />
                  )}
                </button>

                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-transparent hover:border-border"
                >
                  <Key className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-transparent hover:border-border"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Admin</span>
                </Link>

                <Link
                  href="/client"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full bg-foreground text-background hover:opacity-90 transition-all shadow-xs"
                >
                  <span>Launch OS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {/* 2. Hero Section (Matching Patensify Hero with Ambient Glow, Vignette & Canvas) */}
        <section id="hero" className="relative flex min-h-[90vh] flex-col overflow-hidden justify-center items-center px-6 sm:px-8 lg:px-10 py-16 sm:py-24">
          {/* Canvas particle background */}
          <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />

          {/* Vignette mask & Radial stage glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 88% 82% at 50% 48%, transparent 48%, var(--background))',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none animate-pulse-glow"
            style={{
              background: 'radial-gradient(ellipse 52% 44% at 50% 46%, var(--stage-glow), transparent 70%)',
            }}
          />

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-7">
            {/* Meta Connection Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border text-xs text-muted-foreground shadow-xs">
              <span className="w-2 h-2 rounded-full bg-foreground animate-ping" />
              <span>Canada-First Financial OS &middot; Meta WhatsApp Cloud API Verified</span>
            </div>

            {/* Main Headline (Staggered Word Reveal Style from Patensify) */}
            <h1 className="flex flex-col items-center text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
              <span className="text-muted-foreground">
                Accounting isn&apos;t guessing.
              </span>
              <span className="text-foreground mt-1">
                Financial truth has a ledger.
              </span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
              Money Command turns WhatsApp messages and receipts into verified proposals.
              Every dollar is reconciled on an immutable double-entry ledger with deterministic Safe-to-Spend and year-round CRA tax intelligence.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                href="/client"
                className="px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all shadow-xs flex items-center gap-2 group"
              >
                <span>Open Client Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <button
                onClick={() => setShowWhatsAppSim(true)}
                className="px-5 py-3 rounded-full bg-secondary hover:bg-muted text-foreground border border-border font-medium text-sm transition-colors flex items-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span>Simulate WhatsApp Webhook</span>
              </button>

              <button
                onClick={() => setShowAskMoney(true)}
                className="px-5 py-3 rounded-full bg-secondary hover:bg-muted text-foreground border border-border font-medium text-sm transition-colors flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <span>Ask My Money AI</span>
              </button>
            </div>

            {/* Security Proof Strip */}
            <div className="pt-8 border-t border-border w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[10px] text-muted-foreground block font-sans">Ledger Core:</span>
                <span className="font-semibold text-foreground">Debits = Credits</span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[10px] text-muted-foreground block font-sans">Monetary Unit:</span>
                <span className="font-semibold text-foreground">Integer Minor Units</span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[10px] text-muted-foreground block font-sans">Reconciliation:</span>
                <span className="font-semibold text-foreground">0 Errors Gate</span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                <span className="text-[10px] text-muted-foreground block font-sans">Actions:</span>
                <span className="font-semibold text-foreground">SHA-256 Auth</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Section "A secure connection" (Matching Patensify #how) */}
        <section id="how" className="py-20 sm:py-28 px-6 sm:px-8 lg:px-10 border-t border-border">
          <div className="max-w-6xl mx-auto space-y-14">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Engineering Invariant
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                A secure connection. Through Meta’s official API.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                No bank credentials. No third-party screen scraping. Just clean cryptographic linking and conversational accounting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 space-y-4 hover:border-foreground/30 transition-colors shadow-xs">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-mono font-bold text-sm text-foreground border border-border">
                  01
                </div>
                <h3 className="font-semibold text-base text-foreground">
                  Token-Linked WhatsApp
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your phone is bound via a one-time cryptographic code (<code>MC-8942-CA</code>). Phone numbers alone are never accepted as proof of identity.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 space-y-4 hover:border-foreground/30 transition-colors shadow-xs">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-mono font-bold text-sm text-foreground border border-border">
                  02
                </div>
                <h3 className="font-semibold text-base text-foreground">
                  AI Extraction Proposal
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  &ldquo;Spent CAD 46 on groceries at Walmart&rdquo; extracts merchant, category, and integer amount (`4600`). Remains unposted until you confirm.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 space-y-4 hover:border-foreground/30 transition-colors shadow-xs">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-mono font-bold text-sm text-foreground border border-border">
                  03
                </div>
                <h3 className="font-semibold text-base text-foreground">
                  Balanced Journal Posted
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upon your confirmation, the backend commits an immutable double-entry journal: Debit Groceries CAD 46.00, Credit Chequing CAD 46.00.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Live Showcase: "CAD 18,450 follow you. Which ones matter?" */}
        <section id="showcase" className="py-20 sm:py-28 px-6 sm:px-8 lg:px-10 border-t border-border bg-secondary/30">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Deterministic Discretionary Engine
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                CAD 18,450 in business cash. What is safe to spend?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Never ask an LLM to guess your cash runway. Money Command evaluates all protected obligations, tax reserves, and your safety buffer.
              </p>
            </div>

            {/* Interactive Live Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xs space-y-8 max-w-4xl mx-auto">
              {/* Horizon & Buffer Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Forecast Horizon
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { days: 7, label: '7 Days' },
                      { days: 14, label: '14 Days (Payday)' },
                      { days: 30, label: '30 Days' },
                    ].map((h) => (
                      <button
                        key={h.days}
                        onClick={() => setDemoHorizon(h.days)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          demoHorizon === h.days
                            ? 'bg-foreground text-background font-semibold shadow-xs'
                            : 'bg-secondary text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 min-w-[240px]">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">User Safety Buffer:</span>
                    <span className="font-mono font-bold text-foreground">{formatCAD(demoBuffer)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={5000}
                    value={demoBuffer}
                    onChange={(e) => setDemoBuffer(parseInt(e.target.value, 10))}
                    className="w-full accent-current text-foreground h-1.5 bg-muted rounded-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Big Result */}
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                    Deterministic Safe-to-Spend Balance
                  </span>
                  <div className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-foreground mt-1 tabular-nums">
                    {formatCAD(demoSafeToSpend)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fully liquid for discretionary use without jeopardizing rent, payroll, debt, or CRA tax remittances.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/client"
                    className="px-5 py-2.5 rounded-full bg-foreground text-background text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 hover:opacity-90"
                  >
                    <span>View in Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Formula Breakdown Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono pt-2">
                <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                  <span className="text-[10px] text-muted-foreground block font-sans">Liquid Cash in Bank:</span>
                  <span className="text-foreground font-semibold tabular-nums">+{formatCAD(demoLiquid)}</span>
                </div>
                <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                  <span className="text-[10px] text-muted-foreground block font-sans">Expected Income:</span>
                  <span className="text-foreground font-semibold tabular-nums">+{formatCAD(demoIncome)}</span>
                </div>
                <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                  <span className="text-[10px] text-muted-foreground block font-sans">Essential Obligations:</span>
                  <span className="text-muted-foreground font-semibold tabular-nums">-{formatCAD(demoBills)}</span>
                </div>
                <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                  <span className="text-[10px] text-muted-foreground block font-sans">Minimum Debt Payments:</span>
                  <span className="text-muted-foreground font-semibold tabular-nums">-{formatCAD(demoDebt)}</span>
                </div>
                <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                  <span className="text-[10px] text-muted-foreground block font-sans">CRA Tax Reserve (25%):</span>
                  <span className="text-muted-foreground font-semibold tabular-nums">-{formatCAD(demoTax)}</span>
                </div>
                <div className="p-3 rounded-2xl bg-secondary/50 border border-border">
                  <span className="text-[10px] text-muted-foreground block font-sans">Committed Savings:</span>
                  <span className="text-muted-foreground font-semibold tabular-nums">-{formatCAD(demoSavings)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Core Features / Pillars */}
        <section id="features" className="py-20 sm:py-28 px-6 sm:px-8 lg:px-10 border-t border-border">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Built For Founders & Micro-Business
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Every dollar balanced. Every consequential action authorized.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="rounded-3xl border border-border bg-card p-7 space-y-4 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-secondary text-foreground border border-border flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">
                  Zero Overwrite Policy (MC-010)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Posted journals are immutable. Corrections are applied via balanced reversing transactions linked by <code>reversal_of_id</code>. Financial history cannot be wiped.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-3xl border border-border bg-card p-7 space-y-4 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-secondary text-foreground border border-border flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">
                  Consequential Action Auth
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The AI can prepare subscription cancellations and bill negotiation scripts, but cannot accept contracts, spend money, or alter terms without explicit step-up authorization.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-3xl border border-border bg-card p-7 space-y-4 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-secondary text-foreground border border-border flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">
                  CRA T2125 Tax Readiness
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Automatic tracking of 13% Ontario HST collected payable, business vs. personal expense splits, and standardized accountant export packages for fast, painless tax filing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Pricing Section (From Blueprint) */}
        <section id="pricing" className="py-20 sm:py-28 px-6 sm:px-8 lg:px-10 border-t border-border bg-secondary/20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Transparent Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Canada-first launch plans.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Choose the plan that fits your stage, from solo freelancer to growing cohort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Plan */}
              <div className="rounded-3xl border border-border bg-card p-8 space-y-6 flex flex-col justify-between shadow-xs">
                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                    Personal
                  </span>
                  <div className="text-4xl font-extrabold font-mono text-foreground tabular-nums">
                    CAD $5<span className="text-xs font-normal text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ideal for individual freelancers, gig workers, and solopreneurs wanting effortless WhatsApp capture and Safe-to-Spend clarity.
                  </p>
                  <ul className="space-y-2.5 text-xs text-foreground pt-4 border-t border-border">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>WhatsApp conversational capture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>Deterministic Safe-to-Spend</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>Double-entry personal ledger</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/client"
                  className="w-full py-2.5 rounded-full border border-border bg-secondary hover:bg-muted text-foreground text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  Get Started
                </Link>
              </div>

              {/* Founder Plan (Featured) */}
              <div className="rounded-3xl border-2 border-foreground bg-card p-8 space-y-6 flex flex-col justify-between relative shadow-lg">
                <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-foreground text-background font-bold text-[10px] uppercase font-mono tracking-wider">
                  Recommended
                </span>

                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase text-foreground font-semibold">
                    Founder Financial OS
                  </span>
                  <div className="text-4xl font-extrabold font-mono text-foreground tabular-nums">
                    CAD $10<span className="text-xs font-normal text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Everything in Personal plus multi-entity separation (Sole Prop / Corp), CRA tax reserve calculation, and bill negotiation coach.
                  </p>
                  <ul className="space-y-2.5 text-xs text-foreground pt-4 border-t border-border">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>Multi-entity separation (Personal & Sole Prop)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>CRA T2125 & 13% Ontario HST tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>Bill negotiation & cancellation coach</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>Accountant Portal access & CSV export</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/client"
                  className="w-full py-2.5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center hover:opacity-90 transition-all shadow-xs"
                >
                  Start 14-Day Trial
                </Link>
              </div>

              {/* Organization Pilot */}
              <div className="rounded-3xl border border-border bg-card p-8 space-y-6 flex flex-col justify-between shadow-xs">
                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                    Organization Pilot
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-foreground tabular-nums">
                    CAD $5,000<span className="text-xs font-normal text-muted-foreground">/60 days</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Designed for incubators, accelerators, and startup cohorts. Aggregate outcomes without transaction exposure.
                  </p>
                  <ul className="space-y-2.5 text-xs text-foreground pt-4 border-t border-border">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>Dedicated tenant isolation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>Privacy-safe cohort analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>White-glove onboarding & CPA sync</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/admin"
                  className="w-full py-2.5 rounded-full border border-border bg-secondary hover:bg-muted text-foreground text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  Contact Institutional Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ Accordion (Matching Patensify #faq) */}
        <section id="faq" className="py-20 sm:py-28 px-6 sm:px-8 lg:px-10 border-t border-border">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Clarity & Transparency
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Frequently asked questions
              </h2>
            </div>

            <div className="divide-y divide-border">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 py-2 text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${
                        openFaq === idx ? 'rotate-180 text-foreground' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Call to Action Banner (Matching Patensify #invite) */}
        <section className="py-16 sm:py-24 px-6 sm:px-8 lg:px-10 border-t border-border bg-card">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Ready to command your financial truth?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Join founders and Canadian freelancers who never guess their runway, tax reserve, or monthly commitments.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/client"
                className="px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all shadow-xs flex items-center gap-2"
              >
                <span>Launch Client Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin"
                className="px-6 py-3 rounded-full bg-secondary hover:bg-muted text-foreground border border-border font-medium text-sm transition-colors"
              >
                Open Admin Console
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Minimalist Footer with Wordmark Bloom (Matching Patensify Footer) */}
      <footer className="border-t border-border py-12 px-6 sm:px-8 lg:px-10 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="font-bold text-foreground">MONEY COMMAND</span>
            <span>&middot;</span>
            <span>&copy; 2026 Money Command Technologies</span>
            <span>&middot;</span>
            <span className="font-mono">Canada-first</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/client" className="hover:text-foreground transition-colors">Client UI</Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">Admin Console</Link>
            <Link href="/accountant" className="hover:text-foreground transition-colors">Accountant Portal</Link>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WhatsAppSimulatorModal
        isOpen={showWhatsAppSim}
        onClose={() => setShowWhatsAppSim(false)}
        onNewProposal={(newProp) => {
          setState((prev) => ({
            ...prev,
            proposals: [newProp, ...prev.proposals],
          }));
        }}
        entityId={state.entities[0].id}
        tenantId={state.currentTenant.id}
        userId={state.currentUser.id}
      />

      <AskMyMoneyModal
        isOpen={showAskMoney}
        onClose={() => setShowAskMoney(false)}
        accounts={state.accounts}
        transactions={state.transactions}
        pendingProposals={state.proposals}
        safeToSpendMinor={state.safeToSpendBufferMinor + 120000}
      />
    </div>
  );
}
