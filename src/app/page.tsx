
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Key,
  AtSign,
  Tag
} from 'lucide-react';
import MoneyCommandLogo from '@/components/MoneyCommandLogo';
import InteractiveNumberMatrix from '@/components/InteractiveNumberMatrix';
import CashFlowTimingSection from '@/components/CashFlowTimingSection';
import MultiEntitySeparationSection from '@/components/MultiEntitySeparationSection';
import InteractiveMerchantField from '@/components/InteractiveMerchantField';
import ScrambleText from '@/components/ScrambleText';

// Official Real WhatsApp Logo Badge
function RealWhatsAppLogo({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md p-2.5 ${className}`}>
      <WhatsAppIcon className="w-full h-full text-white" />
    </div>
  );
}

// Official Real Money Command Icon Badge (Theme-Compatible)
function RealMoneyCommandIcon({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-foreground text-background shadow-md border border-border p-2.5 ${className}`}>
      <MoneyCommandLogo variant="mark" className="w-full h-full text-current" />
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

const CONNECTION_CARDS_ROW_1 = [
  { id: 1, title: 'coffee with client $14.50', cx: 50, cy: 50 },
  { id: 2, title: 'paid AWS servers $340', cx: 80, cy: 30 },
  { id: 3, title: 'invoice #1042 received $4,200', cx: 30, cy: 80 },
  { id: 4, title: 'safe to spend this weekend?', cx: 60, cy: 40 },
  { id: 5, title: 'Uber to YYZ airport $62.30', cx: 20, cy: 30 },
  { id: 6, title: 'split dinner 3 ways $185', cx: 70, cy: 70 },
];

const CONNECTION_CARDS_ROW_2 = [
  { id: 7, title: 'grocery list · No Frills $84', cx: 40, cy: 60 },
  { id: 8, title: 'quarterly GST/HST estimate', cx: 70, cy: 20 },
  { id: 9, title: 'Staples office supplies $89.20', cx: 30, cy: 50 },
  { id: 10, title: 'how much in my tax vault?', cx: 80, cy: 70 },
  { id: 11, title: 'annual Figma renewal $180', cx: 50, cy: 30 },
  { id: 12, title: 'client retainer wired $6,500', cx: 20, cy: 80 },
];

export default function MoneyCommandLandingPage() {
  const [isDark, setIsDark] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [heroMetric, setHeroMetric] = useState<'all' | 'taxpayers' | 'founders'>('all');
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(true);
  const [toggle3, setToggle3] = useState(true);

  // Connection Section In-View State & Observer
  const connectionRef = useRef<HTMLDivElement>(null);
  const [connectionInView, setConnectionInView] = useState(false);

  useEffect(() => {
    const el = connectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setConnectionInView(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    const sectionIds = ['hero', 'connection', 'features', 'how-it-works', 'actions', 'security', 'timing', 'multi-entity', 'invite-capital', 'pricing', 'faq'];
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
    { id: 'connection', num: '02', label: 'connection' },
    { id: 'features', num: '03', label: 'features' },
    { id: 'how-it-works', num: '04', label: 'how it works' },
    { id: 'actions', num: '05', label: 'actions' },
    { id: 'security', num: '06', label: 'security' },
    { id: 'timing', num: '07', label: 'timing' },
    { id: 'multi-entity', num: '08', label: 'bottom line' },
    { id: 'invite-capital', num: '09', label: 'invite' },
    { id: 'pricing', num: '10', label: 'pricing' },
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
              <Link href="/" className="inline-flex items-center gap-2 sm:gap-2.5 group">
                <MoneyCommandLogo variant="mark" className="h-5 sm:h-5.5 w-auto transition-transform group-hover:scale-105" />
                <span className="font-extrabold tracking-tight text-sm sm:text-base text-foreground font-sans uppercase">
                  MONEY COMMAND
                </span>
              </Link>

              <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs font-normal text-muted-foreground">
                <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
                <a href="#security" className="hover:text-foreground transition-colors">Security</a>
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
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors border border-border"
              >
                {isDark ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-black" />}
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
                <ScrambleText text="Unstructured text is just noise." delay={100} duration={650} />
              </span>
              <span className="text-foreground mt-1 sm:mt-2 block">
                <ScrambleText text="Money has a Command." delay={300} duration={750} />
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
            SECTION 02 · THE CONNECTION (PATENSIFY STYLE)
            ========================================================================= */}
        <section id="connection" className="relative min-h-[90svh] flex flex-col justify-center px-4 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
          <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
            <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
              <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
                <div className="flex items-center gap-3">
                  <p className="flex items-center gap-2 font-mono text-xs font-medium">
                    <span className="tabular-nums text-foreground">02</span>
                    <span aria-hidden="true" className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground lowercase">the connection</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setConnectionInView(false);
                      setTimeout(() => setConnectionInView(true), 120);
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border/80 text-[10px] font-mono text-muted-foreground flex items-center gap-1.5 transition-all hover:text-foreground cursor-pointer"
                    title="Replay card burst and unscramble animation"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Replay Flow</span>
                  </button>
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
                  <span className="block">
                    <ScrambleText text="A secure connection." trigger={connectionInView} delay={100} duration={650} />
                  </span>
                  <span className="block">
                    <ScrambleText text="Through Meta’s official login." trigger={connectionInView} delay={300} duration={750} />
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
                  You authorize in one tap and disconnect whenever you want. Money Command only processes financial logs and receipts you explicitly send.
                </p>
              </div>
            </div>

            {/* Visual Stage Container: Background Grid of Cards with Central Modal Overlay */}
            <div
              ref={connectionRef}
              className="relative w-full max-w-5xl mx-auto rounded-3xl border border-border/40 bg-card/20 p-4 sm:p-6 lg:p-8 overflow-hidden"
            >
              {/* Top User Profile Bar (Patensify Style with Money Command & WhatsApp Context) */}
              <div className="flex items-center justify-between pb-4 sm:pb-6 text-xs text-muted-foreground font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-muted/60 border border-border/60 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/50" />
                  </div>
                  <span className="text-muted-foreground/80 font-normal lowercase">@your.profile</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-muted-foreground">
                  <span>
                    <strong className="text-foreground font-semibold">
                      <ScrambleText text="128" trigger={connectionInView} delay={200} duration={500} />
                    </strong> transactions
                  </span>
                  <span>
                    <strong className="text-foreground font-semibold">
                      <ScrambleText text="80 K" trigger={connectionInView} delay={350} duration={500} />
                    </strong> ledger volume
                  </span>
                  <span>
                    <strong className="text-foreground font-semibold">
                      <ScrambleText text="412" trigger={connectionInView} delay={500} duration={500} />
                    </strong> verified entries
                  </span>
                </div>
              </div>

              {/* Behind Cards Grid (2 rows of 6 cards with concentric ripple texture) */}
              <div className="relative space-y-3 sm:space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-3.5">
                  {CONNECTION_CARDS_ROW_1.map((card) => (
                    <div
                      key={card.id}
                      className="relative rounded-2xl bg-secondary/30 border border-border/40 overflow-hidden h-28 sm:h-36 md:h-44 p-3 sm:p-4 flex flex-col justify-end"
                    >
                      <svg className="absolute inset-0 w-full h-full text-foreground/[0.05] pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <circle cx={card.cx} cy={card.cy} r="18" strokeWidth="0.8" />
                        <circle cx={card.cx} cy={card.cy} r="32" strokeWidth="0.8" />
                        <circle cx={card.cx} cy={card.cy} r="48" strokeWidth="0.8" />
                        <circle cx={card.cx} cy={card.cy} r="64" strokeWidth="0.8" />
                        <circle cx={card.cx} cy={card.cy} r="82" strokeWidth="0.8" />
                      </svg>
                      <span className="relative z-10 text-[11px] sm:text-xs font-normal text-muted-foreground/70 leading-tight lowercase">
                        {card.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-3.5">
                  {CONNECTION_CARDS_ROW_2.map((card) => (
                    <div
                      key={card.id}
                      className="relative rounded-2xl bg-secondary/30 border border-border/40 overflow-hidden h-28 sm:h-36 md:h-44 p-3 sm:p-4 flex flex-col justify-end"
                    >
                      <svg className="absolute inset-0 w-full h-full text-foreground/[0.05] pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <circle cx={card.cx} cy={card.cy} r="18" strokeWidth="0.8" />
                        <circle cx={card.cx} cy={card.cy} r="32" strokeWidth="0.8" />
                        <circle cx={card.cx} cy={card.cy} r="48" strokeWidth="0.8" />
                        <circle cx={card.cx} cy={card.cy} r="64" strokeWidth="0.8" />
                        <circle cx={card.cx} cy={card.cy} r="82" strokeWidth="0.8" />
                      </svg>
                      <span className="relative z-10 text-[11px] sm:text-xs font-normal text-muted-foreground/70 leading-tight lowercase">
                        {card.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Centered Modal & Cards Bursting Outward Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
                  {/* Bursting Card 1 (Top-Left: Emerges outward from the main card) */}
                  <div
                    className={`hidden md:block absolute z-30 p-3 sm:p-3.5 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-2xl max-w-[215px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      connectionInView
                        ? 'top-4 sm:top-6 left-3 sm:left-5 lg:left-8 translate-x-0 translate-y-0 scale-100 opacity-100'
                        : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.25] opacity-0 pointer-events-none'
                    }`}
                    style={{ transitionDelay: connectionInView ? '180ms' : '0ms' }}
                  >
                    <div className={connectionInView ? 'animate-float' : ''}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                          <WhatsAppIcon className="w-3 h-3 text-emerald-500" />
                        </div>
                        <h4 className="font-semibold text-xs text-foreground tracking-tight">
                          <ScrambleText text="You connect your WhatsApp" trigger={connectionInView} delay={380} duration={600} />
                        </h4>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 pl-7 leading-snug">
                        <ScrambleText text="Never your banking password." trigger={connectionInView} delay={550} duration={600} />
                      </p>
                    </div>
                  </div>

                  {/* Bursting Card 2 (Bottom-Left: Emerges outward from the main card) */}
                  <div
                    className={`hidden md:block absolute z-30 p-3 sm:p-3.5 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-2xl max-w-[215px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      connectionInView
                        ? 'bottom-4 sm:bottom-6 left-4 sm:left-6 lg:left-10 translate-x-0 translate-y-0 scale-100 opacity-100'
                        : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.25] opacity-0 pointer-events-none'
                    }`}
                    style={{ transitionDelay: connectionInView ? '380ms' : '0ms' }}
                  >
                    <div className={connectionInView ? 'animate-float-delayed' : ''}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
                          <Sliders className="w-3 h-3 text-orange-500" />
                        </div>
                        <h4 className="font-semibold text-xs text-foreground tracking-tight">
                          <ScrambleText text="You're in control" trigger={connectionInView} delay={580} duration={600} />
                        </h4>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 pl-7 leading-snug">
                        <ScrambleText text="Nothing posts without your OK." trigger={connectionInView} delay={720} duration={600} />
                      </p>
                    </div>
                  </div>

                  {/* Bursting Card 3 (Top-Right: Emerges outward from the main card) */}
                  <div
                    className={`hidden md:block absolute z-30 p-3 sm:p-3.5 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-2xl max-w-[215px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      connectionInView
                        ? 'top-4 sm:top-6 right-3 sm:right-5 lg:right-8 translate-x-0 translate-y-0 scale-100 opacity-100'
                        : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.25] opacity-0 pointer-events-none'
                    }`}
                    style={{ transitionDelay: connectionInView ? '260ms' : '0ms' }}
                  >
                    <div className={connectionInView ? 'animate-float-slow' : ''}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                          <Lock className="w-3 h-3 text-cyan-500" />
                        </div>
                        <h4 className="font-semibold text-xs text-foreground tracking-tight">
                          <ScrambleText text="Bank-grade isolation" trigger={connectionInView} delay={460} duration={600} />
                        </h4>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 pl-7 leading-snug">
                        <ScrambleText text="SHA-256 HMAC webhook verified." trigger={connectionInView} delay={620} duration={600} />
                      </p>
                    </div>
                  </div>

                  {/* Bursting Card 4 (Bottom-Right: Emerges outward from the main card) */}
                  <div
                    className={`hidden md:block absolute z-30 p-3 sm:p-3.5 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-2xl max-w-[215px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      connectionInView
                        ? 'bottom-4 sm:bottom-6 right-4 sm:right-6 lg:right-10 translate-x-0 translate-y-0 scale-100 opacity-100'
                        : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.25] opacity-0 pointer-events-none'
                    }`}
                    style={{ transitionDelay: connectionInView ? '480ms' : '0ms' }}
                  >
                    <div className={connectionInView ? 'animate-float' : ''}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                          <Receipt className="w-3 h-3 text-emerald-500" />
                        </div>
                        <h4 className="font-semibold text-xs text-foreground tracking-tight">
                          <ScrambleText text="Only what's verified" trigger={connectionInView} delay={680} duration={600} />
                        </h4>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 pl-7 leading-snug">
                        <ScrambleText text="Receipts, voice notes & chats." trigger={connectionInView} delay={820} duration={600} />
                      </p>
                    </div>
                  </div>

                  {/* Centered Authorization Modal (The Main Card) */}
                  <div className="relative z-20 w-full max-w-[340px] sm:max-w-[370px] rounded-[24px] sm:rounded-[28px] bg-card/95 backdrop-blur-xl border border-border p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5">
                    {/* Logos with Horizontal Dash Connector */}
                    <div className="flex items-center justify-center gap-3.5 sm:gap-4 pt-1">
                      {/* WhatsApp Official Badge */}
                      <RealWhatsAppLogo className="w-10 h-10 shadow-md hover:scale-105 transition-transform" />

                      {/* Horizontal Connector Line */}
                      <div className="w-8 sm:w-10 h-[2px] bg-muted-foreground/30 rounded-full" />

                      {/* Money Command Logo Badge (Theme-Compatible: White in dark mode, Black in light mode) */}
                      <RealMoneyCommandIcon className="w-10 h-10 shadow-md hover:scale-105 transition-transform" />
                    </div>

                    {/* Title with Unscramble Animation */}
                    <h3 className="text-center font-semibold text-xs sm:text-sm text-foreground tracking-tight">
                      <ScrambleText text="Money Command wants to access your account" trigger={connectionInView} delay={250} duration={750} />
                    </h3>

                    {/* 3 Permission Rows with Skeleton Bars & Interactive Toggles */}
                    <div className="space-y-3 pt-1">
                      {/* Row 1: Chat message stream */}
                      <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl">
                        <MessageCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 space-y-1.5 py-0.5">
                          <div className="w-28 sm:w-32 h-2 rounded-full bg-muted-foreground/30" />
                          <div className="w-16 sm:w-20 h-1.5 rounded-full bg-muted-foreground/20" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setToggle1(!toggle1)}
                          className={`w-11 h-6 rounded-full transition-all duration-300 relative p-0.5 shrink-0 ${toggle1 ? 'bg-foreground' : 'bg-muted border border-border'}`}
                          aria-label="Toggle Message Access"
                        >
                          <div className={`w-5 h-5 rounded-full transition-all duration-300 ${toggle1 ? 'translate-x-5 bg-background shadow-xs' : 'translate-x-0 bg-muted-foreground'}`} />
                        </button>
                      </div>

                      {/* Row 2: Tagged accounts & handles */}
                      <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl">
                        <AtSign className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 space-y-1.5 py-0.5">
                          <div className="w-24 sm:w-28 h-2 rounded-full bg-muted-foreground/30" />
                          <div className="w-20 sm:w-24 h-1.5 rounded-full bg-muted-foreground/20" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setToggle2(!toggle2)}
                          className={`w-11 h-6 rounded-full transition-all duration-300 relative p-0.5 shrink-0 ${toggle2 ? 'bg-foreground' : 'bg-muted border border-border'}`}
                          aria-label="Toggle Tagged Accounts"
                        >
                          <div className={`w-5 h-5 rounded-full transition-all duration-300 ${toggle2 ? 'translate-x-5 bg-background shadow-xs' : 'translate-x-0 bg-muted-foreground'}`} />
                        </button>
                      </div>

                      {/* Row 3: Receipts & tags */}
                      <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl">
                        <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 space-y-1.5 py-0.5">
                          <div className="w-32 sm:w-36 h-2 rounded-full bg-muted-foreground/30" />
                          <div className="w-14 sm:w-16 h-1.5 rounded-full bg-muted-foreground/20" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setToggle3(!toggle3)}
                          className={`w-11 h-6 rounded-full transition-all duration-300 relative p-0.5 shrink-0 ${toggle3 ? 'bg-foreground' : 'bg-muted border border-border'}`}
                          aria-label="Toggle Receipts and Tags"
                        >
                          <div className={`w-5 h-5 rounded-full transition-all duration-300 ${toggle3 ? 'translate-x-5 bg-background shadow-xs' : 'translate-x-0 bg-muted-foreground'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons: Solid Blue "Allow" & Link "Cancel" */}
                    <div className="pt-2 space-y-2 text-center">
                      <button
                        type="button"
                        className="w-full py-2.5 sm:py-3 rounded-xl bg-[#0095f6] hover:bg-[#1877f2] text-white font-medium text-xs sm:text-sm transition-all shadow-md active:scale-98"
                      >
                        Allow
                      </button>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 03 · FEATURES & PRODUCT SURFACES
            ========================================================================= */}
        <section id="features" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
          <span id="surfaces" className="sr-only pointer-events-none" />
          <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
            <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
              <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
                <p className="flex items-center gap-2 font-mono text-xs font-medium">
                  <span className="tabular-nums text-foreground">03</span>
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground lowercase">features & surfaces</span>
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
                  <span className="block">
                    <ScrambleText text="6 product surfaces." delay={100} duration={650} />
                  </span>
                  <span className="block">
                    <ScrambleText text="One deterministic core." delay={250} duration={750} />
                  </span>
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
            SECTION 04 · HOW IT WORKS & SAFE-TO-SPEND
            ========================================================================= */}
        <section id="how-it-works" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
          <span id="safe-to-spend" className="sr-only pointer-events-none" />
          <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
            <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
              <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
                <p className="flex items-center gap-2 font-mono text-xs font-medium">
                  <span className="tabular-nums text-foreground">04</span>
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground lowercase">how it works & safe-to-spend</span>
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
                  <span className="block">
                    <ScrambleText text="One formula" delay={100} duration={600} />
                  </span>
                  <span className="block">
                    <ScrambleText text="always protects you." delay={250} duration={700} />
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Safe-to-Spend is never an LLM guess. It is a strictly deterministic equation protecting your cash flow, minimum debt payments, and mandatory CRA tax reserves.
                </p>
              </div>
            </div>

            {/* Spotlight Card with Layered Animated Background Cards */}
            <div className="relative max-w-4xl mx-auto py-8 sm:py-12 w-full flex items-center justify-center">
              {/* Concentric Ambient Radar Circles in Background */}
              <div aria-hidden="true" className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-[620px] h-[620px] rounded-full border border-border/40 animate-pulse-slow" />
                <div className="absolute w-[440px] h-[440px] rounded-full border border-border/30" />
                <div className="absolute w-[280px] h-[280px] rounded-full border border-border/20" />
              </div>

              {/* STYLED & ANIMATED CARDS IN THE BACKGROUND */}
              {/* Card 1: Top-Left (Liquid Cash) */}
              <div className="hidden md:block absolute -top-6 -left-4 lg:-left-16 z-0 w-64 p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-border/80 shadow-xl -rotate-6 animate-float pointer-events-none select-none">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase pb-1">
                  <span>LIQUID ASSET</span>
                  <span className="text-emerald-500 font-bold">+$5,200.00</span>
                </div>
                <div className="text-xs font-semibold text-foreground">AVAILABLE_LIQUID_CASH</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Operating Checking &amp; Savings</div>
                <div className="mt-2.5 h-1 w-full bg-emerald-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-4/5 rounded-full" />
                </div>
              </div>

              {/* Card 2: Top-Right (Tax Vault) */}
              <div className="hidden md:block absolute -top-4 -right-4 lg:-right-16 z-0 w-64 p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-border/80 shadow-xl rotate-6 animate-float-delayed pointer-events-none select-none">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase pb-1">
                  <span>CRA TAX VAULT</span>
                  <span className="text-[#fb923c] font-bold">-$2,100.00</span>
                </div>
                <div className="text-xs font-semibold text-foreground">TAX_RESERVE_REQUIREMENT</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Automated GST/HST buffer</div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-mono text-[#fb923c]">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Locked against spending</span>
                </div>
              </div>

              {/* Card 3: Bottom-Left (Essential Bills) */}
              <div className="hidden md:block absolute -bottom-8 -left-6 lg:-left-16 z-0 w-64 p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-border/80 shadow-xl -rotate-3 animate-float-slow pointer-events-none select-none">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase pb-1">
                  <span>FIXED RUNWAY</span>
                  <span className="text-rose-500 font-bold">-$1,850.00</span>
                </div>
                <div className="text-xs font-semibold text-foreground">ESSENTIAL_BILLS</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Rent, Utilities &amp; Cloud floor</div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-mono text-emerald-500">
                  <Check className="w-2.5 h-2.5" />
                  <span>100% Covered this horizon</span>
                </div>
              </div>

              {/* Card 4: Bottom-Right (Double-Entry Audit) */}
              <div className="hidden md:block absolute -bottom-8 -right-6 lg:-right-16 z-0 w-64 p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-border/80 shadow-xl rotate-4 animate-float pointer-events-none select-none">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase pb-1">
                  <span>DOUBLE-ENTRY AUDIT</span>
                  <span className="text-cyan-400 font-bold">Δ = $0.00</span>
                </div>
                <div className="text-xs font-semibold text-foreground">LEDGER EQUILIBRIUM</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Debit: Groceries · Credit: Checking</div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-mono text-cyan-400">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>Immutable ledger verified</span>
                </div>
              </div>

              {/* THE ORIGINAL SPOTLIGHT CARD (ELEVATED IN THE CENTER) */}
              <div className="relative z-10 w-full max-w-xl mx-auto rounded-[32px] bg-card/95 backdrop-blur-xl border border-border p-6 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 pro-card">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                  <span>DETERMINISTIC FORMULA</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-500 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    100% EXPLAINABLE
                  </span>
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
                          className={`w-full rounded-xs transition-all ${
                            isPeak
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
            </div>

            <div className="pt-4 text-center text-xs font-mono text-muted-foreground">
              This isn’t an LLM hallucination. It’s double-entry accounting truth.
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
                  <span className="block">
                    <ScrambleText text="AI coaches and drafts." delay={100} duration={650} />
                  </span>
                  <span className="block">
                    <ScrambleText text="You authorize every dollar." delay={250} duration={750} />
                  </span>
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
            SECTION 06 · SECURITY & DETERMINISTIC LEDGER
            ========================================================================= */}
        <section id="security" className="relative min-h-[90svh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 transition-colors">
          <span id="ledger" className="sr-only pointer-events-none" />
          <div className="mx-auto w-full max-w-7xl flex flex-col justify-center gap-10 sm:gap-14 section-animate">
            <div className="act-head grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
              <div className="flex flex-col gap-3 sm:gap-4 text-left lg:col-span-7">
                <p className="flex items-center gap-2 font-mono text-xs font-medium">
                  <span className="tabular-nums text-foreground">06</span>
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground lowercase">security & ledger truth</span>
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground leading-[1.08]">
                  <span className="block">
                    <ScrambleText text="Double-entry source of truth." delay={100} duration={650} />
                  </span>
                  <span className="block">
                    <ScrambleText text="Non-negotiable ledger." delay={250} duration={750} />
                  </span>
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
                <ScrambleText text="There is cash hiding in your business that you can't see." delay={100} duration={800} />
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
                  <ScrambleText text="Transparent Canadian pricing." delay={100} duration={700} />
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
                <ScrambleText text="Frequently asked questions" delay={100} duration={700} />
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
              <li><a href="#features" className="hover:text-muted-foreground transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-muted-foreground transition-colors">How It Works</a></li>
              <li><a href="#security" className="hover:text-muted-foreground transition-colors">Security</a></li>
              <li><a href="#pricing" className="hover:text-muted-foreground transition-colors">Launch Pricing</a></li>
            </ul>
          </div>

          {/* Column 3: BLUEPRINT & GOVERNANCE */}
          <div className="space-y-2.5 sm:space-y-3">
            <span className="font-mono text-[10px] uppercase text-muted-foreground tracking-wider block">BLUEPRINT</span>
            <ul className="space-y-2 text-foreground text-xs">
              <li><a href="#security" className="hover:text-muted-foreground transition-colors">Double-Entry Core</a></li>
              <li><a href="#actions" className="hover:text-muted-foreground transition-colors">Permissioned Action Engine</a></li>
              <li><a href="#faq" className="hover:text-muted-foreground transition-colors">FAQ & Support</a></li>
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
