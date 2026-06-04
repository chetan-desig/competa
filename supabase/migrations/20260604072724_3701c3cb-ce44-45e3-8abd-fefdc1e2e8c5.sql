CREATE TABLE public.user_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID NULL,
  role TEXT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION NULL,
  user_agent TEXT NULL,
  city TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.user_locations TO anon, authenticated;
GRANT ALL ON public.user_locations TO service_role;

ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert location pings"
  ON public.user_locations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX idx_user_locations_session ON public.user_locations(session_id);
CREATE INDEX idx_user_locations_created_at ON public.user_locations(created_at DESC);