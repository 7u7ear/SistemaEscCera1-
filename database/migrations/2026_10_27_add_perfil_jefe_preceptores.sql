-- Migración: Agregar nuevo perfil 'JEFE DE PRECEPTORES/AS' y sus permisos iniciales

-- 1. Insertar nuevo perfil si no existe
INSERT INTO `perfiles` (`nombre`, `created_at`)
SELECT 'JEFE DE PRECEPTORES/AS', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM `perfiles` WHERE `nombre` = 'JEFE DE PRECEPTORES/AS'
);

-- 2. Asignar permisos por defecto en perfil_modulo
-- Estudiantes: Edición
INSERT INTO `perfil_modulo` (`perfil_id`, `modulo_id`, `permiso`)
SELECT p.id, m.id, 'edicion'
FROM `perfiles` p, `modulos` m
WHERE p.nombre = 'JEFE DE PRECEPTORES/AS' AND m.nombre = 'estudiantes'
ON DUPLICATE KEY UPDATE `permiso` = VALUES(`permiso`);

-- Planilla de Firmas: Edición
INSERT INTO `perfil_modulo` (`perfil_id`, `modulo_id`, `permiso`)
SELECT p.id, m.id, 'edicion'
FROM `perfiles` p, `modulos` m
WHERE p.nombre = 'JEFE DE PRECEPTORES/AS' AND m.nombre = 'planilla_firmas'
ON DUPLICATE KEY UPDATE `permiso` = VALUES(`permiso`);

-- Docentes: Lectura
INSERT INTO `perfil_modulo` (`perfil_id`, `modulo_id`, `permiso`)
SELECT p.id, m.id, 'lectura'
FROM `perfiles` p, `modulos` m
WHERE p.nombre = 'JEFE DE PRECEPTORES/AS' AND m.nombre = 'docentes'
ON DUPLICATE KEY UPDATE `permiso` = VALUES(`permiso`);
