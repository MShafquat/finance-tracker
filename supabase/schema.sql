-- ============================================================
-- Personal Finance App — Supabase Schema
-- Run this SQL in: Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT NOT NULL DEFAULT '',
    currency_code CHAR(3) NOT NULL DEFAULT 'USD',
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    monthly_income NUMERIC(15, 2),
    income_category TEXT NOT NULL DEFAULT 'salary',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);


-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    icon TEXT NOT NULL DEFAULT '',
    color CHAR(7) NOT NULL DEFAULT '#94a3b8',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_all" ON public.categories
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- BUDGET PLANS
-- ============================================================
CREATE TABLE public.budget_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    planned_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, category_id, month, year)
);

ALTER TABLE public.budget_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "budget_plans_all" ON public.budget_plans
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- ACCOUNTS
-- ============================================================
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('bank', 'mfs', 'credit_card', 'cash')),
    provider TEXT NOT NULL DEFAULT '',
    current_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    initial_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    currency_code CHAR(3) NOT NULL DEFAULT 'USD',
    credit_limit NUMERIC(15, 2),
    billing_date INTEGER CHECK (billing_date BETWEEN 1 AND 31),
    due_date INTEGER CHECK (due_date BETWEEN 1 AND 31),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "accounts_all" ON public.accounts
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- TRANSACTIONS
-- ============================================================
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    transfer_to_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_all" ON public.transactions
    FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_transactions_user_date ON public.transactions (user_id, transaction_date DESC);
CREATE INDEX idx_transactions_account ON public.transactions (account_id);
CREATE INDEX idx_transactions_category ON public.transactions (category_id);


-- ============================================================
-- SAVING PLANS
-- ============================================================
CREATE TABLE public.saving_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount NUMERIC(15, 2) NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    target_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    suggestion_rule TEXT NOT NULL DEFAULT '',
    monthly_contribution NUMERIC(15, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.saving_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saving_plans_all" ON public.saving_plans
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER budget_plans_updated_at
    BEFORE UPDATE ON public.budget_plans
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER accounts_updated_at
    BEFORE UPDATE ON public.accounts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER saving_plans_updated_at
    BEFORE UPDATE ON public.saving_plans
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- TRIGGER: Auto-create profile on Supabase signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- TRIGGER: Auto-update account balance on transaction change
-- ============================================================
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'income' THEN
            UPDATE public.accounts SET current_balance = current_balance + NEW.amount WHERE id = NEW.account_id;
        ELSIF NEW.type = 'expense' THEN
            UPDATE public.accounts SET current_balance = current_balance - NEW.amount WHERE id = NEW.account_id;
        ELSIF NEW.type = 'transfer' THEN
            UPDATE public.accounts SET current_balance = current_balance - NEW.amount WHERE id = NEW.account_id;
            UPDATE public.accounts SET current_balance = current_balance + NEW.amount WHERE id = NEW.transfer_to_account_id;
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.type = 'income' THEN
            UPDATE public.accounts SET current_balance = current_balance - OLD.amount WHERE id = OLD.account_id;
        ELSIF OLD.type = 'expense' THEN
            UPDATE public.accounts SET current_balance = current_balance + OLD.amount WHERE id = OLD.account_id;
        ELSIF OLD.type = 'transfer' THEN
            UPDATE public.accounts SET current_balance = current_balance + OLD.amount WHERE id = OLD.account_id;
            UPDATE public.accounts SET current_balance = current_balance - OLD.amount WHERE id = OLD.transfer_to_account_id;
        END IF;

    ELSIF TG_OP = 'UPDATE' THEN
        -- Reverse the old transaction
        IF OLD.type = 'income' THEN
            UPDATE public.accounts SET current_balance = current_balance - OLD.amount WHERE id = OLD.account_id;
        ELSIF OLD.type = 'expense' THEN
            UPDATE public.accounts SET current_balance = current_balance + OLD.amount WHERE id = OLD.account_id;
        ELSIF OLD.type = 'transfer' THEN
            UPDATE public.accounts SET current_balance = current_balance + OLD.amount WHERE id = OLD.account_id;
            UPDATE public.accounts SET current_balance = current_balance - OLD.amount WHERE id = OLD.transfer_to_account_id;
        END IF;
        -- Apply the new transaction
        IF NEW.type = 'income' THEN
            UPDATE public.accounts SET current_balance = current_balance + NEW.amount WHERE id = NEW.account_id;
        ELSIF NEW.type = 'expense' THEN
            UPDATE public.accounts SET current_balance = current_balance - NEW.amount WHERE id = NEW.account_id;
        ELSIF NEW.type = 'transfer' THEN
            UPDATE public.accounts SET current_balance = current_balance - NEW.amount WHERE id = NEW.account_id;
            UPDATE public.accounts SET current_balance = current_balance + NEW.amount WHERE id = NEW.transfer_to_account_id;
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER transaction_balance_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_account_balance();
