-- ==============================================================================
-- MONEY COMMAND | SEED DATA FOR DEMO & TESTING
-- Synthetic Canadian Freelancer / Micro-Founder Environment
-- ==============================================================================

DO $$
DECLARE
    v_tenant_id UUID := '11111111-1111-1111-1111-111111111111';
    v_user_id UUID := '22222222-2222-2222-2222-222222222222';
    
    -- Entities
    v_entity_personal UUID := '33333333-3333-3333-3333-333333333331';
    v_entity_business UUID := '33333333-3333-3333-3333-333333333332';
    
    -- Personal Accounts
    v_acc_pers_checking UUID := '44444444-4444-4444-4444-444444444401';
    v_acc_pers_savings UUID := '44444444-4444-4444-4444-444444444402';
    v_acc_pers_credit UUID := '44444444-4444-4444-4444-444444444403';
    v_acc_pers_groceries UUID := '44444444-4444-4444-4444-444444444404';
    v_acc_pers_dining UUID := '44444444-4444-4444-4444-444444444405';
    v_acc_pers_salary UUID := '44444444-4444-4444-4444-444444444406';

    -- Business Accounts
    v_acc_biz_checking UUID := '55555555-5555-5555-5555-555555555501';
    v_acc_biz_tax_reserve UUID := '55555555-5555-5555-5555-555555555502';
    v_acc_biz_credit UUID := '55555555-5555-5555-5555-555555555503';
    v_acc_biz_software UUID := '55555555-5555-5555-5555-555555555504';
    v_acc_biz_revenue UUID := '55555555-5555-5555-5555-555555555505';
    v_acc_biz_gst_payable UUID := '55555555-5555-5555-5555-555555555506';

    -- Transactions
    v_tx_walmart UUID := '66666666-6666-6666-6666-666666666601';
    v_tx_client_income UUID := '66666666-6666-6666-6666-666666666602';
    v_tx_figma UUID := '66666666-6666-6666-6666-666666666603';
BEGIN
    -- 1. TENANT & USER
    INSERT INTO tenants (id, name, plan, status)
    VALUES (v_tenant_id, 'Maple Ridge Founder OS', 'founder', 'active')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO users (id, tenant_id, role, full_name, email, phone, whatsapp_phone, whatsapp_verified)
    VALUES (v_user_id, v_tenant_id, 'owner', 'Alex Tremblay', 'alex@mapleridge.dev', '+16475550192', '+16475550192', true)
    ON CONFLICT (id) DO NOTHING;

    -- 2. ENTITIES (Personal & Business)
    INSERT INTO entities (id, tenant_id, user_id, name, type, currency, is_default)
    VALUES (v_entity_personal, v_tenant_id, v_user_id, 'Alex Tremblay (Personal)', 'personal', 'CAD', true)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO entities (id, tenant_id, user_id, name, type, currency, tax_identifier, is_default)
    VALUES (v_entity_business, v_tenant_id, v_user_id, 'Maple Ridge Studio (Sole Prop)', 'sole_proprietorship', 'CAD', '829103948RT0001', false)
    ON CONFLICT (id) DO NOTHING;

    -- 3. PERSONAL CHART OF ACCOUNTS
    INSERT INTO accounts (id, tenant_id, entity_id, code, name, type, subtype, currency, balance_minor)
    VALUES 
        (v_acc_pers_checking, v_tenant_id, v_entity_personal, '1010', 'TD Chequing Account', 'asset', 'checking', 'CAD', 425000), -- $4,250.00
        (v_acc_pers_savings, v_tenant_id, v_entity_personal, '1020', 'Emergency High-Interest Savings', 'asset', 'savings', 'CAD', 1200000), -- $12,000.00
        (v_acc_pers_credit, v_tenant_id, v_entity_personal, '2010', 'TD CashBack Visa', 'liability', 'credit_card', 'CAD', 85400), -- $854.00
        (v_acc_pers_groceries, v_tenant_id, v_entity_personal, '5010', 'Groceries & Household', 'expense', 'groceries', 'CAD', 68200),
        (v_acc_pers_dining, v_tenant_id, v_entity_personal, '5020', 'Restaurants & Coffee', 'expense', 'dining', 'CAD', 24500),
        (v_acc_pers_salary, v_tenant_id, v_entity_personal, '4010', 'Owner Salary / Transfer In', 'revenue', 'income', 'CAD', 0)
    ON CONFLICT (id) DO NOTHING;

    -- 4. BUSINESS CHART OF ACCOUNTS
    INSERT INTO accounts (id, tenant_id, entity_id, code, name, type, subtype, currency, balance_minor)
    VALUES 
        (v_acc_biz_checking, v_tenant_id, v_entity_business, '1010', 'RBC Business Chequing', 'asset', 'checking', 'CAD', 1845000), -- $18,450.00
        (v_acc_biz_tax_reserve, v_tenant_id, v_entity_business, '1030', 'CRA Tax Reserve (HISA)', 'asset', 'savings', 'CAD', 620000), -- $6,200.00
        (v_acc_biz_credit, v_tenant_id, v_entity_business, '2010', 'RBC Avion Visa Business', 'liability', 'credit_card', 'CAD', 124000), -- $1,240.00
        (v_acc_biz_software, v_tenant_id, v_entity_business, '5040', 'Software & Cloud Subscriptions', 'expense', 'software', 'CAD', 19800),
        (v_acc_biz_revenue, v_tenant_id, v_entity_business, '4010', 'Product & Consulting Revenue', 'revenue', 'services', 'CAD', 550000),
        (v_acc_biz_gst_payable, v_tenant_id, v_entity_business, '2050', 'GST/HST Collected (Payable to CRA)', 'liability', 'tax', 'CAD', 71500)
    ON CONFLICT (id) DO NOTHING;

    -- 5. BENCHMARK BALANCED TRANSACTIONS (Debit == Credit)
    -- Personal MC-006: CAD 46.00 at Walmart Groceries
    INSERT INTO transactions (id, tenant_id, entity_id, type, status, currency, total_minor, tx_date, description, merchant, category, source, source_id, accountant_status)
    VALUES (v_tx_walmart, v_tenant_id, v_entity_personal, 'expense', 'posted', 'CAD', 4600, '2026-10-28', 'Weekly groceries run', 'Walmart Supercentre', 'Groceries', 'whatsapp_text', 'wamid.HBgLMTY0NzU1NTAxOTIVA==', 'user_verified')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO transaction_lines (transaction_id, tenant_id, account_id, debit_minor, credit_minor, currency, description, category)
    VALUES 
        (v_tx_walmart, v_tenant_id, v_acc_pers_groceries, 4600, 0, 'CAD', 'Groceries expense', 'Groceries'),
        (v_tx_walmart, v_tenant_id, v_acc_pers_credit, 0, 4600, 'CAD', 'TD CashBack Visa payment', 'Credit Card')
    ON CONFLICT (id) DO NOTHING;

    -- Business: Client Consulting Invoice Paid: CAD 5,500 + 13% HST (CAD 715) = CAD 6,215
    INSERT INTO transactions (id, tenant_id, entity_id, type, status, currency, total_minor, tx_date, description, merchant, category, source, accountant_status)
    VALUES (v_tx_client_income, v_tenant_id, v_entity_business, 'income', 'posted', 'CAD', 621500, '2026-10-25', 'Acme Corp UX retainer Q4', 'Acme Corp', 'Client Revenue', 'statement', 'user_verified')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO transaction_lines (transaction_id, tenant_id, account_id, debit_minor, credit_minor, currency, description, category, tax_rate, tax_amount_minor)
    VALUES 
        (v_tx_client_income, v_tenant_id, v_acc_biz_checking, 621500, 0, 'CAD', 'Funds deposited to RBC Checking', 'Cash'),
        (v_tx_client_income, v_tenant_id, v_acc_biz_revenue, 0, 550000, 'CAD', 'Net Consulting Revenue', 'Revenue', 0.13, 71500),
        (v_tx_client_income, v_tenant_id, v_acc_biz_gst_payable, 0, 71500, 'CAD', '13% Ontario HST collected', 'Tax Payable')
    ON CONFLICT (id) DO NOTHING;

    -- 6. PENDING UNPOSTED PROPOSAL (First Vertical Slice Demonstration)
    INSERT INTO proposals (
        id, tenant_id, entity_id, user_id, type, amount_minor, currency, merchant, category,
        proposed_debit_account_id, proposed_credit_account_id, tx_date, tax_relevance, confidence, status
    ) VALUES (
        '77777777-7777-7777-7777-777777777701',
        v_tenant_id, v_entity_personal, v_user_id, 'expense', 4600, 'CAD', 'Walmart Supercentre', 'Groceries',
        v_acc_pers_groceries, v_acc_pers_checking, '2026-10-31', 'none', 0.960, 'pending'
    ) ON CONFLICT (id) DO NOTHING;

    -- 7. DETERMINISTIC SAFE-TO-SPEND CONFIG & OBLIGATIONS
    INSERT INTO safe_to_spend_configs (tenant_id, entity_id, user_defined_buffer_minor, horizon_days, tax_reserve_rate, committed_savings_target_minor)
    VALUES (v_tenant_id, v_entity_personal, 30000, 14, 0.000, 25000)
    ON CONFLICT (entity_id) DO UPDATE SET user_defined_buffer_minor = 30000;

    INSERT INTO obligations (tenant_id, entity_id, name, category, amount_minor, frequency, next_due_date, is_essential)
    VALUES 
        (v_tenant_id, v_entity_personal, 'Toronto Condo Rent / Mortgage', 'Housing', 220000, 'monthly', '2026-11-01', true),
        (v_tenant_id, v_entity_personal, 'Enbridge Gas & Hydro', 'Utilities', 14500, 'monthly', '2026-11-08', true),
        (v_tenant_id, v_entity_personal, 'TD Visa Minimum Payment', 'Debt', 5000, 'monthly', '2026-11-12', true)
    ON CONFLICT DO NOTHING;

    -- 8. SUBSCRIPTIONS & ACTION AUTOMATION
    INSERT INTO subscriptions (
        tenant_id, entity_id, merchant, category, amount_minor, currency, frequency, status,
        next_billing_date, last_price_minor, price_delta_minor, annualized_cost_minor, cancellation_route
    ) VALUES 
        (v_tenant_id, v_entity_business, 'Figma Organization', 'Design Tools', 2100, 'CAD', 'monthly', 'active', '2026-11-15', 2100, 0, 25200, 'provider_api'),
        (v_tenant_id, v_entity_business, 'GitHub Copilot Enterprise', 'Developer Tools', 2600, 'CAD', 'monthly', 'active', '2026-11-20', 2600, 0, 31200, 'provider_api'),
        (v_tenant_id, v_entity_personal, 'Bell Fibe Gigabit Internet', 'Telecom', 11500, 'CAD', 'monthly', 'active', '2026-11-05', 9500, 2000, 138000, 'phone_script'),
        (v_tenant_id, v_entity_personal, 'The Athletic Subscription', 'Entertainment', 1099, 'CAD', 'monthly', 'active', '2026-11-18', 1099, 0, 13188, 'email_draft')
    ON CONFLICT DO NOTHING;

    -- 9. BILL NEGOTIATION WORKFLOW (Bell Internet Price Increase)
    INSERT INTO bill_negotiations (
        tenant_id, entity_id, provider_name, account_number_last4, current_bill_minor, target_bill_minor, min_acceptable_bill_minor, mode, status, script_draft, verified_savings_minor
    ) VALUES (
        v_tenant_id, v_entity_personal, 'Bell Canada', '4821', 11500, 7500, 8500, 'coach_me', 'target_ready',
        'Hello Loyalty team, my monthly rate increased by $20 from $95 to $115. Rogers and Beanfield are currently offering 1.5 Gbps in Toronto for $70/month. I would love to stay if you can match $75/mo.',
        48000
    ) ON CONFLICT DO NOTHING;

    -- 10. CANADA-FIRST TAX PROFILE (Ontario CRA)
    INSERT INTO tax_profiles (
        tenant_id, entity_id, jurisdiction, tax_year, reporting_method, gst_hst_registered, gst_hst_number, default_reserve_rate
    ) VALUES (
        v_tenant_id, v_entity_business, 'CA_ON', 2026, 'cash', true, '829103948RT0001', 0.250
    ) ON CONFLICT (entity_id, tax_year) DO NOTHING;

END $$;

