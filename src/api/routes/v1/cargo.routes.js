const express = require('express');
const CargoController = require('../../controllers/cargo.controller');
const auth = require('../../middlewares/auth');
const permisoModulo = require('../../middlewares/permisos');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// --- 1. Rutas estáticas o sub-recursos con prefijo específico (DEBEN IR PRIMERO) ---

// Tipos de hora
router.get('/config/tipos-hora',
    permisoModulo('docentes', 'lectura'),
    CargoController.getTiposHora
);

router.post('/config/tipos-hora',
    permisoModulo('docentes', 'edicion'),
    CargoController.createTipoHora
);

// Distribución por ID directo
router.put('/distribucion/:id',
    permisoModulo('docentes', 'edicion'),
    CargoController.updateDistribucion
);

router.delete('/distribucion/:id',
    permisoModulo('docentes', 'edicion'),
    CargoController.deleteDistribucion
);

// --- 2. Rutas raíz del recurso ---
router.get('/',
    permisoModulo('docentes', 'lectura'),
    CargoController.getAll
);

router.post('/',
    permisoModulo('docentes', 'edicion'),
    CargoController.create
);

// --- 3. Rutas con :id del puesto ---
router.get('/:id/historial',
    CargoController.getHistorial
);

router.post('/:id/asignar',
    permisoModulo('docentes', 'edicion'),
    CargoController.assignDocente
);

router.post('/:id/baja/:cargoDocenteId',
    permisoModulo('docentes', 'edicion'),
    CargoController.bajaDocente
);

router.get('/:id/distribucion',
    permisoModulo('docentes', 'lectura'),
    CargoController.getDistribucion
);

router.post('/:id/distribucion',
    permisoModulo('docentes', 'edicion'),
    CargoController.addDistribucion
);

router.get('/:id/cadena-activa',
    permisoModulo('docentes', 'lectura'),
    CargoController.getActiveChain
);

router.put('/:id',
    permisoModulo('docentes', 'edicion'),
    CargoController.update
);

router.delete('/:id',
    permisoModulo('docentes', 'edicion'),
    CargoController.delete
);

module.exports = router;
