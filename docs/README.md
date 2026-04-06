# Sistema de Gestión Escolar – ECN Nº1 Cerámica

Sistema web de gestión administrativa escolar para docentes, cargos, licencias y tramitaciones.

## 🛠 Tecnologías

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js 4 |
| Base de Datos | MySQL 8 (WAMP) |
| Validación | Zod |
| Logging | Winston |
| Seguridad | Helmet, bcrypt, express-session |
| Testing | Jest + Supertest |
| Calidad | ESLint v9, Prettier |

## 📁 Estructura del Proyecto

```
SistemaEscCera1/
├── src/
│   ├── api/
│   │   ├── controllers/      # Capa de interfaz HTTP
│   │   ├── services/         # Capa de lógica de negocio
│   │   ├── repositories/     # Capa de acceso a datos (SQL)
│   │   ├── routes/v1/        # Rutas API versionadas (/api/v1/...)
│   │   ├── middlewares/      # Auth, permisos, error handler
│   │   ├── validations/      # Schemas Zod por módulo
│   │   └── server.js         # Entry point de la aplicación
│   ├── shared/
│   │   └── errors/AppError.js # Error operacional centralizado
│   └── web/                  # Frontend estático (HTML/CSS/JS)
├── config/
│   └── database.js           # Conexión MySQL con pool
├── tests/
│   └── unit/                 # Tests unitarios (Jest)
├── docs/                     # Documentación técnica
├── .env.example              # Variables de entorno requeridas
├── .eslintrc.js              # Reglas de calidad de código
├── .prettierrc               # Formato de código
└── package.json
```

## 🚀 Instalación

### 1. Clonar y configurar entorno

```bash
git clone <repo>
cd SistemaEscCera1
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales locales
```

Variables requeridas en `.env`:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=bd_ecn1
SESSION_SECRET=una_clave_segura_aqui
NODE_ENV=development
```

### 3. Iniciar el servidor

```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`.

## 🧪 Tests

```bash
# Ejecutar todos los tests
npm test

# Watch mode
npm run test:watch

# Con cobertura
npm test -- --coverage
```

## 🔍 Calidad de Código

```bash
# Verificar linting
npm run lint

# Formatear código
npm run format
```

## 🔐 Seguridad

- Contraseñas hasheadas con **bcrypt**
- Sesiones protegidas con `httpOnly` y `sameSite=lax`
- Headers de seguridad vía **Helmet**
- Control de acceso basado en roles (**RBAC**) por módulo
- Validación de todas las entradas con **Zod**
- Sin exposición de stack traces en producción

## 📡 API

Todas las rutas están bajo `/api/v1`. Ver [`docs/API_REFERENCE.md`](./API_REFERENCE.md) para la referencia completa.

**Endpoint de salud:**
```
GET /api/v1/health
```

## 🏗 Arquitectura

Ver [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) para el diagrama de capas y decisiones de diseño.
