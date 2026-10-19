// 1. Iniciar la sesión de cliente y definir opciones de transacción
const session = db.getMongo().startSession();

// Opciones de consistencia ACID estricta
session.startTransaction({
  readConcern: { level: "snapshot" },
  writeConcern: { w: "majority" }
});

try {
  const sociosColl = session.getDatabase("fittrack").socios;
  const pagosColl = session.getDatabase("fittrack").pagos;

  // Datos de la renovación mensual procesada por el Administrador
  const nombreSocio = "Mateo Fernández";
  const nuevoPlan = "Pase Mensual - 3 Días por Semana";
  const modalidad = "3 días por semana";
  const montoPagado = 15000;
  const fechaHoy = "2026-10-19";
  const fechaVencimiento = "2026-11-19"; // Vencimiento exacto a 1 mes

  // ------------------------------------------------------------
  // PASO A: Actualizar el plan mensual, días y cuota del socio
  // ------------------------------------------------------------
  const resultadoSocio = sociosColl.updateOne(
    { nombre: nombreSocio },
    {
      $set: {
        plan: nuevoPlan,
        frecuenciaEntrenamiento: modalidad,
        cuotaAlDia: true,
        fechaUltimoPago: fechaHoy,
        fechaVencimiento: fechaVencimiento
      }
    }
  );

  // Validación de regla de negocio
  if (resultadoSocio.matchedCount === 0) {
    throw new Error(`El socio '${nombreSocio}' no existe en la base de datos.`);
  }

  // ------------------------------------------------------------
  // PASO B: Registrar el comprobante de pago en la colección pagos
  // ------------------------------------------------------------
  pagosColl.insertOne({
    socio: nombreSocio,
    monto: montoPagado,
    planAdquirido: nuevoPlan,
    modalidad: modalidad,
    duracion: "1 Mes",
    fechaPago: fechaHoy,
    emitidoPor: "Admin_Gimnasio",
    estado: "APROBADO"
  });

  // ------------------------------------------------------------
  // PASO C: Confirmar Transacción (COMMIT) - Escenario de Éxito
  // ------------------------------------------------------------
  session.commitTransaction();
  print("✅ Transacción completada: Membresía mensual activada y pago registrado correctamente.");

} catch (error) {
  // ------------------------------------------------------------
  // PASO D: Cancelar Transacción (ROLLBACK) - Escenario de Fallo
  // ------------------------------------------------------------
  session.abortTransaction();
  print("❌ Transacción abortada (Rollback ejecutado). Motivo: " + error.message);
} finally {
  session.endSession();
}
