
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sun,
  Moon,
  ChevronDown,
  ArrowRight,
  Send,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Lock,
  Eye,
  Check,
  Sparkles,
  Sliders,
  Camera,
  Mic,
  Image as ImageIcon,
  Info,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Layers,
  FileText,
  DollarSign,
  TrendingUp,
  Receipt,
  Users,
  Building,
  Key
} from 'lucide-react';
import MoneyCommandLogo from '@/components/MoneyCommandLogo';
import InteractiveNumberMatrix from '@/components/InteractiveNumberMatrix';
import CashFlowTimingSection from '@/components/CashFlowTimingSection';
import MultiEntitySeparationSection from '@/components/MultiEntitySeparationSection';
import InteractiveMerchantField from '@/components/InteractiveMerchantField';

// Official Real WhatsApp Logo Badge
function RealWhatsAppLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="#25D366" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 10C16.27 10 10 16.27 10 24C10 26.75 10.79 29.31 12.16 31.46L10.5 37.5L16.73 35.89C18.82 37.2 21.32 37.97 24 37.97C31.73 37.97 38 31.7 38 23.97C38 16.24 31.73 10 24 10ZM24 12.35C30.43 12.35 35.65 17.56 35.65 24C35.65 30.43 30.43 35.65 24 35.65C21.65 35.65 19.46 34.96 17.63 33.77L17.21 33.49L13.11 34.55L14.2 30.56L13.9 30.08C12.64 28.23 11.96 26.17 11.96 24C11.96 17.56 17.18 12.35 24 12.35ZM20.25 16.85C19.95 16.85 19.45 16.96 19.03 17.42C18.61 17.88 17.43 18.98 17.43 21.23C17.43 23.48 19.07 25.65 19.3 25.95C19.53 26.25 22.47 30.75 26.96 32.69C30.69 34.3 31.45 33.98 32.25 33.9C33.05 33.82 34.83 32.84 35.2 31.8C35.57 30.76 35.57 29.87 35.46 29.68C35.35 29.49 35.05 29.38 34.6 29.15C34.15 28.92 31.94 27.83 31.52 27.68C31.1 27.53 30.8 27.45 30.5 27.91C30.2 28.37 29.34 29.38 29.08 29.68C28.82 29.98 28.56 30.02 28.11 29.79C27.66 29.56 26.21 29.08 24.48 27.54C23.13 26.34 22.22 24.85 21.95 24.4C21.68 23.95 21.92 23.71 22.15 23.48C22.35 22.28 22.58 22.01 22.81 21.74C23.04 21.47 23.15 21.28 23.3 20.98C23.45 20.68 23.38 20.41 23.26 20.18C23.14 19.95 22.22 17.7 21.84 16.78C21.47 15.89 21.09 16.01 20.8 16C20.53 15.99 20.21 15.99 19.9 15.99"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// Official Real Money Command Icon Badge
function RealMoneyCommandIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-[14px] bg-[#09090b] text-white dark:bg-white dark:text-black shadow-md border border-white/10 dark:border-black/10 p-2.5 ${className}`}>
      <MoneyCommandLogo variant="mark" className="w-full h-full" />
    </div>
  );
}

// WhatsApp Official Icon (Monochrome / Inline)
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.85-7.01zm-7.01 15.25c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a7.88 7.88 0 0 1-1.21-4.39c0-4.38 3.56-7.94 7.95-7.94 2.12 0 4.12.83 5.62 2.33a7.89 7.89 0 0 1 2.33 5.62c0 4.38-3.56 7.94-7.95 7.94zm4.36-5.96c-.24-.12-1.41-.7-1.63-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

// User Profile Avatars
const FOUNDER_AVATARS = [
  { id: 'sarah', name: 'sarah.founder', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { id: 'marcus', name: 'marcus.dev', role: 'Freelance Engineer', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { id: 'elena', name: 'elena.cpa', role: 'Chartered Accountant', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
  { id: 'david', name: 'david.agency', role: 'Studio Founder', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
];

export default function MoneyCommandLandingPage() {
  const [isDark, setIsDark] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [heroMetric, setHeroMetric] = useState<'all' | 'taxpayers' | 'founders'>('all');
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(true);
  const [toggle3, setToggle3] = useState(true);

  // Live session timer in footer
  const [secondsSpent, setSecondsSpent] = useState(25);
  useEffect(() => {
    const timer = setInterval(() => setSecondsSpent((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Sync theme
  useEffect(() => {
    const currentTheme = document.documentElement.dataset.theme;
    setIsDark(currentTheme !== 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem('theme', nextTheme);
    } catch { }
    setIsDark(!isDark);
  };

  // Section scroll spy
  useEffect(() => {
    const sectionIds = ['hero', 'connection', 'surfaces', 'safe-to-spend', 'actions', 'ledger', 'timing', 'multi-entity', 'invite-capital', 'pricing', 'faq'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Professional Scroll Observer Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.08 }
    );

    const animatedEls = document.querySelectorAll('.section-animate');
    animatedEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const sectionsList = [
    { id: 'hero', num: '01', label: 'start' },
    { id: 'connection', num: '02', label: 'the connection' },
    { id: 'surfaces', num: '03', label: '6 product surfaces' },
    { id: 'safe-to-spend', num: '04', label: 'safe-to-spend' },
    { id: 'actions', num: '05', label: 'permissioned actions' },
    { id: 'ledger', num: '06', label: 'deterministic ledger' },
    { id: 'timing', num: '07', label: 'cash flow timing' },
    { id: 'multi-entity', num: '08', label: 'your real bottom line' },
    { id: 'invite-capital', num: '09', label: 'the invite' },
    { id: 'pricing', num: '10', label: 'pricing & blueprint' },
    { id: 'faq', num: '11', label: 'faq' },
  ];

  const faqs = [
    {
      q: 'What is Money Command?',
      a: "Money Command is an auditable financial operating system and Personal AI CFO for freelancers, founders, and organizations. You speak, text, or snap receipts in WhatsApp; AI extracts structured proposals; deterministic services post balanced double-entry ledger entries and compute Safe-to-Spend with zero guessing.",
    },
    {
      q: 'Does AI directly modify my financial ledger or move money?',
      a: "Never. Under our strict AI Boundary, LLMs only interpret natural language and draft proposals. Every transaction requires user confirmation. Official balances, budgets, tax calculations, and double-entry postings are 100% deterministic, immutable, and reproducible.",
    },
    {
      q: 'How does WhatsApp capture work safely without exposing my banking passwords?',
      a: "We never ask for or store bank login credentials. We connect directly through Meta's verified WhatsApp Cloud API with cryptographic webhook signature validation. You authorize once and can unlink anytime.",
    },
    {
      q: 'How does the Safe-to-Spend formula work?',
      a: "Safe-to-Spend is a deterministic calculation: Liquid Cash + Expected Income - Essential Obligations - Debt Minimums - Tax Reserve - Committed Savings - Buffer. It gives you a crystal-clear number you can safely spend without risking payroll, rent, or CRA tax remittances.",
    },
    {
      q: 'Can my accountant or CPA review my books?',
      a: "Yes. Money Command includes a dedicated, permissioned Accountant Portal. You can invite your accountant with revocable access to inspect source receipts, confirm tax-year categories, and export standardized packages without disclosing unnecessary personal records.",
    },
    {
      q: 'What are the launch pricing tiers?',
      a: "Personal is CAD 5/month with full WhatsApp capture, budgets, and Safe-to-Spend. Founder is CAD 10/month with multi-entity separation (personal vs business), receivables tracking, and tax reserves. 60-day organization pilots are CAD 5,000.",
    },
  ];

  // 30 days Safe-to-Spend cash flow histogram (peak in orange)
  const safeToSpendBars = [
    18, 24, 20, 28, 22, 34, 26, 30, 42, 22,
    32, 38, 28, 48, 36, 42, 46, 32, 52, 44,
    58, 64, 54, 70, 76, 68, 82, 88, 74, 96
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-foreground selection:text-background font-sans antialiased overflow-x-hidden transition-colors duration-200">
      {/* FIXED RIGHT-SIDE VERTICAL PROGRESS TICK BAR */}
      <nav
        aria-label="Section navigation"
        className="fixed right-2 sm:right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2.5 items-end select-none pointer-events-auto"
      >
        {sectionsList.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="group flex items-center justify-end py-1"
              title={`${sec.num} · ${sec.label}`}
            >
              <div
                className={`transition-all duration-300 rounded-full ${isActive
                    ? 'w-6 h-[2.5px] bg-foreground shadow-sm'
                    : 'w-2.5 h-[2px] bg-muted-foreground/40 group-hover:bg-muted-foreground group-hover:w-4'
                  }`}
              />
            </a>
          );
        })}
      </nav>

      {/* TOP HEADER WITH BRANDING & CONTROLS */}
      <header className="fixed inset-x-0 top-0 z-40 w-full border-b border-border bg-[var(--chrome-glass)] backdrop-blur-md transition-colors duration-200">
        <div className="px-4 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-7xl flex items-center justify-between gap-4 py-3.5">
            {/* Logo & Navigation */}
            <div className="flex items-center gap-6 sm:gap-8">
              <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group">
                <MoneyCommandLogo variant="mark" className="h-7 sm:h-8 w-auto transition-transform group-hover:scale-105" />
                <span className="font-extrabold tracking-tight text-base sm:text-xl text-foreground font-sans uppercase">
                  MONEY COMMAND
                </span>
              </Link>

              <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs font-normal text-muted-foreground">
                <a href="#surfaces" className="hover:text-foreground transition-colors">Surfaces</a>
                <a href="#safe-to-spend" className="hover:text-foreground transition-colors">Safe-to-Spend</a>
                <a href="#ledger" className="hover:text-foreground transition-colors">Ledger Architecture</a>
                <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
                <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
              </nav>
            </div>

            {/* Right Controls: Canada-first Language Pill, Theme Toggle, App CTA */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="hidden xs:flex items-center gap-1.5 sm:gap-2 text-[11px] font-mono text-muted-foreground border border-border px-2.5 sm:px-3 py-1 rounded-full bg-secondary/80">
                <span className="text-foreground font-bold">EN</span>
                <span className="text-muted-foreground/50">/</span>
                <span className="hover:text-foreground cursor-pointer transition-colors">FR</span>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border"
              >
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </button>

              <Link
                href="/login"
                className="px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-full bg-foreground text-background hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <span>Launch OS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1">
        {/* =========================================================================
            SECTION 01 · HERO & THE CANADIAN WHATSAPP POPULATION MATRIX (13.88M)
            ========================================================================= */}
        <section 
          id="hero" 
          className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 overflow-hidden text-center transition-colors"
        >
          {/* Top Radial Glow Effect */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] pointer-events-none blur-3xl -z-10"
            style={{
              background: 'radial-gradient(ellipse at 50% 15%, var(--glow-top) 0%, transparent 70%)',
            }}
          />

          {/* Centered Hero Text Content Block */}
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center py-6 sm:py-10 lg:py-14 gap-4 sm:gap-6 section-animate in-view">
            {/* Top Monospace Blueprint Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-border bg-secondary/80 text-[11px] sm:text-xs font-mono text-muted-foreground shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Founder Financial OS &middot; Year-Round Tax Intelligence &middot; Canada-First</span>
            </div>

            {/* Main Headline with Generous Vertical Padding */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08] text-balance py-1 sm:py-2">
              <span className="text-muted-foreground block">
                Unstructured text is just noise.
              </span>
              <span className="text-foreground mt-1 sm:mt-2 block">
                Money has a Command.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="max-w-2xl text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed px-2">
              Money Command turns WhatsApp messages, receipts, and voice notes into an auditable double-entry ledger &mdash; with deterministic budgets, year-round tax intelligence, and permissioned action automation.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3 sm:pt-4">
              <a
                href="#connection"
                className="px-6 sm:px-8 py-3 rounded-full bg-foreground text-background font-semibold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-500" />
                <span>Connect WhatsApp</span>
              </a>

              <Link
                href="/login"
                className="px-6 sm:px-7 py-3 rounded-full bg-secondary hover:bg-muted text-foreground border border-border font-medium text-xs sm:text-sm transition-colors shadow-sm"
              >
                Launch Web OS &rarr;
              </Link>
            </div>

            {/* Monospace Pricing Tagline */}
            <div className="text-[11px] sm:text-xs text-muted-foreground font-mono tracking-wide pt-1">
              Launch pricing: Personal CAD 5/mo &middot; Founder CAD 10/mo &middot; 60-Day Org Pilot CAD 5,000
            </div>
          </div>

          {/* THE DYNAMIC CANADIAN WHATSAPP POPULATION MATRIX DISPLAY (13.88M Users · 38.3% - 45% Penetration) */}
          <div className="w-full max-w-5xl mx-auto mt-8 sm:mt-12 lg:mt-16 px-2 relative select-none section-animate in-view">
            {/* Metric Cohort Selector Pills */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 p-1 rounded-full bg-secondary/80 border border-border w-fit mx-auto mb-2 text-[10px] sm:text-[11px] font-mono shadow-xs">
              <button
                type="button"
                onClick={() => setHeroMetric('all')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  heroMetric === 'all'
                    ? 'bg-foreground text-background font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                13.88M All WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setHeroMetric('taxpayers')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  heroMetric === 'taxpayers'
                    ? 'bg-foreground text-background font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                6.85M Taxpayers
              </button>
              <button
                type="button"
                onClick={() => setHeroMetric('founders')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  heroMetric === 'founders'
                    ? 'bg-foreground text-background font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                1.00M+ Founders &amp; Gig
              </button>
            </div>

            <InteractiveNumberMatrix 
              value={heroMetric === 'all' ? 13880000 : heroMetric === 'taxpayers' ? 6850000 : 1000000} 
            />

            {/* Canadian Population Penetration Statistic Pill */}
            <div className="flex flex-col items-center gap-1.5 pt-2">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-secondary/80 border border-border text-[10px] sm:text-[11px] font-mono text-muted-foreground shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-foreground font-bold">
                  {heroMetric === 'all' && '13,880,000 Canadians on WhatsApp'}
                  {heroMetric === 'taxpayers' && '6,850,000 Net Income Taxpayers on WhatsApp'}
                  {heroMetric === 'founders' && '1,000,000+ Freelancers & Self-Employed Founders'}
                </span>
                <span className="text-muted-foreground/50">&middot;</span>
                <span>
                  {heroMetric === 'all' && '38.3% – 45% population penetration'}
                  {heroMetric === 'taxpayers' && 'Active CRA filing & payroll brackets'}
                  {heroMetric === 'founders' && 'Managing T2125, invoices & GST/HST'}
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground/75">
                Hover over numbers to inspect Canadian founders, freelancers &amp; accountants
              </span>
            </div>

            {/* Mouse Scroll Cue */}
            <div className="flex flex-col items-center justify-center pt-3 sm:pt-4">
              <a
                href="#connection"
                aria-label="Scroll to connection section"
                className="w-5 h-8 rounded-full border-2 border-border flex justify-center pt-1.5 scroll-cue-mouse hover:border-foreground transition-colors cursor-pointer"
              >
                <div className="w-1 h-2 rounded-full bg-foreground" />
              </a>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 02 · THE CONNECTION (ANIMATED & INTENTIONAL)
            ========================================================================= */}
        <section id="connection" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
          <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
            <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
              <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
                <p className="flex items-center gap-2 font-mono text-xs font-medium">
                  <span className="tabular-nums text-foreground">02</span>
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground lowercase">the connection</span>
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
                  <span className="block">A secure connection.</span>
                  <span className="block">Through Meta’s official login.</span>
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
                  You authorize in one tap and disconnect whenever you want. Money Command operates through authenticated channel linking &mdash; never accessing your banking passwords or credentials.
                </p>
              </div>
            </div>

            {/* Visual Stage with Ambient Synapses and Floating Callouts */}
            <div className="relative w-full max-w-4xl mx-auto py-8 sm:py-12 px-2 sm:px-8 flex items-center justify-center">
              {/* Floating Callout 1 (Top Left) with Animated Floating */}
              <div className="hidden lg:block absolute -top-4 left-4 z-20 p-4 rounded-2xl bg-card border border-border shadow-md max-w-[230px] pro-card animate-float">
                <div className="flex items-center gap-1.5 pb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">CHANNEL ONLY</span>
                </div>
                <h4 className="font-semibold text-xs text-foreground">You connect WhatsApp</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Never your banking password.</p>
              </div>

              {/* Floating Callout 2 (Bottom Left) with Delayed Animated Floating */}
              <div className="hidden lg:block absolute -bottom-4 left-6 z-20 p-4 rounded-2xl bg-card border border-border shadow-md max-w-[230px] pro-card animate-float-delayed">
                <div className="flex items-center gap-1.5 pb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fb923c] animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-[#fb923c] uppercase">DETERMINISTIC</span>
                </div>
                <h4 className="font-semibold text-xs text-foreground">You&apos;re in control</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Zero autonomous money transfers.</p>
              </div>

              {/* Floating Callout 3 (Center Right) with Slow Animated Floating */}
              <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-2 z-20 p-4 rounded-2xl bg-card border border-border shadow-md max-w-[230px] pro-card animate-float-slow">
                <div className="flex items-center gap-1.5 pb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-cyan-500 uppercase">AUDIT TRAIL</span>
                </div>
                <h4 className="font-semibold text-xs text-foreground">Only what&apos;s confirmed</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Double-entry ledger accuracy.</p>
              </div>

              {/* Centered Authorization Modal with Real Logos & Animated Data Beam Bridge */}
              <div className="relative z-10 w-full max-w-sm rounded-[32px] bg-card/95 backdrop-blur-xl border border-border p-6 sm:p-7 shadow-xl space-y-5 sm:space-y-6 pro-card">
                {/* Real Logos with Animated Connecting Energy Synapse Beam */}
                <div className="flex items-center justify-center gap-4 sm:gap-5 pt-1">
                  {/* Real WhatsApp Official Badge */}
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-2 rounded-2xl bg-emerald-500/15 blur-md animate-radar pointer-events-none" />
                    <RealWhatsAppLogo className="w-12 h-12 relative z-10 shadow-md group-hover:scale-105 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-card z-20" />
                  </div>

                  {/* Animated Flowing Data Synapse Bridge */}
                  <div className="relative w-16 sm:w-20 h-6 flex items-center justify-center">
                    <svg className="w-full h-4 overflow-visible" viewBox="0 0 80 16">
                      <line x1="0" y1="8" x2="80" y2="8" stroke="currentColor" strokeWidth="2" className="text-border" />
                      <line x1="0" y1="8" x2="80" y2="8" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" className="animate-beam-flow" />
                    </svg>
                    <div className="absolute -top-2 px-1.5 py-0.5 rounded-full bg-secondary border border-border shadow-xs text-[8px] font-mono text-muted-foreground flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-emerald-500" />
                      <span className="font-bold">E2EE</span>
                    </div>
                  </div>

                  {/* Real Money Command Official Mark Badge */}
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-2 rounded-2xl bg-foreground/10 blur-md animate-radar pointer-events-none" />
                    <RealMoneyCommandIcon className="w-12 h-12 relative z-10 shadow-md group-hover:scale-105 transition-transform" />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#fb923c] border-2 border-card z-20" />
                  </div>
                </div>

                {/* Header Information */}
                <div className="text-center space-y-1.5">
                  <h3 className="font-extrabold text-sm sm:text-base text-foreground tracking-tight">
                    Link WhatsApp to Money Command
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border text-[10px] font-mono text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Meta Verified Cloud API &middot; Tenant Isolated</span>
                  </div>
                </div>

                {/* Permissions Toggles List with Animated Micro-States */}
                <div className="space-y-3.5 sm:space-y-4 pt-1 text-left">
                  <div className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-secondary/40 transition-colors">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-foreground block">Conversational Capture</span>
                      <span className="text-[10px] text-muted-foreground block">Parse text, voice notes & receipts</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setToggle1(!toggle1)}
                      className={`w-11 h-6 rounded-full transition-all duration-300 relative p-0.5 ${toggle1 ? 'bg-foreground' : 'bg-secondary border border-border'}`}
                      aria-label="Toggle Conversational Capture"
                    >
                      <div className={`w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${toggle1 ? 'translate-x-5 bg-background shadow-xs' : 'translate-x-0 bg-muted-foreground'}`}>
                        {toggle1 && <Check className="w-3 h-3 text-foreground" />}
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-secondary/40 transition-colors">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-foreground block">Safe-to-Spend Alerts</span>
                      <span className="text-[10px] text-muted-foreground block">Proactive threshold reminders</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setToggle2(!toggle2)}
                      className={`w-11 h-6 rounded-full transition-all duration-300 relative p-0.5 ${toggle2 ? 'bg-foreground' : 'bg-secondary border border-border'}`}
                      aria-label="Toggle Safe-to-Spend Alerts"
                    >
                      <div className={`w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${toggle2 ? 'translate-x-5 bg-background shadow-xs' : 'translate-x-0 bg-muted-foreground'}`}>
                        {toggle2 && <Check className="w-3 h-3 text-foreground" />}
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-secondary/40 transition-colors">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-foreground block">Action Scoping</span>
                      <span className="text-[10px] text-muted-foreground block">Require approval for every action</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setToggle3(!toggle3)}
                      className={`w-11 h-6 rounded-full transition-all duration-300 relative p-0.5 ${toggle3 ? 'bg-foreground' : 'bg-secondary border border-border'}`}
                      aria-label="Toggle Action Scoping"
                    >
                      <div className={`w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${toggle3 ? 'translate-x-5 bg-background shadow-xs' : 'translate-x-0 bg-muted-foreground'}`}>
                        {toggle3 && <Check className="w-3 h-3 text-foreground" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Authorize & Link Button with Interactive State */}
                <div className="pt-2 space-y-2.5">
                  <button 
                    type="button"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Authorize &amp; Link WhatsApp</span>
                  </button>
                  <div className="text-center">
                    <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 03 · THE 6 PRODUCT SURFACES
            ========================================================================= */}
        <section id="surfaces" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
          <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
            <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
              <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
                <p className="flex items-center gap-2 font-mono text-xs font-medium">
                  <span className="tabular-nums text-foreground">03</span>
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground lowercase">the surfaces</span>
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
                  6 product surfaces.<br />One deterministic core.
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Whether you converse on WhatsApp, inspect ledgers on the Web Companion, manage multi-entity cash flow as a founder, or grant revocable review to your CPA, the truth reconciles to the exact same double-entry database.
                </p>
              </div>
            </div>

            {/* Surfaces Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto w-full">
              {[
                { title: 'WhatsApp Interface', role: 'Capture & Approvals', desc: 'Text, voice notes, photo receipts, quick transaction confirmations, and Ask My Money.' },
                { title: 'User Web Dashboard', role: 'Companion OS', desc: 'Reconciled balances, budgets, safe-to-spend horizons, subscription monitor, and CSV/PDF export.' },
                { title: 'Founder Dashboard', role: 'Multi-Entity OS', desc: 'Separation of personal vs business entities, cash flow runway, receivables, and tax reserve planning.' },
                { title: 'Accountant Portal', role: 'Permissioned Review', desc: 'Client-granted revocable access for CPAs to inspect provenance, receipts, and tax-year packages.' },
                { title: 'Organization Dashboard', role: 'Cohort Analytics', desc: 'Privacy-safe aggregate financial wellness and benchmark engagement across corporate cohorts.' },
                { title: 'Admin Console', role: 'Governance & Audit', desc: 'Tenant isolation, feature flags, webhook DLQ monitoring, append-only logs, and security oversight.' },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-border bg-card p-6 sm:p-7 flex flex-col justify-between space-y-4 hover:border-foreground/30 transition-all shadow-sm pro-card"
                >
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      SURFACE 0{idx + 1} &middot; {s.role}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="pt-3 flex items-center justify-between text-xs text-muted-foreground font-mono border-t border-border">
                    <span>Deterministic API</span>
                    <span className="text-foreground font-bold">&rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 04 · DETERMINISTIC INTELLIGENCE & SAFE-TO-SPEND
            ========================================================================= */}
        <section id="safe-to-spend" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
          <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
            <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
              <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
                <p className="flex items-center gap-2 font-mono text-xs font-medium">
                  <span className="tabular-nums text-foreground">04</span>
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground lowercase">safe-to-spend</span>
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
                  One formula<br />always protects you.
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Safe-to-Spend is never an LLM guess. It is a strictly deterministic equation protecting your cash flow, minimum debt payments, and mandatory CRA tax reserves.
                </p>
              </div>
            </div>

            {/* Spotlight Card */}
            <div className="relative max-w-4xl mx-auto py-6 sm:py-8 w-full">
              <div className="relative z-10 w-full max-w-xl mx-auto rounded-[32px] bg-card border border-border p-6 sm:p-8 shadow-xl space-y-5 sm:space-y-6 pro-card">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                  <span>DETERMINISTIC FORMULA</span>
                  <span className="text-emerald-500 font-bold">100% EXPLAINABLE</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-secondary border border-border text-[11px] sm:text-xs font-mono text-foreground space-y-1.5 leading-relaxed overflow-x-auto">
                  <div className="font-bold pb-1 text-foreground">SAFE_TO_SPEND =</div>
                  <div className="pl-4 text-emerald-600 dark:text-emerald-400">+ AVAILABLE_LIQUID_CASH</div>
                  <div className="pl-4 text-emerald-600 dark:text-emerald-400">+ EXPECTED_INCOME_WITHIN_HORIZON</div>
                  <div className="pl-4 text-rose-500">- ESSENTIAL_BILLS</div>
                  <div className="pl-4 text-rose-500">- MINIMUM_DEBT_PAYMENTS</div>
                  <div className="pl-4 text-[#fb923c]">- TAX_RESERVE_REQUIREMENT</div>
                  <div className="pl-4 text-muted-foreground">- COMMITTED_SAVINGS</div>
                  <div className="pl-4 text-muted-foreground">- USER_DEFINED_BUFFER</div>
                </div>

                {/* 30-Day Safe-to-Spend Histogram */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase">
                    <span>SAFE-TO-SPEND &middot; 30-DAY HORIZON</span>
                    <span className="font-bold text-foreground">CAD 2,840</span>
                  </div>

                  <div className="flex items-end justify-between gap-1 h-12 sm:h-14 w-full pt-1">
                    {safeToSpendBars.map((height, i) => {
                      const isPeak = i === safeToSpendBars.length - 1;
                      return (
                        <div
                          key={i}
                          style={{ height: `${height}%` }}
                          className={`w-full rounded-xs transition-all ${isPeak
                              ? 'bg-[#fb923c] shadow-sm'
                              : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                            }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Proposed Transaction Extraction */}
                <div className="p-4 rounded-2xl bg-secondary border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                    <span>PROPOSED TRANSACTION</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">CONFIDENCE 0.96 &middot; USER VERIFIED</span>
                  </div>
                  <p className="text-foreground font-medium text-xs sm:text-sm">
                    &ldquo;Spent CAD 46 at Walmart on groceries&rdquo;
                  </p>
                  <div className="text-[10px] font-mono text-muted-foreground flex items-center justify-between pt-1">
                    <span>Debit: Groceries CAD 46.00</span>
                    <span>Credit: Checking CAD 46.00</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/login"
                    className="w-full py-3 rounded-full bg-foreground text-background font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity shadow-sm block text-center"
                  >
                    Inspect in Web Dashboard &rarr;
                  </Link>
                </div>
              </div>

              <div className="pt-8 text-center text-xs font-mono text-muted-foreground">
                This isn’t an LLM hallucination. It’s double-entry accounting truth.
              </div>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 05 · PERMISSIONED ACTIONS
            ========================================================================= */}
        <section id="actions" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
          <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
            <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
              <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
                <p className="flex items-center gap-2 font-mono text-xs font-medium">
                  <span className="tabular-nums text-foreground">05</span>
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground lowercase">permissioned actions</span>
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
                  AI coaches and drafts.<br />You authorize every dollar.
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
                  The Action Orchestrator prepares cancellation workflows and bill negotiation counteroffers, but it cannot bind you to contract changes without explicit, scoped consent.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto text-xs w-full">
              {/* Card 1: Subscription Cancellation */}
              <div className="p-6 sm:p-7 rounded-[32px] border border-border bg-card space-y-4 shadow-sm pro-card">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-bold text-foreground text-sm sm:text-base">Subscription Cancellation</span>
                  <span className="text-[10px] font-mono text-muted-foreground">P1 WORKFLOW</span>
                </div>
                <div className="font-mono text-[11px] text-muted-foreground space-y-1.5">
                  <div>DETECT RECURRING CHARGE (CAD 84/mo)</div>
                  <div>&rarr; USER REVIEWS TERMS & FEES</div>
                  <div>&rarr; RESOLVE ROUTE (EMAIL/API/SCRIPT)</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">&rarr; EXPLICIT USER AUTHORIZATION</div>
                  <div>&rarr; POST-CANCELLATION MONITORING</div>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed pt-2">
                  Never marked &ldquo;cancelled&rdquo; until proof of confirmation is captured and verified against future billing cycles.
                </p>
              </div>

              {/* Card 2: Bill Negotiation */}
              <div className="p-6 sm:p-7 rounded-[32px] border border-border bg-card space-y-4 shadow-sm pro-card">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-bold text-foreground text-sm sm:text-base">Bill Negotiation Engine</span>
                  <span className="text-[10px] font-mono text-muted-foreground">COACH / DRAFT / INITIATE</span>
                </div>
                <div className="font-mono text-[11px] text-muted-foreground space-y-1.5">
                  <div>ANALYZE HISTORICAL TELECOM BILLS</div>
                  <div>&rarr; BENCHMARK ACCEPTABLE TARGET RANGE</div>
                  <div>&rarr; GENERATE COUNTEROFFER SCRIPT</div>
                  <div className="text-[#fb923c] font-bold">&rarr; USER APPROVAL FOR ANY TERM CHANGE</div>
                  <div>&rarr; AUDITABLE PROVED SAVINGS STORED</div>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed pt-2">
                  Any contract extension, financing terms, credit check or fee requires fresh, explicit customer signoff.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 06 · THE LEDGER TRUTH
            ========================================================================= */}
        <section id="ledger" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
          <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
            <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
              <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
                <p className="flex items-center gap-2 font-mono text-xs font-medium">
                  <span className="tabular-nums text-foreground">06</span>
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground lowercase">the ledger truth</span>
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
                  Double-entry source of truth.<br />Non-negotiable ledger.
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Money Command enforces strict financial controls: integer minor units (4600 cents), balanced debits and credits, idempotent writes, and append-only reversal corrections.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto text-xs w-full">
              <div className="p-6 rounded-[28px] border border-border bg-card space-y-2.5 shadow-sm pro-card">
                <span className="font-mono text-[10px] text-muted-foreground block uppercase">Exact Minor Units</span>
                <p className="font-bold text-foreground text-base">Integer Math Only</p>
                <span className="text-xs text-muted-foreground block leading-relaxed">No floating-point rounding errors. Every transaction stored to the exact cent.</span>
              </div>

              <div className="p-6 rounded-[28px] border border-border bg-card space-y-2.5 shadow-sm pro-card">
                <span className="font-mono text-[10px] text-muted-foreground block uppercase">Zero Overwrites</span>
                <p className="font-bold text-foreground text-base">Append-Only Audit</p>
                <span className="text-xs text-muted-foreground block leading-relaxed">Posted journals are non-editable. Corrections link to reversing compensating entries.</span>
              </div>

              <div className="p-6 rounded-[28px] border border-border bg-card space-y-2.5 shadow-sm pro-card">
                <span className="font-mono text-[10px] text-muted-foreground block uppercase">Replay Safety</span>
                <p className="font-bold text-foreground text-base">Idempotent Webhooks</p>
                <span className="text-xs text-muted-foreground block leading-relaxed">Repeated WhatsApp message IDs post exactly one journal. Zero duplicate transactions.</span>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 07 · CASH FLOW TIMING (IMAGE 2)
            ========================================================================= */}
        <CashFlowTimingSection />

        {/* =========================================================================
            SECTION 08 · MULTI-ENTITY SEPARATION (IMAGE 1)
            ========================================================================= */}
        <MultiEntitySeparationSection />

        {/* =========================================================================
            THE INVITE · HIDDEN CAPITAL & MERCHANT HALO MATRIX (EXACT PATENSIFY STAGE)
            ========================================================================= */}
        <section id="invite-capital" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 text-center transition-colors">
          <div className="mx-auto w-full max-w-7xl flex flex-col items-center justify-center gap-6 sm:gap-10 section-animate">
            <div className="act-head mx-auto flex max-w-3xl flex-col items-center gap-3 sm:gap-4 text-center">
              <p className="flex items-center gap-2 font-mono text-xs font-medium">
                <span className="tabular-nums text-foreground">09</span>
                <span aria-hidden="true" className="text-muted-foreground">·</span>
                <span className="text-muted-foreground lowercase">the invite</span>
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
                There is cash hiding in your business that you can&apos;t see.
              </h2>
              <p className="text-pretty text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                They&apos;re buried in zombie subscriptions, untracked GST/HST input tax credits, and forgotten auto-renewals. Money Command puts it together and surfaces every dollar, by name.
              </p>
            </div>

            <InteractiveMerchantField />
          </div>
        </section>


        {/* =========================================================================
            SECTION 10 · PRICING & IT EXECUTION BLUEPRINT (EXACT PATENSIFY ACT-HEAD)
            ========================================================================= */}
        <section id="pricing" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
          <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
            <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
              <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
                <p className="flex items-center gap-2 font-mono text-xs font-medium">
                  <span className="tabular-nums text-foreground">10</span>
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground lowercase">pricing & roadmap</span>
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
                  Transparent Canadian pricing.
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Deterministic accounting, WhatsApp capture, and year-round peace of mind. Zero bank credential sharing.
                </p>
              </div>
            </div>

            {/* 3 Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 text-left max-w-6xl mx-auto w-full">
              {/* Personal */}
              <div className="p-7 sm:p-8 rounded-[32px] border border-border bg-card space-y-6 flex flex-col justify-between shadow-sm pro-card">
                <div className="space-y-3.5">
                  <span className="text-xs font-mono uppercase text-muted-foreground">PERSONAL</span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    CAD 5<span className="text-sm font-normal text-muted-foreground"> / month</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    For freelancers and creators tracking daily cash flow and safe-to-spend.
                  </p>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5 pt-2">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> WhatsApp text, voice & receipts</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Deterministic Safe-to-Spend</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Double-entry personal ledger</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Web companion & CSV export</li>
                  </ul>
                </div>
                <Link
                  href="/login"
                  className="w-full py-3 rounded-full bg-secondary text-foreground font-semibold text-xs sm:text-sm hover:bg-muted transition-colors block text-center border border-border"
                >
                  Start Personal
                </Link>
              </div>

              {/* Founder (Highlighted) */}
              <div className="p-7 sm:p-8 rounded-[32px] border-2 border-foreground bg-card space-y-6 flex flex-col justify-between shadow-xl relative pro-card">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold">FOUNDER CFO</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-foreground text-background text-[10px] font-mono font-bold">POPULAR</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    CAD 10<span className="text-sm font-normal text-muted-foreground"> / month</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    For incorporated founders, agency owners, and multi-entity micro-businesses.
                  </p>
                  <ul className="text-xs sm:text-sm text-foreground space-y-2.5 pt-2">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Everything in Personal</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Multi-entity (Personal & Business)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Continuous tax reserve calculation</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Accountant Portal sharing grant</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Subscription & bill negotiation coach</li>
                  </ul>
                </div>
                <Link
                  href="/login"
                  className="w-full py-3 rounded-full bg-foreground text-background font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity block text-center shadow-md"
                >
                  Start Founder OS
                </Link>
              </div>

              {/* Organization Pilot */}
              <div className="p-7 sm:p-8 rounded-[32px] border border-border bg-card space-y-6 flex flex-col justify-between shadow-sm pro-card">
                <div className="space-y-3.5">
                  <span className="text-xs font-mono uppercase text-muted-foreground">ORGANIZATION PILOT</span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    CAD 5,000<span className="text-sm font-normal text-muted-foreground"> / 60 days</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    60-day organization pilot for accelerators, co-working networks, and founder cohorts.
                  </p>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-2.5 pt-2">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Up to 100 member seats</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Privacy-safe aggregate analytics</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Dedicated onboarding concierge</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Custom CRA tax categories</li>
                  </ul>
                </div>
                <a
                  href="mailto:pilot@moneycommand.ca"
                  className="w-full py-3 rounded-full bg-secondary text-foreground font-semibold text-xs sm:text-sm hover:bg-muted transition-colors block text-center border border-border"
                >
                  Inquire for Pilot
                </a>
              </div>
            </div>

            {/* WhatsApp Simulator Box */}
            <div id="invite" className="p-6 sm:p-8 rounded-[32px] border border-border bg-card max-w-lg mx-auto space-y-5 text-left text-xs shadow-md pro-card w-full">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <WhatsAppIcon className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-foreground text-sm">Money Command WhatsApp Bot</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Active · CAD-Ready</span>
              </div>

              <div className="space-y-3 font-sans">
                <div className="flex justify-end">
                  <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-xs max-w-[85%] leading-relaxed shadow-sm">
                    Spent CAD 46 at Walmart on groceries
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-secondary border border-border text-foreground p-3.5 rounded-2xl rounded-tl-xs max-w-[88%] leading-relaxed space-y-2">
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 block font-bold">PROPOSAL READY (96% Confidence)</span>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Record <strong className="text-foreground">CAD 46.00</strong> expense to <strong className="text-foreground">Groceries</strong> from <strong className="text-foreground">Personal Checking</strong>?
                    </p>
                    <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                      <span className="px-2.5 py-1 rounded bg-foreground text-background font-bold">1: Confirm</span>
                      <span className="px-2.5 py-1 rounded bg-muted text-foreground border border-border">2: Correct</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/client"
                  className="w-full py-3 rounded-full bg-foreground text-background font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-500" />
                  <span>Start on WhatsApp Now</span>
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 11 · FREQUENTLY ASKED QUESTIONS (EXACT PATENSIFY ACCORDION)
            ========================================================================= */}
        <section id="faq" className="scroll-mt-24 px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
          <div className="mx-auto w-full max-w-7xl flex flex-col gap-10 sm:gap-14 section-animate">
            <header className="grid gap-x-10 gap-y-4 lg:grid-cols-12 lg:items-end">
              <h2 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl lg:col-span-7">
                Frequently asked questions
              </h2>
              <p className="text-pretty text-base sm:text-lg text-muted-foreground lg:col-span-5">
                The questions we get asked the most.
              </p>
            </header>

            <div className="border-t border-foreground/12">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-foreground/12">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 sm:py-6 text-left text-base sm:text-lg font-medium text-foreground hover:text-foreground/80 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-muted-foreground duration-300 motion-safe:transition-transform ${
                        openFaq === idx ? 'rotate-180 text-foreground' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>


      {/* =========================================================================
          FOOTER WITH OFFICIAL FULL LOGO LOCKUP, LIVE TIMER & WATERMARK
          ========================================================================= */}
      <footer className="border-t border-border pt-12 sm:pt-16 pb-8 px-4 sm:px-8 lg:px-12 bg-background relative overflow-hidden transition-colors">
        {/* Dynamic Live Widget */}
        <div className="flex flex-col items-center justify-center pb-12 sm:pb-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground shrink-0 shadow-sm">
              <MoneyCommandLogo variant="mark" className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="px-3.5 py-1.5 rounded-2xl rounded-bl-xs bg-secondary border border-border text-[10px] sm:text-[11px] text-muted-foreground shadow-sm">
                Hey, so glad you&apos;re here
              </div>
              <div className="px-3.5 py-1.5 rounded-2xl rounded-tl-xs bg-secondary border border-border text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1.5 shadow-sm">
                <span>You&apos;ve been here for {formatTimer(secondsSpent)}. Money Command is ready.</span>
                <span className="text-red-500">❤️</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-column Footer Layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-xs text-muted-foreground relative z-10 pb-12">
          {/* Column 1: Brand & Tagline with Official Logo Lockup */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <MoneyCommandLogo variant="full" className="h-6 sm:h-7 w-auto text-foreground" />
            <div className="space-y-1 pt-1">
              <span className="text-xs font-mono text-muted-foreground block">Personal AI CFO &middot; Founder Financial OS</span>
              <strong className="text-xs sm:text-sm font-bold text-foreground block">Money has a Command.</strong>
            </div>
          </div>

          {/* Column 2: PRODUCT */}
          <div className="space-y-2.5 sm:space-y-3">
            <span className="font-mono text-[10px] uppercase text-muted-foreground tracking-wider block">PRODUCT</span>
            <ul className="space-y-2 text-foreground text-xs">
              <li><a href="#safe-to-spend" className="hover:text-muted-foreground transition-colors">Safe-to-Spend Engine</a></li>
              <li><a href="#surfaces" className="hover:text-muted-foreground transition-colors">WhatsApp & Web OS</a></li>
              <li><a href="#pricing" className="hover:text-muted-foreground transition-colors">Launch Pricing</a></li>
            </ul>
          </div>

          {/* Column 3: BLUEPRINT & GOVERNANCE */}
          <div className="space-y-2.5 sm:space-y-3">
            <span className="font-mono text-[10px] uppercase text-muted-foreground tracking-wider block">BLUEPRINT</span>
            <ul className="space-y-2 text-foreground text-xs">
              <li><a href="#ledger" className="hover:text-muted-foreground transition-colors">Double-Entry Core</a></li>
              <li><a href="#actions" className="hover:text-muted-foreground transition-colors">Permissioned Action Engine</a></li>
              <li><a href="#tax" className="hover:text-muted-foreground transition-colors">CRA Tax Readiness</a></li>
            </ul>
          </div>

          {/* Column 4: SOCIAL & PORTALS */}
          <div className="space-y-2.5 sm:space-y-3">
            <span className="font-mono text-[10px] uppercase text-muted-foreground tracking-wider block">PORTALS</span>
            <ul className="space-y-2 text-foreground text-xs">
              <li><Link href="/client" className="hover:text-muted-foreground transition-colors">User Web Companion</Link></li>
              <li><Link href="/accountant" className="hover:text-muted-foreground transition-colors">Accountant Review Portal</Link></li>
              <li><Link href="/admin" className="hover:text-muted-foreground transition-colors">Admin & Audit Console</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="max-w-6xl mx-auto border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-muted-foreground relative z-10 text-center sm:text-left">
          <span>&copy; 2026 Money Command. All rights reserved.</span>
          <Link href="/client" className="hover:text-foreground transition-colors">
            Launch Dashboard OS &rarr;
          </Link>
        </div>

        {/* Massive "Money Command" Typography Watermark */}
        <div className="w-full text-center pointer-events-none select-none overflow-hidden pt-8 -mb-4 sm:-mb-8">
          <span className="text-[12vw] sm:text-[14vw] font-extrabold tracking-tighter text-[var(--watermark-color)] leading-none block font-sans">
            Money Command
          </span>
        </div>
      </footer>
    </div>
  );
}
