-- ==============================================================================
-- Migration: 20261026000002_create_financial_entities.sql
-- Description: Core financial evaluation tables, capex, opex, payroll,
--              assumptions, market, risks, environmental impacts, and scenarios.
-- ==============================================================================

-- 1. Projects Master Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    legal_structure TEXT,
    ciiu_code TEXT,
    currency TEXT NOT NULL DEFAULT 'COP',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2. Financial Macro & Operational Assumptions (1:1 with project)
CREATE TABLE IF NOT EXISTS public.financial_assumptions (
    project_id UUID PRIMARY KEY REFERENCES public.projects(id) ON DELETE CASCADE,
    annual_inflation_ipc JSONB NOT NULL DEFAULT '[]'::JSONB,
    annual_market_growth JSONB NOT NULL DEFAULT '[]'::JSONB,
    base_smlmv NUMERIC NOT NULL DEFAULT 1160000,
    discount_rate_wacc NUMERIC NOT NULL DEFAULT 0.10,
    receivable_days INT NOT NULL DEFAULT 60,
    payable_days INT NOT NULL DEFAULT 60,
    inventory_days INT NOT NULL DEFAULT 90,
    tax_rate_history JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_financial_assumptions_updated_at
    BEFORE UPDATE ON public.financial_assumptions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. Revenue Streams (Products / Services)
CREATE TABLE IF NOT EXISTS public.revenue_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    initial_quantity NUMERIC NOT NULL DEFAULT 0,
    growth_rate NUMERIC NOT NULL DEFAULT 0,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revenue_streams_project_id ON public.revenue_streams(project_id);

CREATE TRIGGER trigger_revenue_streams_updated_at
    BEFORE UPDATE ON public.revenue_streams
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Labor Positions (Payroll / Mano de Obra)
CREATE TABLE IF NOT EXISTS public.labor_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    role_name TEXT NOT NULL,
    headcount INT NOT NULL DEFAULT 1 CHECK (headcount >= 0),
    base_monthly_salary NUMERIC NOT NULL DEFAULT 1160000 CHECK (base_monthly_salary >= 0),
    has_transport_allowance BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_labor_positions_project_id ON public.labor_positions(project_id);

CREATE TRIGGER trigger_labor_positions_updated_at
    BEFORE UPDATE ON public.labor_positions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Direct Costs & Production Supplies
CREATE TABLE IF NOT EXISTS public.direct_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    monthly_amount NUMERIC NOT NULL DEFAULT 0 CHECK (monthly_amount >= 0),
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direct_costs_project_id ON public.direct_costs(project_id);

CREATE TRIGGER trigger_direct_costs_updated_at
    BEFORE UPDATE ON public.direct_costs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Operating Expenses (OPEX / Gastos Administrativos y de Venta)
CREATE TABLE IF NOT EXISTS public.operating_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    monthly_amount NUMERIC NOT NULL DEFAULT 0 CHECK (monthly_amount >= 0),
    category TEXT NOT NULL DEFAULT 'general',
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_operating_expenses_project_id ON public.operating_expenses(project_id);

CREATE TRIGGER trigger_operating_expenses_updated_at
    BEFORE UPDATE ON public.operating_expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. CAPEX Investments (Initial Assets & Depreciation)
CREATE TABLE IF NOT EXISTS public.capex_investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    asset_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    cost NUMERIC NOT NULL DEFAULT 0 CHECK (cost >= 0),
    useful_life_years INT NOT NULL DEFAULT 5 CHECK (useful_life_years > 0),
    salvage_value NUMERIC NOT NULL DEFAULT 0 CHECK (salvage_value >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_capex_investments_project_id ON public.capex_investments(project_id);

CREATE TRIGGER trigger_capex_investments_updated_at
    BEFORE UPDATE ON public.capex_investments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 8. Market Competitors Benchmarking
CREATE TABLE IF NOT EXISTS public.market_competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    scores JSONB NOT NULL DEFAULT '{}'::JSONB,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_competitors_project_id ON public.market_competitors(project_id);

CREATE TRIGGER trigger_market_competitors_updated_at
    BEFORE UPDATE ON public.market_competitors
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 9. Risk Matrix Items
CREATE TABLE IF NOT EXISTS public.risk_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    process TEXT NOT NULL,
    objective TEXT,
    risk_description TEXT NOT NULL,
    probability INT NOT NULL DEFAULT 1,
    impact INT NOT NULL DEFAULT 1,
    severity NUMERIC NOT NULL DEFAULT 1,
    control_description TEXT,
    what_controls TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risk_items_project_id ON public.risk_items(project_id);

CREATE TRIGGER trigger_risk_items_updated_at
    BEFORE UPDATE ON public.risk_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 10. Conesa Environmental Impacts Evaluation
CREATE TABLE IF NOT EXISTS public.environmental_impacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    component TEXT NOT NULL,
    element TEXT NOT NULL,
    impact_name TEXT NOT NULL,
    intensity_u NUMERIC NOT NULL DEFAULT 1,
    extension_ex NUMERIC NOT NULL DEFAULT 1,
    moment_mo NUMERIC NOT NULL DEFAULT 1,
    persistence_pe NUMERIC NOT NULL DEFAULT 1,
    reversibility_rv NUMERIC NOT NULL DEFAULT 1,
    recoverability_mc NUMERIC NOT NULL DEFAULT 1,
    effect_ef NUMERIC NOT NULL DEFAULT 1,
    periodicity_pr NUMERIC NOT NULL DEFAULT 1,
    character_sign INT NOT NULL DEFAULT -1 CHECK (character_sign IN (-1, 1)),
    importance_score NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_environmental_impacts_project_id ON public.environmental_impacts(project_id);

CREATE TRIGGER trigger_environmental_impacts_updated_at
    BEFORE UPDATE ON public.environmental_impacts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 11. Multi-scenario Simulation Caches
CREATE TABLE IF NOT EXISTS public.scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    variable_overrides JSONB NOT NULL DEFAULT '{}'::JSONB,
    result_cache JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scenarios_project_id ON public.scenarios(project_id);

CREATE TRIGGER trigger_scenarios_updated_at
    BEFORE UPDATE ON public.scenarios
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
