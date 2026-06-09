-- Tabla de agentes/asesores
CREATE TABLE IF NOT EXISTS public.agents (
  id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de clientes de seguros
CREATE TABLE IF NOT EXISTS public.insurance_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id INTEGER NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  document_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pólizas
CREATE TABLE IF NOT EXISTS public.policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.insurance_clients(id) ON DELETE CASCADE,
  agent_id INTEGER NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  policy_type TEXT NOT NULL,
  insurer TEXT NOT NULL,
  start_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'vigente' CHECK (status IN ('vigente', 'por_vencer', 'vencida', 'en_gestion')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_insurance_clients_agent_id ON public.insurance_clients(agent_id);
CREATE INDEX IF NOT EXISTS idx_policies_agent_id ON public.policies(agent_id);
CREATE INDEX IF NOT EXISTS idx_policies_client_id ON public.policies(client_id);
CREATE INDEX IF NOT EXISTS idx_policies_expiration_date ON public.policies(expiration_date);
CREATE INDEX IF NOT EXISTS idx_policies_status ON public.policies(status);

-- Comentarios
COMMENT ON TABLE public.agents IS 'Agentes/asesores de seguros';
COMMENT ON TABLE public.insurance_clients IS 'Clientes de seguros asignados a un agente';
COMMENT ON TABLE public.policies IS 'Pólizas de seguros de los clientes';

-- RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agents_select_all" ON public.agents FOR SELECT USING (true);

CREATE POLICY "insurance_clients_select" ON public.insurance_clients FOR SELECT USING (true);
CREATE POLICY "insurance_clients_insert" ON public.insurance_clients FOR INSERT WITH CHECK (true);
CREATE POLICY "insurance_clients_update" ON public.insurance_clients FOR UPDATE USING (true);
CREATE POLICY "insurance_clients_delete" ON public.insurance_clients FOR DELETE USING (true);

CREATE POLICY "policies_select" ON public.policies FOR SELECT USING (true);
CREATE POLICY "policies_insert" ON public.policies FOR INSERT WITH CHECK (true);
CREATE POLICY "policies_update" ON public.policies FOR UPDATE USING (true);
CREATE POLICY "policies_delete" ON public.policies FOR DELETE USING (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_policies_updated_at
  BEFORE UPDATE ON public.policies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
