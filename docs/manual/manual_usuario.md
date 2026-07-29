# Manual de Usuario - Sistema ECN Nº1 Cerámica (CERA 1)

## 1. Introducción
El Sistema de Gestión Escolar CERA 1 es una plataforma integral web diseñada para la administración de personal docente, cargos y puestos institucionales, gestión de alumnos, licencias, tramitaciones de expedientes, distribución horaria y planilla de firmas.

---

## 2. Acceso y Autenticación
### 2.1 Inicio de Sesión
- El acceso requiere un usuario registrado y aprobado.
- La autenticación utiliza **JSON Web Tokens (JWT)** mediante la cabecera `Authorization: Bearer <token>`.

### 2.2 Registro de Usuarios
- Los nuevos usuarios pueden solicitar acceso mediante la pantalla de registro pública.
- La cuenta permanece en estado **PENDIENTE** hasta ser aprobada por un Administrador o Secretario.

### 2.3 Perfiles de Usuario
- **ADMINISTRADOR**: Acceso total a configuración, usuarios, auditoría y módulos.
- **SECRETARIO**: Gestión de cargos, docentes, licencias, tramitaciones y planilla de firmas.
- **CONDUCCIÓN**: Supervisión general y lectura de reportes.
- **AUXILIAR ADMINISTRATIVO**: Carga operativa en secretaría y trámites.
- **OFICINA DE ALUMNOS**: Gestión exclusiva de legajos e inscripciones de estudiantes.
- **PRECEPTOR/A**: Asistencia y planilla de firmas por curso asignado.
- **DOCENTE**: Consulta de situación de revista propia y solicitud de licencias.
- **BIBLIOTECA**: Consulta y gestión de material bibliográfico.
- **ESTUDIANTE**: Consulta de horarios y datos académicos.

---

## 3. Panel Inicio (Dashboard)
- **Resumen Institucional**: Indicadores en tiempo real de cantidad de Docentes, Cargos, Estudiantes Inscriptos y Cursos Configurados.
- **Alertas de Seguridad y Accesos**: Notificación destacada si existen solicitudes de registro pendientes de aprobación.
- **Botones de Navegación Rápida**: Acceso directo a los módulos de mayor frecuencia de uso.

---

## 4. Gestión de Usuarios
- **Panel de Pendientes**: Visualización y aprobación de solicitudes de registro. Es obligatorio asignar un Perfil/Rol antes de la activación.
- **Creación por Administrador**: Permite dar de alta cuentas de usuario directamente sin requerir registro público.
- **Gestión de Estados**: Activación, desactivación y modificación de perfiles de usuarios existentes.

---

## 5. Módulo de Cargos y Puestos Institucionales
- **Gestión de Puestos**: Creación y edición de cargos con número identificador y carga horaria total.
- **Cadena Activa**: Visualización jerárquica del titular actual del cargo y sus suplentes/interinos vinculados en cascada.
- **Situaciones de Revista**:
  - *Titular*: Ocupante principal del puesto.
  - *Interino*: Ocupante provisional sin titular previo.
  - *Suplente*: Ocupante temporal que reemplaza a un docente con licencia.
- **Asignación y Baja**: Asignación de docentes a puestos con registro de expediente y fecha.
- **Historial de Cargos**: Trazabilidad completa de docentes que han ocupado el puesto.
- **Distribución Horaria**: Desglose de horas del puesto por materias y cursos, impidiendo superar la carga horaria máxima del cargo.

---

## 6. Módulo de Docentes
- **Administración de Legajos**: Registro de DNI, CUIL, nombre, apellido, email, teléfono y fecha de ingreso.
- **Ficha del Docente**: Consulta de cargos activos, licencias cargadas e historial de revista.
- **Baja Lógica**: Desactivación del docente preservando su historial en la base de datos.

---

## 7. Módulo de Estudiantes (Alumnos)
- **Gestión de Legajos**: Registro de DNI, nombre, apellido, fecha de nacimiento, contacto y tutor responsable.
- **Asignación Académica**: Vinculación de alumnos a Cursos, Años y Divisiones.
- **Búsqueda y Filtros**: Búsqueda por DNI, apellido o curso asignado.

---

## 8. Módulo de Cursos, Materias y Horarios
- **Estructura Académica**: Configuración de Años, Divisiones y Turnos (Mañana, Tarde, Noche).
- **Plan de Estudios**: Catálogo de materias de la institución.
- **Bloques Horarios**: Definición de la grilla horaria semanal por curso y asignatura.

---

## 9. Módulo de Licencias
- **Registro de Licencias**: Carga de inasistencias indicando tipo de licencia (médica, examen, personal, etc.) y código de trámite según normativa.
- **Afectación de Cargos**: Selección de los puestos docentes afectados por la licencia para coordinar suplencias.

---

## 10. Módulo de Tramitaciones
- **Seguimiento de Expedientes**: Caratulación y seguimiento de trámites administrativos asociados a licencias o altas/bajas.
- **Estados**: `Caratulado`, `En trámite`, `Resuelto`, `Cancelado`.
- **Trazabilidad**: Registro de código de trámite, número de expediente y observaciones.

---

## 11. Planilla de Firmas
- **Generación Automatizada**: Cruce en tiempo real entre Cargos, Distribución Horaria, Bloques Horarios y Licencias.
- **Impresión y Exportación**: Vista estructurada diaria por fecha y curso lista para firma presencial o archivo.

---

## 12. Auditoría del Sistema
- Registro inmutable de acciones críticas (creación, modificación, eliminación).
- Captura de ID de usuario, tipo de acción, entidad afectada, detalle y fecha/hora exactas.
