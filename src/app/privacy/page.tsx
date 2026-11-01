'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import MoneyCommandLogo from '@/components/MoneyCommandLogo';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Printer, 
  ExternalLink,
  CheckCircle2,
  FileText,
  UserCheck
} from 'lucide-react';

interface LegalSection {
  number: string;
  title: string;
  paragraph: string;
  keyPoints?: string[];
}

const PRIVACY_SECTIONS: LegalSection[] = [
  {
    number: '01',
    title: 'Commitment to Privacy and PIPEDA Compliance',
    paragraph: 'Money Command is committed to protecting the privacy, confidentiality, and integrity of personal and business financial data entrusted to us by Canadian founders and individuals. Our privacy practices comply fully with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy regulations across Ontario, British Columbia, Alberta, and Quebec, maintaining strict data sovereignty principles.',
    keyPoints: ['Full compliance with Canadian federal PIPEDA standards', 'Protection of personal and incorporated business financial data', 'Data sovereignty maintained across Canadian cloud infrastructure']
  },
  {
    number: '02',
    title: 'Information We Collect and Ingest',
    paragraph: 'We collect information provided directly through your authenticated WhatsApp communications, web companion onboarding, receipt image uploads, and authorized bank connection tokens. This encompasses your legal name, business entity registration, phone number, itemized expense details, transaction timestamps, merchant names, and encrypted document attachments necessary to populate your double-entry chart of accounts.',
    keyPoints: ['Receipt OCR uploads and conversational expense dispatches', 'WhatsApp phone number and authenticated session identifiers', 'Double-entry transaction records and entity chart of accounts']
  },
  {
    number: '03',
    title: 'Zero Banking Credential Storage Philosophy',
    paragraph: 'Money Command adheres to a strict zero-credential storage philosophy; we never solicit, capture, store, or transmit your online banking usernames, account passwords, or debit PINs. Account synchronization operates through read-only open banking APIs using short-lived cryptographically signed tokens, guaranteeing that our systems can never independently initiate unapproved cash withdrawals or fund transfers.',
    keyPoints: ['Zero storage of banking login usernames, passwords, or PINs', 'Read-only financial data access tokens with short-lived expiration', 'Inability of software or operators to initiate bank withdrawals']
  },
  {
    number: '04',
    title: 'Purpose and Permitted Use of Financial Data',
    paragraph: 'Your financial information is utilized solely to parse receipts, propose accurate double-entry ledger categorizations, compute continuous CRA tax reserve requirements, and calculate explainable Safe-to-Spend runway. We do not sell, rent, monetize, or exchange your personal or corporate financial records with third-party advertisers, data brokers, or marketing networks under any circumstances.',
    keyPoints: ['Sole usage for bookkeeping, double-entry ledgers, and tax estimation', 'Strict prohibition against selling or monetizing user financial data', 'Zero data sharing with advertising platforms or commercial brokers']
  },
  {
    number: '05',
    title: 'AI Extraction and Machine Learning Governance',
    paragraph: 'When optical character recognition (OCR) or language models extract details from receipts and conversational messages, data is processed in isolated, stateless memory containers that are never used to train public models. Financial extracts undergo strict deterministic schema validation, ensuring sensitive tax identification numbers and recipient names remain confidential and accessible only to authorized tenant users.',
    keyPoints: ['Stateless AI parsing containers with zero memory retention', 'User transaction data is never utilized to train foundation models', 'Deterministic validation safeguards sensitive tax and entity identifiers']
  },
  {
    number: '06',
    title: 'Revocable Accountant and CPA Access Grants',
    paragraph: 'Money Command provides granular permission controls enabling founders to grant temporary, revocable access to external Chartered Professional Accountants (CPAs) and bookkeeping advisors. External accountants receive restricted read-and-certify privileges strictly bounded by entity and tax-year filters, with all inspection actions permanently recorded in the tenant\'s consequential audit log for user verification.',
    keyPoints: ['Granular, client-controlled CPA review grants with expiry timers', 'Scoped read-and-certify privileges without administrative mutation rights', 'All accountant inspections captured in immutable tenant audit log']
  },
  {
    number: '07',
    title: 'Data Encryption and Storage Architecture',
    paragraph: 'All data in transit across public networks is secured using TLS 1.3 cryptographic protocols with modern cipher suites, while all database records and document vaults are encrypted at rest using AES-256 standards. Our primary cloud hosting infrastructure utilizes enterprise-grade Canadian data centers that enforce strict physical access security, biometric barriers, and 24/7 infrastructure monitoring protocols.',
    keyPoints: ['TLS 1.3 with Perfect Forward Secrecy for all API connections', 'AES-256 encryption at rest across databases and document vaults', 'Enterprise hosting in certified Canadian data center facilities']
  },
  {
    number: '08',
    title: 'WhatsApp Messaging Security and Meta Boundary',
    paragraph: 'Conversations conducted via our WhatsApp interface are routed through Meta’s official WhatsApp Business Cloud API under cryptographically signed webhook signatures validated on our backend before ingestion. While transmission over WhatsApp benefits from carrier-grade security, users are reminded to safeguard their mobile devices and utilize biometrics to prevent unauthorized local access to message histories.',
    keyPoints: ['HMAC-SHA256 signature verification on all inbound Meta webhooks', 'Carrier-grade transport security across WhatsApp Cloud API channels', 'Recommendation to maintain biometric locks on user WhatsApp devices']
  },
  {
    number: '09',
    title: 'Individual Access, Rectification, and Portability',
    paragraph: 'Under Canadian privacy legislation, you have the absolute right to inspect all personal financial records held in your tenant, request rectification of inaccurate data, and download your complete transaction ledger. Our web companion portal provides automated tools allowing you to export verified double-entry journals, receipt attachments, and reconciliation reports in open, non-proprietary CSV formats at any time.',
    keyPoints: ['Absolute right of inspection and data rectification under PIPEDA', 'One-click export of complete double-entry journals in standard CSV', 'Portability of receipt attachments, metadata, and tax workpapers']
  },
  {
    number: '10',
    title: 'Data Retention and Permanent Purge Protocols',
    paragraph: 'We retain financial records only for as long as your tenant account remains active and as required to fulfill statutory Canadian tax recordkeeping requirements mandated by the CRA. Upon receiving a formal written account deletion request, our automated purge pipelines permanently delete your tenant records, user profiles, uploaded receipt images, and linked communication identifiers within thirty days.',
    keyPoints: ['Retention aligned with Canada Revenue Agency seven-year tax guidelines', 'Automated tenant database purge completed within 30 days of closure', 'Permanent deletion of linked phone numbers, hashes, and image files']
  },
  {
    number: '11',
    title: 'Incident Response and Breach Notification',
    paragraph: 'Money Command maintains an audited cybersecurity incident response plan that includes continuous anomaly detection, automated database intrusion alerts, and rapid isolation protocols. In the unlikely event of a security breach involving a real risk of significant harm, we will notify affected users and the Office of the Privacy Commissioner of Canada (OPC) without undue delay.',
    keyPoints: ['Continuous automated intrusion detection and anomaly alerts', 'Documented protocol for containment, investigation, and recovery', 'Timely user and Privacy Commissioner notification per PIPEDA mandates']
  },
  {
    number: '12',
    title: 'Privacy Officer Contact and Regulatory Recourse',
    paragraph: 'Questions, privacy inquiries, access requests, or complaints regarding our data handling protocols may be addressed directly to our designated Data Protection & Privacy Officer via email at privacy@moneycommand.ca. If you believe your privacy rights under PIPEDA have been infringed, you retain the right to lodge a formal complaint with the Office of the Privacy Commissioner of Canada.',
    keyPoints: ['Direct access to corporate Data Protection & Privacy Officer', 'Prompt written responses to all formal PIPEDA access inquiries', 'Statutory right to escalate complaints to the Privacy Commissioner of Canada']
  }
];

export default function PrivacyPolicyPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 w-full">
        {/* Back Link & Category Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Financial OS Landing</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-secondary border border-border text-foreground">
                  <Lock className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Privacy & Data Protection Framework
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Privacy Policy
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Canadian PIPEDA-compliant privacy architecture safeguarding double-entry books, receipts, and WhatsApp message streams.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium text-foreground transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Print Copy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Metadata Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="font-semibold text-foreground">PIPEDA Certified &middot; Last Revised: November 1, 2026</span>
              <span className="text-muted-foreground block text-[11px] font-mono">Governing Authority: Office of the Privacy Commissioner of Canada</span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span>Doc: MC-PRIV-2026.2</span>
            <span>&middot;</span>
            <span className="text-emerald-500 font-bold">12 Comprehensive Sections</span>
          </div>
        </div>

        {/* Quick Table of Contents Jump Grid */}
        <div className="p-5 sm:p-6 rounded-3xl bg-secondary/40 border border-border space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-bold">
            Table of Contents & Quick Navigation
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {PRIVACY_SECTIONS.map((sec) => (
              <a
                key={sec.number}
                href={`#privacy-sec-${sec.number}`}
                className="p-2 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 font-medium"
              >
                <span className="font-mono text-[10px] text-foreground font-bold">{sec.number}.</span>
                <span className="truncate">{sec.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 12 Detailed Sections with 3-4 Line Paragraphs */}
        <div className="space-y-8 divide-y divide-border/60">
          {PRIVACY_SECTIONS.map((sec) => (
            <section
              key={sec.number}
              id={`privacy-sec-${sec.number}`}
              className="pt-8 first:pt-0 space-y-3 scroll-mt-24"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-md bg-secondary border border-border text-[11px] font-mono font-bold text-foreground">
                  Section {sec.number}
                </span>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {sec.title}
                </h2>
              </div>

              {/* 3-4 Lines Substantial Paragraph */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed sm:leading-[1.75] font-normal text-pretty">
                {sec.paragraph}
              </p>

              {sec.keyPoints && (
                <div className="pt-2">
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-foreground font-medium">
                    {sec.keyPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-card border border-border shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug text-muted-foreground text-[11px]">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Privacy Office Contact Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-secondary text-foreground border border-border">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">Data Protection & Privacy Officer</h3>
              <p className="text-xs text-muted-foreground">
                For access requests, data portability queries, or formal PIPEDA compliance matters, contact our Canadian privacy officer.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
            <a
              href="mailto:privacy@moneycommand.ca"
              className="px-4 py-2 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
            >
              Email privacy@moneycommand.ca
            </a>
            <Link
              href="/terms"
              className="px-4 py-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 border border-border font-medium transition-colors"
            >
              Review Terms of Service &rarr;
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center text-xs text-muted-foreground font-mono space-y-2">
        <div className="flex items-center justify-center gap-4">
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <span>&middot;</span>
          <Link href="/privacy" className="text-foreground underline">Privacy Policy</Link>
          <span>&middot;</span>
          <Link href="/compliance" className="hover:text-foreground transition-colors">Security & Compliance</Link>
        </div>
        <p>&copy; 2026 Money Command Technologies Inc. Ontario, Canada. All rights reserved.</p>
      </footer>
    </div>
  );
}
