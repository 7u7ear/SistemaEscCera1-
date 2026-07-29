# Listado de Pendientes - Proyecto CERA 1 (Checkpoint Definitivo)

Este documento centraliza el 100% de las tareas, especificaciones y parámetros acordados para continuar en el próximo desarrollo.

## 📌 Checklist Definitiva de Desarrollo (Próximos Pasos)

### 1️⃣ Licencias Pendientes y Envíos de Mails
- [ ] **Solicitud Docente**: Solicitud de licencia que afecta al puesto inmediatamente y genera la solicitud en estado `PENDIENTE`.
- [ ] **Asignación Preceptor-Curso**: Tabla `curso_preceptor` e interfaz para asignar los preceptores a cargo de cada curso.
- [ ] **Notificación Automática por Email (Entrada)**: Envío de correo en HTML al Preceptor del curso afectado y a Secretaría (`licencias@...`).
- [ ] **Notificación Automática por Email (Resolución)**: Envío de correo en HTML al Docente avisándole cuando su licencia sea **Aprobada** o **Rechazada**.
- [ ] **Servicio SMTP & Fallback**: Módulo `email.service.js` (si no hay SMTP configurado en `.env`, escribe el correo en `logs/email.log`).

### 2️⃣ Recuperación de Contraseña ("¿Olvidaste tu contraseña?")
- [ ] **Opción en Login**: Enlace en `login.html` para solicitar restablecimiento de clave sin intervención administrativa.
- [ ] **Token de Seguridad**: Enlace enviado por email con token único y validez de **1 hora**.

### 3️⃣ Botones y Archivos de Mails por Curso Específico
- [ ] **Tres Listas Independientes por Curso**:
  - 1. Mails de **Estudiantes**.
  - 2. Mails de **Tutores / Padres**.
  - 3. Mails de **Docentes de ese curso** (únicamente profesores que dictan materias en ese curso).
- [ ] **Botón "Copiar al Portapapeles"**: Copia todas las direcciones en formato separado por comas (listo para pegar en CCO/BCC de Gmail/Outlook).
- [ ] **Botón "Descargar Archivo"**: Descarga del listado en archivo `.txt` / `.csv`.

### 4️⃣ Visibilidad Dinámica por Permisos (Sidebar)
- [ ] **Ocultamiento Total**: Ocultar por completo las opciones del menú lateral para los módulos donde el rol del usuario no tenga permisos de lectura o edición.

### 5️⃣ Visualizador de Auditoría
- [ ] **Pantalla de Logs**: Interfaz para Administradores y Conducción con filtro por fecha, usuario y entidad.

---

## 🟡 Media Prioridad (Funcionalidades Adicionales)

- [ ] **Reportes y Constancias en PDF**: Generación automatizada de constancias de Alumno Regular y pases.
- [ ] **Módulo de Biblioteca**: Gestión del catálogo bibliográfico y préstamos.

---

## 🟢 Baja Prioridad / Mejoras Futuras

- [ ] **Dashboard Estadístico**: Gráficos interactivos de ausentismo docente y cupos de alumnos.
- [ ] **Alertas Generales**: Avisos automáticos sobre vencimiento de licencias.

---

## ✅ Completado Recientemente

- [x] Gestión de Usuarios (Aprobación, perfiles iniciales y creación por admin).
- [x] Definición de los 9 perfiles institucionales.
- [x] Módulo de Planilla de Firmas funcional cruzando cargos, horarios y licencias.
- [x] Módulo de Tramitaciones integrado con Cargos.
- [x] Módulo de Licencias vinculado a cargos docentes.
- [x] Módulo de Alumnos (Legajos, matriculación y materias adeudadas).
- [x] Documentación oficial en `docs/manual/manual_usuario.md` y `docs/manual/manual_tecnico.md`.
- [x] Actualización de credenciales de base de datos Aiven MySQL Cloud en `docs/README.md`.
