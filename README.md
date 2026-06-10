# ¿Cómo correrlo?

- Visitar esta página: [App link](https://carlos-beltran-automotor-prueba-tec.vercel.app/policies)
- Para ver la basede datos en supabase se envió un correo a rrhh@agentemotor.com, debe crear una cuenta en supabase, y posteriormente puede ver la aplicación backend. sin embargo, toda está bien listado en este repositori[Supabase project](https://mlehbjkbcgvcycmrquqw.supabase.co/)

---

## Tiempo tomado

- 1h de planeación
- 3h de implementación de código
- 2h documentación
- 1h creación del vídeo (intento/error)

---
## Vídeo

Link de explicación del vídeo: [Video YT](https://youtube.com/shorts/jLBID5KE2lA?si=8n4h44AQoP2aEkBx)

---

# Decisiones

## Lo que dejé afuera

- **Login**: decidí dejar afuera el login debido a que le pedí a la IA que me llenara las tablas directamente en la base de datos de Supabase como se puede ver en la carpeta './supabase/seed.sql', así que dejé que el agente se logeara con su ID. En este caso, usé el ID 1, 2, y 3 para no complicar la revisión de la prueba técnica. De igual manera, esta pensado para que luego implementar un ID más largo, y que sólo conozca el agente, además de usar posiblemente un PIN de su conocimiento para mayor seguridad.

- **Campana de notificaciones**: Dado que no existe una autenticación persé, las notificaciones no llegan a ningun lado, así que dejé que cada vez que el agente abriera la aplicación, se almacenara en el contexto de la app, usando el hook useContext de React, al iniciar enumerara las pólizas que están próximas a vencer. De esta manera podría ver al iniciar Que tiene notificaciones por revisar. Al darle click a la campana, aparecerán éstas.

- **CSS en vez de frameworks**: No quería atosigar con tantas clases a quien vea el código, así que decidí sólo usar CSS para que fuera más limpio de ver e interpretar.

# SegurosPro - Sistema de Gestión de Pólizas

Sistema SaaS para agentes de seguros que permite mantener un seguimiento efectivo del vencimiento de pólizas de clientes. Diseñado para el mercado colombiano, con enfoque en la ventana crítica de 30 días para renovación de pólizas automotrices.

## Descripción

SegurosPro es una aplicación web que ayuda a los agentes de seguros a gestionar su cartera de clientes y pólizas de manera eficiente. El sistema notifica cada vez que se entra a la aplicación, en forma de notificación con una campana sobre pólizas próximas a vencer y permite realizar un seguimiento detallado del estado de cada póliza, facilitando la gestión de renovaciones y el mantenimiento de relaciones con clientes.

---
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

---

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

- **Playwright**: Testing end-to-end, se corre con el comando 'npm test'
- **TypeScript**: Tipado estricto en tests

### Despliegue

- **Vercel**: Hosting y despliegue automático
- **GitHub**: Control de versiones

---

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

---

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

---

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

---

## Contribución

Este es un proyecto de prueba técnica. Para contribuir:

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

---
## Licencia

Este proyecto fue desarrollado como prueba técnica para Carlos Beltrán Automotor.

---
## Contacto

Para preguntas o soporte:
- Gmail: carlosbeltranpardo@gmail.com
- GitHub: [@DodLitros](https://github.com/DodLitros)
- Repositorio: [CarlosBeltran-automotor-prueba-tecnica](https://github.com/DodLitros/CarlosBeltran-automotor-prueba-tecnica)

**Desarrollado con ❤️ usando Opencode como agente de terminal**
