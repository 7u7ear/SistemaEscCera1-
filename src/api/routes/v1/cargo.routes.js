const express = require('express');
const CargoController = require('../../controllers/cargo.controller');
const auth = require('../../middlewares/auth'); // assuming paths or we'll move them soon
const permisoModulo = require('../../middlewares/permisos');

const router = express.Router();

// All routes are protected and require a session
router.use(auth);

router.get('/',
    permisoModulo('docentes', 'lectura'),
    CargoController.getAll
);

router.post('/',
    permisoModulo('docentes', 'edicion'),
    CargoController.create
);

router.put('/:id',
    permisoModulo('docentes', 'edicion'),
    CargoController.update
);

router.delete('/:id',
    permisoModulo('docentes', 'edicion'),
    CargoController.delete
);

router.get('/:id/historial',
    CargoController.getHistorial
);

router.post('/:id/asignar',
    permisoModulo('docentes', 'edicion'),
    CargoController.assignDocente
);

router.get('/:id/distribucion',
    permisoModulo('docentes', 'lectura'),
    CargoController.getDistribucion
);

router.post('/:id/distribucion',
    permisoModulo('docentes', 'edicion'),
    CargoController.addDistribucion
);

// --- Tipos de Hora ---
router.get('/config/tipos-hora',
    permisoModulo('docentes', 'lectura'),
    CargoController.getTiposHora
);

router.post('/config/tipos-hora',
    permisoModulo('docentes', 'edicion'),
    CargoController.createTipoHora
);

// --- Cadena Activa ---
router.get('/:id/cadena-activa',
    permisoModulo('docentes', 'lectura'),
    CargoController.getActiveChain
);

module.exports = router;
