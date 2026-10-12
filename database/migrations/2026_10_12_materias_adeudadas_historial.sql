-- Migración: Ampliar materias_adeudadas y crear tabla de historial de exámenes
-- Fecha: 2026-10-12

-- 1. Agregar columnas anio_materia y ciclo_lectivo a materias_adeudadas si no existen
ALTER TABLE `materias_adeudadas`
  ADD COLUMN `anio_materia` INT NULL AFTER `materia_id`,
  ADD COLUMN `ciclo_lectivo` INT NULL AFTER `anio_materia`;

-- 2. Crear tabla de historial de exámenes para materias adeudadas
CREATE TABLE IF NOT EXISTS `materia_adeudada_examenes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `materia_adeudada_id` BIGINT UNSIGNED NOT NULL,
  `fecha_examen` DATE NOT NULL,
  `nota` DECIMAL(4,2) NOT NULL,
  `libro` VARCHAR(50) NULL,
  `folio` VARCHAR(50) NULL,
  `observaciones` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `materia_adeudada_examenes_adeudada_id_idx` (`materia_adeudada_id`),
  CONSTRAINT `fk_materia_adeudada_examenes`
    FOREIGN KEY (`materia_adeudada_id`) REFERENCES `materias_adeudadas` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
