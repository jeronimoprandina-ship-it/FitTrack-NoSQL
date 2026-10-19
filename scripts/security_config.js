// 1. Cambiar a la base de datos de administración para crear usuarios
use admin;

// 2. Crear el Usuario Administrador Global (Control total de la instancia)
db.createUser({
  user: "admin_fittrack",
  pwd: passwordPrompt(), // Solicita contraseña segura de forma interactiva
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
});

// 3. Cambiar a la base de datos específica del gimnasio
use fittrack;

// 4. Crear el Usuario Operativo de la Aplicación (Permisos restringidos solo a fittrack)
db.createUser({
  user: "fittrack_appuser",
  pwd: passwordPrompt(), // Solicita contraseña segura de forma interactiva
  roles: [
    { role: "readWrite", db: "fittrack" },
    { role: "dbAdmin", db: "fittrack" }
  ]
});

print("✅ Configuración de seguridad y usuarios RBAC generada correctamente para FitTrack.");
```
