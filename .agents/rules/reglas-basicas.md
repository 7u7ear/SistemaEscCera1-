---
trigger: always_on
---

# 📘 REGLAS BÁSICAS DE DESARROLLO – ESTÁNDAR PROFESIONAL

## 1. Estructura del Proyecto

* Mantener una estructura clara y minimalista:

  * `/src` → código fuente principal
  * `/tests` → pruebas automatizadas
  * `/docs` → documentación técnica y de usuario
  * `/config` → configuraciones y variables de entorno
* Usar `.gitignore` para excluir:

  * dependencias
  * logs
  * archivos temporales
* Nombrar archivos y carpetas de forma consistente y descriptiva.

---

## 2. Código Limpio y Escalable

* Seguir estándares de estilo (PEP8, ESLint, etc.).
* Evitar duplicación de código (DRY).
* Modularizar funciones y clases.
* Documentar con comentarios claros y concisos.
* Aplicar patrones de diseño:

  * MVC
  * Repository
  * Service Layer
* Priorizar legibilidad sobre complejidad.

---

## 3. Arquitectura del Sistema

* Usar separación por capas:

  * Dominio
  * Aplicación
  * Infraestructura
* Favorecer arquitecturas escalables:

  * Clean Architecture
  * Hexagonal
* Diseñar módulos desacoplados.

---

## 4. Seguridad

* Validar todas las entradas del usuario.
* Usar hashing seguro para contraseñas.
* Implementar:

  * Protección contra XSS
  * Protección contra CSRF
  * Prevención de SQL Injection
* No exponer errores sensibles en producción.
* Implementar roles y permisos.
* Registrar auditoría de acciones (logs de usuario).
* Usar HTTPS obligatorio.

---

## 5. Diseño y Experiencia de Usuario (UX)

* Interfaz clara, simple y consistente.
* Feedback inmediato:

  * mensajes de éxito
  * errores claros
* Cumplir estándares de accesibilidad (WCAG).
* Mantener coherencia visual (colores, tipografías, iconos).

---

## 6. Gestión de Datos

* Base de datos normalizada.
* Uso de migraciones versionadas.
* Implementar:

  * backups automáticos
  * políticas de recuperación
* Minimizar recolección de datos sensibles.
* Documentar el modelo de datos (ERD).

---

## 7. APIs y Comunicación

* Diseñar APIs consistentes:

  * REST o GraphQL
* Versionado (`/api/v1`)
* Uso de códigos HTTP correctos.
* Validación con schemas (Joi, Zod, etc.).
* Manejo uniforme de errores.
* Implementar rate limiting.

---

## 8. Manejo de Errores

* Centralizar manejo de errores.
* Diferenciar:

  * errores de usuario
  * errores internos
* Loggear errores críticos.
* No exponer stack traces en producción.

---

## 9. Observabilidad

* Implementar:

  * logging estructurado (JSON)
  * métricas (tiempos de respuesta, uso de recursos)
  * trazabilidad de requests
* Integrar herramientas como:

  * Prometheus
  * Grafana
  * OpenTelemetry

---

## 10. Testing y Control de Calidad

* Implementar:

  * pruebas unitarias
  * pruebas de integración
  * pruebas end-to-end
* Mantener alta cobertura de tests.
* Realizar:

  * pruebas de rendimiento
  * pruebas de seguridad
* Usar análisis estático de código.

---

## 11. Entornos y Configuración

* Separar entornos:

  * desarrollo
  * testing
  * producción
* Usar variables de entorno (`.env`).
* No hardcodear credenciales.
* Usar gestores de secretos si es necesario.

---

## 12. Contenerización y Entornos Reproducibles

* Usar Docker para:

  * backend
  * base de datos
* Implementar `docker-compose`.
* Incluir datos de prueba (seeds).
* Facilitar levantamiento del entorno completo.

---

## 13. Performance

* Implementar:

  * caching (Redis u otros)
  * paginación
* Optimizar consultas a base de datos (índices).
* Evitar cargas innecesarias.
* Aplicar lazy loading cuando corresponda.

---

## 14. Mantenimiento y Escalabilidad

* Mantener dependencias actualizadas.
* Preparar el sistema para crecer sin romper compatibilidad.
* Modularizar funcionalidades.
* Documentar cambios importantes.

---

## 15. Gestión de Versiones y Deploy

* Usar versionado semántico (SemVer).
* Implementar CI/CD.
* Tener entorno de staging.
* Documentar procesos de:

  * deploy
  * rollback

---

## 16. Automatización

* Usar herramientas:

  * ESLint / Prettier
* Hooks de Git (Husky).
* Ejecutar tests automáticamente en cada push.

---

## 17. Normas de Equipo

* Code reviews obligatorias.
* Commits claros:

  * `feat:`
  * `fix:`
  * `refactor:`
* Comunicación clara en issues.
* Uso de ramas (feature, develop, main).

---

## 18. Gestión de Dependencias

* Usar lockfiles.
* Auditar vulnerabilidades.
* Evitar dependencias innecesarias.

---

## 19. Documentación Profesional

* Mantener documentación actualizada.
* Incluir:

  * guía de instalación
  * guía de uso
  * guía de contribución
* Documentar APIs (Swagger/OpenAPI).
* Incluir diagramas:

  * arquitectura
  * base de datos
  * flujos

---

## 20. Pensamiento de Producto

* Entender el problema antes de programar.
* Diseñar soluciones centradas en el usuario.
* Evaluar impacto real del sistema.
* Medir resultados con métricas.
* Iterar y mejorar continuamente.

---

## 21. Principios Profesionales

* Planificar antes de codificar.
* Escribir código mantenible y claro.
* Manejar errores de forma robusta.
* Optimizar solo cuando sea necesario.
* Mantenerse actualizado.
* Trabajar con metodologías ágiles.

---

## 22. programar como un ingeniero en sistemas con muchos años de experiencia. 

# 📌 PRINCIPIO FINAL

> “El software no solo debe funcionar, debe ser mantenible, seguro, escalable y comprensible.”

---
