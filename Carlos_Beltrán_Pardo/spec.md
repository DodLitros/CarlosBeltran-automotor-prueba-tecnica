# Mi analisis

## ¿Cómo entendí el problema?

Principalmente, noté que el hecho de buscar en un Excel que posiblemente sea muy basto, tendría que filtrar la información más importante, y que no saturara al agente con tanta información. En un principio, tenía pensado contar con columnas como, Nombre, Apellido, teléfono, tipo de póliza, vencimiento de póliza, tiempo con el agente, y número de reclamaciones de esa póliza. Quise que el agente pudiera filtrar la información así que pensé que ordenar las columnas con solo clickear el header de la columna, pudiese cambiar rápidamente el orden de sus clientes. 

La primera tabla, que contiene toda la información de sus clientes la pensé para todos sus clientes, y que pudiese visualizar la mayor información posible de sus clientes. Sin embargo, y aunque se pudiese filtrar la información por columnas pensé que sería más conveniente tener otra tab donde pudiese listar todos los clientes en riesgo de vencimiento. Como esta segunda tabla también contaba con la misma funcionalidad de ordenar las columnas, decidí también hacer unos filtros visibles donde pudiera listar, dependiendo de la urgencia de contactar al cliente. Es por eso que decidí darle varias opciones al agente, pudiendo filtrar entre las pólizas que están a menos de 30, 15 y 5 días antes del vencimiento de la póliza. Pero teniendo en cuenta que la póliza se puede renovar antes del cumplimiento de 30 días después del vencimiento, decidí que era importante también que el agente pudiese visualizar las pólizas vencidas con más de 5 días de vencimiento, y con 20 días de vencimiento para que pudiese renovarla en vez de perder el cliente.

---

# Decisiones

**github**: En el repositorio de github está todo commiteado correctamente, para ver cada cambio hecho, todo el desarrollo está documentado ahí. [repositorio](https://github.com/DodLitros/CarlosBeltran-automotor-prueba-tecnica)

## Lo que dejé afuera

- **Login**: decidí dejar afuera el login debido a que le pedí a la IA que me llenara las tablas directamente en la base de datos de Supabase como se puede ver en la carpeta './supabase/seed.sql', así que dejé que el agente se logeara con su ID. En este caso, usé el ID 1, 2, y 3 para no complicar la revisión de la prueba técnica. De igual manera, esta pensado para que luego implementar un ID más largo, y que sólo conozca el agente, además de usar posiblemente un PIN de su conocimiento para mayor seguridad.

- **Campana de notificaciones**: Dado que no existe una autenticación persé, las notificaciones no llegan a ningun lado, así que dejé que cada vez que el agente abriera la aplicación, se almacenara en el contexto de la app, usando el hook useContext de React, al iniciar enumerara las pólizas que están próximas a vencer. De esta manera podría ver al iniciar Que tiene notificaciones por revisar. Al darle click a la campana, aparecerán éstas.

- **CSS en vez de frameworks**: No quería atosigar con tantas clases a quien vea el código, así que decidí sólo usar CSS para que fuera más limpio de ver e interpretar.

- **Mock up**: Para visualizar mejor el flujo, pensé que no era necesario haber creado tantos clientes, pues la campana en este momento tiene más de 99 pólizas próximas a vencer.

---

# Si esto fuera a producción mañana, qué le falta ¿Qué cambiaría de este desarrollo?

- Haría el login
- Conectaría con una base de datos real
- Tendría en cuenta una realmente el precio de las pólizas reales y con descuento

---

## Flujos principales

### 1. Agente Revisando su Cartera Diariamente

**Escenario**: Un agente inicia su día y necesita revisar qué pólizas requieren atención.

**Flujo**:
1. Ingresa su ID de agente (1, 2 o 3 en este caso, en caso de producción sería un hash)
2. Ve inmediatamente el contador en la campana de notificaciones
3. Hace click en la campana o en "Por vencer"
4. Revisa la lista de pólizas próximas a vencer, ordenadas por urgencia
5. Filtra por "Menos de 5 días" para priorizar las más urgentes
6. Edita notas y cambia estados a "En gestión" para las que ya contactó

### 2. Contacto Proactivo con Clientes

**Escenario**: Un agente identifica pólizas a punto de vencer y contacta a los clientes.

**Flujo**:
1. Navega a "Por vencer"
2. Filtra por dependiendo de los días a los que está por vencer.
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
5. El agente entiende que debe tratar esto como una nueva contratación, así que puede decidir crear una nueva poliza

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

---

## Modelo de los datos

### Esquema de la base de datos

Decidí usar supabase, porque es un BaaS que facilita la edición del esquema una base de datos relacional. La creación de las tablas no fue muy difícil de pensar, sólo necesitaba 4 tablas. Los agentes, los clientes, Tipos de pólizas, las aseguradoras. Posteriormente la IA integró una tabla para las renovaciones de las pólizas, y tener el historial guardado de cómo ha evolucionado cada cliente con cada póliza. El esquema de datos puede verse como una imagen en el directorio './supabase' sin embargo la especificaré acá. 

### Endpoints expuestos

Supabase te da la facilidad de no exponer los endpoints, sin embargo se puede acceder a las tablas directamente y hacer los queries casi directamente. La forma en como Supabase hace esto es:
```
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://mlehbjkbcgvcycmrquqw.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
```
de esta forma, se hacen las llamadas, por ejemplo si queremos agregar un agente se hace de esta forma:
```
const { data, error } = await supabase
  .from('agents')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()
```

todos los servicios están listados en el directorio './src/services'


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

---

## Características Técnicas Destacadas

### Context API para Estado Global
- `AuthContext`: Manejo de autenticación del agente
- `NotificationContext`: Contador de pólizas por vencer compartido en toda la aplicación

### Custom Hooks
- `useSearch`: Lógica de búsqueda reutilizable
- `useSort`: Lógica de ordenamiento con estado
