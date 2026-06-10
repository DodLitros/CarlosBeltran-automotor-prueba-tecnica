# SegurosPro - Sistema de Gestión de Pólizas

Sistema SaaS para agentes de seguros que permite mantener un seguimiento efectivo del vencimiento de pólizas de clientes. Diseñado para el mercado colombiano, con enfoque en la ventana crítica de 30 días para renovación de pólizas automotrices.

## Descripción

SegurosPro es una aplicación web que ayuda a los agentes de seguros a gestionar su cartera de clientes y pólizas de manera eficiente. El sistema notifica automáticamente sobre pólizas próximas a vencer y permite realizar un seguimiento detallado del estado de cada póliza, facilitando la gestión de renovaciones y el mantenimiento de relaciones con clientes.

### Contexto Regulatorio

En Colombia, una póliza de auto vencida puede ser renovada por el mismo intermediario dentro de los 30 días siguientes a la fecha de vencimiento sin que el cliente pierda historial ni la aseguradora trate la operación como una nueva contratación. Después de esos 30 días, la renovación se considera nueva contratación y el asesor compite con cualquier otro intermediario.

Esta ventana de 30 días es crítica para el negocio del asesor. Una póliza vencida hace 5 días no es lo mismo que una vencida hace 35.

## Características Principales

### Gestión de Clientes y Pólizas

- **Tabla completa de pólizas**: Visualización de todas las pólizas del agente con información detallada del cliente, tipo de póliza, aseguradora, fechas, precios y notas
- **Búsqueda avanzada**: Filtros por nombre, documento, teléfono, tipo de póliza o aseguradora
- **Ordenamiento por columnas**: Click en cualquier encabezado para ordenar ascendente/descendente
- **Creación de clientes**: Formulario completo para agregar nuevos clientes con su primera póliza

### Seguimiento de Vencimientos

- **Vista de pólizas por vencer**: Tabla especializada que muestra solo pólizas a 30 días o menos de vencer, o ya vencidas
- **Filtros de tiempo**: 
  - Menos de 30 días para vencimiento
  - Menos de 15 días para vencimiento
  - Menos de 5 días para vencimiento
  - Vencida hace 5 días o más
  - Vencida hace 20 días o más
- **Códigos de color visuales**:
  - Verde: Pólizas vigentes (más de 30 días)
  - Amarillo/Naranja: Pólizas por vencer (30 días o menos)
  - Rojo: Pólizas vencidas

### Sistema de Notificaciones

- **Campana de notificaciones**: Indicador visual con contador de pólizas próximas a vencer
- **Acceso rápido**: Click en la campana redirige directamente a la vista de pólizas por vencer
- **Actualización en tiempo real**: El contador se actualiza automáticamente al realizar cambios

### Gestión de Estados

- **Estados de póliza**:
  - Vigente
  - Por vencer
  - Vencida
  - En gestión
- **Edición de notas**: Campo editable para que el agente registre observaciones y seguimiento
- **Cambio de estado**: Dropdown para actualizar el estado de pólizas desde la vista de vencimientos

### Perfil del Cliente

- **Vista detallada**: Información completa del cliente incluyendo tiempo como cliente
- **Historial de pólizas**: Todas las pólizas del cliente con sus estados actuales
- **Edición de datos**: Posibilidad de actualizar información del cliente
- **Agregar pólizas**: Crear nuevas pólizas para clientes existentes

### Renovación de Pólizas

- **Botón de renovación**: Disponible en el perfil del cliente para cada póliza
- **Validación de 30 días**: Solo se puede renovar si la póliza no está vencida por más de 30 días
- **Modal de renovación**:
  - Fecha de vencimiento por defecto calculada automáticamente (misma duración que la póliza original)
  - Opción de ajustar fecha y precio
  - Historial completo de renovaciones anteriores
- **Actualización automática**: Al renovar, la póliza vuelve a estado "vigente"

### Restricciones Inteligentes

- **Estado "En gestión"**: Solo disponible si la póliza no está vencida por más de 30 días
- **Renovación bloqueada**: Botón deshabilitado con tooltip explicativo cuando han pasado más de 30 días
- **Validaciones en tiempo real**: Mensajes claros sobre por qué ciertas acciones no están disponibles

## Casos de Uso

### 1. Agente Revisando su Cartera Diariamente

**Escenario**: Un agente inicia su día y necesita revisar qué pólizas requieren atención.

**Flujo**:
1. Ingresa su ID de agente (1, 2 o 3)
2. Ve inmediatamente el contador en la campana de notificaciones
3. Hace click en la campana o en "Por vencer"
4. Revisa la lista de pólizas próximas a vencer, ordenadas por urgencia
5. Filtra por "Menos de 5 días" para priorizar las más urgentes
6. Edita notas y cambia estados a "En gestión" para las que ya contactó

### 2. Contacto Proactivo con Clientes

**Escenario**: Un agente identifica pólizas a punto de vencer y contacta a los clientes.

**Flujo**:
1. Navega a "Por vencer"
2. Filtra por "Menos de 15 días"
3. Hace click en una póliza para ver el perfil del cliente
4. Obtiene el teléfono del cliente
5. Contacta al cliente y negocia la renovación
6. Agrega nota: "Cliente interesado en renovar, enviar cotización"
7. Cambia estado a "En gestión"

### 3. Renovación Exitosa de Póliza

**Escenario**: Después de contactar al cliente, se acuerda la renovación.

**Flujo**:
1. Desde el perfil del cliente, hace click en "Renovar" en la póliza correspondiente
2. El modal muestra la información actual y el historial de renovaciones
3. Ajusta el precio si es necesario (ej: aumento del 5%)
4. Confirma la fecha de vencimiento (por defecto, un año después)
5. Hace click en "Confirmar renovación"
6. El sistema registra la renovación en el historial y actualiza la póliza a "vigente"

### 4. Nuevo Cliente con Primera Póliza

**Escenario**: Un agente consigue un nuevo cliente y necesita registrar su primera póliza.

**Flujo**:
1. En "Todas las pólizas", hace click en "+ Nuevo cliente"
2. Completa el formulario con datos del cliente (nombre, documento, teléfono)
3. Selecciona tipo de póliza (Automóvil, Moto, Hogar, Vida, Salud)
4. Selecciona aseguradora de la lista predefinida
5. Ingresa fechas de inicio y vencimiento
6. Ingresa el precio de la póliza
7. Agrega notas iniciales si es necesario
8. Hace click en "Crear cliente y póliza"

### 5. Cliente Existente con Nueva Póliza

**Escenario**: Un cliente actual adquiere una póliza adicional (ej: tenía auto, ahora agrega moto).

**Flujo**:
1. Busca el cliente en "Todas las pólizas"
2. Hace click en el nombre para ver su perfil
3. Hace click en "+ Nueva póliza"
4. Completa el formulario de la nueva póliza
5. El sistema agrega la póliza al perfil del cliente
6. Ambas pólizas aparecen en el historial del cliente

### 6. Póliza Vencida por Más de 30 Días

**Escenario**: Un agente descubre una póliza que venció hace 40 días.

**Flujo**:
1. Ve la póliza en rojo en la tabla de "Por vencer"
2. Intenta cambiar el estado a "En gestión" pero el dropdown muestra "(No disponible)"
3. Intenta hacer click en "Renovar" pero el botón está deshabilitado
4. El tooltip indica: "No se puede renovar: vencida por más de 30 días"
5. El agente entiende que debe tratar esto como una nueva contratación y competir con otros intermediarios

### 7. Búsqueda y Filtrado de Información

**Escenario**: Un agente necesita encontrar información específica sobre un cliente.

**Flujo**:
1. En "Todas las pólizas", usa el buscador
2. Escribe parte del nombre, documento o teléfono
3. Los resultados se filtran en tiempo real
4. Hace click en una columna (ej: "Vencimiento") para ordenar por fecha
5. Hace click nuevamente para invertir el orden

### 8. Revisión de Historial de Renovaciones

**Escenario**: Un agente necesita verificar cuántas veces se ha renovado una póliza.

**Flujo**:
1. Navega al perfil del cliente
2. Hace click en "Renovar" en una póliza
3. El modal muestra el historial completo de renovaciones
4. Ve fechas, precios anteriores y actuales de cada renovación
5. Puede analizar patrones de renovación del cliente

## Tecnologías Utilizadas

### Frontend

- **React 19**: Biblioteca de UI con hooks modernos
- **TypeScript**: Tipado estricto para mayor robustez
- **Vite**: Build tool rápido y moderno
- **React Router DOM**: Navegación entre vistas
- **CSS puro**: Estilos personalizados sin frameworks

### Backend y Base de Datos

- **Supabase**: Backend as a Service
  - PostgreSQL como base de datos
  - Row Level Security (RLS) para control de acceso
  - API REST automática
  - Autenticación simplificada

### Testing

- **Playwright**: Testing end-to-end
- **TypeScript**: Tipado estricto en tests

### Despliegue

- **Vercel**: Hosting y despliegue automático
- **GitHub**: Control de versiones

## Estructura del Proyecto

```
CarlosBeltran-automotor-prueba-tecnica/
├── Carlos_Beltrán_Pardo/          # Documentación del desarrollo
│   ├── spec.md                    # Especificaciones técnicas
│   ├── code_review.md             # Revisión de código
│   └── ai_history.md              # Historial de interacciones con IA
├── src/
│   ├── components/                # Componentes reutilizables
│   │   ├── Layout.tsx             # Layout principal con navegación
│   │   ├── NotificationBell.tsx   # Campana de notificaciones
│   │   ├── SearchBar.tsx          # Barra de búsqueda
│   │   ├── SortableHeader.tsx     # Encabezado ordenable
│   │   ├── CreateClientModal.tsx  # Modal crear cliente
│   │   ├── CreatePolicyModal.tsx  # Modal crear póliza
│   │   └── RenewPolicyModal.tsx   # Modal renovar póliza
│   ├── context/                   # Context API
│   │   ├── AuthContext.tsx        # Autenticación
│   │   └── NotificationContext.tsx # Notificaciones
│   ├── hooks/                     # Custom hooks
│   │   ├── useSearch.ts           # Búsqueda
│   │   └── useSort.ts             # Ordenamiento
│   ├── lib/                       # Utilidades
│   │   ├── supabase.ts            # Cliente Supabase
│   │   ├── utils.ts               # Funciones helper
│   │   └── sortHelpers.ts         # Helpers de ordenamiento
│   ├── pages/                     # Páginas principales
│   │   ├── LoginPage.tsx          # Login por ID de agente
│   │   ├── AllPoliciesPage.tsx    # Todas las pólizas
│   │   ├── ExpiringPoliciesPage.tsx # Pólizas por vencer
│   │   └── ClientProfilePage.tsx  # Perfil del cliente
│   ├── services/                  # Servicios de API
│   │   ├── agentService.ts        # Agentes
│   │   ├── clientService.ts       # Clientes
│   │   ├── policyService.ts       # Pólizas
│   │   ├── insurerService.ts      # Aseguradoras
│   │   └── renewalService.ts      # Renovaciones
│   ├── styles/
│   │   └── global.css             # Estilos globales
│   ├── types/                     # Tipos TypeScript
│   │   ├── database.ts            # Tipos de base de datos
│   │   └── index.ts               # Tipos de aplicación
│   ├── constants/
│   │   └── index.ts               # Constantes
│   ├── App.tsx                    # Componente raíz
│   └── main.tsx                   # Entry point
├── supabase/
│   ├── migrations/                # Migraciones de BD
│   │   ├── 001_create_insurance_schema.sql
│   │   ├── 002_add_insurers_and_policy_type_enum.sql
│   │   └── 003_add_policy_renewals.sql
│   └── seed.sql                   # Datos de ejemplo
├── tests/
│   └── app.spec.ts                # Tests de Playwright
├── public/                        # Assets públicos
├── .env                           # Variables de entorno
├── .env.example                   # Ejemplo de variables
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
└── vercel.json                    # Configuración Vercel
```

## Base de Datos

### Tablas Principales

#### agents
Almacena información de los agentes de seguros.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | ID único del agente |
| full_name | TEXT | Nombre completo |
| email | TEXT | Email (opcional) |
| phone | TEXT | Teléfono (opcional) |
| created_at | TIMESTAMPTZ | Fecha de creación |

#### insurance_clients
Almacena información de los clientes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único del cliente |
| agent_id | INTEGER | FK a agents |
| full_name | TEXT | Nombre completo |
| document_id | TEXT | Documento de identidad |
| phone | TEXT | Teléfono |
| created_at | TIMESTAMPTZ | Fecha de creación |

#### policies
Almacena las pólizas de seguros.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único de la póliza |
| client_id | UUID | FK a insurance_clients |
| agent_id | INTEGER | FK a agents |
| policy_type | ENUM | Tipo de póliza (Automóvil, Moto, Hogar, Vida, Salud) |
| insurer | TEXT | Nombre de la aseguradora |
| insurer_id | UUID | FK a insurers |
| start_date | DATE | Fecha de inicio |
| expiration_date | DATE | Fecha de vencimiento |
| price | NUMERIC | Precio en COP |
| status | TEXT | Estado (vigente, por_vencer, vencida, en_gestion) |
| notes | TEXT | Notas del agente |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Fecha de última actualización |

#### insurers
Catálogo de aseguradoras disponibles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| name | TEXT | Nombre de la aseguradora |
| code | TEXT | Código único |
| is_active | BOOLEAN | Si está activa |
| created_at | TIMESTAMPTZ | Fecha de creación |

#### policy_renewals
Historial de renovaciones de pólizas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| policy_id | UUID | FK a policies |
| previous_expiration_date | DATE | Fecha de vencimiento anterior |
| new_expiration_date | DATE | Nueva fecha de vencimiento |
| previous_price | NUMERIC | Precio anterior |
| new_price | NUMERIC | Nuevo precio |
| renewed_at | TIMESTAMPTZ | Fecha de renovación |
| renewed_by | INTEGER | FK a agents (quién renovó) |

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas que permiten:
- Lectura pública para la demo
- Inserción, actualización y eliminación controladas
- Filtrado por agent_id para aislar datos entre agentes

## Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase
- Cuenta en Vercel (para despliegue)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/DodLitros/CarlosBeltran-automotor-prueba-tecnica.git
cd CarlosBeltran-automotor-prueba-tecnica
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` basado en `.env.example`:
```env
VITE_SUPABASE_URL=tu-supabase-url
VITE_SUPABASE_ANON_KEY=tu-supabase-anon-key
```

4. **Configurar Supabase**

```bash
# Vincular proyecto
npx supabase link --project-ref tu-project-ref

# Aplicar migraciones
npx supabase db push

# (Opcional) Cargar datos de ejemplo
npx supabase db query --linked --file supabase/seed.sql
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Agentes de Prueba

El sistema incluye 3 agentes de prueba:
- **ID 1**: Carlos Beltrán
- **ID 2**: María López
- **ID 3**: Andrés Gómez

Cada agente tiene 100 clientes con aproximadamente 2 pólizas cada uno.

## Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Build para producción
npm run preview          # Preview del build

# Calidad de código
npm run lint             # Ejecutar ESLint
npm run typecheck        # Verificar tipos TypeScript

# Testing
npm test                 # Ejecutar tests de Playwright
npm run test:ui          # Ejecutar tests con UI

# Base de datos
npx supabase db push     # Aplicar migraciones
npx supabase db pull     # Descargar esquema
npx supabase db reset    # Resetear base de datos local
```

## Despliegue en Vercel

1. **Conectar repositorio a Vercel**
   - Importar proyecto desde GitHub
   - Seleccionar el repositorio

2. **Configurar variables de entorno**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Desplegar**
   - Vercel detectará automáticamente que es un proyecto Vite
   - El despliegue se realizará automáticamente

4. **Configurar rewrites**
   - El archivo `vercel.json` ya está configurado para manejar el enrutamiento del SPA

## Diseño y UX

### Principios de Diseño

- **Minimalista**: Interfaz limpia sin distracciones
- **Profesional**: Adecuado para uso empresarial
- **Responsive**: Funciona en desktop, tablet y móvil
- **Accesible**: Cumple con estándares WCAG AA
- **Modo oscuro**: Soporte completo para tema oscuro

### Paleta de Colores

- **Primario**: Azul (#4263eb) - Acciones principales
- **Éxito**: Verde (#2b8a3e) - Pólizas vigentes
- **Advertencia**: Naranja (#e67700) - Pólizas por vencer
- **Peligro**: Rojo (#c92a2a) - Pólizas vencidas
- **Neutros**: Grises para texto y fondos

### Tipografía

- **Sans-serif**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- **Monospace**: "SF Mono", "Fira Code" para precios y datos numéricos

## Características Técnicas Destacadas

### Context API para Estado Global
- `AuthContext`: Manejo de autenticación del agente
- `NotificationContext`: Contador de pólizas por vencer compartido en toda la aplicación

### Custom Hooks
- `useSearch`: Lógica de búsqueda reutilizable
- `useSort`: Lógica de ordenamiento con estado

### Servicios de API
Capa de abstracción sobre Supabase para:
- Facilitar testing
- Centralizar lógica de negocio
- Manejar errores consistentemente

### Tipos TypeScript Estrictos
- Tipos generados desde el esquema de Supabase
- Tipado estricto en todo el proyecto
- Interfaces claras para props y estados

### CSS Variables
- Sistema de temas con variables CSS
- Soporte completo para modo oscuro
- Fácil personalización

## Roadmap Futuro

### Funcionalidades Planificadas

- [ ] Notificaciones push en tiempo real
- [ ] Exportación de reportes a Excel/PDF
- [ ] Dashboard con métricas y gráficos
- [ ] Sistema de recordatorios automáticos por email/SMS
- [ ] Integración con WhatsApp Business API
- [ ] Modo offline con sincronización
- [ ] App móvil nativa (React Native)
- [ ] Multi-idioma (inglés/portugués)
- [ ] Sistema de comisiones y pagos
- [ ] Integración con APIs de aseguradoras

### Mejoras Técnicas

- [ ] Implementar autenticación completa con Supabase Auth
- [ ] Agregar más tests unitarios y de integración
- [ ] Implementar caching con React Query
- [ ] Optimizar rendimiento con virtualización de tablas grandes
- [ ] Agregar analytics y tracking de eventos
- [ ] Implementar CI/CD completo con GitHub Actions

## Contribución

Este es un proyecto de prueba técnica. Para contribuir:

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## Licencia

Este proyecto fue desarrollado como prueba técnica para Carlos Beltrán Automotor.

## Contacto

Para preguntas o soporte:
- GitHub: [@DodLitros](https://github.com/DodLitros)
- Repositorio: [CarlosBeltran-automotor-prueba-tecnica](https://github.com/DodLitros/CarlosBeltran-automotor-prueba-tecnica)

## Agradecimientos

- **Supabase**: Por proporcionar una plataforma backend robusta y fácil de usar
- **Vercel**: Por el hosting y despliegue simplificado
- **Comunidad React**: Por las excelentes herramientas y patrones de diseño

---

**Desarrollado con ❤️ usando React, TypeScript y Supabase**
