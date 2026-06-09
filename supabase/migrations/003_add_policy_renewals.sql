CREATE TABLE IF NOT EXISTS public.policy_renewals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  previous_expiration_date DATE NOT NULL,
  new_expiration_date DATE NOT NULL,
  previous_price NUMERIC(15, 2) NOT NULL,
  new_price NUMERIC(15, 2) NOT NULL,
  renewed_at TIMESTAMPTZ DEFAULT NOW(),
  renewed_by INTEGER REFERENCES public.agents(id)
);

CREATE INDEX IF NOT EXISTS idx_policy_renewals_policy_id ON public.policy_renewals(policy_id);

ALTER TABLE public.policy_renewals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "policy_renewals_select" ON public.policy_renewals FOR SELECT USING (true);
CREATE POLICY "policy_renewals_insert" ON public.policy_renewals FOR INSERT WITH CHECK (true);

COMMENT ON TABLE public.policy_renewals IS 'Historial de renovaciones de pólizas';
