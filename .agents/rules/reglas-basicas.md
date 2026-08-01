---
trigger: always_on
---

# ⚙️ REGLAS OPERATIVAS IA (OBLIGATORIAS)

## 1. CONTEXTO DEL PROYECTO

* Proyecto real en producción (NO ejemplo).
* Sistema de gestión escolar destinado a comercializarse.
* Backend: Node.js + Express.
* Base de datos: MySQL.
* Frontend: HTML + Bootstrap.
* Arquitectura: MVC + Service Layer.
* Autenticación: JWT.

**No cambiar tecnologías ni arquitectura sin autorización explícita.**

---

## 2. OBJETIVO

Toda solución debe priorizar:

* Calidad.
* Seguridad.
* Escalabilidad.
* Mantenibilidad.
* Rendimiento.
* Reutilización.
* Fácil instalación.
* Fácil mantenimiento por otros desarrolladores.

Nunca proponer soluciones rápidas que comprometan el producto.

---

## 3. FORMA DE RESPUESTA

* Responder únicamente lo solicitado.
* Priorizar código listo para producción.
* Explicar solo cuando sea necesario.
* No escribir como tutorial.
* No repetir información.

---

## 4. CONSISTENCIA DEL PROYECTO

Antes de generar código:

* Revisar el código relacionado.
* Mantener el estilo existente.
* Reutilizar funciones, clases y archivos existentes.
* No crear código duplicado.
* No romper compatibilidad.

---

## 5. ARQUITECTURA

Respetar siempre:

* controllers
* services
* models
* routes
* middlewares
* config

Controllers únicamente Request / Response.

Toda la lógica pertenece a Services.

---

## 6. BASE DE DATOS

* No inventar tablas.
* No inventar columnas.
* No asumir relaciones.
* No modificar el modelo sin autorización.

Si falta información:

**Preguntar antes de generar código.**

---

## 7. VALIDACIONES

Siempre validar:

* datos recibidos
* tipos
* campos obligatorios
* reglas de negocio
* permisos

Nunca confiar en el frontend.

---

## 8. ERRORES

Obligatorio:

* try/catch
* respuestas HTTP correctas
* mensajes claros para el usuario
* no exponer errores internos
* registrar errores mediante logger

Nunca usar console.log() en producción.

---

## 9. SEGURIDAD

Siempre aplicar:

* JWT
* bcrypt
* consultas parametrizadas
* sanitización de entradas
* protección contra SQL Injection
* protección contra XSS
* variables de entorno
* rate limit cuando corresponda

Nunca hardcodear información sensible.

---

## 10. SQL Y RENDIMIENTO

* Evitar SELECT *
* Optimizar consultas
* Evitar consultas repetidas
* Usar JOIN correctamente
* Preparar paginación
* Filtrar en la base de datos, no en JavaScript

---

## 11. TRANSACCIONES

Cuando una operación afecte varias tablas:

* usar transacciones
* rollback completo ante cualquier error

Nunca dejar datos inconsistentes.

---

## 12. FRONTEND

* HTML + Bootstrap.
* Sin lógica de negocio.
* Consumir únicamente la API.
* Componentes reutilizables.
* JavaScript limpio y mantenible.

---

## 13. MENSAJES DE ERROR

Nunca mostrar:

* [object Object]
* stack trace
* errores técnicos

Siempre utilizar:

```javascript
alert(api.getErrorMessage(err));
```

Los errores técnicos deben registrarse únicamente en el backend.

---

## 14. AUDITORÍA

Registrar las operaciones importantes:

* creación
* edición
* eliminación

Campos mínimos:

* usuario
* acción
* entidad
* fecha

Siempre que sea posible conservar historial de cambios.

---

## 15. ELIMINACIÓN

Evitar DELETE físico.

Preferir:

* estado = Inactivo
* deleted_at

Eliminar definitivamente solo cuando sea necesario.

---

## 16. CONFIGURACIÓN

Toda configuración debe provenir de:

* variables de entorno
* archivos de configuración

Nunca hardcodear:

* URLs
* claves
* puertos
* rutas

---

## 17. RESPUESTAS DE LA API

Mantener un formato consistente.

Éxito:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "message": "",
    "details": {}
  }
}
```

---

## 18. MODIFICACIONES

Antes de modificar código existente:

* analizar impacto
* mantener compatibilidad
* no eliminar funcionalidades sin autorización
* evitar efectos secundarios

---

## 19. CALIDAD DEL CÓDIGO

El código debe ser:

* limpio
* legible
* modular
* reutilizable
* desacoplado
* consistente

Seguir principios DRY y responsabilidad única.

---

## 20. DOCUMENTACIÓN

Cuando una modificación sea importante indicar:

* archivos modificados
* motivo
* impacto
* pasos adicionales si fueran necesarios

---

## 21. REGLA FINAL

Si existe cualquier duda sobre:

* estructura
* tablas
* relaciones
* reglas de negocio
* funcionamiento actual

**NO asumir.**

**NO inventar.**

**Preguntar primero.**

---

## 22. REGLA MAESTRA

Actuar siempre como un desarrollador senior responsable de un producto comercial.

Cada respuesta debe poder incorporarse directamente al sistema con el menor riesgo posible, priorizando estabilidad, calidad y mantenimiento a largo plazo.
