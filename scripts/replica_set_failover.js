// 1. Conexión a la base de datos FitTrack del Replica Set
const dbFitTrack = db.getSiblingDB("fittrack");

print("🚀 Iniciando simulación de inserción continua para prueba de Failover en FitTrack...");
print("ℹ️ Para probar la tolerancia a fallos, detenga el proceso del nodo Primario mientras corre este bucle.");

let contador = 1;

// 2. Bucle de prueba de disponibilidad
for (let i = 1; i <= 20; i++) {
  try {
    dbFitTrack.logs_disponibilidad.insertOne({
      pruebaId: contador,
      evento: "Monitoreo de latencia y escritura en alta disponibilidad",
      timestamp: new Date(),
      estadoNodo: "Escritura Exitosa"
    });

    print(`[Log #${contador}] ✅ Registro escrito correctamente en el Replica Set.`);
    contador++;

    // Pausa de 1 segundo entre iteraciones
    sleep(1000);

  } catch (error) {
    print(`[Log #${contador}] ⚠️ Fallo de escritura detectado durante la reelección: ${error.message}`);
    // Intento de reconexión automática en el cliente
    sleep(2000);
  }
}

print("🏁 Prueba de tolerancia a fallos completada. Verifique el cambio de nodo Primario con rs.status().");
