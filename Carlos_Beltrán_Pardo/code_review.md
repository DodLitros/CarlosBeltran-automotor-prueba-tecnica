# Revisión del código de Python usando Flask

---

## Sólo busca las pólizas cuyo vencimiento ya pasó
```sql
SELECT id, client_id, insurer, expiration_date, status
FROM policies
WHERE advisor_id = ?
AND expiration_date < ?
```

- Solo pólizas del asesor indicado.
- Solo pólizas vencidas.
- No incluye las que vencen hoy.
- No incluye las que vencen mañana.
- No incluye las que vencen este mes.

### Problemas reales
El agente
1. No se da cuenta de que vencen
2. No llama con anticipación
3. Otro asesor puede renovar primero

---

## No existe gestión

El asesor dice: "Marco una columna gestionado con una X." Pero el endpoint no tiene nada parecido, y no devuelve algo como:
```
{
  "managed": true
}
```

Ni:
```
{
  "last_contact_date": ...
}
```

O:
```
{
  "renewal_in_progress": true
}
```

---

## No conserva ningún contexto

- No devuelve:
- notas
- observaciones
- última conversación
- cotización enviada
- aseguradora ofrecida
- razón de rechazo

El campo status ni siquiera se usa

Se consulta:

```sql
SELECT ..., status
```

Pero luego:

```
status
```

nunca participa en ninguna lógica.

Podrías tener:

- renewed
- cancelled
- pending


y el endpoint seguiría devolviendo como si todos necesitaran gestión.

---

## No hay orden de prioridad real

Actualmente:

```python
urgent = > 7 días
normal = <= 7 días
```

Pero para el negocio es al revés.

Una póliza vencida hace 30 días probablemente ya se perdió.

Una póliza que vence en 3 días es la más importante.

La prioridad está basada en una métrica técnica, no comercial.

---

## Problema de rendimiento (N+1 queries)

Por cada póliza:

Hace una consulta al cliente.

```sql
SELECT name, phone ...
```

Hace otra consulta a intentos.

```sql
SELECT COUNT(*) ...
```

Si hay 200 pólizas:

1 consulta inicial
200 consultas de clientes
200 consultas de intentos


Total: 401 consultas

Cuando podría resolverse con joins.

---

## Puede romperse si faltan datos

Si:

```sql
SELECT name, phone
FROM clients
```

no encuentra cliente:

```
client = None
```

Luego:

```
client[0]
```

produce:
```python
TypeError
```

y el endpoint devuelve error 500.

---

# Lo más importante

El mayor error no es técnico, es que el prompt: "hazme un endpoint que liste las pólizas vencidas" ya ncorporó una interpretación incorrecta del problema. La IA hizo exactamente lo que le pidieron, pero el problema del asesor no era "ver pólizas vencidas". 
Era: "evitar que las pólizas venzan sin gestión, conservar el historial de seguimiento y priorizar clientes con riesgo de fuga".

Un sistema realmente alineado con el negocio probablemente tendría una consulta como:

```sql
WHERE expiration_date
BETWEEN today
AND today + 30 days
```

--- 

# Corrección

## renewal_pipeline.py

Correcciones aplicadas respecto al código original:
1. Ya no busca pólizas vencidas, sino pólizas que vencerán en los próximos 30 días.
2. Incluye información de gestión (managed, renewal_in_progress).
3. Conserva contexto comercial (última interacción y notas).
4. Utiliza el campo status para excluir pólizas ya renovadas o canceladas.
5. Prioriza según riesgo comercial y proximidad al vencimiento.
6. Evita el problema N+1 utilizando JOINs.
7. Tolera datos faltantes sin lanzar errores 500.
Objetivo:
Ayudar al asesor a evitar que las pólizas venzan sin gestión.

```
from flask import Flask, jsonify
from datetime import datetime, timedelta
import sqlite3

app = Flask(__name__)

DB = "agentemotor.db"

@app.route("/advisors/<advisor_id>/renewal-pipeline", methods=["GET"])
def renewal_pipeline(advisor_id):
    """
    Lista las pólizas que requieren gestión preventiva
    antes de que el cliente se pierda.
    """

    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    today = datetime.now().date()
    next_30_days = today + timedelta(days=30)

    # Se buscan pólizas próximas a vencer.
    # También se excluyen las que ya fueron renovadas o canceladas.
    #
    # Se traen de una sola vez:
    # - cliente
    # - información de gestión
    # - última interacción
    # - contexto comercial
    #
    # evitando cientos de consultas adicionales.
    query = """
        SELECT
            p.id AS policy_id,
            p.insurer,
            p.expiration_date,
            p.status,

            c.name AS client_name,
            c.phone AS client_phone,

            p.managed,
            p.renewal_in_progress,

            p.last_contact_date,
            p.last_contact_note,

            COUNT(ca.id) AS contact_attempts

        FROM policies p

        LEFT JOIN clients c
            ON c.id = p.client_id

        LEFT JOIN contact_attempts ca
            ON ca.policy_id = p.id

        WHERE
            p.advisor_id = ?
            AND p.expiration_date BETWEEN ? AND ?
            AND p.status NOT IN ('renewed', 'cancelled')

        GROUP BY p.id
    """

    cursor.execute(
        query,
        (
            advisor_id,
            today.isoformat(),
            next_30_days.isoformat()
        )
    )

    policies = cursor.fetchall()

    result = []

    for policy in policies:

        expiration_date = datetime.strptime(
            policy["expiration_date"],
            "%Y-%m-%d"
        ).date()

        days_until_expiration = (
            expiration_date - today
        ).days

        # Prioridad basada en riesgo de negocio,
        # no en cuánto tiempo lleva vencida.
        if days_until_expiration <= 3:
            priority = "critical"

        elif days_until_expiration <= 7:
            priority = "high"

        else:
            priority = "normal"

        # Acción sugerida basada en contexto.
        if not policy["managed"]:
            recommended_action = (
                "Realizar primer contacto con el cliente"
            )

        elif policy["renewal_in_progress"]:
            recommended_action = (
                "Hacer seguimiento a la renovación"
            )

        else:
            recommended_action = (
                "Validar estado de la renovación"
            )

        result.append({
            "policy_id": policy["policy_id"],

            "client_name":
                policy["client_name"] or "Cliente sin registrar",

            "client_phone":
                policy["client_phone"],

            "insurer":
                policy["insurer"],

            "expiration_date":
                policy["expiration_date"],

            "days_until_expiration":
                days_until_expiration,

            "status":
                policy["status"],

            "managed":
                bool(policy["managed"]),

            "renewal_in_progress":
                bool(policy["renewal_in_progress"]),

            "contact_attempts":
                policy["contact_attempts"],

            "last_contact_date":
                policy["last_contact_date"],

            "last_contact_note":
                policy["last_contact_note"],

            "priority":
                priority,

            "recommended_action":
                recommended_action
        })

    conn.close()

    return jsonify(result), 200


if __name__ == "__main__":
    app.run(debug=True)
```
