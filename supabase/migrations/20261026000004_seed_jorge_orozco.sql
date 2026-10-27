-- ==============================================================================
-- Migration: 20261026000004_seed_jorge_orozco.sql
-- Description: Real Seed Data from Jorge Orozco's Project
--              "Formato para evaluación de proyectos(Jorge_Orozco).xlsm":
--              - Influencer & Content Creator Agency in Popayán (CIIU J5911, S.A.S.)
--              - 3 Products (Afiliación, Asesoría inicial, Canon de mantenimiento)
--              - 5 Labor Positions (Ingeniero, Administrador, Contador, Jurídico, Comunicaciones)
--              - Total CAPEX $14,340,000 COP ($14.34M)
--              - Working Capital Rotation (CxC: 60d, CxP: 60d, Inventario: 90d)
--              - WACC / Tasa Descuento: 10%
-- ==============================================================================

DO $$
DECLARE
    v_user_id UUID := '00000000-0000-0000-0000-000000000001'::UUID;
    v_project_id UUID := 'a0000000-0000-0000-0000-000000000001'::UUID;
BEGIN
    -- 1. Create or ensure Demo / Seed User in auth.users
    -- In standard Supabase environments, auth.users holds authenticated identities
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role,
            created_at,
            updated_at
        ) VALUES (
            v_user_id,
            '00000000-0000-0000-0000-000000000000'::UUID,
            'jorge.orozco@ejemplo.com',
            crypt('DemoPass123*', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::JSONB,
            '{"full_name":"Jorge Orozco","role":"admin"}'::JSONB,
            'authenticated',
            'authenticated',
            NOW(),
            NOW()
        );
    END IF;

    -- Ensure corresponding profile in public.profiles
    INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
        v_user_id,
        'jorge.orozco@ejemplo.com',
        'Jorge Orozco',
        'admin'::public.user_role,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        updated_at = NOW();

    -- 2. Seed Primary Project: Jorge Orozco Agency (Popayán)
    INSERT INTO public.projects (
        id,
        user_id,
        title,
        description,
        legal_structure,
        ciiu_code,
        currency,
        created_at,
        updated_at
    ) VALUES (
        v_project_id,
        v_user_id,
        'Agencia de Creadores de Contenido e Influenciadores - Popayán',
        'Modelo financiero y de negocio para una agencia de representación, producción de contenido audiovisual y monetización de redes sociales en el departamento del Cauca.',
        'Sociedad por Acciones Simplificada (S.A.S.)',
        'J5911',
        'COP',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        legal_structure = EXCLUDED.legal_structure,
        ciiu_code = EXCLUDED.ciiu_code,
        updated_at = NOW();

    -- 3. Seed Macro & Financial Assumptions
    -- Matches exact parameters from Excel sheet Base & Proyección FCL:
    -- - IPC: 1.45% (Yr0), 3.60% (Yr1), 3.20% (Yr2), 3.00% (Yr3-5)
    -- - Market Growth: 10% annual
    -- - Tax Rates: 32% (Yr0), 31% (Yr1), 30% (Yr2-5)
    -- - Working Capital Days: CxC 60, CxP 60, Inv 90
    -- - SMLMV 2023: $1,160,000 COP
    -- - WACC / Tasa de Descuento: 10%
    INSERT INTO public.financial_assumptions (
        project_id,
        annual_inflation_ipc,
        annual_market_growth,
        base_smlmv,
        discount_rate_wacc,
        receivable_days,
        payable_days,
        inventory_days,
        tax_rate_history,
        created_at,
        updated_at
    ) VALUES (
        v_project_id,
        '[0.0145, 0.0360, 0.0320, 0.0300, 0.0300, 0.0300]'::JSONB,
        '[0.10, 0.10, 0.10, 0.10, 0.10, 0.10]'::JSONB,
        1160000,
        0.10,
        60,
        60,
        90,
        '[0.32, 0.31, 0.30, 0.30, 0.30, 0.30]'::JSONB,
        NOW(),
        NOW()
    )
    ON CONFLICT (project_id) DO UPDATE SET
        annual_inflation_ipc = EXCLUDED.annual_inflation_ipc,
        annual_market_growth = EXCLUDED.annual_market_growth,
        base_smlmv = EXCLUDED.base_smlmv,
        discount_rate_wacc = EXCLUDED.discount_rate_wacc,
        receivable_days = EXCLUDED.receivable_days,
        payable_days = EXCLUDED.payable_days,
        inventory_days = EXCLUDED.inventory_days,
        tax_rate_history = EXCLUDED.tax_rate_history,
        updated_at = NOW();

    -- 4. Seed Revenue Streams (3 commercial offerings)
    -- Base Sheet Rows 11-13:
    -- Product 1: Afiliación (Q=20, P=$482,893)
    -- Product 2: Asesoría inicial (Q=20, P=$482,893)
    -- Product 3: Canon de mantenimiento de la página (Q=20, P=$4,828,930)
    -- Year 0 Total Projected Revenue = $115,894,320 COP
    DELETE FROM public.revenue_streams WHERE project_id = v_project_id;
    INSERT INTO public.revenue_streams (project_id, name, unit_price, initial_quantity, growth_rate, order_index)
    VALUES
        (v_project_id, 'Afiliación', 482893, 20, 0.10, 1),
        (v_project_id, 'Asesoría inicial', 482893, 20, 0.10, 2),
        (v_project_id, 'Canon de mantenimiento de la página', 4828930, 20, 0.10, 3);

    -- 5. Seed Labor Positions (5 organizational roles)
    -- Base Sheet Rows 29-33:
    -- Total Monthly Cost per position with Colombian legal benefits: $1,485,913.06
    -- Total Annual Payroll (Base 4 active in initial model): $71,323,826.88
    DELETE FROM public.labor_positions WHERE project_id = v_project_id;
    INSERT INTO public.labor_positions (project_id, role_name, headcount, base_monthly_salary, has_transport_allowance, order_index)
    VALUES
        (v_project_id, 'Ingeniero de sistemas', 1, 1160000, true, 1),
        (v_project_id, 'Administrador', 1, 1160000, true, 2),
        (v_project_id, 'Contador', 1, 1160000, true, 3),
        (v_project_id, 'Jurídico', 1, 1160000, true, 4),
        (v_project_id, 'Comunicaciones', 1, 1160000, true, 5);

    -- 6. Seed Direct Costs & Production Supplies
    -- Base Sheet Rows 38-39:
    -- Distribución: $1,437,240 monthly (Annual = $17,246,880)
    -- Páginas: $119,770 monthly unit (Annual = $2,395,400)
    DELETE FROM public.direct_costs WHERE project_id = v_project_id;
    INSERT INTO public.direct_costs (project_id, name, monthly_amount, order_index)
    VALUES
        (v_project_id, 'Distribución de contenido', 1437240, 1),
        (v_project_id, 'Costos operativos de páginas web', 119770, 2);

    -- 7. Seed Operating Expenses (OPEX)
    -- Base Sheet Rows 65-66:
    -- Arriendo: $700,000 monthly
    -- Servicios Públicos y Celulares: $200,000 monthly
    DELETE FROM public.operating_expenses WHERE project_id = v_project_id;
    INSERT INTO public.operating_expenses (project_id, name, monthly_amount, category, order_index)
    VALUES
        (v_project_id, 'Arriendo de oficina comercial', 700000, 'operativo', 1),
        (v_project_id, 'Servicios Públicos y Conectividad Móvil', 200000, 'servicios', 2);

    -- 8. Seed CAPEX Investments (Exact $14,340,000 COP)
    -- Base Sheet Rows 80-83:
    -- Muebles y Enseres: $2,000,000 (5 yrs depreciation)
    -- Equipos de Oficina: $5,000,000 (5 yrs depreciation)
    -- Otros (Páginas monetizadas): $7,340,000 (5 yrs depreciation)
    -- Total Initial Investment = $14,340,000 COP
    DELETE FROM public.capex_investments WHERE project_id = v_project_id;
    INSERT INTO public.capex_investments (project_id, asset_name, category, cost, useful_life_years, salvage_value)
    VALUES
        (v_project_id, 'Muebles y Enseres', 'mobiliario', 2000000, 5, 0),
        (v_project_id, 'Equipos de Cómputo y Oficina', 'tecnologia', 5000000, 5, 0),
        (v_project_id, 'Páginas y Canales Monetizados (Intangibles)', 'intangibles', 7340000, 5, 0);

    -- 9. Seed Market Competitors (from Mercado sheet)
    -- Benchmarking 6 regional and national agencies
    DELETE FROM public.market_competitors WHERE project_id = v_project_id;
    INSERT INTO public.market_competitors (project_id, name, scores, order_index)
    VALUES
        (v_project_id, 'Raw Talent', '{"calidad": 5, "imagen": 10, "reconocimiento": 10, "relacion": 10, "ubicacion": 10, "servicio": 10, "total": 55}'::JSONB, 1),
        (v_project_id, 'DCInfluenc', '{"calidad": 10, "imagen": 10, "reconocimiento": 10, "relacion": 0, "ubicacion": 10, "servicio": 0, "total": 40}'::JSONB, 2),
        (v_project_id, 'MatchAgenc', '{"calidad": 10, "imagen": 10, "reconocimiento": 5, "relacion": 0, "ubicacion": 10, "servicio": 10, "total": 45}'::JSONB, 3),
        (v_project_id, 'RangaMedia', '{"calidad": 10, "imagen": 10, "reconocimiento": 5, "relacion": 0, "ubicacion": 10, "servicio": 0, "total": 35}'::JSONB, 4),
        (v_project_id, 'Trendset', '{"calidad": 10, "imagen": 10, "reconocimiento": 8, "relacion": 0, "ubicacion": 10, "servicio": 0, "total": 38}'::JSONB, 5),
        (v_project_id, 'SomosInflu', '{"calidad": 5, "imagen": 5, "reconocimiento": 2, "relacion": 0, "ubicacion": 3, "servicio": 0, "total": 15}'::JSONB, 6);

    -- 10. Seed Risk Items (from Matriz de Riesgo sheet)
    DELETE FROM public.risk_items WHERE project_id = v_project_id;
    INSERT INTO public.risk_items (project_id, process, objective, risk_description, probability, impact, severity, control_description, what_controls)
    VALUES
        (
            v_project_id,
            'Área Contable y Financiera',
            'Garantizar la exactitud tributaria y cumplimiento normativo',
            'Errores en la liquidación del impuesto en la elaboración de la factura.',
            1,
            2,
            2,
            'La facturación se realiza a través de la herramienta gratuita de la DIAN.',
            'Errores humanos en la liquidación de impuestos. Caída constante de la plataforma.'
        ),
        (
            v_project_id,
            'Área Contable y Financiera',
            'Control de soportes de egresos y legalidad documental',
            'Mala práctica en la contabilización de factura o cuentas de cobro de proveedores.',
            1,
            1,
            1,
            'Verificación de los requisitos de ley para facturación y auditoría de Revisoría Fiscal.',
            'Registros y pagos de facturas sin requisitos legales vigentes.'
        ),
        (
            v_project_id,
            'Área Contable y Financiera',
            'Integridad y fiabilidad de los estados financieros',
            'Fraude en la información contable.',
            1,
            4,
            4,
            'Segregación de funciones y auditorías periódicas de revisoría fiscal.',
            'Falta de valores y debilidad en controles internos.'
        ),
        (
            v_project_id,
            'Dirección General',
            'Alineación del plan estratégico con la ejecución financiera',
            'Ausencia de variables estratégicas en la definición del presupuesto.',
            2,
            3,
            6,
            'Planear conforme al Presupuesto Anual de Trabajo (PAT) con aprobación por junta de socios.',
            'Gastos no orientados al cumplimiento del objeto misional.'
        );

    -- 11. Seed Conesa Environmental Impacts (from Matriz Ambiental sheet)
    DELETE FROM public.environmental_impacts WHERE project_id = v_project_id;
    INSERT INTO public.environmental_impacts (
        project_id,
        component,
        element,
        impact_name,
        intensity_u,
        extension_ex,
        moment_mo,
        persistence_pe,
        reversibility_rv,
        recoverability_mc,
        effect_ef,
        periodicity_pr,
        character_sign,
        importance_score
    ) VALUES
        (
            v_project_id,
            'Componente Físico',
            'Recurso Suelo',
            'Presión sobre relleno sanitario por residuos de papelería y oficina',
            1, 1, 1, 1, 1, 1, 1, 1,
            -1,
            -11 -- 3*1 + 2*1 + 1 + 1 + 1 + 1 + 1 + 1 = 11 (Irrelevante)
        ),
        (
            v_project_id,
            'Componente Físico',
            'Calidad de Aire y Energía',
            'Consumo energético por uso permanente de equipos de grabación y luminarias',
            2, 1, 2, 2, 1, 1, 1, 2,
            -1,
            -17 -- 3*2 + 2*1 + 2 + 2 + 1 + 1 + 1 + 2 = 17 (Irrelevante)
        ),
        (
            v_project_id,
            'Socioeconómico y Cultural',
            'Comunidades y Empleo',
            'Generación de empleo calificado directo para creadores y equipo técnico',
            4, 2, 4, 2, 2, 2, 4, 4,
            1,
            34 -- 3*4 + 2*2 + 4 + 2 + 2 + 2 + 4 + 4 = 34 (Moderado Beneficioso)
        );

    -- 12. Seed Default Baseline Scenario
    DELETE FROM public.scenarios WHERE project_id = v_project_id;
    INSERT INTO public.scenarios (project_id, name, variable_overrides, result_cache)
    VALUES (
        v_project_id,
        'Escenario Base (Jorge Orozco Modelo Oficial)',
        '{"discountRate": 0.10, "salesGrowth": 0.10, "taxRate": 0.32}'::JSONB,
        '{"irr": 0.731163, "irrPercentage": 73.12, "npv": 81442455.82, "status": "VIABLE"}'::JSONB
    );

END $$;
