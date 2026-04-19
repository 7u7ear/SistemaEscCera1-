---
trigger: always_on
---

# ⚙️ REGLAS OPERATIVAS IA (OBLIGATORIAS)

## 1. CONTEXTO FIJO

- Proyecto real en desarrollo (NO ejemplo)
- Backend: Node.js + Express
- Base de datos: MySQL
- Frontend: HTML + Bootstrap
- Arquitectura: MVC + Service Layer
- Autenticación: JWT

NO cambiar stack ni arquitectura.

---

## 2. FORMA DE RESPUESTA

- Responder SOLO lo pedido
- Sin introducciones ni conclusiones
- Priorizar código sobre explicación
- Explicaciones máximo 5 líneas
- No repetir información

---

## 3. CÓDIGO

- Código listo para producción
- No código de ejemplo ni tutorial
- No simplificar lógica real
- Mantener consistencia con el proyecto existente

---

## 4. ESTRUCTURA

Respetar siempre:

/controllers  
/services  
/routes  
/models  
/middlewares  
/config  

- No mezclar responsabilidades

---

## 5. BASE DE DATOS

- NO inventar tablas ni campos
- Respetar estructura existente
- No asumir relaciones

Si falta información → preguntar

---

## 6. LÓGICA

- Toda lógica en services
- Controllers solo request/response
- No duplicar lógica

---

## 7. DRY

- No repetir código
- Reutilizar funciones existentes

---

## 8. ASYNC

- Usar async/await
- NO usar .then()

---

## 9. VALIDACIÓN

- Validar todos los inputs
- No confiar en frontend

---

## 10. ERRORES

- try/catch obligatorio
- Respuestas HTTP correctas
- No console.log en producción
- No exponer errores internos

---

## 11. AUTENTICACIÓN

- Usar JWT
- No usar sesiones
- Proteger rutas con middleware

---

## 12. SEGURIDAD

- Sanitizar inputs (SQL Injection, XSS)
- Hash de contraseñas (bcrypt)
- Rate limit en endpoints críticos
- No hardcodear datos sensibles
- Usar variables de entorno

---

## 13. CONSISTENCIA

- Naming en inglés
- camelCase
- Mismo estilo en todo el proyecto

---

## 14. PERFORMANCE

- Evitar queries innecesarias
- Usar joins correctamente
- Preparar paginación

---

## 15. FRONTEND

- HTML + Bootstrap simple
- Sin lógica compleja
- Consumir API backend

---

## 16. REGLAS DE NEGOCIO

- Validar consistencia antes de guardar
- No permitir estados inválidos
- Centralizar reglas en services

---

## 17. AUDITORÍA

Registrar:
- creación
- edición
- eliminación

Campos:
- user_id
- acción
- entidad
- fecha

---

## 18. CONTROL DE ERRORES PREVIOS

- No repetir soluciones que fallaron
- Adaptarse al estado actual del sistema

---

## 19. MODO PROFESIONAL

- No explicar conceptos básicos
- No usar lenguaje de tutorial
- Actuar como desarrollador senior

---

## 20. OPTIMIZACIÓN DE TOKENS

- Respuestas cortas
- Sin relleno
- Sin redundancias

---

## 21. REGLA FINAL

Si falta información:
→ NO asumir
→ NO inventar
→ PREGUNTAR

---

## 22. NIVEL PRODUCTO (OBLIGATORIO)

Este sistema está destinado a ser vendido.

Debe ser:
- Seguro
- Mantenible
- Escalable
- Instalable fácilmente
- Comprensible por otro desarrollador

Evitar soluciones rápidas que comprometan el producto.