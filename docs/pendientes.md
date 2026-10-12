# Tareas Pendientes — Sistema Escolar CERA 1

> Última actualización: 2026-10-12
> Este documento es la fuente de verdad del estado del proyecto. Leerlo al inicio de cada sesión.

---

## 🔴 ALTA PRIORIDAD — Próximos Desarrollos

### Módulo Mails por Curso (Siguiente paso recomendado)
- [ ] Endpoints para extraer mails: Estudiantes / Tutores / Docentes del curso
- [ ] 3 listas independientes en `cursosHorariosComponent.js`
- [ ] Botón "Copiar al portapapeles" (formato CCO/BCC)
- [ ] Botón "Descargar TXT/CSV"
- [ ] Solapa específica en Horarios con los profesores asignados al curso y sus correos

### Sidebar Dinámico por Permisos
- [ ] `dashboard_script.js` — ocultar (no deshabilitar) ítems del menú sin permisos L o E

### Visualizador de Auditoría
- [ ] Pantalla con filtros por fecha, usuario y entidad (roles: Admin / Conducción)

### Licencias & Puestos
- [ ] Afectación inmediata del puesto al crear licencia (estado `PENDIENTE`)

---

## 🟠 DEUDA TÉCNICA / REFACTORING

> Los ítems marcados con 🔍 fueron detectados en auditoría de compliance (2026-08-01). Son incumplimientos activos de reglas.

### Correcciones de Compliance (hacer primero)
- [x] 🔍 **Eliminar `credentials: "include"`** en `src/web/utils/api.js` — eliminado (2026-09-19)
- [x] 🔍 **Eliminar 4 `console.log()`** en frontend:
  - `src/web/components/licenciasComponent.js` línea 116
  - `src/web/components/permisosComponent.js` línea 82
  - `src/web/components/tramitacionesComponent.js` líneas 156 y 163
- [x] 🔍 **Agregar auditoría** a `licencia.service.js` (create, update, delete) — implementado (2026-09-19)
- [x] 🔍 **Agregar auditoría** a `tramitacion.service.js` — implementado (2026-09-19)
- [x] 🔍 **Revisar DELETE físico** en `alumno.service.js` — convertido a borrado lógico `deleted_at` (migración aplicada 2026-09-19)

### Refactoring General
- [x] Eliminar fallback de sesiones en `src/api/middlewares/auth.js` — completado (solo JWT)
- [ ] Esquemas Zod: `tramitacion.validation.js`, `codigo_tramite.validation.js`, `permiso.validation.js`
- [ ] Actualizar `usuario.validation.js` — añadir adminCreate, status y perfil
- [ ] Actualizar `cargo.validation.js` — añadir tipos-hora
- [ ] Refactorizar módulo Permisos → MVC + Service Layer:
  - [ ] `src/api/models/permiso.model.js`
  - [ ] `src/api/services/permiso.service.js`
  - [ ] `src/api/controllers/permiso.controller.js`
  - [ ] Modificar `src/api/routes/v1/permisos.routes.js`
- [ ] Aplicar Zod en controllers: `usuario`, `cargo`, `tramitacion`, `codigo_tramite`
- [ ] Campo `anio_materia` en materias adeudadas del alumno (BD + frontend ficha)
- [ ] Revisión visual botones negros→azules en modales: tramitaciones, licencias, docentes, cargos

---

## 🟡 MEDIA PRIORIDAD

- [ ] Reportes y constancias en PDF (Alumno Regular, pases)
- [ ] Módulo de Biblioteca (catálogo bibliográfico + préstamos)

---

## 🟢 BAJA PRIORIDAD / MEJORAS FUTURAS

- [ ] Dashboard estadístico con gráficos interactivos (ausentismo docente, cupos de alumnos)
- [ ] Alertas automáticas por vencimiento de licencias

---

## ✅ COMPLETADO

- [x] Gestión de Usuarios (aprobación, perfiles iniciales, creación por admin)
- [x] Definición de los 9 perfiles institucionales
- [x] Módulo Planilla de Firmas (cargos × horarios × licencias)
- [x] Módulo Tramitaciones integrado con Cargos
- [x] Módulo Licencias vinculado a cargos docentes
- [x] Módulo Alumnos (legajos, matriculación, materias adeudadas)
- [x] `api.getErrorMessage()` helper + parseo correcto de errores en todo el frontend
- [x] Alerta de usuarios pendientes de aprobación en Dashboard
- [x] Métricas en vivo en Dashboard (docentes, puestos, estudiantes, cursos)
- [x] Normalización de ordinales (1º° → 1º en todo el frontend)
- [x] Documentación oficial: `docs/manual/manual_usuario.md` y `docs/manual/manual_tecnico.md`
- [x] Credenciales de base de datos Aiven MySQL Cloud en `docs/README.md`
- [x] **Módulo Email + Notificaciones de Licencias** (2026-10-12):
  - Nodemailer + SMTP configurado con fallback a `logs/email.log`
  - Plantillas HTML de notificación (`licencia_notificacion_template.js`)
  - Asignación de preceptor por curso (`curso_preceptor` en BD + UI en Cursos y Horarios)
  - Notificaciones automáticas por correo al preceptor y secretaría al registrar licencias
  - Notificación automática por correo al docente al aprobar/rechazar licencias
- [x] **Módulo Recuperación de Contraseña & Autenticación** (2026-10-12):
  - Servicio `password_reset.service.js` con tokens seguros y validez de 1 hora
  - Endpoints `/api/v1/auth/forgot-password` y `/api/v1/auth/reset-password`
  - Modal interactivo de "¿Olvidaste tu contraseña?" y formulario de cambio de clave en `login.html`
  - Icono "ojo" (ver/ocultar contraseña) en inputs de login y registro
  - Campo email en registro de usuarios y columna `email` en tabla `usuarios`
