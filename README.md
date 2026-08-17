# Sistema de Gestión de Gimnasio, Membresías y Rutinas (FitTrack)

## 1. Definición del Dominio del Problema

### Contexto y Problemática
Los centros de entrenamiento y gimnasios enfrentan el desafío de gestionar eficientemente dos grandes flujos de información: el control de acceso y vencimiento de membresías, junto con el seguimiento personalizado de rutinas de ejercicios para sus socios.

En un sistema relacional tradicional, estructurar los planes de entrenamiento (días, grupos musculares, ejercicios, series, repeticiones y descansos) requiere esquemas rígidos con múltiples tablas cruzadas (`JOINs`). Esto genera lentitud al consultar la rutina del día de un alumno desde una app móvil o al validar su ingreso en la recepción.

### Solución Propuesta y Rol de la Base de Datos
**FitTrack** es un sistema integral para la administración de gimnasios y seguimiento de socios. La base de datos orientada a documentos (MongoDB) cumple un rol estratégico al ofrecer:
* **Carga inmediata de la rutina ($O(1)$):** Toda la estructura de entrenamiento de un socio se recupera en una sola consulta de lectura, optimizando la experiencia en la app móvil.
* **Esquema flexible:** Permite adaptar la rutina según la disciplina del socio (musculación, crossfit, funcional o rehabilitación) sin modificar la estructura global de la base de datos.
* **Seguimiento de membresías:** Control en tiempo real del estado del pase (activo, vencido, suspendido) e historial de pagos.

---

## 2. Modelado Conceptual Orientado a Documentos

El sistema se articula principalmente en tres colecciones: `socios`, `ejercicios` y `pagos_membresia`.

### Colección: `socios`
Es la colección principal del sistema. Almacena los datos personales, el estado de la membresía y el plan de entrenamiento activo anidado.

```json
{
  "_id": 1,
  "dni": "40123456",
  "nombre_completo": "Jerónimo Martínez",
  "email": "jero.martinez@email.com",
  "telefono": "+542614556677",
  "fecha_alta": "2026-01-15T09:00:00Z",
  "membresia_actual": {
    "tipo_plan": "PASE_LIBRE_MUSCULACION",
    "fecha_inicio": "2026-08-01",
    "fecha_vencimiento": "2026-09-01",
    "estado": "ACTIVO"
  },
  "rutina_activa": {
    "nombre_plan": "Hipertrofia - Frecuencia 4",
    "profesional_asignado": "Prof. Lucas Gómez",
    "fecha_actualizacion": "2026-08-05",
    "dias_entrenamiento": [
      {
        "dia": "Lunes",
        "grupo_muscular": "Pecho y Tríceps",
        "ejercicios": [
          {
            "ejercicio_id": 101,
            "nombre": "Press de Banca Plano",
            "series": 4,
            "repeticiones": "8-10",
            "descanso_segundos": 90,
            "peso_sugerido_kg": 70
          },
          {
            "ejercicio_id": 102,
            "nombre": "Press Francés con Barra W",
            "series": 3,
            "repeticiones": "12",
            "descanso_segundos": 60,
            "peso_sugerido_kg": 25
          }
        ]
      },
      {
        "dia": "Miércoles",
        "grupo_muscular": "Espalda y Bíceps",
        "ejercicios": [
          {
            "ejercicio_id": 103,
            "nombre": "Dominadas Pronas",
            "series": 4,
            "repeticiones": "Al fallo",
            "descanso_segundos": 120,
            "peso_sugerido_kg": 0
          }
        ]
      }
    ]
  }
}
**Colección: ejercicios
Catálogo general de ejercicios disponibles con su guía de ejecución, usado como biblioteca de referencia por los profesores.

JSON
{
  "_id": 101,
  "nombre": "Press de Banca Plano",
  "grupo_muscular_principal": "Pecho",
  "equipamiento": "Barra y Banco Plano",
  "nivel_dificultad": "Intermedio",
"instrucciones": "Mantener los pies apoyados, retraer escápulas y bajar la barra a la altura del esternón."
}
### Colección: `pagos_membresia`
Almacena el historial contable de comprobantes de pago de las cuotas de los socios.

```json
{
  "_id": 5001,
  "socio_id": 1,
  "fecha_pago": "2026-08-01T10:15:00Z",
  "monto_ars": 25000.00,
  "metodo_pago": "MERCADO_PAGO",
  "periodo_abonado": {
    "mes": 8,
    "anio": 2026
  },
  "comprobante_numero": "REC-2026-08912"
}
