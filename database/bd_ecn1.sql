-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 14-05-2026 a las 21:18:44
-- Versión del servidor: 8.2.0
-- Versión de PHP: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_ecn1`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
CREATE TABLE IF NOT EXISTS `alumnos` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `apellido` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `direccion` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alumnos_dni_unique` (`dni`),
  UNIQUE KEY `alumnos_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
CREATE TABLE IF NOT EXISTS `auditoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `accion` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entidad` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entidad_id` int DEFAULT NULL,
  `detalles` json DEFAULT NULL,
  `creado_el` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autorizados`
--

DROP TABLE IF EXISTS `autorizados`;
CREATE TABLE IF NOT EXISTS `autorizados` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `apellido` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vinculo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alumno_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `autorizados_dni_unique` (`dni`),
  KEY `autorizados_alumno_id_foreign` (`alumno_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargos`
--

DROP TABLE IF EXISTS `cargos`;
CREATE TABLE IF NOT EXISTS `cargos` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero_puesto` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_cargo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_horas` int DEFAULT NULL,
  `estado` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cargos_numero_puesto_unique` (`numero_puesto`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cargos`
--

INSERT INTO `cargos` (`id`, `numero_puesto`, `tipo_cargo`, `total_horas`, `estado`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, '101', 'TP3 Matemática', 20, 'Activo', NULL, '2026-02-04 04:30:35', '2026-02-04 04:30:35'),
(2, '102', 'TP2 Historia', 15, 'Activo', NULL, '2026-02-04 04:30:35', '2026-02-04 04:30:35'),
(3, '103', 'PRECEPTOR', 18, 'Activo', NULL, '2026-02-04 04:30:35', '2026-02-04 04:30:35'),
(4, '254797', 'Preceptor', 30, 'activo', NULL, '2026-02-19 22:04:46', '2026-02-19 22:04:46'),
(5, '345678', 'TP2', 12, 'activo', NULL, '2026-02-19 22:04:46', '2026-02-19 22:04:46'),
(6, '456789', 'TP3', 18, 'activo', NULL, '2026-02-19 22:04:46', '2026-02-19 22:04:46'),
(7, '567890', 'HC Matemática', 2, 'activo', NULL, '2026-02-19 22:04:46', '2026-02-19 22:04:46'),
(8, '678901', 'HC Lengua', 3, 'activo', NULL, '2026-02-19 22:04:46', '2026-02-19 22:04:46'),
(9, '789012', 'HC Historia', 2, 'activo', NULL, '2026-02-19 22:04:46', '2026-02-19 22:04:46'),
(10, '890123', 'HC Inglés', 3, 'activo', NULL, '2026-02-19 22:04:46', '2026-02-19 22:04:46'),
(11, '901234', 'HC Educación Física', 4, 'activo', NULL, '2026-02-19 22:04:46', '2026-02-19 22:04:46'),
(12, '112233', 'Jefe de área Matemática', 6, 'activo', NULL, '2026-02-19 22:04:46', '2026-02-19 22:04:46'),
(13, '223344', 'Coordinador pedagógico', 12, 'activo', NULL, '2026-02-19 22:04:46', '2026-02-19 22:04:46'),
(14, '456781', 'TP1 LENGUA Y LITERATURA', 30, 'activo', NULL, '2026-04-03 15:14:00', '2026-04-03 15:32:12'),
(15, '456787', 'TP1 ED.FISICA', 30, 'activo', NULL, '2026-04-03 15:31:35', NULL),
(16, '31082013', 'TP Economia ', 12, 'activo', NULL, '2026-04-19 15:16:13', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo_docente`
--

DROP TABLE IF EXISTS `cargo_docente`;
CREATE TABLE IF NOT EXISTS `cargo_docente` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `docente_id` bigint UNSIGNED NOT NULL,
  `cargo_id` bigint UNSIGNED NOT NULL,
  `rol` int UNSIGNED NOT NULL,
  `situacion_revista` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'interino',
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `reemplaza_a` bigint UNSIGNED DEFAULT NULL,
  `expediente_alta` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expediente_baja` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cargo_docente_cargo_id_foreign` (`cargo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cargo_docente`
--

INSERT INTO `cargo_docente` (`id`, `docente_id`, `cargo_id`, `rol`, `situacion_revista`, `fecha_inicio`, `fecha_fin`, `estado`, `created_at`, `updated_at`, `deleted_at`, `reemplaza_a`, `expediente_alta`, `expediente_baja`) VALUES
(1, 6, 1, 1, 'titular', '2024-03-01', NULL, 'inactivo', '2026-02-19 22:07:30', '2026-02-19 22:07:30', '2026-03-01 13:30:10', NULL, NULL, NULL),
(2, 7, 1, 23, 'suplente', '2024-03-10', '2024-03-15', 'inactivo', '2026-02-19 22:29:34', '2026-02-19 22:29:34', '2026-03-01 13:30:10', 1, NULL, NULL),
(3, 8, 1, 0, 'suplente', '2026-03-01', NULL, 'inactivo', '2026-03-01 13:30:10', NULL, '2026-03-02 00:38:24', NULL, NULL, NULL),
(6, 6, 3, 0, 'titular', '2026-03-01', NULL, 'licencia', '2026-03-01 13:39:33', NULL, NULL, NULL, NULL, NULL),
(11, 9, 1, 0, 'titular', '2020-03-02', NULL, 'inactivo', '2026-03-02 00:45:44', NULL, '2026-03-02 00:45:48', NULL, NULL, NULL),
(16, 9, 1, 0, 'titular', '2020-03-02', '2026-03-02', 'inactivo', '2026-03-02 01:07:16', NULL, NULL, NULL, NULL, NULL),
(17, 6, 1, 0, 'suplente', '2026-03-02', '2026-03-01', 'inactivo', '2026-03-02 01:21:08', NULL, NULL, 16, NULL, NULL),
(18, 6, 15, 13, 'interino', '2022-04-03', NULL, 'licencia', '2026-04-03 15:32:47', NULL, NULL, NULL, NULL, NULL),
(19, 6, 2, 2, 'titular', '2026-04-03', NULL, 'licencia', '2026-04-03 18:02:13', NULL, NULL, NULL, NULL, NULL),
(20, 16, 5, 15, 'titular', '2026-04-03', '2026-04-03', 'inactivo', '2026-04-03 18:04:24', NULL, NULL, NULL, NULL, NULL),
(21, 16, 5, 15, 'titular', '2026-04-03', NULL, 'activo', '2026-04-03 18:14:28', NULL, NULL, NULL, 'EX-2025-1004125-GCABA-DGPDYNG', NULL),
(22, 16, 2, 45, 'suplente', '2026-04-03', NULL, 'activo', '2026-04-03 18:30:33', NULL, NULL, 19, 'EX-2025-1000005-GCABA-DGPDYNG', NULL),
(23, 21, 5, 27, 'suplente', '2026-04-03', '2026-04-03', 'inactivo', '2026-04-03 19:41:08', NULL, NULL, 21, 'EX-2025-100010-GCABA-DGPDYNG', 'EX-2025-100011-GCABA-DGPDYNG'),
(24, 29, 16, 12, 'titular', '2024-08-12', '2024-08-12', 'inactivo', '2026-04-19 15:26:26', NULL, NULL, NULL, NULL, NULL),
(25, 29, 16, 12, 'titular', '2024-08-12', '2024-08-12', 'inactivo', '2026-04-19 16:01:23', NULL, NULL, NULL, NULL, NULL),
(26, 29, 16, 12, 'titular', '2024-08-12', NULL, 'licencia', '2026-04-19 16:02:11', NULL, NULL, NULL, 'EX-2025-100006-GCABA-DGPDYNG', NULL),
(27, 20, 16, 35, 'suplente', '2026-04-19', NULL, 'activo', '2026-04-19 16:30:03', NULL, NULL, 26, 'EX-2025-222222-GCABA-DGPDYNG', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo_docente_licencias`
--

DROP TABLE IF EXISTS `cargo_docente_licencias`;
CREATE TABLE IF NOT EXISTS `cargo_docente_licencias` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cargo_docente_id` bigint UNSIGNED NOT NULL,
  `licencia_id` bigint UNSIGNED NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cargo_docente_licencias`
--

INSERT INTO `cargo_docente_licencias` (`id`, `cargo_docente_id`, `licencia_id`, `fecha_inicio`, `fecha_fin`, `observaciones`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, '2024-03-10', '2024-03-15', 'Licencia 70A sin suplente', '2026-02-19 22:19:51', '2026-02-19 22:19:51', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `causales`
--

DROP TABLE IF EXISTS `causales`;
CREATE TABLE IF NOT EXISTS `causales` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `tipo` enum('licencia','alta','baja','modificacion') COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `causales`
--

INSERT INTO `causales` (`id`, `nombre`, `descripcion`, `tipo`, `activo`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Alta titular', NULL, 'alta', 1, NULL, NULL, NULL),
(2, 'Alta interino', NULL, 'alta', 1, NULL, NULL, NULL),
(3, 'Alta suplente', NULL, 'alta', 1, NULL, NULL, NULL),
(4, 'Renuncia', NULL, 'baja', 1, NULL, NULL, NULL),
(5, 'Jubilación', NULL, 'baja', 1, NULL, NULL, NULL),
(6, 'Fallecimiento', NULL, 'baja', 1, NULL, NULL, NULL),
(7, 'Fin suplencia', NULL, 'baja', 1, NULL, NULL, NULL),
(8, 'Cambio situación revista', NULL, 'modificacion', 1, NULL, NULL, NULL),
(9, 'Regreso titular', NULL, 'modificacion', 1, NULL, NULL, NULL),
(10, 'Corrimiento a interino', NULL, 'modificacion', 1, NULL, NULL, NULL),
(11, 'Licencia médica', NULL, 'licencia', 1, NULL, NULL, NULL),
(12, 'Licencia maternidad', NULL, 'licencia', 1, NULL, NULL, NULL),
(13, 'Licencia estudio', NULL, 'licencia', 1, NULL, NULL, NULL),
(14, 'Comisión servicio', NULL, 'licencia', 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `codigo_tramites`
--

DROP TABLE IF EXISTS `codigo_tramites`;
CREATE TABLE IF NOT EXISTS `codigo_tramites` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_tramite` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_tramites_codigo_unique` (`codigo`),
  KEY `codigo_tramites_codigo_index` (`codigo`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `codigo_tramites`
--

INSERT INTO `codigo_tramites` (`id`, `codigo`, `descripcion_tramite`, `activo`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '212B', 'ALTA TITULAR', 1, NULL, NULL, NULL),
(2, '212R', 'RENUNCIA TITULAR', 1, NULL, NULL, NULL),
(3, '212S', 'ALTA SUPLENTE', 1, NULL, NULL, NULL),
(4, '212F', 'FIN SUPLENCIA', 1, NULL, NULL, NULL),
(5, '545F', 'RENUNCIA SUPLENTE', 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cod_lic`
--

DROP TABLE IF EXISTS `cod_lic`;
CREATE TABLE IF NOT EXISTS `cod_lic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cod_licencia` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cod_lic`
--

INSERT INTO `cod_lic` (`id`, `cod_licencia`, `descripcion`, `activo`) VALUES
(1, '70.j', 'Licencia Médica', 1),
(2, '70.a', 'Vacaciones / Anual Ordinaria', 1),
(3, 'Art 6', 'Capacitación / Examen', 1),
(4, '70.t', 'Atención Familiar', 1),
(5, '70 T', 'Razones Particulares', 1),
(6, '70a', 'afeccion comun', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

DROP TABLE IF EXISTS `cursos`;
CREATE TABLE IF NOT EXISTS `cursos` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `anio` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `division` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modalidad` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `especialidad` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `turno` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `curso_unico` (`anio`,`division`,`turno`,`modalidad`,`especialidad`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `anio`, `division`, `modalidad`, `especialidad`, `turno`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '1º', '1º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(2, '1º', '2º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(3, '1º', '3º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(4, '1º', '4º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(5, '2º', '1º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(6, '2º', '2º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(7, '2º', '3º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(8, '2º', '4º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(9, '3º', '1º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(10, '3º', '2º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(11, '3º', '3º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(12, '4º', '1º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(13, '4º', '2º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(14, '4º', '3º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(15, '5º', '1º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(16, '5º', '2º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(17, '5º', '3º', 'B.E.C', '', 'COMPLETO', NULL, NULL, NULL),
(18, '1º', '1º', 'T.C.A', '', 'MAÑANA', NULL, NULL, NULL),
(19, '1º', '2º', 'T.C.A', '', 'MAÑANA', NULL, NULL, NULL),
(20, '2º', NULL, 'T.C.A', '', 'MAÑANA', NULL, NULL, NULL),
(21, '3º', NULL, 'T.C.A', '', 'MAÑANA', NULL, NULL, NULL),
(22, '1º', NULL, 'T.C.A', '', 'TARDE', NULL, NULL, NULL),
(23, '2º', NULL, 'T.C.A', '', 'TARDE', NULL, NULL, NULL),
(24, '3º', NULL, 'T.C.A', '', 'TARDE', NULL, NULL, NULL),
(25, '1º', '1º', 'T.C.A', '', 'NOCHE', NULL, NULL, NULL),
(26, '1º', '2º', 'T.C.A', '', 'NOCHE', NULL, NULL, NULL),
(27, '2º', NULL, 'T.C.A', '', 'NOCHE', NULL, NULL, NULL),
(28, '3º', NULL, 'T.C.A', '', 'NOCHE', NULL, NULL, NULL),
(29, '1º', NULL, 'AUX', 'VITRAL', 'MAÑANA', NULL, NULL, NULL),
(30, '2º', NULL, 'AUX', 'VITRAL', 'MAÑANA', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso_materia`
--

DROP TABLE IF EXISTS `curso_materia`;
CREATE TABLE IF NOT EXISTS `curso_materia` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `curso_id` bigint UNSIGNED NOT NULL,
  `materia_id` bigint UNSIGNED NOT NULL,
  `modulos_asignados` int UNSIGNED NOT NULL,
  `docente_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `curso_materia_curso_id_materia_id_docente_id_unique` (`curso_id`,`materia_id`,`docente_id`),
  KEY `curso_materia_materia_id_foreign` (`materia_id`),
  KEY `curso_materia_docente_id_foreign` (`docente_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `distribucion_horas`
--

DROP TABLE IF EXISTS `distribucion_horas`;
CREATE TABLE IF NOT EXISTS `distribucion_horas` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cargo_id` bigint UNSIGNED NOT NULL,
  `curso_id` bigint UNSIGNED NOT NULL,
  `materia_id` bigint UNSIGNED NOT NULL,
  `cantidad_horas` int NOT NULL,
  `tipo_hora_id` int DEFAULT NULL,
  `tipo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia` enum('lunes','martes','miércoles','jueves','viernes') COLLATE utf8mb4_unicode_ci NOT NULL,
  `hora_ingreso` time NOT NULL,
  `hora_egreso` time NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `distribucion_horas_cargo_id_foreign` (`cargo_id`),
  KEY `distribucion_horas_curso_id_foreign` (`curso_id`),
  KEY `distribucion_horas_materia_id_foreign` (`materia_id`),
  KEY `fk_tipo_hora` (`tipo_hora_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `distribucion_horas`
--

INSERT INTO `distribucion_horas` (`id`, `cargo_id`, `curso_id`, `materia_id`, `cantidad_horas`, `tipo_hora_id`, `tipo`, `dia`, `hora_ingreso`, `hora_egreso`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 45, 2, NULL, 'clase', 'lunes', '07:45:00', '09:45:00', '2026-02-19 23:42:32', '2026-02-19 23:42:32', NULL),
(2, 1, 1, 14, 1, NULL, 'extraclase', 'martes', '09:45:00', '10:25:00', '2026-02-19 23:42:32', '2026-02-19 23:42:32', NULL),
(3, 1, 8, 45, 2, NULL, 'clase', 'miércoles', '09:45:00', '11:45:00', '2026-02-19 23:42:32', '2026-02-19 23:42:32', NULL),
(4, 15, 9, 10, 2, NULL, 'clase', 'martes', '08:00:00', '10:00:00', '2026-04-03 15:33:42', NULL, NULL),
(5, 16, 2, 9, 4, 1, 'materia', 'martes', '08:00:00', '10:30:00', '2026-04-19 16:04:25', '2026-04-19 16:12:19', NULL),
(6, 16, 1, 9, 4, 1, 'materia', 'lunes', '08:00:00', '10:30:00', '2026-04-19 16:16:15', '2026-04-19 16:44:40', NULL),
(7, 16, 0, 14, 4, 2, 'materia', 'miércoles', '10:30:00', '12:00:00', '2026-04-19 16:17:59', '2026-04-19 16:20:38', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docentes`
--

DROP TABLE IF EXISTS `docentes`;
CREATE TABLE IF NOT EXISTS `docentes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `rrhh_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fechaNac` date NOT NULL,
  `dni` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuil` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fichaCensal` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `estado` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `docentes_rrhh_id_unique` (`rrhh_id`),
  UNIQUE KEY `docentes_dni_unique` (`dni`),
  UNIQUE KEY `docentes_cuil_unique` (`cuil`),
  UNIQUE KEY `docentes_fichacensal_unique` (`fichaCensal`),
  UNIQUE KEY `docentes_email_unique` (`email`),
  KEY `docentes_apellido_index` (`apellido`),
  KEY `docentes_dni_index` (`dni`)
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `docentes`
--

INSERT INTO `docentes` (`id`, `rrhh_id`, `apellido`, `nombre`, `fechaNac`, `dni`, `cuil`, `fichaCensal`, `email`, `direccion`, `telefono`, `fecha_ingreso`, `estado`, `created_at`, `updated_at`, `deleted_at`, `deleted_by`) VALUES
(9, '1004', 'Gómez', 'Ana', '1990-01-30', '29876543', '27-29876543-2', 'FC1004', 'agomez@mail.com', 'San Juan 555', '1167891234', '2019-03-10', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(8, '1003', 'Pérez', 'Carlos', '1979-11-10', '27456789', '20-27456789-5', 'FC1003', 'cperez@mail.com', 'Belgrano 890', '1133344455', '2010-07-01', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(7, '1002', 'Juárez', 'Laura', '1988-09-22', '28987654', '27-28987654-1', 'FC1002', 'ljuarez@mail.com', 'Mitre 456', '1123456789', '2018-02-15', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(6, '1001', 'Arnau', 'Matías', '1985-06-12', '30123456', '20-30123456-3', 'FC1001', 'marnau@mail.com', 'Av. Rivadavia 1234', '1134567890', '2015-03-01', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(10, '1005', 'López', 'María', '1984-04-18', '29222333', '27-29222333-7', 'FC1005', 'mlopez@mail.com', 'Lavalle 321', '1145671234', '2012-08-01', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(11, '1006', 'Fernández', 'Diego', '1982-12-05', '28111222', '20-28111222-4', 'FC1006', 'dfernandez@mail.com', 'Corrientes 999', '1156782345', '2011-05-15', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(12, '1007', 'Martínez', 'Sofía', '1993-03-25', '30333444', '27-30333444-8', 'FC1007', 'smartinez@mail.com', 'Callao 123', '1165432211', '2020-04-01', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(13, '1008', 'Sánchez', 'Pedro', '1975-07-14', '26123456', '20-26123456-9', 'FC1008', 'psanchez@mail.com', 'Santa Fe 567', '1143219876', '2005-06-20', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(14, '1009', 'Ramírez', 'Lucía', '1987-10-08', '29555666', '27-29555666-0', 'FC1009', 'lramirez@mail.com', 'Alvear 345', '1132198765', '2017-09-01', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(15, '1010', 'Torres', 'Javier', '1981-02-17', '27999888', '20-27999888-2', 'FC1010', 'jtorres@mail.com', 'Moreno 765', '1167895432', '2009-11-15', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(16, '1011', 'Díaz', 'Carolina', '1992-06-05', '30444555', '27-30444555-3', 'FC1011', 'cdiaz@mail.com', 'Entre Ríos 444', '1145674321', '2021-03-01', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(17, '1012', 'Vega', 'Andrés', '1986-01-11', '29111234', '20-29111234-6', 'FC1012', 'avega@mail.com', 'Suipacha 234', '1134567777', '2014-02-10', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(18, '1013', 'Morales', 'Natalia', '1994-08-19', '30555123', '27-30555123-1', 'FC1013', 'nmorales@mail.com', 'Perú 678', '1155556666', '2022-05-05', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(19, '1014', 'Castro', 'Fernando', '1978-03-03', '27000999', '20-27000999-8', 'FC1014', 'fcastro@mail.com', 'Independencia 890', '1122334455', '2007-04-18', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(20, '1015', 'Rojas', 'Elena', '1989-12-12', '29777111', '27-29777111-4', 'FC1015', 'erojas@mail.com', 'México 345', '1144445555', '2016-08-20', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(21, '1016', 'Ortega', 'Luis', '1983-05-27', '28222444', '20-28222444-1', 'FC1016', 'lortega@mail.com', 'Bolívar 111', '1133322111', '2013-03-15', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(22, '1017', 'Silva', 'Patricia', '1991-09-09', '30222111', '27-30222111-9', 'FC1017', 'psilva@mail.com', 'Lima 222', '1166667777', '2019-07-01', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(23, '1018', 'Navarro', 'Roberto', '1976-10-01', '26555444', '20-26555444-7', 'FC1018', 'rnavarro@mail.com', 'Chacabuco 456', '1155558888', '2006-09-10', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(24, '1019', 'Acosta', 'Gabriela', '1988-04-14', '29000987', '27-29000987-5', 'FC1019', 'gacosta@mail.com', 'Defensa 333', '1133377788', '2018-11-12', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(25, '1020', 'Herrera', 'Tomás', '1995-02-21', '30666123', '20-30666123-6', 'FC1020', 'therrera@mail.com', 'Paseo Colón 999', '1144412345', '2023-02-01', 'activo', '2026-02-19 22:02:35', '2026-02-19 22:02:35', NULL, NULL),
(26, '154873', 'al', 'lk', '1789-04-12', '12454541', '20123456987', '759468', 'alk@gmail.com', NULL, '115506981', '2026-02-22', 'activo', NULL, NULL, NULL, NULL),
(27, '12', 'Boca', 'juniors ', '1979-03-12', '12345656', '20123456565', '123345', 'boca@gmail.com', 'bransen 405', '1212121212', '2026-03-01', 'inactivo', NULL, NULL, '2026-04-19 15:05:00', 1),
(28, '00012', 'boca ', 'juniors', '1984-03-12', '11111111', '22111111112', '001', '12bjs@gmail.com', 'Avenida Oca 5115', '01155069845', '2010-10-15', 'activo', '2026-04-03 14:49:45', '2026-04-03 14:50:03', NULL, NULL),
(29, '31082013', 'Arnau D´Aloy', 'Celeste', '1997-08-31', '53418187', '20234733716', '0011010', 'arnauceles@gmail.com', 'Montes de Oca 600', '0115504015', '2014-08-03', 'activo', '2026-04-19 15:04:32', '2026-04-19 15:04:50', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `familiares`
--

DROP TABLE IF EXISTS `familiares`;
CREATE TABLE IF NOT EXISTS `familiares` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alumno_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `familiares_dni_unique` (`dni`),
  KEY `familiares_alumno_id_foreign` (`alumno_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

DROP TABLE IF EXISTS `inscripciones`;
CREATE TABLE IF NOT EXISTS `inscripciones` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `alumno_id` bigint UNSIGNED NOT NULL,
  `curso_id` bigint UNSIGNED NOT NULL,
  `anio_lectivo` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inscripciones_alumno_id_curso_id_anio_lectivo_unique` (`alumno_id`,`curso_id`,`anio_lectivo`),
  KEY `inscripciones_curso_id_foreign` (`curso_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `licencias`
--

DROP TABLE IF EXISTS `licencias`;
CREATE TABLE IF NOT EXISTS `licencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `docente_id` int NOT NULL,
  `cargo_id` bigint UNSIGNED DEFAULT NULL,
  `tramitacion_id` bigint UNSIGNED DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `tipo_licencia` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `corresponde_expediente` tinyint(1) DEFAULT '0',
  `expediente` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_licencias_tramitacion` (`tramitacion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `licencias`
--

INSERT INTO `licencias` (`id`, `docente_id`, `cargo_id`, `tramitacion_id`, `fecha_inicio`, `fecha_fin`, `tipo_licencia`, `corresponde_expediente`, `expediente`, `observaciones`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 6, 3, NULL, '2026-04-04', '2026-04-04', '70.j', 0, NULL, NULL, '2026-04-04 02:30:27', '2026-04-04 19:55:33', '2026-04-04 19:55:33'),
(2, 6, 15, NULL, '2026-04-04', NULL, '70.j', 0, NULL, NULL, '2026-04-04 02:30:27', '2026-04-04 19:55:31', '2026-04-04 19:55:31'),
(3, 6, 3, NULL, '2026-04-04', '2026-04-04', '70 T', 0, NULL, NULL, '2026-04-04 19:56:49', '2026-04-19 16:39:39', NULL),
(4, 6, 15, NULL, '2026-04-04', '2026-04-04', '70 T', 0, NULL, NULL, '2026-04-04 19:56:49', '2026-05-04 12:00:59', NULL),
(5, 6, 2, NULL, '2026-04-04', '2026-04-04', '70 T', 0, NULL, NULL, '2026-04-04 19:56:49', '2026-04-19 16:40:04', NULL),
(6, 29, 16, NULL, '2026-04-17', '2026-04-30', '70a', 0, NULL, NULL, '2026-04-19 16:26:11', '2026-04-19 16:27:24', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias`
--

DROP TABLE IF EXISTS `materias`;
CREATE TABLE IF NOT EXISTS `materias` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `materias_nombre_index` (`nombre`)
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `materias`
--

INSERT INTO `materias` (`id`, `nombre`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'ALFARERIA Y MOSAICO', NULL, NULL, NULL),
(2, 'ARTE PUBLICO, PROD.CERAMICA Y GESTION CULTURAL', NULL, NULL, NULL),
(3, 'ARTE,CULTURA Y SOCIEDAD ', NULL, NULL, NULL),
(4, 'ARTES MUSICA ', NULL, NULL, NULL),
(5, 'ARTES TEATRO', NULL, NULL, NULL),
(6, 'ARTES VISUALES Y MULTIMEDIA', NULL, NULL, NULL),
(7, 'BIOLOGIA ', NULL, NULL, NULL),
(8, 'DIBUJO', NULL, NULL, NULL),
(9, 'ECONOMIA', NULL, NULL, NULL),
(10, 'ED. FISICA', NULL, NULL, NULL),
(11, 'ED. TECNOLOGIA', NULL, NULL, NULL),
(12, 'EDUCACION CIUDADANA ', NULL, NULL, NULL),
(13, 'ESMALTADO SOBRE METAL Y VITRAL', NULL, NULL, NULL),
(14, 'EXTRA CLASE', NULL, NULL, NULL),
(15, 'FILOSOFIA ', NULL, NULL, NULL),
(16, 'FISICA', NULL, NULL, NULL),
(17, 'FISICO QUIMICA', NULL, NULL, NULL),
(18, 'FORMACION ETICA Y CIUDADANA', NULL, NULL, NULL),
(19, 'GEOGRAFIA', NULL, NULL, NULL),
(38, 'HISTORIA ', NULL, NULL, NULL),
(39, 'HISTORIA DE LAS ARTES', NULL, NULL, NULL),
(40, 'HISTORIA ORIENTADA', NULL, NULL, NULL),
(41, 'LENGUA Y LITERATURA', NULL, NULL, NULL),
(42, 'LENGUAJE VISUAL', NULL, NULL, NULL),
(43, 'LENGUAJES COMBINADOS', NULL, NULL, NULL),
(44, 'LENGUAS ADICIONALES INGLES', NULL, NULL, NULL),
(45, 'MATEMATICA', NULL, NULL, NULL),
(46, 'QUIMICA ', NULL, NULL, NULL),
(47, 'TALLER CERAMICO ', NULL, NULL, NULL),
(48, 'TECNOLOGIA CERAMICA ', NULL, NULL, NULL),
(49, 'TECNOLOGIA DE LA INFORMACION ', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias_adeudadas`
--

DROP TABLE IF EXISTS `materias_adeudadas`;
CREATE TABLE IF NOT EXISTS `materias_adeudadas` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `alumno_id` bigint UNSIGNED NOT NULL,
  `materia_id` bigint UNSIGNED NOT NULL,
  `estado` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `materias_adeudadas_alumno_id_materia_id_unique` (`alumno_id`,`materia_id`),
  KEY `materias_adeudadas_materia_id_foreign` (`materia_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulos`
--

DROP TABLE IF EXISTS `modulos`;
CREATE TABLE IF NOT EXISTS `modulos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`id`, `nombre`, `descripcion`) VALUES
(1, 'docentes', 'Gestion docente'),
(2, 'estudiantes', 'Gestion estudiantes'),
(3, 'biblioteca', 'Sistema biblioteca'),
(4, 'tramitaciones', NULL),
(5, 'permisos', 'Gestión de permisos'),
(6, 'cargos', 'Gestión de puestos y cargos'),
(7, 'licencias', 'Gestión de licencias docentes'),
(8, 'planilla_firmas', 'Planilla de firmas diaria'),
(9, 'auditoria', 'Registro de auditoría del sistema'),
(10, 'usuarios', 'Gestión de usuarios y accesos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfiles`
--

DROP TABLE IF EXISTS `perfiles`;
CREATE TABLE IF NOT EXISTS `perfiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `perfiles`
--

INSERT INTO `perfiles` (`id`, `nombre`, `created_at`) VALUES
(1, 'ADMINISTRADOR', '2026-05-09 13:41:41'),
(2, 'SECRETARIO', '2026-05-09 13:41:41'),
(3, 'CONDUCCION', '2026-05-09 13:41:41'),
(4, 'AUXILIAR ADMINISTRATIVO', '2026-05-09 13:41:41'),
(5, 'OFICINA DE ALUMNOS', '2026-05-09 13:41:41'),
(6, 'PRECEPTOR/A', '2026-05-09 13:41:41'),
(7, 'DOCENTE', '2026-05-09 13:41:41'),
(8, 'BIBLIOTECA', '2026-05-09 13:41:41'),
(9, 'ESTUDIANTE', '2026-05-09 13:41:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_modulo`
--

DROP TABLE IF EXISTS `perfil_modulo`;
CREATE TABLE IF NOT EXISTS `perfil_modulo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `perfil_id` int NOT NULL,
  `modulo_id` int NOT NULL,
  `permiso` enum('lectura','edicion','ninguno') COLLATE utf8mb4_unicode_ci DEFAULT 'ninguno',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_perfil_modulo` (`perfil_id`,`modulo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `perfil_modulo`
--

INSERT INTO `perfil_modulo` (`id`, `perfil_id`, `modulo_id`, `permiso`) VALUES
(1, 1, 1, 'edicion'),
(2, 2, 1, 'edicion'),
(3, 1, 2, 'edicion'),
(4, 2, 2, 'edicion'),
(5, 1, 3, 'edicion'),
(6, 2, 3, 'edicion'),
(7, 1, 4, 'edicion'),
(8, 2, 4, 'edicion'),
(9, 1, 5, 'edicion'),
(10, 2, 5, 'edicion'),
(11, 1, 6, 'edicion'),
(12, 2, 6, 'edicion'),
(13, 1, 7, 'edicion'),
(14, 2, 7, 'edicion'),
(15, 1, 8, 'edicion'),
(16, 2, 8, 'edicion'),
(17, 1, 9, 'edicion'),
(18, 2, 9, 'edicion'),
(19, 1, 10, 'edicion'),
(20, 2, 10, 'edicion'),
(21, 4, 1, 'lectura');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `situaciones_revista`
--

DROP TABLE IF EXISTS `situaciones_revista`;
CREATE TABLE IF NOT EXISTS `situaciones_revista` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cargo_id` bigint UNSIGNED NOT NULL,
  `docente_id` bigint UNSIGNED NOT NULL,
  `tipo` enum('TITULAR','INTERINO','SUPLENTE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `observaciones` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `causal_id` bigint UNSIGNED NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `situaciones_revista_cargo_id_docente_id_fecha_inicio_unique` (`cargo_id`,`docente_id`,`fecha_inicio`),
  KEY `situaciones_revista_docente_id_foreign` (`docente_id`),
  KEY `situaciones_revista_causal_id_foreign` (`causal_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `situaciones_revista`
--

INSERT INTO `situaciones_revista` (`id`, `cargo_id`, `docente_id`, `tipo`, `observaciones`, `causal_id`, `fecha_inicio`, `fecha_fin`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'TITULAR', 'Cargo permanente', 1, '2020-03-01', NULL, '2026-02-04 04:30:35', '2026-02-04 04:30:35', NULL),
(2, 2, 2, 'SUPLENTE', 'Reemplazo temporal', 2, '2021-08-15', NULL, '2026-02-04 04:30:35', '2026-02-04 04:30:35', NULL),
(3, 3, 3, 'INTERINO', 'Designación provisoria', 3, '2022-02-10', NULL, '2026-02-04 04:30:35', '2026-02-04 04:30:35', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_hora`
--

DROP TABLE IF EXISTS `tipos_hora`;
CREATE TABLE IF NOT EXISTS `tipos_hora` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipos_hora`
--

INSERT INTO `tipos_hora` (`id`, `nombre`, `descripcion`, `created_at`, `deleted_at`) VALUES
(1, 'Frente a curso', NULL, '2026-04-06 00:14:27', NULL),
(2, 'Extraclase', NULL, '2026-04-06 00:14:27', NULL),
(3, 'Cargo', NULL, '2026-04-06 00:14:27', NULL),
(4, 'No docente', NULL, '2026-04-06 00:14:27', NULL),
(5, 'Especiales', NULL, '2026-04-06 00:14:27', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tramitaciones`
--

DROP TABLE IF EXISTS `tramitaciones`;
CREATE TABLE IF NOT EXISTS `tramitaciones` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `tipo_tramite` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_tramite_id` int DEFAULT NULL,
  `docente_id` bigint UNSIGNED DEFAULT NULL,
  `rol` int DEFAULT NULL,
  `expediente` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cargo_id` bigint UNSIGNED DEFAULT NULL,
  `estado` enum('caratulado','en_tramitacion','espera_documentacion','urgente','realizado') COLLATE utf8mb4_unicode_ci DEFAULT 'caratulado',
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tramitaciones_cargo` (`cargo_id`),
  KEY `fk_tramitaciones_codigo` (`codigo_tramite_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tramitaciones`
--

INSERT INTO `tramitaciones` (`id`, `fecha`, `tipo_tramite`, `codigo_tramite_id`, `docente_id`, `rol`, `expediente`, `cargo_id`, `estado`, `observaciones`, `created_at`, `updated_at`, `deleted_at`, `created_by`) VALUES
(1, '2026-04-03', '', 1, 6, 2, 'EX-2025-14544125-GCABA-DGPDYNG', 2, 'caratulado', NULL, '2026-04-03 17:34:27', '2026-05-09 14:19:55', NULL, 1),
(2, '2026-04-03', '', 1, 16, 15, 'EX-2025-1004125-GCABA-DGPDYNG', 5, 'caratulado', NULL, '2026-04-03 18:04:24', '2026-04-03 18:14:28', NULL, 1),
(3, '2026-04-03', '', 3, 16, 45, 'EX-2025-1000005-GCABA-DGPDYNG', 2, 'caratulado', NULL, '2026-04-03 18:30:33', NULL, NULL, 1),
(4, '2026-04-03', '', 4, 16, 45, 'EX-2025-100006-GCABA-DGPDYNG', 2, 'realizado', 'FALTA QR', '2026-04-03 18:34:54', '2026-04-03 18:47:05', NULL, 1),
(5, '2026-04-03', '', 3, 21, 27, 'EX-2025-100010-GCABA-DGPDYNG', 5, 'caratulado', NULL, '2026-04-03 19:41:08', NULL, NULL, 1),
(6, '2026-04-03', '', 4, 21, 27, 'EX-2025-100011-GCABA-DGPDYNG', 5, 'caratulado', NULL, '2026-04-03 19:42:42', NULL, NULL, 1),
(7, '2024-08-12', '', 1, 29, 12, 'EX-2025-100006-GCABA-DGPDYNG', 16, 'caratulado', NULL, '2026-04-19 15:26:26', '2026-04-19 16:02:11', NULL, 1),
(8, '2026-04-19', '', 3, 20, 35, 'EX-2025-222222-GCABA-DGPDYNG', 16, 'realizado', NULL, '2026-04-19 16:30:03', '2026-05-09 14:20:41', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tramitaciones_legacy`
--

DROP TABLE IF EXISTS `tramitaciones_legacy`;
CREATE TABLE IF NOT EXISTS `tramitaciones_legacy` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `estado` enum('urgente','realizado','en_tramitacion','espera_documentacion','caratulado','a_la_guarda') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_tramitacion',
  `cargo_docente_id` bigint UNSIGNED NOT NULL,
  `abm` enum('alta','baja','modificacion') COLLATE utf8mb4_unicode_ci NOT NULL,
  `expediente` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_tramite_id` bigint UNSIGNED NOT NULL,
  `causal_id` bigint UNSIGNED DEFAULT NULL,
  `licencia_id` bigint UNSIGNED DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tramitaciones_expediente_unique` (`expediente`),
  KEY `tramitaciones_cargo_docente_id_foreign` (`cargo_docente_id`),
  KEY `tramitaciones_codigo_tramite_id_foreign` (`codigo_tramite_id`),
  KEY `tramitaciones_causal_id_foreign` (`causal_id`),
  KEY `tramitaciones_estado_index` (`estado`),
  KEY `tramitaciones_abm_index` (`abm`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tramitaciones_legacy`
--

INSERT INTO `tramitaciones_legacy` (`id`, `fecha`, `estado`, `cargo_docente_id`, `abm`, `expediente`, `codigo_tramite_id`, `causal_id`, `licencia_id`, `observaciones`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '2024-03-01', 'realizado', 1, 'alta', 'EXP-2024-0001', 1, 1, NULL, 'Alta titular Arnau preceptor', '2026-02-19 22:08:53', '2026-02-19 22:08:53', NULL),
(2, '2024-03-10', 'realizado', 2, 'alta', 'EXP-2024-0003', 3, 3, NULL, 'Alta suplente Juárez reemplaza Arnau', '2026-02-19 22:22:24', '2026-02-19 22:22:24', NULL),
(3, '2024-03-10', 'realizado', 2, 'alta', 'EXP-2024-0004', 3, 3, NULL, 'Alta suplente Juárez reemplaza Arnau', '2026-02-19 22:32:26', '2026-02-19 22:32:26', NULL),
(4, '2024-03-15', 'realizado', 2, 'baja', 'EXP-2024-0005', 4, 7, NULL, 'Fin suplencia Juárez regreso titular Arnau', '2026-02-19 22:45:34', '2026-02-19 22:45:34', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('pendiente','activo','rechazado') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `activo` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `perfil` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `perfil_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`, `nombre`, `estado`, `activo`, `created_at`, `perfil`, `perfil_id`) VALUES
(1, 'sergio', '$2b$10$v7Jg0c.3OAGtRis7N3oW2OPZ2Bt14YEQNouxO8bnLCHUSDxbRk7Gu', 'Sergio', 'activo', 1, '2026-02-21 18:18:59', 'SECRETARIO', 2),
(2, '7u7e', '$2b$10$CgllvOsABzYhsN5zNekoluZMKpUMuYCRJAzDrWRZ82sjcHKaVxBPK', '7u7e', 'activo', 1, '2026-05-09 13:27:43', 'ADMINISTRADOR', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_curso`
--

DROP TABLE IF EXISTS `usuario_curso`;
CREATE TABLE IF NOT EXISTS `usuario_curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `curso_id` bigint UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `curso_id` (`curso_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_modulo`
--

DROP TABLE IF EXISTS `usuario_modulo`;
CREATE TABLE IF NOT EXISTS `usuario_modulo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `modulo_id` int DEFAULT NULL,
  `permiso` enum('lectura','edicion') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`modulo_id`),
  KEY `modulo_id` (`modulo_id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario_modulo`
--

INSERT INTO `usuario_modulo` (`id`, `usuario_id`, `modulo_id`, `permiso`) VALUES
(1, 1, 1, 'edicion'),
(2, 1, 2, 'edicion'),
(5, 1, 4, 'edicion'),
(6, 1, 3, 'edicion'),
(7, 1, 5, 'edicion'),
(8, 1, 6, 'edicion'),
(9, 1, 7, 'edicion'),
(10, 1, 8, 'edicion'),
(11, 1, 9, 'edicion'),
(12, 1, 10, 'edicion');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `licencias`
--
ALTER TABLE `licencias`
  ADD CONSTRAINT `fk_licencias_tramitacion` FOREIGN KEY (`tramitacion_id`) REFERENCES `tramitaciones` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
