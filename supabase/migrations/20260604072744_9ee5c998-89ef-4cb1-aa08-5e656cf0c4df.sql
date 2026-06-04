DROP POLICY "Anyone can insert location pings" ON public.user_locations;

CREATE POLICY "Insert valid location pings"
  ON public.user_locations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(session_id) BETWEEN 8 AND 128
    AND latitude BETWEEN -90 AND 90
    AND longitude BETWEEN -180 AND 180
  );