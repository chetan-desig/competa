-- Revoke any SELECT/UPDATE/DELETE access from public roles; keep INSERT only.
REVOKE SELECT, UPDATE, DELETE ON public.user_locations FROM anon, authenticated, PUBLIC;
GRANT INSERT ON public.user_locations TO anon, authenticated;
GRANT ALL ON public.user_locations TO service_role;

-- Add an explicit restrictive SELECT policy denying reads to anon/authenticated.
-- (service_role bypasses RLS.)
DROP POLICY IF EXISTS "No public reads of location data" ON public.user_locations;
CREATE POLICY "No public reads of location data"
  ON public.user_locations
  FOR SELECT
  TO anon, authenticated
  USING (false);

-- Also block UPDATE/DELETE explicitly at the policy layer.
DROP POLICY IF EXISTS "No public updates of location data" ON public.user_locations;
CREATE POLICY "No public updates of location data"
  ON public.user_locations
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "No public deletes of location data" ON public.user_locations;
CREATE POLICY "No public deletes of location data"
  ON public.user_locations
  FOR DELETE
  TO anon, authenticated
  USING (false);