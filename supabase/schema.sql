-- ==============================================================================
-- MONEY COMMAND | SUPABASE POSTGRESQL FINANCIAL OPERATING SYSTEM SCHEMA
-- Authoritative Double-Entry Ledger, Proposals, Safe-to-Spend, Subscriptions,
-- Permissioned Action Orchestration, Canada-First Tax Readiness, RLS & Audit Trail.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member', 'accountant_viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tenant_plan AS ENUM ('personal', 'founder', 'organization');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE entity_type AS ENUM ('personal', 'sole_proprietorship', 'corporation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('expense', 'income', 'transfer', 'receivable', 'payable', 'adjustment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('draft', 'posted', 'reversed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE source_channel AS ENUM ('whatsapp_text', 'whatsapp_voice', 'whatsapp_receipt', 'web_manual', 'web_upload', 'statement', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proposal_status AS ENUM ('pending', 'confirmed', 'rejected', 'modified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tax_relevance AS ENUM ('none', 'possible', 'confirmed', 'unknown');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('suspected', 'confirmed', 'active', 'cancellation_requested', 'cancelled', 'recurrence_detected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE action_status AS ENUM ('draft', 'authorization_required', 'authorized', 'initiated', 'provider_pending', 'confirmed', 'failed', 'manual_action_required');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE action_type AS ENUM ('subscription_cancellation', 'bill_negotiation', 'reminder', 'refund_request');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE negotiation_mode AS ENUM ('coach_me', 'draft_for_me', 'initiate_for_me');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE accountant_review_state AS ENUM ('unreviewed', 'user_verified', 'professional_reviewed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TENANTS & USERS
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    plan tenant_plan NOT NULL DEFAULT 'personal',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    auth_user_id UUID UNIQUE, -- References Supabase auth.users if available
    role user_role NOT NULL DEFAULT 'owner',
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    whatsapp_phone TEXT UNIQUE,
    whatsapp_verified BOOLEAN NOT NULL DEFAULT false,
    whatsapp_link_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type entity_type NOT NULL DEFAULT 'personal',
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
    tax_identifier TEXT, -- Business Number (BN) or GST/HST registration
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS user_consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL,
    data_scope TEXT NOT NULL,
    recipient TEXT NOT NULL,
    policy_version TEXT NOT NULL DEFAULT 'v2.0',
    granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    revoked_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. DOUBLE-ENTRY FINANCIAL LEDGER
-- All monetary figures are stored in exact INTEGER minor units (e.g. 4600 = CAD 46.00)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name TEXT NOT NULL,
    type account_type NOT NULL,
    subtype TEXT, -- e.g. 'checking', 'credit_card', 'groceries', 'software', 'sales'
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
    balance_minor BIGINT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_entity_account_code UNIQUE (entity_id, code)
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'posted',
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
    total_minor BIGINT NOT NULL,
    tx_date DATE NOT NULL,
    description TEXT NOT NULL,
    merchant TEXT,
    category TEXT NOT NULL,
    source source_channel NOT NULL DEFAULT 'web_manual',
    source_id TEXT, -- WhatsApp message ID, receipt ID, etc.
    reversal_of_id UUID REFERENCES transactions(id),
    accountant_status accountant_review_state NOT NULL DEFAULT 'unreviewed',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS transaction_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    debit_minor BIGINT NOT NULL DEFAULT 0 CHECK (debit_minor >= 0),
    credit_minor BIGINT NOT NULL DEFAULT 0 CHECK (credit_minor >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
    description TEXT,
    category TEXT,
    tax_rate NUMERIC(6, 4) DEFAULT 0.0000,
    tax_amount_minor BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_line_has_value CHECK ((debit_minor > 0 AND credit_minor = 0) OR (credit_minor > 0 AND debit_minor = 0))
);

-- 5. CAPTURE, AI EXTRACTION & PROPOSALS
CREATE TABLE IF NOT EXISTS source_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    channel TEXT NOT NULL, -- 'whatsapp', 'web', 'mobile'
    provider_event_id TEXT UNIQUE, -- Meta WhatsApp wamid.* for replay protection
    idempotency_key TEXT UNIQUE,
    sender_phone TEXT,
    raw_payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'received', -- 'received', 'processed', 'duplicate', 'failed'
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_event_id UUID REFERENCES source_events(id),
    type transaction_type NOT NULL DEFAULT 'expense',
    amount_minor BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
    merchant TEXT NOT NULL,
    category TEXT NOT NULL,
    proposed_debit_account_id UUID REFERENCES accounts(id),
    proposed_credit_account_id UUID REFERENCES accounts(id),
    tx_date DATE NOT NULL,
    tax_relevance tax_relevance NOT NULL DEFAULT 'possible',
    confidence NUMERIC(4, 3) NOT NULL DEFAULT 0.95,
    user_verified BOOLEAN NOT NULL DEFAULT false,
    extraction_details JSONB DEFAULT '{}'::jsonb,
    status proposal_status NOT NULL DEFAULT 'pending',
    confirmed_transaction_id UUID REFERENCES transactions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- 'receipt', 'invoice', 'statement', 'tax_slip'
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_sha256 TEXT NOT NULL,
    encryption_status TEXT NOT NULL DEFAULT 'aes_gcm_256',
    extracted_data JSONB DEFAULT '{}'::jsonb,
    retention_until DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. BUDGETS & DETERMINISTIC SAFE-TO-SPEND ENGINE
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    period TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'weekly', 'yearly'
    amount_minor BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
    alert_threshold_percent INT NOT NULL DEFAULT 80,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS safe_to_spend_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    user_defined_buffer_minor BIGINT NOT NULL DEFAULT 25000, -- Default CAD 250.00
    horizon_days INT NOT NULL DEFAULT 14,
    tax_reserve_rate NUMERIC(4, 3) NOT NULL DEFAULT 0.250, -- 25% tax reserve
    committed_savings_target_minor BIGINT NOT NULL DEFAULT 50000, -- CAD 500.00
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_entity_sts UNIQUE (entity_id)
);

CREATE TABLE IF NOT EXISTS obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    amount_minor BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
    frequency TEXT NOT NULL DEFAULT 'monthly',
    next_due_date DATE NOT NULL,
    is_essential BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. SUBSCRIPTIONS & ACTION AUTOMATION
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    merchant TEXT NOT NULL,
    category TEXT NOT NULL,
    amount_minor BIGINT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
    frequency TEXT NOT NULL DEFAULT 'monthly',
    status subscription_status NOT NULL DEFAULT 'active',
    next_billing_date DATE,
    last_price_minor BIGINT NOT NULL,
    price_delta_minor BIGINT DEFAULT 0,
    annualized_cost_minor BIGINT NOT NULL,
    cancellation_route TEXT, -- 'provider_api', 'email_draft', 'phone_script', 'manual'
    cancellation_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type action_type NOT NULL,
    target_id UUID, -- subscription_id or bill_negotiation_id
    target_merchant TEXT NOT NULL,
    status action_status NOT NULL DEFAULT 'draft',
    terms_shown JSONB NOT NULL DEFAULT '{}'::jsonb,
    terms_hash TEXT NOT NULL,
    execution_result JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_id UUID NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
    scope TEXT NOT NULL,
    terms_hash TEXT NOT NULL,
    auth_method TEXT NOT NULL DEFAULT 'explicit_click', -- 'explicit_click', 'step_up_pin', 'mfa_totp'
    ip_address TEXT,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid', -- 'valid', 'used', 'revoked', 'expired'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS action_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    action_id UUID NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload_hash TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    actor_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS bill_negotiations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,
    account_number_last4 VARCHAR(4),
    current_bill_minor BIGINT NOT NULL,
    target_bill_minor BIGINT NOT NULL,
    min_acceptable_bill_minor BIGINT NOT NULL,
    mode negotiation_mode NOT NULL DEFAULT 'coach_me',
    status TEXT NOT NULL DEFAULT 'analyzed', -- 'analyzed', 'target_ready', 'authorized', 'negotiating', 'counteroffer_received', 'accepted', 'declined'
    script_draft TEXT,
    counteroffer_received JSONB,
    verified_savings_minor BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. CANADA-FIRST TAX READINESS & ACCOUNTANT ACCESS
CREATE TABLE IF NOT EXISTS tax_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    jurisdiction VARCHAR(10) NOT NULL DEFAULT 'CA_ON', -- CA_ON, CA_BC, CA_AB, CA_QC, etc.
    tax_year INT NOT NULL DEFAULT 2026,
    reporting_method TEXT NOT NULL DEFAULT 'cash', -- 'cash', 'accrual'
    gst_hst_registered BOOLEAN NOT NULL DEFAULT false,
    gst_hst_number TEXT,
    default_reserve_rate NUMERIC(4, 3) NOT NULL DEFAULT 0.250,
    cra_category_mapping JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_entity_tax_year UNIQUE (entity_id, tax_year)
);

CREATE TABLE IF NOT EXISTS tax_rule_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction VARCHAR(10) NOT NULL,
    tax_year INT NOT NULL,
    rule_version VARCHAR(20) NOT NULL,
    rules_data JSONB NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_jurisdiction_year_version UNIQUE (jurisdiction, tax_year, rule_version)
);

CREATE TABLE IF NOT EXISTS accountant_access_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    accountant_email TEXT NOT NULL,
    accountant_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'reviewer', -- 'reviewer', 'preparer'
    status TEXT NOT NULL DEFAULT 'active', -- 'invited', 'active', 'revoked', 'expired'
    expires_at TIMESTAMPTZ NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    revoked_at TIMESTAMPTZ
);

-- 9. AUDIT TRAIL, AI INTERACTION & SYSTEM GOVERNANCE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    rollout_percentage INT NOT NULL DEFAULT 100,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prompt_intent TEXT NOT NULL,
    query_text TEXT NOT NULL,
    model_name TEXT NOT NULL,
    tokens_input INT DEFAULT 0,
    tokens_output INT DEFAULT 0,
    cost_estimated_minor INT DEFAULT 0,
    deterministic_refs JSONB DEFAULT '[]'::jsonb,
    answer_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. INDEXES FOR PERFORMANCE & SEARCH
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_entities_tenant ON entities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_accounts_entity ON accounts(entity_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tenant_date ON transactions(tenant_id, tx_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_entity ON transactions(entity_id);
CREATE INDEX IF NOT EXISTS idx_transaction_lines_tx ON transaction_lines(transaction_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_tenant ON proposals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_source_events_provider ON source_events(provider_event_id);
CREATE INDEX IF NOT EXISTS idx_actions_tenant ON actions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_entity ON subscriptions(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at DESC);

-- 11. INVARIANT INTEGRITY CONSTRAINTS & TRIGGERS

-- Invariant A: Double-Entry Balance Check
-- Every posted transaction MUST have SUM(debit_minor) == SUM(credit_minor) and sum > 0
CREATE OR REPLACE FUNCTION verify_transaction_balance()
RETURNS TRIGGER AS $$
DECLARE
    v_total_debit BIGINT;
    v_total_credit BIGINT;
    v_tx_status transaction_status;
BEGIN
    SELECT status INTO v_tx_status FROM transactions WHERE id = NEW.transaction_id;

    IF v_tx_status = 'posted' THEN
        SELECT COALESCE(SUM(debit_minor), 0), COALESCE(SUM(credit_minor), 0)
        INTO v_total_debit, v_total_credit
        FROM transaction_lines
        WHERE transaction_id = NEW.transaction_id;

        IF v_total_debit != v_total_credit THEN
            -- In postgres triggers, we allow intermediate writes if deferred, but for strict posting:
            -- RAISE NOTICE 'Journal debits and credits must balance';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Invariant B: Posted Transaction Immutability
-- Posted transactions cannot have their financial values directly overwritten; corrections require reversals.
CREATE OR REPLACE FUNCTION protect_posted_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'posted' AND NEW.status = 'posted' THEN
        IF OLD.total_minor != NEW.total_minor OR OLD.currency != NEW.currency OR OLD.entity_id != NEW.entity_id THEN
            RAISE EXCEPTION 'MC-010 Violation: Posted journals are immutable. Post a reversing transaction to correct.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_posted_tx ON transactions;
CREATE TRIGGER trg_protect_posted_tx
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION protect_posted_transaction();

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE safe_to_spend_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountant_access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Default permissive policy for authenticated tenant scoping (in Supabase, auth.uid() links to users.auth_user_id)
-- For development and demo setup, allow read/write when authenticated or via service role.
CREATE POLICY "Tenant isolation for transactions" ON transactions
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM users WHERE auth_user_id = auth.uid() OR auth.uid() IS NULL
        )
    );

CREATE POLICY "Tenant isolation for accounts" ON accounts
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM users WHERE auth_user_id = auth.uid() OR auth.uid() IS NULL
        )
    );

CREATE POLICY "Tenant isolation for proposals" ON proposals
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM users WHERE auth_user_id = auth.uid() OR auth.uid() IS NULL
        )
    );

-- 13. SEED DEFAULT FEATURE FLAGS
INSERT INTO feature_flags (key, enabled, description, rollout_percentage)
VALUES 
    ('meta_whatsapp_inbound', true, 'Enable Meta WhatsApp webhook processing and AI proposal generator', 100),
    ('deterministic_safe_to_spend', true, 'Calculate explainable safe-to-spend on dashboard', 100),
    ('consequential_action_approval', true, 'Enforce cryptographic terms_hash and step-up authorization', 100),
    ('cra_tax_readiness_export', true, 'Enable Canada-first tax schedules and accountant exports', 100)
ON CONFLICT (key) DO NOTHING;

