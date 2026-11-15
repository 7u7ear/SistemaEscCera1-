-- =======================================================================
-- MIGRACIÓN: Normalización de Nombres y Texto a MAYÚSCULAS sin acentos
-- Base de datos: Sistema Escolar CERA 1
-- Fecha: 2026-11-15
-- Objetivo:
--  - Convertir nombres y descripciones en docentes, materias, alumnos, familiares,
--    cargos y usuarios a MAYÚSCULAS.
--  - Eliminar acentos/tildes y diéresis (Á, É, Í, Ó, Ú, Ü -> A, E, I, O, U) preservando Ñ.
--  - Reparar caracteres históricos corruptos ('?') de importaciones previas.
--  - Preservar correos electrónicos intactos en minúsculas.
-- =======================================================================

-- 1. DOCENTES
UPDATE `docentes` SET 
    `apellido` = UPPER(TRIM(`apellido`)),
    `nombre` = UPPER(TRIM(`nombre`)),
    `email` = LOWER(TRIM(`email`))
WHERE `id` > 0;

UPDATE `docentes` SET 
    `apellido` = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`apellido`, 'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U'),
    `nombre` = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`nombre`, 'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U')
WHERE `id` > 0;

-- 2. ALUMNOS
UPDATE `alumnos` SET 
    `apellido` = UPPER(TRIM(`apellido`)),
    `nombre` = UPPER(TRIM(`nombre`)),
    `email` = LOWER(TRIM(`email`))
WHERE `id` > 0;

UPDATE `alumnos` SET 
    `apellido` = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`apellido`, 'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U'),
    `nombre` = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`nombre`, 'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U')
WHERE `id` > 0;

-- 3. FAMILIARES
UPDATE `familiares` SET 
    `apellido` = UPPER(TRIM(`apellido`)),
    `nombre` = UPPER(TRIM(`nombre`)),
    `parentesco` = UPPER(TRIM(`parentesco`)),
    `email` = LOWER(TRIM(`email`))
WHERE `id` > 0;

UPDATE `familiares` SET 
    `apellido` = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`apellido`, 'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U'),
    `nombre` = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`nombre`, 'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U'),
    `parentesco` = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`parentesco`, 'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U')
WHERE `id` > 0;

-- 4. CARGOS
UPDATE `cargos` SET 
    `tipo_cargo` = UPPER(TRIM(`tipo_cargo`))
WHERE `id` > 0;

UPDATE `cargos` SET 
    `tipo_cargo` = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`tipo_cargo`, 'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U')
WHERE `id` > 0;

-- Reparar caracteres '?' históricos en cargos
UPDATE `cargos` SET `tipo_cargo` = REPLACE(`tipo_cargo`, 'PEDAG?GICO', 'PEDAGOGICO') WHERE `tipo_cargo` LIKE '%PEDAG?GICO%';
UPDATE `cargos` SET `tipo_cargo` = REPLACE(`tipo_cargo`, 'EDUCACI?N', 'EDUCACION') WHERE `tipo_cargo` LIKE '%EDUCACI?N%';
UPDATE `cargos` SET `tipo_cargo` = REPLACE(`tipo_cargo`, 'F?SICA', 'FISICA') WHERE `tipo_cargo` LIKE '%F?SICA%';

-- 5. MATERIAS
UPDATE `materias` SET 
    `nombre` = UPPER(TRIM(`nombre`))
WHERE `id` > 0;

UPDATE `materias` SET 
    `nombre` = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`nombre`, 'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U')
WHERE `id` > 0;

-- Reparar caracteres '?' históricos en materias
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'ALFARER?A', 'ALFARERIA') WHERE `nombre` LIKE '%ALFARER?A%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'P?BLICO', 'PUBLICO') WHERE `nombre` LIKE '%P?BLICO%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'CER?MICA', 'CERAMICA') WHERE `nombre` LIKE '%CER?MICA%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'CER?MICO', 'CERAMICO') WHERE `nombre` LIKE '%CER?MICO%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'M?SICA', 'MUSICA') WHERE `nombre` LIKE '%M?SICA%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'PL?STICA', 'PLASTICA') WHERE `nombre` LIKE '%PL?STICA%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'PEDAG?GICO', 'PEDAGOGICO') WHERE `nombre` LIKE '%PEDAG?GICO%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'C?TEDRA', 'CATEDRA') WHERE `nombre` LIKE '%C?TEDRA%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'BIOL?GICAS', 'BIOLOGICAS') WHERE `nombre` LIKE '%BIOL?GICAS%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'DECORACI?N', 'DECORACION') WHERE `nombre` LIKE '%DECORACI?N%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'EDUCACI?N', 'EDUCACION') WHERE `nombre` LIKE '%EDUCACI?N%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'C?VICA', 'CIVICA') WHERE `nombre` LIKE '%C?VICA%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'F?SICA', 'FISICA') WHERE `nombre` LIKE '%F?SICA%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'TECNOL?GICA', 'TECNOLOGICA') WHERE `nombre` LIKE '%TECNOL?GICA%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'F?SICO', 'FISICO') WHERE `nombre` LIKE '%F?SICO%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'QU?MICA', 'QUIMICA') WHERE `nombre` LIKE '%QU?MICA%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'FORMACI?N', 'FORMACION') WHERE `nombre` LIKE '%FORMACI?N%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'INSTRUCCI?N', 'INSTRUCCION') WHERE `nombre` LIKE '%INSTRUCCI?N%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'FRANC?S', 'FRANCES') WHERE `nombre` LIKE '%FRANC?S%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'MOLDER?A', 'MOLDERIA') WHERE `nombre` LIKE '%MOLDER?A%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'PSIC?LOGO', 'PSICOLOGO') WHERE `nombre` LIKE '%PSIC?LOGO%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'PSICOLOG?A', 'PSICOLOGIA') WHERE `nombre` LIKE '%PSICOLOG?A%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'REUNI?N', 'REUNION') WHERE `nombre` LIKE '%REUNI?N%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'ELECCI?N', 'ELECCION') WHERE `nombre` LIKE '%ELECCI?N%';
UPDATE `materias` SET `nombre` = REPLACE(`nombre`, 'AN?LISIS', 'ANALISIS') WHERE `nombre` LIKE '%AN?LISIS%';

-- 6. USUARIOS
UPDATE `usuarios` SET 
    `nombre` = UPPER(TRIM(`nombre`)),
    `email` = LOWER(TRIM(`email`))
WHERE `id` > 0;

UPDATE `usuarios` SET 
    `nombre` = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`nombre`, 'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U')
WHERE `id` > 0;
