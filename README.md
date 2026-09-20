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
  "c# Sistema de Gestión de Gimnasio - FitTrack (Base de Datos NoSQL)

Este repositorio contiene la implementación práctica del modelo de datos NoSQL para el sistema de gestión de gimnasios **FitTrack**, desarrollado sobre **MongoDB Server 7.0**.

---

1. Sembrado de Datos (Seeding)
Se pobló la colección socios en la base de datos fittrack con 10 documentos. Para evidenciar la flexibilidad del esquema (schema-less), se estructuraron subdocumentos anidados de contacto (contacto.email, contacto.telefono), un arreglo de disciplinas (actividades) y campos opcionales según el caso (aptoMedicoVencimiento, casilleroAsignado).

2. Pruebas de Consultas (MQL)
A. Consultas de Lectura (Read)
Filtrado básico por coincidencia exacta

Caso de negocio: Obtener el listado de todos los socios activos que poseen su cuota al día.

db.socios.find({ cuotaAlDia: true });
<img width="422" height="575" alt="image" src="https://github.com/user-attachments/assets/5d16ae7a-8c3d-4fa8-af81-fef655f10614" />
<img width="373" height="614" alt="image" src="https://github.com/user-attachments/assets/c461f0f3-19de-445b-9280-706618f7d956" />
<img width="393" height="601" alt="image" src="https://github.com/user-attachments/assets/ec81393f-01b8-43ce-84e2-20866a4822c4" />
<img width="366" height="605" alt="image" src="https://github.com/user-attachments/assets/c974a792-6a53-4a96-9f2d-271ad2ba805c" />

Operador de comparación ($gt)

Caso de negocio: Identificar socios mayores a 25 años para campañas de personalización de entrenamiento.

db.socios.find({ edad: { $gt: 25 } });
<img width="396" height="608" alt="image" src="https://github.com/user-attachments/assets/fc4058b3-f5eb-49b5-a155-4dd7ea7084a4" />
<img width="381" height="623" alt="image" src="https://github.com/user-attachments/assets/b7edc856-9d2d-41f1-a751-cfa01be638bd" />
<img width="342" height="618" alt="image" src="https://github.com/user-attachments/assets/8a184c56-a9b7-40be-bc0a-f46cfdbe950f" />
<img width="377" height="600" alt="image" src="https://github.com/user-attachments/assets/0d47a01e-81d0-4d52-b230-e044530b3370" />
<img width="317" height="265" alt="image" src="https://github.com/user-attachments/assets/f2763727-8c80-400d-bc91-d5afa8900b55" />


Notación de punto en objetos anidados (Dot Notation)

Caso de negocio: Buscar el perfil de un socio a partir de su dirección de correo electrónico registrada en el subdocumento contacto.


db.socios.find({ "contacto.email": "sofia@gmail.com" });
<img width="459" height="403" alt="image" src="https://github.com/user-attachments/assets/07b4fc83-c739-45e0-b5dd-8e4ba8ee2ec5" />


Proyección específica de campos (Exclusión de _id)

Caso de negocio: Generar una lista pública resumida con el nombre, plan y edad del socio, omitiendo datos sensibles y el _id.

db.socios.find({}, { _id: 0, nombre: 1, plan: 1, edad: 1 });
<img width="500" height="603" alt="image" src="https://github.com/user-attachments/assets/a3af39e9-db04-440d-aab7-92158d3dc869" />
<img width="229" height="599" alt="image" src="https://github.com/user-attachments/assets/beb28d14-232e-49bc-80d4-6e4df63b90da" />


Filtro en arreglos ($all)

Caso de negocio: Filtrar únicamente a los socios que participan simultáneamente en las actividades de Crossfit y Spinning.

db.socios.find({ actividades: { $all: ["Crossfit", "Spinning"] } });
<img width="556" height="602" alt="image" src="https://github.com/user-attachments/assets/6e05e0e0-fb5c-4aac-ae79-49cfbead835c" />
<img width="272" height="264" alt="image" src="https://github.com/user-attachments/assets/cee4d36b-5ad2-47ef-8d9d-830a8fe7bc80" />


B. Operaciones de Escritura y Modificación (Update & Delete)
Actualización con $set (Campo simple y nueva propiedad)

Caso de negocio: Registrar el pago de la cuota de Mateo Fernández cambiando cuotaAlDia a true e insertando la fecha de la transacción (fechaUltimoPago).


db.socios.updateOne(
  { nombre: "Mateo Fernández" },
  { $set: { cuotaAlDia: true, fechaUltimoPago: "2026-09-20" } }
);
<img width="949" height="200" alt="image" src="https://github.com/user-attachments/assets/0a8fd6a5-f190-4c02-901e-b9d3e9b994a1" />


Incremento atómico ($inc)

Caso de negocio: Sumar +1 al contador de asistencias mensuales (visitasMes) del socio Lucas Gómez al ingresar por molinete.

db.socios.updateOne(
  { nombre: "Lucas Gómez" },
  { $inc: { visitasMes: 1 } }
);
<img width="618" height="198" alt="image" src="https://github.com/user-attachments/assets/b2849a42-0ecd-499c-ad71-45e188aa95b0" />


Eliminación segura con criterio estricto (deleteOne)

Caso de negocio: Eliminar el registro de prueba no verificado de la socia Martina Díaz.

db.socios.deleteOne({ nombre: "Martina Díaz", plan: "Prueba" });
<img width="522" height="158" alt="image" src="https://github.com/user-attachments/assets/64beed35-cc60-4809-be9d-1957d296494f" />



db.socios.deleteOne({ nombre: "Martina Díaz", plan: "Prueba" });s CRUDomprobante_numero": "REC-2026-08912"
}
