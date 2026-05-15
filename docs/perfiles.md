# Definición de Perfiles y Roles - Sistema CERA 1

A continuación se detallan los perfiles identificados para el sistema. Se utilizarán para la gestión de accesos y permisos granulares por módulo.

## Perfiles del Sistema

1. **ADMINISTRADOR**
   - Acceso total al sistema.
   - Gestión de usuarios, perfiles y permisos.
   - Visualización de auditoría completa.
   - Configuración técnica del sistema.

2. **SECRETARIO**
   - Gestión integral de Cargos y Puestos.
   - Gestión de Docentes y sus situaciones de revista.
   - Control de Licencias y Tramitaciones.
   - Generación de Planillas de Firmas.

3. **CONDUCCIÓN** (Directivos)
   - Acceso de lectura a todos los módulos.
   - Firma digital de tramitaciones (si aplica).
   - Visualización de reportes estadísticos.

4. **AUXILIAR ADMINISTRATIVO**
   - Apoyo en la carga de datos de Secretaría.
   - Gestión de trámites específicos.
   - Consulta de legajos docentes.

5. **OFICINA DE ALUMNOS**
   - Gestión de legajos de estudiantes.
   - Inscripciones y pases.
   - Emisión de constancias de alumno regular.

6. **PRECEPTOR/A**
   - Gestión de asistencia de alumnos por curso asignado.
   - Control de la planilla de firmas diaria de sus cursos.
   - Comunicación con familias.

7. **DOCENTE**
   - Consulta de situación de revista propia.
   - Carga de notas y asistencia (si se implementa el módulo pedagógico).
   - Solicitud de licencias.

8. **BIBLIOTECA**
   - Gestión del catálogo de libros.
   - Préstamos y devoluciones.
   - Control de inventario.

9. **ESTUDIANTE**
   - Consulta de asistencia y notas.
   - Solicitud de constancias.
   - Acceso a recursos de biblioteca.

---

## Próximos Pasos
- Definir la matriz de permisos (Lectura/Escritura) para cada módulo basándose en estos perfiles.
- Implementar la lógica de verificación de perfiles en el middleware de autenticación.
