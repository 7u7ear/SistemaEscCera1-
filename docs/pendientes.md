# Tareas Pendientes — Sistema Escolar CERA 1

> Última actualización: 2026-10-12
> Este documento es la fuente de verdad del estado del proyecto. Leerlo al inicio de cada sesión.

---

## 🔴 ALTA PRIORIDAD — Próximos Desarrollos

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
- [x] Configuración de base de datos MySQL local (WAMP) documentada en `docs/README.md`
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
- [x] **Módulo Mails y Planta Docente por Curso** (2026-10-12):
  - Endpoints `/api/v1/cursos/:id/emails` y `/api/v1/cursos/:id/docentes`
  - Nueva pestaña "Docentes Asignados" con planta docente del curso, materias, cargos, puestos, situación de revista, correos, teléfonos e impresión
  - Nueva pestaña "Mails del Curso" con 3 listas independientes: Estudiantes, Tutores y Docentes
  - Botón "Copiar CCO / BCC" para pegado directo en clientes de correo
  - Exportación y descarga directa en formatos TXT y CSV para cada una de las listas
  - Métricas de cobertura de correos en tiempo real y buscador/filtro interactivo
- [x] **Sidebar Dinámico por Permisos** (2026-10-12):
  - `aplicarPermisosSidebar` en `dashboard_script.js` oculta ítems sin permiso L o E
  - Endpoint `/api/v1/permisos/mis-permisos` y `getEffectivePermissions` en `usuario.model.js`
  - Protección de rutas en `mostrarSeccion` con alerta y redirección al dashboard
- [x] **Visualizador de Auditoría** (2026-10-12):
  - Endpoint `GET /api/v1/auditoria` con filtros por fecha, usuario, entidad y acción
  - Paginación de 50 registros por página con navegación
  - Filtros dinámicos poblados desde la BD (entidades y acciones reales)
  - Sección `seccion-auditoria` en dashboard con tabla detallada y badges por acción
  - Exportación directa a CSV con BOM UTF-8
  - Acceso restringido a perfiles: Administrador (edición), Secretario (edición), Conducción (lectura)
