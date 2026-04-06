const express = require('express');
const router = express.Router();

const cargoRoutes = require('./cargo.routes');
const usuarioRoutes = require('./usuario.routes');
const licenciaRoutes = require('./licencia.routes');
const docenteRoutes = require('./docente.routes');
const materiaRoutes = require('./materia.routes');
const cursoRoutes = require('./curso.routes');
const tramitacionRoutes = require('./tramitacion.routes');
const codigoTramiteRoutes = require('./codigo_tramite.routes');
const planillaRoutes = require('./planilla.routes');

// Define API v1 routes
router.use('/cargos', cargoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/licencias', licenciaRoutes);
router.use('/docentes', docenteRoutes);
router.use('/materias', materiaRoutes);
router.use('/cursos', cursoRoutes);
router.use('/tramitaciones', tramitacionRoutes);
router.use('/codigos-tramite', codigoTramiteRoutes);
router.use('/planilla-firmas', planillaRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'API v1 is healthy', timestamp: new Date() });
});

module.exports = router;
