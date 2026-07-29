const express = require('express');
const AlumnoController = require('../../controllers/alumno.controller');
const auth = require('../../middlewares/auth');
const permisoModulo = require('../../middlewares/permisos');

const router = express.Router();

router.use(auth);

// Alumnos CRUD
router.get('/', permisoModulo('estudiantes', 'lectura'), AlumnoController.getAll);
router.get('/:id', permisoModulo('estudiantes', 'lectura'), AlumnoController.getById);
router.post('/', permisoModulo('estudiantes', 'edicion'), AlumnoController.create);
router.put('/:id', permisoModulo('estudiantes', 'edicion'), AlumnoController.update);
router.delete('/:id', permisoModulo('estudiantes', 'edicion'), AlumnoController.delete);

// Inscripciones y pases
router.post('/matricular', permisoModulo('estudiantes', 'edicion'), AlumnoController.matricular);
router.post('/desinscribir', permisoModulo('estudiantes', 'edicion'), AlumnoController.desinscribir);
router.post('/trasladar', permisoModulo('estudiantes', 'edicion'), AlumnoController.trasladar);
router.get('/:id/movimientos', permisoModulo('estudiantes', 'lectura'), AlumnoController.getMovimientos);
router.get('/curso/:cursoId', permisoModulo('estudiantes', 'lectura'), AlumnoController.getPorCurso);

// Materias adeudadas
router.get('/:id/materias-adeudadas', permisoModulo('estudiantes', 'lectura'), AlumnoController.getMateriasAdeudadas);
router.post('/materias-adeudadas', permisoModulo('estudiantes', 'edicion'), AlumnoController.createMateriaAdeudada);
router.put('/materias-adeudadas/:id', permisoModulo('estudiantes', 'edicion'), AlumnoController.updateMateriaAdeudada);
router.delete('/materias-adeudadas/:id', permisoModulo('estudiantes', 'edicion'), AlumnoController.deleteMateriaAdeudada);

module.exports = router;
