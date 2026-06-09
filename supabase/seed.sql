-- Agentes de prueba
INSERT INTO public.agents (id, full_name, email, phone) VALUES
(1, 'Carlos Beltrán', 'carlos.beltran@seguros.com', '3001234567'),
(2, 'María López', 'maria.lopez@seguros.com', '3102345678'),
(3, 'Andrés Gómez', 'andres.gomez@seguros.com', '3203456789')
ON CONFLICT (id) DO NOTHING;

-- Seed data: 300 clientes con pólizas
DO $$
DECLARE
  v_client_id UUID;
  v_first_names TEXT[] := ARRAY['Juan','María','Carlos','Ana','Pedro','Laura','José','Sofía','Diego','Valentina','Andrés','Camila','Felipe','Isabella','Santiago','Mariana','Sebastián','Daniela','Nicolás','Gabriela','Alejandro','Paula','Mateo','Luciana','Samuel','Natalia','David','Sara','Esteban','Mariana','Ricardo','Catalina','Fernando','Andrea','Miguel','Juliana','Rafael','Carolina','Eduardo','Manuela','Javier','Valeria','Gustavo','Lina','Roberto','Tatiana','Hernán','Adriana','Óscar','Claudia','Ramón','Patricia','Luis','Diana','Jorge','Mónica','Alberto','Beatriz','Raúl','Pilar','Tomás','Cristina','Pablo','Alejandra','Sergio','Viviana','Hugo','Rosa','Iván','Teresa','Mario','Gloria','César','Elena','Armando','Silvia','Leonardo','Marta','Arturo','Olga','Rodrigo','Lucía','Ernesto','Amparo','Guillermo','Esperanza','Gonzalo','Yolanda','Álvaro','Nidia','Fabián','Francy','Cristian','Liliana','Edwin','Nancy','Jhon','Leidy','Brayan','Karen'];
  v_last_names TEXT[] := ARRAY['García','Rodríguez','Martínez','López','González','Hernández','Pérez','Sánchez','Ramírez','Torres','Flores','Rivera','Gómez','Díaz','Cruz','Morales','Reyes','Gutiérrez','Ortiz','Ramos','Vargas','Castro','Romero','Jiménez','Ruiz','Álvarez','Mendoza','Aguilar','Medina','Domínguez','Guerrero','Herrera','Vega','Cárdenas','Cortés','Bernal','Suárez','Navarro','Molina','Caballero','Rojas','Mejía','Ospina','Vásquez','Ríos','Acosta','Delgado','Moreno','Muñoz','Carvajal','Zapata','Marín','Giraldo','Aristizábal','Bedoya','Salazar','Vélez','Henao','Londoño','Restrepo','Gallego','Montoya','Echeverri','Orozco','Castano','Quintero','Toro','Valencia','Castaño','Serna','Alzate','Correa','Cano','Aguirre','Osorio','Franco','Duque','Escobar','Velásquez','Parra','Sandoval','Buitrago','Céspedes','Pineda','Peña','Lozano','Contreras','Pacheco','Carrillo','Fonseca','Calderón','Salgado','Patiño','Miranda','Rincón','Bermúdez','Cortés','Sierra','Camacho','Granados','Barrera'];
  v_policy_types TEXT[] := ARRAY['Automóvil','Moto','Hogar','Vida','Salud'];
  v_insurers TEXT[] := ARRAY['Sura','Bolívar','Liberty','Mapfre','Allianz','AXA Colpatria','HDI','Seguros del Estado','Previsora','Positiva'];
  v_first TEXT;
  v_last TEXT;
  v_doc TEXT;
  v_phone TEXT;
  v_start DATE;
  v_exp DATE;
  v_price NUMERIC;
  v_status TEXT;
  v_type TEXT;
  v_insurer TEXT;
  v_notes TEXT[] := ARRAY['Cliente fiel, siempre renueva a tiempo','Pendiente de llamar para ofrecer mejora de plan','Cliente nuevo, primera póliza','Prefiere contacto por WhatsApp','Solicitar cotización de póliza adicional','Revisar cobertura antes del vencimiento','Cliente referido por otro asegurado','Interesado en cambiar de aseguradora','Confirmar dirección actualizada','Pendiente envío de documentos renovados','Buen pagador, sin siniestros','Tuvo siniestro leve el año pasado','Solicita descuento por fidelidad','Evaluar aumento de cobertura','Cliente corporativo - flota de 3 vehículos'];
  i INTEGER;
  j INTEGER;
  v_agent_id INTEGER;
BEGIN
  FOR v_agent_id IN 1..3 LOOP
    FOR i IN 1..100 LOOP
      v_first := v_first_names[1 + floor(random() * array_length(v_first_names, 1))::int];
      v_last := v_last_names[1 + floor(random() * array_length(v_last_names, 1))::int] || ' ' || v_last_names[1 + floor(random() * array_length(v_last_names, 1))::int];
      v_doc := (1000000000 + floor(random() * 200000000))::text;
      v_phone := '3' || lpad((floor(random() * 100000000))::text, 9, '0');
      
      INSERT INTO public.insurance_clients (agent_id, full_name, document_id, phone)
      VALUES (v_agent_id, v_first || ' ' || v_last, v_doc, v_phone)
      RETURNING id INTO v_client_id;
      
      FOR j IN 1..(1 + floor(random() * 3)::int) LOOP
        v_type := v_policy_types[1 + floor(random() * array_length(v_policy_types, 1))::int];
        v_insurer := v_insurers[1 + floor(random() * array_length(v_insurers, 1))::int];
        
        IF random() < 0.30 THEN
          v_start := CURRENT_DATE - (365 + floor(random() * 365))::int;
          v_exp := CURRENT_DATE + (31 + floor(random() * 335))::int;
          v_status := 'vigente';
        ELSIF random() < 0.55 THEN
          v_start := CURRENT_DATE - (335 + floor(random() * 30))::int;
          v_exp := CURRENT_DATE + (1 + floor(random() * 30))::int;
          v_status := 'por_vencer';
        ELSIF random() < 0.75 THEN
          v_start := CURRENT_DATE - (365 + floor(random() * 30))::int;
          v_exp := CURRENT_DATE - (1 + floor(random() * 5))::int;
          v_status := 'vencida';
        ELSE
          v_start := CURRENT_DATE - (365 + floor(random() * 60))::int;
          v_exp := CURRENT_DATE - (6 + floor(random() * 55))::int;
          v_status := 'vencida';
        END IF;
        
        v_price := (500000 + floor(random() * 4500000))::numeric;
        v_price := round(v_price / 1000) * 1000;
        
        INSERT INTO public.policies (client_id, agent_id, policy_type, insurer, start_date, expiration_date, price, status, notes)
        VALUES (
          v_client_id, v_agent_id, v_type, v_insurer, v_start, v_exp, v_price, v_status,
          CASE WHEN random() < 0.4 THEN v_notes[1 + floor(random() * array_length(v_notes, 1))::int] ELSE '' END
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
