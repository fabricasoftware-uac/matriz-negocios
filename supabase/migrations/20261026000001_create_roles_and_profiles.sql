-- ==============================================================================
-- Migration: 20261026000001_create_roles_and_profiles.sql
-- Description: Define user roles, profiles table, auto-provisioning trigger,
--              and high-performance security definer helpers.
-- ==============================================================================

-- 1. Role Enum Definition
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('superadmin', 'admin', 'user', 'investor');
    END IF;
END $$;

-- 2. Utility Trigger Function to automatically keep updated_at in sync
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 3. Profiles Table Linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role public.user_role NOT NULL DEFAULT 'user'::public.user_role,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to maintain updated_at on profiles
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Trigger Function on auth.users for Automatic Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    assigned_role public.user_role := 'user'::public.user_role;
    meta_role TEXT;
BEGIN
    -- Extract role safely if passed in raw_user_meta_data
    meta_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', ''));
    IF meta_role IN ('superadmin', 'admin', 'user', 'investor') THEN
        assigned_role := meta_role::public.user_role;
    END IF;

    INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        assigned_role,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
        updated_at = NOW();

    RETURN NEW;
END;
$$;

-- Connect trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 5. High-Performance Helper Functions for Role Checking
-- Parameterized version (takes user_id uuid)
CREATE OR REPLACE FUNCTION public.is_superadmin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = user_id
          AND role = 'superadmin'::public.user_role
    );
$$;

-- Zero-argument overload version (infers auth.uid() automatically)
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.is_superadmin((SELECT auth.uid()));
$$;

-- Helper to check any role
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, required_role public.user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = user_id
          AND role = required_role
    );
$$;
