-- Migración: Normalizar codificación y ordinales en tabla 'cursos'

-- 1. Normalizar 'anio' a formato limpio con ordinal (ej: '1º', '2º', etc.)
UPDATE `cursos` SET `anio` = '1º' WHERE `anio` LIKE '1%';
UPDATE `cursos` SET `anio` = '2º' WHERE `anio` LIKE '2%';
UPDATE `cursos` SET `anio` = '3º' WHERE `anio` LIKE '3%';
UPDATE `cursos` SET `anio` = '4º' WHERE `anio` LIKE '4%';
UPDATE `cursos` SET `anio` = '5º' WHERE `anio` LIKE '5%';
UPDATE `cursos` SET `anio` = '6º' WHERE `anio` LIKE '6%';

-- 2. Normalizar 'division' a formato limpio con ordinal (ej: '1º', '2º', etc.)
UPDATE `cursos` SET `division` = '1º' WHERE `division` LIKE '1%';
UPDATE `cursos` SET `division` = '2º' WHERE `division` LIKE '2%';
UPDATE `cursos` SET `division` = '3º' WHERE `division` LIKE '3%';
UPDATE `cursos` SET `division` = '4º' WHERE `division` LIKE '4%';
UPDATE `cursos` SET `division` = '5º' WHERE `division` LIKE '5%';
UPDATE `cursos` SET `division` = '6º' WHERE `division` LIKE '6%';

-- 3. Normalizar turno si tuviera caracteres con codificación OEM (ej: 'MA├æANA' -> 'MAÑANA')
UPDATE `cursos` SET `turno` = 'MAÑANA' WHERE `turno` LIKE 'MA%ANA';
