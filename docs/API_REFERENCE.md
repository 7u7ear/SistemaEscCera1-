# API Reference – Sistema ECN Nº1 Cerámica

**Base URL:** `/api/v1`  
**Autenticación:** Todas las rutas (excepto `/usuarios/login`) requieren sesión activa.  
**Formato:** `Content-Type: application/json`

---

## 🔐 Autenticación

### POST `/usuarios/login`
Inicia sesión y crea una cookie de sesión.

**Body:**
```json
{ "username": "admin", "password": "1234" }
```
**Respuesta exitosa (200):**
```json
{ "message": "Login correcto", "user": { "id": 1, "username": "admin", "nombre": "Administrador" } }
```
**Errores:** `400` (validación), `401` (credenciales inválidas), `403` (usuario inactivo)

---

### POST `/usuarios/logout`
Cierra la sesión activa.

**Respuesta (200):** `{ "message": "Logout correcto" }`

---

### GET `/usuarios/me`
Retorna los datos del usuario autenticado.

**Respuesta (200):** Objeto usuario sin contraseña.

---

## 👩‍🏫 Docentes

### GET `/docentes`
Lista todos los docentes activos (no borrados).  
**Permiso requerido:** `docentes → lectura`

### POST `/docentes`
Crea un nuevo docente.  
**Permiso:** `docentes → edicion`

**Body:**
```json
{
  "rrhh_id": "D001",
  "apellido": "García",
  "nombre": "María",
  "dni": "12345678",
  "cuil": "27123456789",
  "email": "mgarcia@ecn1.edu.ar",
  "fecha_ingreso": "2024-03-01"
}
```

### PUT `/docentes/:id`
Actualiza datos de un docente.

### DELETE `/docentes/:id`
Borrado lógico (marca `deleted_at`).

### GET `/docentes/:id/cargos`
Lista los cargos activos/licencia de un docente.

---

## 📋 Cargos (Puestos)

### GET `/cargos`
Lista todos los cargos con docente asignado.

### POST `/cargos`
Crea un nuevo puesto.

### PUT `/cargos/:id`
Actualiza nombre/horas de un puesto.

### DELETE `/cargos/:id`
Elimina un puesto.

### GET `/cargos/:id/historial`
Historial completo de asignaciones de un cargo.

### POST `/cargos/:id/asignar`
Asigna un docente a un cargo.

**Body:**
```json
{
  "docente_id": 5,
  "situacion_revista": "titular",
  "fecha_inicio": "2024-04-01",
  "expediente_alta": "EXP-2024-001"
}
```

### POST `/cargos/:id/baja/:cargoDocenteId`
Registra la baja de un docente en un cargo.

### GET `/cargos/:id/distribucion`
Lista las materias/horas asignadas a un cargo.

### POST `/cargos/:id/distribucion`
Agrega una materia a la distribución horaria.

---

## 📅 Licencias

### GET `/licencias`
Lista todas las licencias.

### POST `/licencias`
Registra una nueva licencia para un docente.

**Body:**
```json
{
  "docente_id": 5,
  "fecha_inicio": "2024-05-01",
  "tipo_licencia": "ENF",
  "cargo_ids": [1, 3],
  "actualizar_puesto": true,
  "generar_tramite": true,
  "codigo_tramite_id": 2
}
```

### PUT `/licencias/:id`
Actualiza o finaliza una licencia.

### DELETE `/licencias/:id`
Elimina una licencia.

### GET `/licencias/tipos`
Lista los tipos de licencia disponibles.

### POST `/licencias/tipos`
Crea un nuevo tipo de licencia.

---

## 📁 Tramitaciones

### GET `/tramitaciones`
Lista todas las tramitaciones activas.  
**Permiso:** `tramitaciones → lectura`

### POST `/tramitaciones`
Crea una nueva tramitación.

**Body:**
```json
{
  "fecha": "2024-05-01",
  "docente_id": 5,
  "cargo_id": 2,
  "codigo_tramite_id": 3,
  "estado": "caratulado",
  "expediente": "EXP-2024-010",
  "observaciones": "Sucesión por licencia médica"
}
```

### PUT `/tramitaciones/:id`
Actualiza estado y datos de una tramitación.

### DELETE `/tramitaciones/:id`
Borrado lógico de tramitación.

---

## 🗂 Códigos de Trámite

### GET `/codigos-tramite`
Lista todos los tipos de trámite activos.

### POST `/codigos-tramite`
Crea un nuevo código de trámite.

### PUT `/codigos-tramite/:id`
Actualiza un código de trámite.

### DELETE `/codigos-tramite/:id`
Desactiva un código de trámite.

---

## ❌ Formato de Errores

Todos los errores siguen el formato:
```json
{
  "error": {
    "message": "Descripción del error",
    "status": 400,
    "timestamp": "2024-05-01T10:00:00.000Z"
  }
}
```

Para errores de validación Zod:
```json
{
  "error": {
    "message": "Error de validación",
    "status": 400,
    "details": [
      { "path": ["dni"], "message": "DNI es requerido" }
    ]
  }
}
```

## ✅ Health Check

```
GET /api/v1/health
→ { "status": "API v1 is healthy", "timestamp": "..." }
```
