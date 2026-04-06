# Arquitectura del Sistema – ECN Nº1 Cerámica

## Diagrama de Capas

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE (Browser)                  │
│              src/web/ (HTML + JS + CSS)              │
└────────────────────────┬────────────────────────────┘
                         │ HTTP /api/v1/...
┌────────────────────────▼────────────────────────────┐
│                    API LAYER                         │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Middlewares │  │  Controllers  │  │  Validations│ │
│  │ auth.js     │→ │ *.controller │→ │ Zod Schemas│  │
│  │ permisos.js │  │              │  │            │  │
│  │ errorHandler│  └──────┬───────┘  └────────────┘  │
│  └─────────────┘         │                          │
│                          ▼                          │
│                   ┌──────────────┐                  │
│                   │   Services   │                  │
│                   │ *.service.js │                  │
│                   │ (Business    │                  │
│                   │  Logic)      │                  │
│                   └──────┬───────┘                  │
│                          │                          │
│                   ┌──────▼───────┐                  │
│                   │ Repositories │                  │
│                   │ *.repository │                  │
│                   │ (SQL Queries)│                  │
│                   └──────┬───────┘                  │
│                          │                          │
└──────────────────────────┼──────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────┐
│                   MySQL Database                     │
│                   (bd_ecn1)                          │
└─────────────────────────────────────────────────────┘
```

## Principios Aplicados

### Controller → Service → Repository

Cada módulo sigue esta cadena estricta:

| Capa | Responsabilidad | Ejemplo |
|------|----------------|---------|
| **Controller** | Recibir request, validar input (Zod), devolver response | `docente.controller.js` |
| **Service** | Lógica de negocio, reglas, validaciones cruzadas | `docente.service.js` |
| **Repository** | Acceso a base de datos (SQL), sin lógica | `docente.repository.js` |

### Módulos del Sistema

| Módulo | Rutas Base | Descripción |
|--------|-----------|-------------|
| Usuarios | `/api/v1/usuarios` | Autenticación, sesión, permisos |
| Docentes | `/api/v1/docentes` | CRUD docentes, cargos por docente |
| Cargos | `/api/v1/cargos` | Gestión de puestos, asignaciones, historial |
| Materias | `/api/v1/materias` | Catálogo de materias |
| Cursos | `/api/v1/cursos` | Catálogo de cursos |
| Licencias | `/api/v1/licencias` | Registro y gestión de licencias |
| Tramitaciones | `/api/v1/tramitaciones` | Procedimientos administrativos |
| Códigos Trámite | `/api/v1/codigos-tramite` | Catálogo de tipos de trámites |

### Seguridad por Capas

```
Request → auth.js (sesión) → permisoModulo (RBAC) → Controller → Service → Repository
```

- **auth.js**: Verifica que existe sesión activa.
- **permisoModulo**: Verifica permiso (`lectura`/`edicion`) del usuario para el módulo en `usuario_modulo`.
- **Zod**: Valida y transforma el body antes de pasar al service.
- **AppError**: Errores operacionales tipados que el `errorHandler` convierte en respuestas JSON estructuradas.

### Manejo de Errores

```
throw new AppError('Mensaje', 404)
       ↓
errorHandler middleware
       ↓
{ error: { message, status, timestamp } }
```

Los errores internos (no operacionales) devuelven `500` sin exponer detalles en producción.

### Logging (Winston)

Todos los errores críticos se registran con:
- **Nivel**: `info`, `warn`, `error`
- **Formato**: JSON estructurado en producción, texto legible en desarrollo
- **Destino**: `logs/error.log`, `logs/combined.log`, stdout

## Decisiones de Diseño

1. **CommonJS** en lugar de ESM para máxima compatibilidad con el entorno WAMP existente.
2. **Singleton de servicios/repositorios** (`module.exports = new Clase()`) para evitar instanciación múltiple.
3. **Pool de conexiones MySQL** (mysql2) en lugar de conexiones individuales, para eficiencia.
4. **Borrado lógico** (`deleted_at`) en docentes y tramitaciones para preservar historial.
5. **Versionado de API** (`/api/v1`) para permitir evolución sin romper clientes existentes.
