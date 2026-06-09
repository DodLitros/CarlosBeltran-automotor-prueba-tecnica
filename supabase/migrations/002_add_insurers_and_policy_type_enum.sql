-- Recargar caché de PostgREST
NOTIFY pgrst, 'reload schema';

-- Crear enum para tipos de póliza
CREATE TYPE policy_type_enum AS ENUM (
  'Automóvil',
  'Moto',
  'Hogar',
  'Vida',
  'Salud'
);

-- Crear tabla de aseguradoras
CREATE TABLE IF NOT EXISTS public.insurers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar aseguradoras predefinidas
INSERT INTO public.insurers (name, code) VALUES
('Sura', 'SURA'),
('Bolívar', 'BOLIVAR'),
('Liberty', 'LIBERTY'),
('Mapfre', 'MAPFRE'),
('Allianz', 'ALLIANZ'),
('AXA Colpatria', 'AXA'),
('HDI', 'HDI'),
('Seguros del Estado', 'ESTADO'),
('Previsora', 'PREVISORA'),
('Positiva', 'POSITIVA')
ON CONFLICT (name) DO NOTHING;

-- RLS para insurers
ALTER TABLE public.insurers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insurers_select" ON public.insurers FOR SELECT USING (true);

-- Modificar policies para usar enum y FK a insurers
ALTER TABLE public.policies 
  ALTER COLUMN policy_type TYPE policy_type_enum 
  USING policy_type::policy_type_enum;

-- Agregar columna insurer_id y FK (opcional, mantener insurer text para compatibilidad)
ALTER TABLE public.policies 
  ADD COLUMN IF NOT EXISTS insurer_id UUID REFERENCES public.insurers(id);

-- Actualizar insurer_id basado en el nombre
UPDATE public.policies p
SET insurer_id = i.id
FROM public.insurers i
WHERE p.insurer = i.name;

-- Índice para insurer_id
CREATE INDEX IF NOT EXISTS idx_policies_insurer_id ON public.policies(insurer_id);

COMMENT ON TABLE public.insurers IS 'Catálogo de aseguradoras disponibles';
COMMENT ON COLUMN public.policies.policy_type IS 'Tipo de póliza (enum)';
COMMENT ON COLUMN public.policies.insurer_id IS 'Referencia a la aseguradora';

-- Recargar caché nuevamente
NOTIFY pgrst, 'reload schema';
