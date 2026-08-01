# Tareas Pendientes — Sistema Escolar CERA 1

> Última actualización: 2026-08-01
> Este documento es la fuente de verdad del estado del proyecto. Leerlo al inicio de cada sesión.

---

## 🔴 ALTA PRIORIDAD — Funcionalidades Nuevas

### Módulo Email + Licencias
- [ ] `email.service.js` — Nodemailer + SMTP con fallback a `logs/email.log`
- [ ] `licencia_notificacion_template.js` — Plantillas HTML (solicitud + resolución)
- [ ] Afectación inmediata del puesto al crear licencia (estado `PENDIENTE`)
- [ ] Tabla `curso_preceptor` + interfaz de asignación en admin de cursos
- [ ] Email automático a Preceptor/Secretaría al ingresar licencia
- [ ] Email automático al Docente al Aprobar/Rechazar licencia

### Módulo Recuperación de Contraseña
- [ ] `password_reset.service.js` — token único, expiración 1 hora
- [ ] `password_reset.routes.js` — endpoints `forgot-password` y `reset-password`
- [ ] Enlace + modal "¿Olvidaste tu contraseña?" en `login.html`

### Módulo Mails por Curso
- [ ] Endpoints para extraer mails: Estudiantes / Tutores / Docentes del curso
- [ ] 3 listas independientes en `cursosHorariosComponent.js`
- [ ] Botón "Copiar al portapapeles" (formato CCO/BCC)
- [ ] Botón "Descargar TXT/CSV"

### Sidebar Dinámico por Permisos
- [ ] `dashboard_script.js` — ocultar (no deshabilitar) ítems del menú sin permisos L o E

### Visualizador de Auditoría
- [ ] Pantalla con filtros por fecha, usuario y entidad (roles: Admin / Conducción)

---

## 🟠 DEUDA TÉCNICA / REFACTORING

- [ ] Eliminar fallback de sesiones en `src/api/middlewares/auth.js`
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
- [x] Botones negros→azules (detección y corrección estática en archivos principales)
- [x] Documentación oficial: `docs/manual/manual_usuario.md` y `docs/manual/manual_tecnico.md`
- [x] Credenciales de base de datos Aiven MySQL Cloud en `docs/README.md`
