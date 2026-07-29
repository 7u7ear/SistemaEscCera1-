# Manual Técnico y de Administración - Sistema CERA 1

## 1. Arquitectura del Sistema
El sistema sigue una arquitectura en capas **MVC + Service Layer**:
- **Controladores (`/src/api/controllers`)**: Manejo de peticiones/respuestas HTTP y validaciones de entrada.
- **Servicios (`/src/api/services`)**: Lógica de negocio centralizada, validación de estado y reglas de inconsistencia.
- **Modelos (`/src/api/models`)**: Consultas a la base de datos MySQL mediante `mysql2/promise`.
- **Rutas (`/src/api/routes`)**: Endpoints de la API REST v1 expuestos bajo `/api/v1`.
- **Middlewares (`/src/api/middlewares`)**: Autenticación por token JWT, control de errores y auditoría de eventos.

---

## 2. Requisitos de Entorno
- **Node.js**: v18.0.0 o superior
- **Base de Datos**: MySQL 8.0+ o MariaDB 10.4+
- **Servidor Web / Runtime**: Node.js, PM2 (opcional para producción), WampServer/XAMPP para desarrollo local.

---

## 3. Configuración de Variables de Entorno (`.env`)
```env
PORT=3000
DB_HOST=mysql-fde0d9c-bdecn1.i.aivencloud.com
DB_PORT=23887
DB_USER=avnadmin
DB_PASS=tu_contraseña_aqui
DB_NAME=defaultdb
SESSION_SECRET=ceramica_secret_dev_2024
JWT_SECRET=ceramica_jwt_token_secret_2024
NODE_ENV=production
```

---

## 4. Despliegue e Instalación
1. Clonar el repositorio y posicionarse en la carpeta raíz del proyecto.
2. Instalar las dependencias de Node.js:
   ```bash
   npm install
   ```
3. Ejecutar los scripts de base de datos ubicados en `/database/schema.sql`.
4. Iniciar la aplicación:
   ```bash
   npm start
   ```

---

## 5. Auditoría y Registros
- **Logs del Servidor**: Gestión mediante `logger.service.js` registrado en consola y/o archivos de log.
- **Tabla de Auditoría**: Toda modificación de datos se registra automáticamente en la tabla `auditoria` asociando `user_id`, acción, entidad y timestamp.
