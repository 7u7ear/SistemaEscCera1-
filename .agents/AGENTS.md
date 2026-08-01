# AGENTS.md — Contexto del Proyecto CERA 1

## Stack Técnico
- **Backend**: Node.js + Express
- **Base de datos**: MySQL (Aiven Cloud)
- **Frontend**: HTML + Bootstrap
- **Autenticación**: JWT (sin sesiones)
- **Arquitectura**: MVC + Service Layer

## Estructura de Carpetas
```
src/api/
  controllers/
  services/
  routes/v1/
  models/
  middlewares/
  validations/
src/web/
  components/
  utils/
  dashboard.html
  dashboard_script.js
  login.html
docs/
  pendientes.md       ← fuente de verdad de tareas
  manual/
```

## Reglas del Proyecto (OBLIGATORIAS)
- Toda lógica de negocio va en `services/` — los controllers solo manejan request/response
- Usar `async/await` (nunca `.then()`)
- Validar todos los inputs en el backend (Zod)
- `try/catch` obligatorio en todos los métodos
- No exponer errores internos al cliente
- En el frontend: SIEMPRE usar `api.getErrorMessage(err)` para mostrar errores — nunca `[object Object]`
- No inventar tablas ni campos sin confirmar con el usuario
- Naming en inglés, camelCase

## Estado del Proyecto
Las tareas pendientes están en `docs/pendientes.md`.
**Al iniciar cada sesión, leer ese archivo para conocer el contexto actual del desarrollo.**

El módulo de prioridad máxima actualmente es:
1. Sistema de emails (Nodemailer + SMTP + fallback log)
2. Recuperación de contraseña (token 1h)
3. Mails por curso (Estudiantes / Tutores / Docentes)
4. Sidebar dinámico por permisos
5. Visualizador de Auditoría
