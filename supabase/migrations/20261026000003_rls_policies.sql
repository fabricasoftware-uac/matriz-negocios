-- ==============================================================================
-- Migration: 20261026000003_rls_policies.sql
-- Description: Strict BOLA/IDOR-proof Row Level Security (RLS) policies
--              for all tables with authenticated-only role, (select auth.uid())
--              ownership verification, USING + WITH CHECK, and superadmin bypass.
-- ==============================================================================

-- 1. Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_assumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operating_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capex_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environmental_impacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. Profiles Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
        (SELECT auth.uid()) = id
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (SELECT auth.uid()) = id
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (
        (SELECT auth.uid()) = id
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        (SELECT auth.uid()) = id
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
CREATE POLICY "profiles_delete_policy" ON public.profiles
    FOR DELETE
    TO authenticated
    USING (
        public.is_superadmin((SELECT auth.uid()))
    );

-- ==============================================================================
-- 3. Projects Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "projects_select_policy" ON public.projects;
CREATE POLICY "projects_select_policy" ON public.projects
    FOR SELECT
    TO authenticated
    USING (
        user_id = (SELECT auth.uid())
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "projects_insert_policy" ON public.projects;
CREATE POLICY "projects_insert_policy" ON public.projects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = (SELECT auth.uid())
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "projects_update_policy" ON public.projects;
CREATE POLICY "projects_update_policy" ON public.projects
    FOR UPDATE
    TO authenticated
    USING (
        user_id = (SELECT auth.uid())
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        user_id = (SELECT auth.uid())
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "projects_delete_policy" ON public.projects;
CREATE POLICY "projects_delete_policy" ON public.projects
    FOR DELETE
    TO authenticated
    USING (
        user_id = (SELECT auth.uid())
        OR public.is_superadmin((SELECT auth.uid()))
    );

-- ==============================================================================
-- 4. Financial Assumptions Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "financial_assumptions_select_policy" ON public.financial_assumptions;
CREATE POLICY "financial_assumptions_select_policy" ON public.financial_assumptions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = financial_assumptions.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "financial_assumptions_insert_policy" ON public.financial_assumptions;
CREATE POLICY "financial_assumptions_insert_policy" ON public.financial_assumptions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = financial_assumptions.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "financial_assumptions_update_policy" ON public.financial_assumptions;
CREATE POLICY "financial_assumptions_update_policy" ON public.financial_assumptions
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = financial_assumptions.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = financial_assumptions.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "financial_assumptions_delete_policy" ON public.financial_assumptions;
CREATE POLICY "financial_assumptions_delete_policy" ON public.financial_assumptions
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = financial_assumptions.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

-- ==============================================================================
-- 5. Revenue Streams Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "revenue_streams_select_policy" ON public.revenue_streams;
CREATE POLICY "revenue_streams_select_policy" ON public.revenue_streams
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = revenue_streams.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "revenue_streams_insert_policy" ON public.revenue_streams;
CREATE POLICY "revenue_streams_insert_policy" ON public.revenue_streams
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = revenue_streams.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "revenue_streams_update_policy" ON public.revenue_streams;
CREATE POLICY "revenue_streams_update_policy" ON public.revenue_streams
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = revenue_streams.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = revenue_streams.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "revenue_streams_delete_policy" ON public.revenue_streams;
CREATE POLICY "revenue_streams_delete_policy" ON public.revenue_streams
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = revenue_streams.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

-- ==============================================================================
-- 6. Labor Positions Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "labor_positions_select_policy" ON public.labor_positions;
CREATE POLICY "labor_positions_select_policy" ON public.labor_positions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = labor_positions.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "labor_positions_insert_policy" ON public.labor_positions;
CREATE POLICY "labor_positions_insert_policy" ON public.labor_positions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = labor_positions.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "labor_positions_update_policy" ON public.labor_positions;
CREATE POLICY "labor_positions_update_policy" ON public.labor_positions
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = labor_positions.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = labor_positions.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "labor_positions_delete_policy" ON public.labor_positions;
CREATE POLICY "labor_positions_delete_policy" ON public.labor_positions
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = labor_positions.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

-- ==============================================================================
-- 7. Direct Costs Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "direct_costs_select_policy" ON public.direct_costs;
CREATE POLICY "direct_costs_select_policy" ON public.direct_costs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = direct_costs.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "direct_costs_insert_policy" ON public.direct_costs;
CREATE POLICY "direct_costs_insert_policy" ON public.direct_costs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = direct_costs.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "direct_costs_update_policy" ON public.direct_costs;
CREATE POLICY "direct_costs_update_policy" ON public.direct_costs
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = direct_costs.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = direct_costs.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "direct_costs_delete_policy" ON public.direct_costs;
CREATE POLICY "direct_costs_delete_policy" ON public.direct_costs
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = direct_costs.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

-- ==============================================================================
-- 8. Operating Expenses Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "operating_expenses_select_policy" ON public.operating_expenses;
CREATE POLICY "operating_expenses_select_policy" ON public.operating_expenses
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = operating_expenses.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "operating_expenses_insert_policy" ON public.operating_expenses;
CREATE POLICY "operating_expenses_insert_policy" ON public.operating_expenses
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = operating_expenses.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "operating_expenses_update_policy" ON public.operating_expenses;
CREATE POLICY "operating_expenses_update_policy" ON public.operating_expenses
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = operating_expenses.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = operating_expenses.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "operating_expenses_delete_policy" ON public.operating_expenses;
CREATE POLICY "operating_expenses_delete_policy" ON public.operating_expenses
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = operating_expenses.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

-- ==============================================================================
-- 9. CAPEX Investments Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "capex_investments_select_policy" ON public.capex_investments;
CREATE POLICY "capex_investments_select_policy" ON public.capex_investments
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = capex_investments.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "capex_investments_insert_policy" ON public.capex_investments;
CREATE POLICY "capex_investments_insert_policy" ON public.capex_investments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = capex_investments.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "capex_investments_update_policy" ON public.capex_investments;
CREATE POLICY "capex_investments_update_policy" ON public.capex_investments
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = capex_investments.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = capex_investments.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "capex_investments_delete_policy" ON public.capex_investments;
CREATE POLICY "capex_investments_delete_policy" ON public.capex_investments
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = capex_investments.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

-- ==============================================================================
-- 10. Market Competitors Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "market_competitors_select_policy" ON public.market_competitors;
CREATE POLICY "market_competitors_select_policy" ON public.market_competitors
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = market_competitors.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "market_competitors_insert_policy" ON public.market_competitors;
CREATE POLICY "market_competitors_insert_policy" ON public.market_competitors
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = market_competitors.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "market_competitors_update_policy" ON public.market_competitors;
CREATE POLICY "market_competitors_update_policy" ON public.market_competitors
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = market_competitors.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = market_competitors.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "market_competitors_delete_policy" ON public.market_competitors;
CREATE POLICY "market_competitors_delete_policy" ON public.market_competitors
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = market_competitors.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

-- ==============================================================================
-- 11. Risk Items Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "risk_items_select_policy" ON public.risk_items;
CREATE POLICY "risk_items_select_policy" ON public.risk_items
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = risk_items.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "risk_items_insert_policy" ON public.risk_items;
CREATE POLICY "risk_items_insert_policy" ON public.risk_items
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = risk_items.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "risk_items_update_policy" ON public.risk_items;
CREATE POLICY "risk_items_update_policy" ON public.risk_items
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = risk_items.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = risk_items.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "risk_items_delete_policy" ON public.risk_items;
CREATE POLICY "risk_items_delete_policy" ON public.risk_items
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = risk_items.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

-- ==============================================================================
-- 12. Environmental Impacts Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "environmental_impacts_select_policy" ON public.environmental_impacts;
CREATE POLICY "environmental_impacts_select_policy" ON public.environmental_impacts
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = environmental_impacts.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "environmental_impacts_insert_policy" ON public.environmental_impacts;
CREATE POLICY "environmental_impacts_insert_policy" ON public.environmental_impacts
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = environmental_impacts.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "environmental_impacts_update_policy" ON public.environmental_impacts;
CREATE POLICY "environmental_impacts_update_policy" ON public.environmental_impacts
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = environmental_impacts.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = environmental_impacts.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "environmental_impacts_delete_policy" ON public.environmental_impacts;
CREATE POLICY "environmental_impacts_delete_policy" ON public.environmental_impacts
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = environmental_impacts.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

-- ==============================================================================
-- 13. Scenarios Table RLS Policies
-- ==============================================================================
DROP POLICY IF EXISTS "scenarios_select_policy" ON public.scenarios;
CREATE POLICY "scenarios_select_policy" ON public.scenarios
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = scenarios.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "scenarios_insert_policy" ON public.scenarios;
CREATE POLICY "scenarios_insert_policy" ON public.scenarios
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = scenarios.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "scenarios_update_policy" ON public.scenarios;
CREATE POLICY "scenarios_update_policy" ON public.scenarios
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = scenarios.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = scenarios.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );

DROP POLICY IF EXISTS "scenarios_delete_policy" ON public.scenarios;
CREATE POLICY "scenarios_delete_policy" ON public.scenarios
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = scenarios.project_id
              AND p.user_id = (SELECT auth.uid())
        )
        OR public.is_superadmin((SELECT auth.uid()))
    );
