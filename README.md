# Money Command | IT Execution Blueprint & Web Platform

> **Personal AI CFO | Founder Financial OS | Year-Round Tax Intelligence | Action Automation**
> Launch pricing: Personal CAD 5/month | Founder CAD 10/month | 60-day organization pilot CAD 5,000

---

## 1. System Architecture Overview

Money Command utilizes a conversational capture layer over a deterministic, double-entry financial core.
AI interprets unstructured user input (natural language text, voice notes, OCR receipt photos) into structured proposals.
However, ledger balances, budgets, tax calculations, eligibility logic, action permissions, and audit records are **deterministic and immutable**.

```text
USER (WhatsApp / Web / Mobile)
        │
API Gateway + Identity + Consent (RLS isolation)
        │
AI Orchestration (Text, Voice, Receipts, PDFs)
        │
Structured Extraction + Confidence Scoring
        │
Validation / User Confirmation (Proposal Inbox)
        │
Double-Entry Financial Ledger (PostgreSQL Core)
  ├── Personal Entity (CAD)
  ├── Business Entity (Sole Prop / Corp)
  ├── Balanced Debits = Credits (Integer minor units)
  └── Non-destructive Reversals (MC-010)
        │
Rules & Intelligence Layer
  ├── Deterministic Safe-to-Spend Engine
  ├── Behavioural Guardrails (Zero shame/fear)
  └── Canada-First Tax Readiness (Ontario 13% HST, T2125/T1)
        │
ACTION ORCHESTRATOR (Permissioned)
  ├── Subscription Cancellation
  ├── Bill Negotiation (Coach / Draft / Counteroffers)
  └── Explicit Cryptographic Terms Hash & MFA Step-Up
        │
WhatsApp Response + Dashboard + Reconciled CSV Exports
```

---

## 2. Supabase PostgreSQL Financial Core

The database schema is located in `supabase/schema.sql` and includes 16 production-grade tables, enums, triggers, and Row-Level Security (RLS) policies.

### Included Tables:
1. `tenants`: Multi-tenant organization boundaries.
2. `users`: Scoped users, roles, and WhatsApp binding credentials.
3. `entities`: Personal vs. Sole Proprietorship vs. Corporation multi-entity separation.
4. `user_consent_records`: Explicit, revocable user privacy consents.
5. `accounts`: Double-entry Chart of Accounts with exact integer minor units (e.g. 4600 = CAD 46.00).
6. `transactions`: Immutable posted journals with reversal links (`reversal_of_id`).
7. `transaction_lines`: Balanced opposing debit/credit entries.
8. `source_events`: Inbound Meta WhatsApp webhooks with provider ID replay checks (`wamid.*`).
9. `proposals`: AI/OCR extracted candidates awaiting user review and confirmation.
10. `documents`: Encrypted receipt and statement files with SHA-256 integrity hash.
11. `budgets`: Category envelope budgets and alert thresholds.
12. `safe_to_spend_configs`: Deterministic parameters (buffer, horizon, tax reserve rate).
13. `obligations`: Essential fixed bills (rent, hydro, minimum debt).
14. `subscriptions`: Recurring charges, renewal cadence, price delta, and cancellation route.
15. `actions` & `authorizations`: Consequential action state machines with cryptographic `terms_hash`.
16. `tax_profiles`: Canada-first CRA tax year profiles (Ontario CA_ON, 13% HST collected).

### Trigger Invariants:
- `verify_transaction_balance()`: Ensures `SUM(debit_minor) == SUM(credit_minor)` on posted transactions.
- `protect_posted_transaction()`: Enforces MC-010 immutability; financial values cannot be overwritten directly.

### Running Schema in Supabase:
```sql
-- 1. In Supabase Dashboard -> SQL Editor, run:
supabase/schema.sql

-- 2. Populate synthetic baseline data for testing:
supabase/seed.sql
```

---

## 3. Product Surfaces Delivered

### Client UI (`/client`):
- **Financial Overview**: Net liquid assets, liabilities, multi-entity switcher, recent journals.
- **Deterministic Safe-to-Spend**:
  $$\text{Safe-to-Spend} = \text{Liquid Cash} + \text{Income} - \text{Obligations} - \text{Debt} - \text{Tax Reserve} - \text{Savings} - \text{Buffer} - \text{Pending}$$
  Includes 7-day, 14-day (payday), and 30-day horizon selectors and component breakdown.
- **Proposal Inbox (`/client/proposals`)**: Review unposted candidates extracted from WhatsApp. Edit fields or confirm to atomically post a balanced double-entry journal (Release First Slice Demonstration).
- **Double-Entry Ledger (`/client/transactions`)**: View journal lines, inspect balanced debits/credits, post correcting reversals (MC-010), and export ledger CSV.
- **Subscriptions & Bills (`/client/subscriptions`)**: Track recurring charges, detect price increases, and launch cancellation assistant.
- **Bill Negotiation (`/client/negotiations`)**: Coach Me, Draft for Me, and approve counteroffers.
- **Canada Tax Readiness (`/client/tax`)**: CRA T2125 statement of business activities, 13% Ontario HST tracking, and accountant export package.
- **WhatsApp Settings (`/client/whatsapp`)**: Cryptographic token exchange code (`MC-8942-CA`), number verification, and launch simulator.
- **Ask My Money Modal**: Traceable AI CFO answering financial questions with citations to verified ledger accounts.

### Admin Console (`/admin`):
- **Health & Metrics**: 0 Unreconciled Journals Gate Check, WFAU, AI extraction benchmark (&ge;95%), model COGS tracking.
- **Tenant Operations (`/admin/tenants`)**: Tenant isolation inspector, multi-entity review.
- **Append-Only Audit Stream (`/admin/audit`)**: Tamper-evident log of all mutations, reversals, and SHA-256 terms hashes.
- **Meta Webhook Inspector (`/admin/webhooks`)**: Replay detection test (MC-003) and invalid signature rejection test (MC-002).
- **Feature Flags (`/admin/flags`)**: Dynamic risk controls and circuit breakers.
- **Schema Viewer (`/admin/schema`)**: 16-table PostgreSQL schema inspection.

### Accountant Portal (`/accountant`):
- Permissioned client review view.
- Non-destructive status marking (`unreviewed` &rarr; `user_verified` &rarr; `professional_reviewed`).
- Standardized audit-tied CSV export.

---

## 4. Development & Build

### Prerequisites:
- Node.js &ge; 20
- npm &ge; 10

### Commands:
```bash
# Install dependencies
npm install

# Run Next.js development server
npm run dev

# Run production build (webpack optimized)
npm run build

# Start production server
npm start
```
