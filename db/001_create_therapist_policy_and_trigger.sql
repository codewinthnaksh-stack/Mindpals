-- 001_create_therapist_policy_and_trigger.sql
-- Complete RLS setup and trigger for therapist connection requests
-- Run this in Supabase SQL editor (or psql as a privileged user).

-- ============================================================================
-- 1. THERAPISTS TABLE: Enable RLS and set policies
-- ============================================================================
ALTER TABLE IF EXISTS public.therapists ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to INSERT a therapist row only for themselves
DROP POLICY IF EXISTS allow_therapist_self_insert ON public.therapists;
CREATE POLICY allow_therapist_self_insert ON public.therapists
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow anyone to SELECT all therapists (public list)
DROP POLICY IF EXISTS allow_select_therapists ON public.therapists;
CREATE POLICY allow_select_therapists ON public.therapists
  FOR SELECT
  TO public
  USING (true);

-- ============================================================================
-- 2. THERAPIST_REQUESTS TABLE: Enable RLS and set policies
-- ============================================================================
ALTER TABLE IF EXISTS public.therapist_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to INSERT requests (send a connection request)
-- User must be sending from their own auth ID
DROP POLICY IF EXISTS allow_insert_therapist_requests ON public.therapist_requests;
CREATE POLICY allow_insert_therapist_requests ON public.therapist_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to SELECT their own sent requests
DROP POLICY IF EXISTS allow_select_own_requests_users ON public.therapist_requests;
CREATE POLICY allow_select_own_requests_users ON public.therapist_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow therapists to SELECT requests sent to them
DROP POLICY IF EXISTS allow_select_requests_for_therapist ON public.therapist_requests;
CREATE POLICY allow_select_requests_for_therapist ON public.therapist_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = therapist_id);

-- Allow therapists to UPDATE request status (accept/reject)
DROP POLICY IF EXISTS allow_update_request_status ON public.therapist_requests;
CREATE POLICY allow_update_request_status ON public.therapist_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = therapist_id)
  WITH CHECK (auth.uid() = therapist_id);

-- ============================================================================
-- 3. USERS TABLE: Ensure basic SELECT access for joins
-- ============================================================================
-- Note: Auth adds a default policy. If users can't be joined, enable/check this:
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to SELECT users (needed for therapist_requests -> users join)
DROP POLICY IF EXISTS allow_public_select_users ON public.users;
CREATE POLICY allow_public_select_users ON public.users
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can SELECT their own row
DROP POLICY IF EXISTS allow_select_own_user ON public.users;
CREATE POLICY allow_select_own_user ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- ============================================================================
-- 4. TRIGGER: Auto-create therapists row when profile is inserted as therapist
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_therapist_from_profile()
RETURNS trigger AS $$
BEGIN
  -- Only act when profile is a therapist
  IF NEW.user_type IS NOT NULL AND LOWER(NEW.user_type) = 'therapist' THEN
    -- Try to insert a therapist row with matching id; ignore if already exists
    INSERT INTO public.therapists (
      id,
      name,
      specialization,
      experience,
      description,
      languages,
      response_time,
      price,
      rating,
      created_at
    )
    VALUES (
      NEW.id,
      NEW.name,
      COALESCE(NEW.specialization, NULL),
      COALESCE(NEW.experience_years, NULL),
      COALESCE(NEW.bio, NULL),
      -- If profiles.languages is jsonb array, try to cast; otherwise use as-is
      CASE
        WHEN pg_typeof(NEW.languages)::text = 'jsonb' THEN (
          SELECT array_agg(value) FROM (
            SELECT jsonb_array_elements_text(NEW.languages) as value
          ) sub
        )
        ELSE NEW.languages
      END,
      COALESCE(NEW.response_time_label, NULL),
      NULL, -- price not present in profiles by default
      COALESCE(NEW.rating, 5),
      NOW()
    ) ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create/replace trigger on profiles after insert
DROP TRIGGER IF EXISTS trg_create_therapist_from_profile ON public.profiles;
CREATE TRIGGER trg_create_therapist_from_profile
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_therapist_from_profile();

-- ============================================================================
-- TEST & VERIFICATION
-- ============================================================================
-- After running this SQL, test by:
-- 1) User sends connection request (INSERT into therapist_requests)
-- 2) Therapist logs in and opens dashboard
-- 3) Therapist should see the pending request (SELECT from therapist_requests filtered by therapist_id)
-- 4) Check browser console for any remaining 400/403 errors
-- ============================================================================
