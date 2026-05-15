# Manual de Usuario - Sistema de Gestión Escolar CERA 1

## 1. Introducción
El Sistema de Gestión Escolar CERA 1 es una plataforma integral diseñada para la administración eficiente de recursos humanos, cargos docentes y control de asistencia. El sistema utiliza una arquitectura moderna basada en Node.js, MySQL y seguridad JWT para garantizar la integridad y disponibilidad de los datos.

---

## 2. Acceso y Seguridad

### 2.1 Inicio de Sesión
- El acceso está restringido a usuarios registrados y aprobados.
- El sistema utiliza **JSON Web Tokens (JWT)** para mantener sesiones seguras sin necesidad de cookies persistentes.

### 2.2 Gestión de Usuarios
- Roles disponibles: **ADMINISTRADOR**, **SECRETARIO**, **CONDUCCION**, **AUXILIAR ADMINISTRATIVO**, **OFICINA DE ALUMNOS**, **PRECEPTOR/A**, **DOCENTE**, **BIBLIOTECA**, **ESTUDIANTE**.
- Los administradores y secretarios pueden aprobar registros pendientes y asignar estos roles desde el módulo de **Gestión de Usuarios**.

### 2.3 Panel de Gestión de Usuarios
- **Usuarios Pendientes**: Aparecen destacados en el panel para una acción rápida.
- **Asignación de Perfiles**: Es obligatorio asignar un rol antes de activar una cuenta.
- **Creación Administrativa**: Los usuarios con privilegios pueden crear cuentas directamente, saltando el proceso de registro público.

---

## 3. Módulo de Cargos y Puestos

Este es el núcleo del sistema, donde se gestiona la estructura de la institución.

### 3.1 Gestión de Puestos
- Creación y edición de puestos con número identificador único.
- Definición de carga horaria total por puesto.
- Visualización de la **Cadena Activa**: permite ver quién ocupa el cargo actualmente y quiénes son sus suplentes en cascada.

### 3.2 Asignación de Docentes
- **Situaciones de Revista**: Titular, Interino y Suplente.
- **Lógica de Reemplazo**: El sistema valida automáticamente que no existan dos titulares activos. Al asignar un suplente, se vincula directamente al docente que está reemplazando, manteniendo la trazabilidad.
- **Historial**: Registro completo de todos los docentes que han pasado por un puesto determinado.

---

## 4. Módulo de Licencias y Tramitaciones

### 4.1 Registro de Licencias
- Gestión de inasistencias vinculadas a códigos de trámite específicos.
- Al cargar una licencia, el sistema permite disparar el proceso de búsqueda de reemplazo (Suplente).

### 4.2 Códigos de Trámite
- Catálogo configurable de motivos de licencia según normativa vigente.

---

## 5. Distribución Horaria

### 5.1 Organización Académica
- Permite desglosar la carga horaria de un puesto en diferentes materias y cursos.
- Validación de horas: El sistema impide asignar más horas de las que el puesto tiene declaradas.
- Soporte para tareas "Extra-clase" o funciones institucionales no vinculadas a un curso específico.

---

## 6. Gestión Académica (Docentes, Materias y Cursos)

- **Docentes**: Base de datos centralizada con información de contacto y legajo.
- **Materias**: Listado de asignaturas por plan de estudio.
- **Cursos**: Estructura de años y divisiones de la institución.

---

## 7. Planilla de Firmas

- Generación automatizada de planillas de asistencia diaria.
- El sistema cruza los datos de Cargos, Distribución Horaria y Licencias para mostrar quién debe firmar en cada bloque horario.
- Exportación lista para impresión en formato profesional.

---

## 8. Auditoría del Sistema

Para garantizar la transparencia y seguridad, el sistema registra automáticamente cada acción crítica:
- **Datos registrados**: Usuario que realizó la acción, tipo de acción (Creación, Edición, Eliminación), entidad afectada, fecha y hora exacta.
- Este módulo permite reconstruir el historial de cambios ante cualquier inconsistencia.

---

## 9. Tecnologías Utilizadas
- **Backend**: Node.js + Express
- **Base de Datos**: MySQL
- **Frontend**: HTML5 + Bootstrap 5 (Responsive)
- **Seguridad**: JWT (Authentication) + Bcrypt (Password Hashing)
