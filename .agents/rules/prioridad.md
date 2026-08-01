# Orden de Prioridad de Desarrollo — CERA 1

> Generado: 2026-08-01 · Basado en auditoría de compliance del proyecto.
> Este archivo define el orden exacto en que deben encararse las tareas pendientes.
> Ver `docs/pendientes.md` para el detalle de cada ítem.

---

## 🔴 NIVEL 1 — Correcciones Inmediatas (bugs activos / violaciones de reglas)

Son incumplimientos de las reglas del proyecto detectados en auditoría. Se deben resolver **antes de cualquier funcionalidad nueva**.

1. Eliminar `credentials: "include"` en `src/web/utils/api.js` línea 21 — viola regla JWT-only
2. Eliminar 4 `console.log()` en frontend:
   - `src/web/components/licenciasComponent.js` línea 116
   - `src/web/components/permisosComponent.js` línea 82
   - `src/web/components/tramitacionesComponent.js` líneas 156 y 163
3. Agregar auditoría a `licencia.service.js` (create, update, delete)
4. Agregar auditoría a `tramitacion.service.js`
5. Decidir con el usuario si `DELETE FROM alumnos` en `alumno.service.js` debe ser soft-delete

---

## 🔴 NIVEL 2 — Funcionalidades Core (tienen dependencias entre sí)

6. `email.service.js` — Nodemailer + SMTP + fallback a `logs/email.log` **(base de todo lo que sigue)**
7. Tabla `curso_preceptor` + interfaz de asignación de preceptores por curso
8. Notificaciones email al crear/resolver licencia (depende de 6 y 7)
9. Recuperación de contraseña — `password_reset.service.js` + routes + modal en `login.html`

---

## 🟠 NIVEL 3 — Funcionalidades Importantes (sin dependencias bloqueantes)

10. Sidebar dinámico — ocultar ítems del menú según permisos L/E del rol en `dashboard_script.js`
11. Botones de mails por curso (Estudiantes / Tutores / Docentes) con copiar y descargar TXT/CSV
12. Visualizador de Auditoría — pantalla con filtros (fecha, usuario, entidad) para Admin/Conducción

---

## 🟠 NIVEL 4 — Deuda Técnica General

13. Campo `anio_materia` en materias adeudadas del alumno (BD + frontend ficha)
14. Revisión visual botones negros → azules en modales: tramitaciones, licencias, docentes, cargos

---

## 🟡 NIVEL 5 — Media Prioridad

15. Reportes y constancias en PDF (Alumno Regular, pases)
16. Módulo de Biblioteca (catálogo + préstamos)

---

## 🟢 NIVEL 6 — Mejoras Futuras

17. Dashboard estadístico con gráficos (ausentismo docente, cupos de alumnos)
18. Alertas automáticas por vencimiento de licencias
