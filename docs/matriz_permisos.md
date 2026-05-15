# Propuesta: Matriz de Permisos - Sistema CERA 1

Esta matriz define el nivel de acceso de cada perfil a los diferentes módulos del sistema.

**Niveles de Acceso:**
- **L**: Leer (Ver listados y detalles)
- **E**: Escribir (Crear y Editar)
- **B**: Borrar (Eliminación lógica)
- **-**: Sin acceso
- **P**: Solo lo propio (Datos personales o cursos asignados)

| Módulo / Perfil | Admin | Secretario | Conducción | Aux. Admin | Of. Alumnos | Preceptor | Docente | Biblioteca | Estudiante |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Usuarios** | L E B | L E B | L | - | - | - | - | - | - |
| **Cargos / Puestos** | L E B | L E B | L | L E | - | L | - | - | - |
| **Docentes** | L E B | L E B | L | L E | - | L | L (P) | - | - |
| **Licencias / Trámites**| L E B | L E B | L | L E | - | L | L (P) | - | - |
| **Alumnos (Legajos)** | L E B | L E B | L | - | L E B | L | L | - | L (P) |
| **Asistencia Alumnos** | L E B | L E B | L | - | L E | L E | L | - | L (P) |
| **Planilla de Firmas** | L E B | L E B | L | L E | - | L E | L | - | - |
| **Biblioteca** | L E B | L E B | L | - | - | - | L | L E B | L |
| **Auditoría** | L | L | L | - | - | - | - | - | - |

---

## Observaciones de Lógica de Negocio

1. **Seguridad**: Solo el **Administrador** puede gestionar usuarios y perfiles.
2. **Secretaría**: Es el perfil con mayor poder sobre la estructura docente y cargos.
3. **Preceptores**: Tienen permiso de escritura (`E`) en **Asistencia** y **Planilla de Firmas**, pero limitado a sus cursos asignados (lógica que se implementará en el Service Layer).
4. **Conducción**: Perfil de supervisión general; ven todo pero no modifican datos operativos.
5. **Oficina de Alumnos**: Foco exclusivo en la gestión de estudiantes.
6. **Auxiliar Administrativo**: Puede cargar datos operativos pero el borrado (`B`) queda reservado para el Secretario o Admin para evitar errores accidentales.

---

## Preguntas para el Usuario

- ¿El **Docente** debería poder ver los listados de otros docentes o solo su propia ficha? (En la tabla puse `L(P)` para solo lo propio).
- ¿El **Preceptor** puede ver los legajos de todos los alumnos o solo los de sus cursos?
- ¿Falta algún módulo importante en esta lista inicial?
