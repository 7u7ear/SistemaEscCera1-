-- MySQL dump 10.13  Distrib 8.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: bd_cera1
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alumno_movimientos`
--

DROP TABLE IF EXISTS `alumno_movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumno_movimientos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `alumno_id` bigint unsigned NOT NULL,
  `tipo_movimiento` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` date NOT NULL,
  `detalle` json DEFAULT NULL,
  `usuario_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_movimiento_alumno` (`alumno_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumno_movimientos`
--

LOCK TABLES `alumno_movimientos` WRITE;
/*!40000 ALTER TABLE `alumno_movimientos` DISABLE KEYS */;
/*!40000 ALTER TABLE `alumno_movimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `apellido` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `direccion` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alumnos_dni_unique` (`dni`),
  UNIQUE KEY `alumnos_email_unique` (`email`),
  KEY `idx_alumnos_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
/*!40000 ALTER TABLE `alumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `accion` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entidad` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entidad_id` int DEFAULT NULL,
  `detalles` json DEFAULT NULL,
  `creado_el` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
INSERT INTO `auditoria` VALUES (1,2,'CREATE','CARGO',17,'{\"tipo_cargo\": \"TP 2 NAVEGACION\", \"total_horas\": 12, \"numero_puesto\": \"102431\"}','2026-06-26 21:44:09'),(2,2,'ASSIGN_DOCENTE','CARGO',17,'{\"rol\": 27, \"docente_id\": 30, \"reemplaza_a\": null, \"fecha_inicio\": \"2023-03-10\", \"expediente_alta\": \"EX-2023- MUGUIWARA-ONEPIECE\", \"situacion_revista\": \"titular\"}','2026-06-26 21:49:35'),(3,2,'ADD_DISTRIBUCION','CARGO',17,'{\"dia\": \"lunes\", \"curso_id\": 1, \"materia_id\": 49, \"hora_egreso\": \"09:00\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 1, \"cantidad_horas\": 2}','2026-06-26 21:52:05'),(4,2,'CREATE','TIPO_HORA',NULL,'{\"nombre\": \"Visita\"}','2026-06-26 21:53:58'),(5,2,'ADD_DISTRIBUCION','CARGO',17,'{\"dia\": \"martes\", \"curso_id\": 6, \"materia_id\": 4, \"hora_egreso\": \"09:00\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 6, \"cantidad_horas\": 2}','2026-06-26 21:54:10'),(6,2,'ADD_DISTRIBUCION','CARGO',17,'{\"dia\": \"miércoles\", \"curso_id\": 17, \"materia_id\": 10, \"hora_egreso\": \"09:00\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 1, \"cantidad_horas\": 2}','2026-06-26 21:56:34'),(7,2,'UPDATE_DISTRIBUCION','CARGO_DISTRIBUCION',10,'{\"dia\": \"miércoles\", \"curso_id\": 17, \"materia_id\": 10, \"hora_egreso\": \"10:30\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 1, \"cantidad_horas\": 4}','2026-06-26 21:57:16'),(8,2,'ADD_DISTRIBUCION','CARGO',17,'{\"dia\": \"jueves\", \"curso_id\": null, \"materia_id\": 14, \"hora_egreso\": \"09:00\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 2, \"cantidad_horas\": 2}','2026-06-26 22:01:33'),(9,2,'ADD_DISTRIBUCION','CARGO',17,'{\"dia\": \"viernes\", \"curso_id\": null, \"materia_id\": 14, \"hora_egreso\": \"10:00\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 2, \"cantidad_horas\": 2}','2026-06-26 22:04:37'),(10,2,'CREATE_USER_ADMIN','USUARIOS',3,'{\"username\": \"Celes\", \"perfil_id\": 4}','2026-06-26 22:10:31'),(11,3,'ASSIGN_DOCENTE','CARGO',17,'{\"rol\": 28, \"docente_id\": 12, \"reemplaza_a\": 28, \"fecha_inicio\": \"2026-06-26\", \"expediente_alta\": \"EX-2026- MUGUIWARA-ONEPIECE\", \"situacion_revista\": \"suplente\"}','2026-06-26 22:41:59'),(12,2,'BAJA_DOCENTE','CARGO',16,'{\"fecha_fin\": \"2026-04-30\", \"cargoDocenteId\": \"27\", \"expediente_baja\": \"ex-2026-1534-cera1-26\", \"titular_regresa\": true}','2026-07-22 12:28:21'),(13,2,'BAJA_DOCENTE','CARGO',16,'{\"fecha_fin\": \"2026-04-30\", \"cargoDocenteId\": \"27\", \"expediente_baja\": \"ex-2026-1534-cera1-26\", \"titular_regresa\": true}','2026-07-22 12:28:22'),(14,2,'CREATE','ALUMNOS',1,'{\"dni\": \"13456789\", \"apellido\": \"Fuente\"}','2026-07-29 12:12:03'),(15,2,'MATRICULAR','ALUMNOS',1,'{\"curso_id\": 1, \"anio_lectivo\": 2026}','2026-07-29 12:18:45'),(16,2,'UPDATE_DISTRIBUCION','CARGO_DISTRIBUCION',1,'{\"dia\": \"martes\", \"curso_id\": 1, \"materia_id\": 45, \"hora_egreso\": \"09:45\", \"hora_ingreso\": \"07:45\", \"tipo_hora_id\": 1, \"cantidad_horas\": 2}','2026-07-29 13:32:12'),(17,2,'UPDATE_DISTRIBUCION','CARGO_DISTRIBUCION',6,'{\"dia\": \"miércoles\", \"curso_id\": 1, \"materia_id\": 9, \"hora_egreso\": \"10:30\", \"hora_ingreso\": \"08:00\", \"tipo_hora_id\": 1, \"cantidad_horas\": 4}','2026-07-29 13:33:18'),(18,2,'TRASLADO_CURSO','ALUMNOS',1,'{\"anio_lectivo\": 2026, \"curso_origen_id\": 1, \"curso_destino_id\": 2}','2026-07-29 14:53:52'),(19,2,'ASSIGN_DOCENTE','CARGO',10,'{\"rol\": 57, \"docente_id\": 28, \"reemplaza_a\": null, \"fecha_inicio\": \"2026-08-04\", \"expediente_alta\": \"ex-2025-nojodas\", \"situacion_revista\": \"titular\"}','2026-08-04 19:36:15'),(20,2,'ADD_DISTRIBUCION','CARGO',10,'{\"dia\": \"lunes\", \"curso_id\": 2, \"materia_id\": 44, \"hora_egreso\": \"10:00\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 1, \"cantidad_horas\": 2}','2026-08-04 19:38:45'),(21,1,'UPDATE_PERFIL','USUARIOS',1,'{\"nuevo_perfil\": 2, \"perfil_anterior\": 2}','2026-09-19 14:00:31'),(22,2,'UPDATE_PERFIL','USUARIOS',4,'{\"nuevo_perfil\": 5, \"perfil_anterior\": null}','2026-09-19 14:06:41'),(23,2,'UPDATE_STATUS','USUARIOS',4,'{\"nuevo_estado\": \"activo\", \"estado_anterior\": \"pendiente\"}','2026-09-19 14:06:43'),(24,2,'UPDATE_PERFIL','USUARIOS',4,'{\"nuevo_perfil\": 5, \"perfil_anterior\": 5}','2026-09-19 14:06:44'),(25,2,'UPDATE_STATUS','USUARIOS',4,'{\"nuevo_estado\": \"activo\", \"estado_anterior\": \"activo\"}','2026-09-19 14:06:46'),(26,2,'CREATE','ALUMNOS',2,'{\"dni\": \"134567890\", \"apellido\": \"Arnau\"}','2026-09-19 14:47:25'),(27,2,'MATRICULAR','ALUMNOS',2,'{\"curso_id\": 1, \"anio_lectivo\": 2026}','2026-09-19 14:48:42'),(28,2,'CREATE','TRAMITACIONES',14,'{\"docente_id\": 20, \"codigo_tramite_id\": 1}','2026-09-19 16:00:52'),(29,2,'ASSIGN_DOCENTE','CARGO',3,'{\"rol\": 43, \"docente_id\": 20, \"reemplaza_a\": null, \"fecha_inicio\": \"2026-09-19\", \"expediente_alta\": \"EX-2023- preceptoria-ecn1\", \"situacion_revista\": \"titular\"}','2026-09-19 16:00:54'),(30,2,'UPDATE','TRAMITACIONES',14,'{\"estado\": \"caratulado\"}','2026-09-19 16:01:37'),(31,2,'UPDATE','TRAMITACIONES',14,'{\"estado\": \"caratulado\"}','2026-09-19 16:02:02'),(32,2,'ASSIGN_DOCENTE','CARGO',3,'{\"rol\": 43, \"docente_id\": 20, \"reemplaza_a\": 6, \"fecha_inicio\": \"2026-09-19\", \"expediente_alta\": \"EX-2023- preceptoria-ecn1\", \"situacion_revista\": \"suplente\"}','2026-09-19 16:02:04'),(33,2,'BAJA_DOCENTE','CARGO',3,'{\"fecha_fin\": \"2026-09-19\", \"cargoDocenteId\": \"31\", \"expediente_baja\": \"\", \"titular_regresa\": false}','2026-09-19 16:03:05'),(34,2,'CREATE','CARGO',18,'{\"tipo_cargo\": \"PRECEPTOR\", \"total_horas\": 0, \"numero_puesto\": \"2727\"}','2026-09-19 16:05:05'),(35,2,'UPDATE','CARGO',18,'{\"tipo_cargo\": \"PRECEPTOR\", \"total_horas\": 0, \"numero_puesto\": \"2727\"}','2026-10-05 09:45:52'),(36,2,'ASSIGN_DOCENTE','CARGO',18,'{\"rol\": 15, \"docente_id\": 32, \"reemplaza_a\": null, \"fecha_inicio\": \"2025-01-06\", \"expediente_alta\": \"ex-2010-cer1-tatantatan\", \"situacion_revista\": \"titular\"}','2026-10-05 09:47:41'),(37,2,'ASSIGN_DOCENTE','CARGO',11,'{\"rol\": 15, \"docente_id\": 31, \"reemplaza_a\": null, \"fecha_inicio\": \"2026-10-05\", \"expediente_alta\": \"ex-2012-cer1-lalalal\", \"situacion_revista\": \"interino\"}','2026-10-05 09:49:04'),(38,2,'UPDATE_PERFIL','USUARIOS',5,'{\"nuevo_perfil\": 6, \"perfil_anterior\": null}','2026-10-05 09:58:14'),(39,2,'UPDATE_STATUS','USUARIOS',5,'{\"nuevo_estado\": \"activo\", \"estado_anterior\": \"activo\"}','2026-10-05 09:58:14'),(40,2,'CREATE_USER_ADMIN','USUARIOS',6,'{\"username\": \"Naty\", \"perfil_id\": 1}','2026-10-05 10:16:16'),(41,6,'CREATE','TRAMITACIONES',15,'{\"docente_id\": 31, \"codigo_tramite_id\": 6}','2026-10-05 13:24:57'),(42,6,'CREATE','CARGO',19,'{\"tipo_cargo\": \"TP2 HISTORIA\", \"total_horas\": 12, \"numero_puesto\": \"2727\"}','2026-10-05 13:25:58'),(43,6,'UPDATE','TRAMITACIONES',15,'{\"estado\": \"caratulado\"}','2026-10-05 13:26:15'),(44,6,'ASSIGN_DOCENTE','CARGO',19,'{\"rol\": 2, \"docente_id\": 31, \"reemplaza_a\": null, \"fecha_inicio\": \"2026-10-05\", \"expediente_alta\": \"EX-2023- MUGUIWARA-ONEPIECE\", \"situacion_revista\": \"titular\"}','2026-10-05 13:26:15');
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bloques_horarios`
--

DROP TABLE IF EXISTS `bloques_horarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bloques_horarios` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `turno` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `es_recreo` tinyint(1) NOT NULL DEFAULT '0',
  `descripcion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bloques_horarios`
--

LOCK TABLES `bloques_horarios` WRITE;
/*!40000 ALTER TABLE `bloques_horarios` DISABLE KEYS */;
INSERT INTO `bloques_horarios` VALUES (1,'mañana','07:45:00','08:25:00',0,'1° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(2,'mañana','08:25:00','09:05:00',0,'2° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(3,'mañana','09:05:00','09:10:00',1,'Recreo','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(4,'mañana','09:10:00','09:50:00',0,'3° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(5,'mañana','09:50:00','10:30:00',0,'4° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(6,'mañana','10:30:00','10:40:00',1,'Recreo','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(7,'mañana','10:40:00','11:20:00',0,'5° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(8,'mañana','11:20:00','12:00:00',0,'6° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(9,'mañana','12:00:00','12:40:00',0,'7° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(10,'tarde','12:40:00','13:20:00',0,'1° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(11,'tarde','13:20:00','14:00:00',0,'2° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(12,'tarde','14:00:00','14:10:00',1,'Recreo','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(13,'tarde','14:10:00','14:50:00',0,'3° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(14,'tarde','14:50:00','15:30:00',0,'4° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(15,'tarde','15:30:00','15:40:00',1,'Recreo','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(16,'tarde','15:40:00','16:20:00',0,'5° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(17,'tarde','16:20:00','17:00:00',0,'6° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(18,'tarde','17:00:00','17:40:00',0,'7° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL),(19,'tarde','17:40:00','18:20:00',0,'8° Hora','2026-07-29 11:48:51','2026-07-29 11:48:51',NULL);
/*!40000 ALTER TABLE `bloques_horarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargo_docente`
--

DROP TABLE IF EXISTS `cargo_docente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargo_docente` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `docente_id` bigint unsigned NOT NULL,
  `cargo_id` bigint unsigned NOT NULL,
  `rol` int unsigned NOT NULL,
  `situacion_revista` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'interino',
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `reemplaza_a` bigint unsigned DEFAULT NULL,
  `expediente_alta` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expediente_baja` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cargo_docente_cargo_id_foreign` (`cargo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo_docente`
--

LOCK TABLES `cargo_docente` WRITE;
/*!40000 ALTER TABLE `cargo_docente` DISABLE KEYS */;
INSERT INTO `cargo_docente` VALUES (35,31,19,2,'titular','2026-10-05',NULL,'activo','2026-10-05 13:26:15',NULL,NULL,NULL,'EX-2023- MUGUIWARA-ONEPIECE',NULL);
/*!40000 ALTER TABLE `cargo_docente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargo_docente_licencias`
--

DROP TABLE IF EXISTS `cargo_docente_licencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargo_docente_licencias` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cargo_docente_id` bigint unsigned NOT NULL,
  `licencia_id` bigint unsigned NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo_docente_licencias`
--

LOCK TABLES `cargo_docente_licencias` WRITE;
/*!40000 ALTER TABLE `cargo_docente_licencias` DISABLE KEYS */;
INSERT INTO `cargo_docente_licencias` VALUES (1,1,1,'2024-03-10','2024-03-15','Licencia 70A sin suplente','2026-02-19 22:19:51','2026-02-19 22:19:51',NULL);
/*!40000 ALTER TABLE `cargo_docente_licencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargos`
--

DROP TABLE IF EXISTS `cargos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `numero_puesto` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_cargo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_horas` int DEFAULT NULL,
  `estado` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cargos_numero_puesto_unique` (`numero_puesto`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargos`
--

LOCK TABLES `cargos` WRITE;
/*!40000 ALTER TABLE `cargos` DISABLE KEYS */;
INSERT INTO `cargos` VALUES (19,'2727','TP2 HISTORIA',12,'activo',NULL,'2026-10-05 13:25:58',NULL);
/*!40000 ALTER TABLE `cargos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `causales`
--

DROP TABLE IF EXISTS `causales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `causales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tipo` enum('licencia','alta','baja','modificacion') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `causales`
--

LOCK TABLES `causales` WRITE;
/*!40000 ALTER TABLE `causales` DISABLE KEYS */;
INSERT INTO `causales` VALUES (1,'Alta titular',NULL,'alta',1,NULL,NULL,NULL),(2,'Alta interino',NULL,'alta',1,NULL,NULL,NULL),(3,'Alta suplente',NULL,'alta',1,NULL,NULL,NULL),(4,'Renuncia',NULL,'baja',1,NULL,NULL,NULL),(5,'Jubilación',NULL,'baja',1,NULL,NULL,NULL),(6,'Fallecimiento',NULL,'baja',1,NULL,NULL,NULL),(7,'Fin suplencia',NULL,'baja',1,NULL,NULL,NULL),(8,'Cambio situación revista',NULL,'modificacion',1,NULL,NULL,NULL),(9,'Regreso titular',NULL,'modificacion',1,NULL,NULL,NULL),(10,'Corrimiento a interino',NULL,'modificacion',1,NULL,NULL,NULL),(11,'Licencia médica',NULL,'licencia',1,NULL,NULL,NULL),(12,'Licencia maternidad',NULL,'licencia',1,NULL,NULL,NULL),(13,'Licencia estudio',NULL,'licencia',1,NULL,NULL,NULL),(14,'Comisión servicio',NULL,'licencia',1,NULL,NULL,NULL);
/*!40000 ALTER TABLE `causales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cod_lic`
--

DROP TABLE IF EXISTS `cod_lic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cod_lic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cod_licencia` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cod_lic`
--

LOCK TABLES `cod_lic` WRITE;
/*!40000 ALTER TABLE `cod_lic` DISABLE KEYS */;
INSERT INTO `cod_lic` VALUES (1,'70.j','Licencia Médica',1),(2,'70.a','Vacaciones / Anual Ordinaria',1),(3,'Art 6','Capacitación / Examen',1),(4,'70.t','Atención Familiar',1),(5,'70 T','Razones Particulares',1),(6,'70a','afeccion comun',1);
/*!40000 ALTER TABLE `cod_lic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `codigo_tramites`
--

DROP TABLE IF EXISTS `codigo_tramites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `codigo_tramites` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_tramite` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_tramites_codigo_unique` (`codigo`),
  KEY `codigo_tramites_codigo_index` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codigo_tramites`
--

LOCK TABLES `codigo_tramites` WRITE;
/*!40000 ALTER TABLE `codigo_tramites` DISABLE KEYS */;
INSERT INTO `codigo_tramites` VALUES (1,'212B','ALTA TITULAR',1,NULL,NULL,NULL),(2,'212R','RENUNCIA TITULAR',1,NULL,NULL,NULL),(3,'212S','ALTA SUPLENTE',1,NULL,NULL,NULL),(4,'212F','FIN SUPLENCIA',1,NULL,NULL,NULL),(5,'545F','RENUNCIA SUPLENTE',1,NULL,NULL,NULL),(6,'102B','CESE SUPLENTE',1,NULL,NULL,NULL),(8,'102C','CAMBIO DE SR',1,NULL,NULL,NULL);
/*!40000 ALTER TABLE `codigo_tramites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso_preceptor`
--

DROP TABLE IF EXISTS `curso_preceptor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso_preceptor` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `curso_id` bigint unsigned NOT NULL,
  `docente_id` bigint unsigned NOT NULL,
  `anio_lectivo` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_curso_anio` (`curso_id`,`anio_lectivo`),
  KEY `docente_id` (`docente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso_preceptor`
--

LOCK TABLES `curso_preceptor` WRITE;
/*!40000 ALTER TABLE `curso_preceptor` DISABLE KEYS */;
/*!40000 ALTER TABLE `curso_preceptor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (1,'1º','1º','B.E.C','','COMPLETO',NULL,NULL,NULL),(2,'1º','2º','B.E.C','','COMPLETO',NULL,NULL,NULL),(3,'1º','3º','B.E.C','','COMPLETO',NULL,NULL,NULL),(4,'1º','4º','B.E.C','','COMPLETO',NULL,NULL,NULL),(5,'2º','1º','B.E.C','','COMPLETO',NULL,NULL,NULL),(6,'2º','2º','B.E.C','','COMPLETO',NULL,NULL,NULL),(7,'2º','3º','B.E.C','','COMPLETO',NULL,NULL,NULL),(8,'2º','4º','B.E.C','','COMPLETO',NULL,NULL,NULL),(9,'3º','1º','B.E.C','','COMPLETO',NULL,NULL,NULL),(10,'3º','2º','B.E.C','','COMPLETO',NULL,NULL,NULL),(11,'3º','3º','B.E.C','','COMPLETO',NULL,NULL,NULL),(12,'4º','1º','B.E.C','','COMPLETO',NULL,NULL,NULL),(13,'4º','2º','B.E.C','','COMPLETO',NULL,NULL,NULL),(14,'4º','3º','B.E.C','','COMPLETO',NULL,NULL,NULL),(15,'5º','1º','B.E.C','','COMPLETO',NULL,NULL,NULL),(16,'5º','2º','B.E.C','','COMPLETO',NULL,NULL,NULL),(17,'5º','3º','B.E.C','','COMPLETO',NULL,NULL,NULL),(18,'1º','1º','T.C.A','','MAÑANA',NULL,NULL,NULL),(19,'1º','2º','T.C.A','','MAÑANA',NULL,NULL,NULL),(20,'2º',NULL,'T.C.A','','MAÑANA',NULL,NULL,NULL),(21,'3º',NULL,'T.C.A','','MAÑANA',NULL,NULL,NULL),(22,'1º',NULL,'T.C.A','','TARDE',NULL,NULL,NULL),(23,'2º',NULL,'T.C.A','','TARDE',NULL,NULL,NULL),(24,'3º',NULL,'T.C.A','','TARDE',NULL,NULL,NULL),(25,'1º','1º','T.C.A','','NOCHE',NULL,NULL,NULL),(26,'1º','2º','T.C.A','','NOCHE',NULL,NULL,NULL),(27,'2º',NULL,'T.C.A','','NOCHE',NULL,NULL,NULL),(28,'3º',NULL,'T.C.A','','NOCHE',NULL,NULL,NULL),(29,'1º',NULL,'AUX','VITRAL','MAÑANA',NULL,NULL,NULL),(30,'2º',NULL,'AUX','VITRAL','MAÑANA',NULL,NULL,NULL);
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distribucion_horas`
--

DROP TABLE IF EXISTS `distribucion_horas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distribucion_horas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cargo_id` bigint unsigned NOT NULL,
  `curso_id` bigint unsigned DEFAULT NULL,
  `materia_id` bigint unsigned NOT NULL,
  `cantidad_horas` int NOT NULL,
  `tipo_hora_id` int DEFAULT NULL,
  `tipo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia` enum('lunes','martes','miércoles','jueves','viernes') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hora_ingreso` time DEFAULT NULL,
  `hora_egreso` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `distribucion_horas_cargo_id_foreign` (`cargo_id`),
  KEY `distribucion_horas_curso_id_foreign` (`curso_id`),
  KEY `distribucion_horas_materia_id_foreign` (`materia_id`),
  KEY `fk_tipo_hora` (`tipo_hora_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distribucion_horas`
--

LOCK TABLES `distribucion_horas` WRITE;
/*!40000 ALTER TABLE `distribucion_horas` DISABLE KEYS */;
INSERT INTO `distribucion_horas` VALUES (1,1,1,45,2,1,'clase','martes','07:45:00','09:45:00','2026-02-19 23:42:32','2026-07-29 13:32:11',NULL),(2,1,1,14,1,NULL,'extraclase','martes','09:45:00','10:25:00','2026-02-19 23:42:32','2026-02-19 23:42:32',NULL),(3,1,8,45,2,NULL,'clase','miércoles','09:45:00','11:45:00','2026-02-19 23:42:32','2026-02-19 23:42:32',NULL),(4,15,9,10,2,NULL,'clase','martes','08:00:00','10:00:00','2026-04-03 15:33:42',NULL,NULL),(5,16,2,9,4,1,'materia','martes','08:00:00','10:30:00','2026-04-19 16:04:25','2026-04-19 16:12:19',NULL),(6,16,1,9,4,1,'materia','miércoles','08:00:00','10:30:00','2026-04-19 16:16:15','2026-07-29 13:33:17',NULL),(7,16,0,14,4,2,'materia','miércoles','10:30:00','12:00:00','2026-04-19 16:17:59','2026-04-19 16:20:38',NULL),(8,17,1,49,2,1,'materia','lunes','07:40:00','09:00:00','2026-06-26 21:52:05',NULL,NULL),(9,17,6,4,2,6,'materia','martes','07:40:00','09:00:00','2026-06-26 21:54:10',NULL,NULL),(10,17,17,10,4,1,'materia','miércoles','07:40:00','10:30:00','2026-06-26 21:56:33','2026-06-26 21:57:16',NULL),(11,17,NULL,14,2,2,'materia','jueves','07:40:00','09:00:00','2026-06-26 22:01:32',NULL,NULL),(12,17,NULL,14,2,2,'materia','viernes','07:40:00','10:00:00','2026-06-26 22:04:37',NULL,NULL),(13,10,2,44,2,1,'materia','lunes','07:40:00','10:00:00','2026-08-04 19:38:45',NULL,NULL);
/*!40000 ALTER TABLE `distribucion_horas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docentes`
--

DROP TABLE IF EXISTS `docentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docentes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `rrhh_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fechaNac` date NOT NULL,
  `dni` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuil` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fichaCensal` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `estado` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docentes`
--

LOCK TABLES `docentes` WRITE;
/*!40000 ALTER TABLE `docentes` DISABLE KEYS */;
INSERT INTO `docentes` VALUES (31,'030','Arnau','Matias Ezequiel','2026-04-28','2774958','20277749583','4469041','arnaumatias@gmail.com','Montes de Oca 511','01155069327','2026-05-07','activo','2026-05-15 00:54:02',NULL,NULL,NULL),(32,'2787','Roronoa','Soro','1979-02-15','74589632','20745896321','456789','ronoop@ecn1.com.ar','eastblue','15478965','2010-04-12','activo','2026-10-05 09:43:28',NULL,NULL,NULL);
/*!40000 ALTER TABLE `docentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `familiares`
--

DROP TABLE IF EXISTS `familiares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `familiares` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentesco` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alumno_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `familiares_dni_unique` (`dni`),
  KEY `familiares_alumno_id_foreign` (`alumno_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `familiares`
--

LOCK TABLES `familiares` WRITE;
/*!40000 ALTER TABLE `familiares` DISABLE KEYS */;
/*!40000 ALTER TABLE `familiares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripciones`
--

DROP TABLE IF EXISTS `inscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripciones` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `alumno_id` bigint unsigned NOT NULL,
  `curso_id` bigint unsigned NOT NULL,
  `anio_lectivo` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inscripciones_alumno_id_curso_id_anio_lectivo_unique` (`alumno_id`,`curso_id`,`anio_lectivo`),
  KEY `inscripciones_curso_id_foreign` (`curso_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripciones`
--

LOCK TABLES `inscripciones` WRITE;
/*!40000 ALTER TABLE `inscripciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `inscripciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licencias`
--

DROP TABLE IF EXISTS `licencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `docente_id` int NOT NULL,
  `cargo_id` bigint unsigned DEFAULT NULL,
  `tramitacion_id` bigint unsigned DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `tipo_licencia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `corresponde_expediente` tinyint(1) DEFAULT '0',
  `expediente` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_licencias_tramitacion` (`tramitacion_id`),
  CONSTRAINT `fk_licencias_tramitacion` FOREIGN KEY (`tramitacion_id`) REFERENCES `tramitaciones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licencias`
--

LOCK TABLES `licencias` WRITE;
/*!40000 ALTER TABLE `licencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `licencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias`
--

DROP TABLE IF EXISTS `materias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `materias_nombre_index` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias`
--

LOCK TABLES `materias` WRITE;
/*!40000 ALTER TABLE `materias` DISABLE KEYS */;
INSERT INTO `materias` VALUES (1,'ALFARERIA Y MOSAICO',NULL,NULL,NULL),(2,'ARTE PUBLICO, PROD.CERAMICA Y GESTION CULTURAL',NULL,NULL,NULL),(3,'ARTE,CULTURA Y SOCIEDAD ',NULL,NULL,NULL),(4,'ARTES MUSICA ',NULL,NULL,NULL),(5,'ARTES TEATRO',NULL,NULL,NULL),(6,'ARTES VISUALES Y MULTIMEDIA',NULL,NULL,NULL),(7,'BIOLOGIA ',NULL,NULL,NULL),(8,'DIBUJO',NULL,NULL,NULL),(9,'ECONOMIA',NULL,NULL,NULL),(10,'ED. FISICA',NULL,NULL,NULL),(11,'ED. TECNOLOGIA',NULL,NULL,NULL),(12,'EDUCACION CIUDADANA ',NULL,NULL,NULL),(13,'ESMALTADO SOBRE METAL Y VITRAL',NULL,NULL,NULL),(14,'EXTRA CLASE',NULL,NULL,NULL),(15,'FILOSOFIA ',NULL,NULL,NULL),(16,'FISICA',NULL,NULL,NULL),(17,'FISICO QUIMICA',NULL,NULL,NULL),(18,'FORMACION ETICA Y CIUDADANA',NULL,NULL,NULL),(19,'GEOGRAFIA',NULL,NULL,NULL),(38,'HISTORIA ',NULL,NULL,NULL),(39,'HISTORIA DE LAS ARTES',NULL,NULL,NULL),(40,'HISTORIA ORIENTADA',NULL,NULL,NULL),(41,'LENGUA Y LITERATURA',NULL,NULL,NULL),(42,'LENGUAJE VISUAL',NULL,NULL,NULL),(43,'LENGUAJES COMBINADOS',NULL,NULL,NULL),(44,'LENGUAS ADICIONALES INGLES',NULL,NULL,NULL),(45,'MATEMATICA',NULL,NULL,NULL),(46,'QUIMICA ',NULL,NULL,NULL),(47,'TALLER CERAMICO ',NULL,NULL,NULL),(48,'TECNOLOGIA CERAMICA ',NULL,NULL,NULL),(49,'TECNOLOGIA DE LA INFORMACION ',NULL,NULL,NULL);
/*!40000 ALTER TABLE `materias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias_adeudadas`
--

DROP TABLE IF EXISTS `materias_adeudadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias_adeudadas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `alumno_id` bigint unsigned NOT NULL,
  `materia_id` bigint unsigned NOT NULL,
  `estado` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `materias_adeudadas_alumno_id_materia_id_unique` (`alumno_id`,`materia_id`),
  KEY `materias_adeudadas_materia_id_foreign` (`materia_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias_adeudadas`
--

LOCK TABLES `materias_adeudadas` WRITE;
/*!40000 ALTER TABLE `materias_adeudadas` DISABLE KEYS */;
/*!40000 ALTER TABLE `materias_adeudadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulos`
--

DROP TABLE IF EXISTS `modulos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulos`
--

LOCK TABLES `modulos` WRITE;
/*!40000 ALTER TABLE `modulos` DISABLE KEYS */;
INSERT INTO `modulos` VALUES (1,'docentes','Gestion docente'),(2,'estudiantes','Gestion estudiantes'),(3,'biblioteca','Sistema biblioteca'),(4,'tramitaciones',NULL),(5,'permisos','Gestión de permisos'),(6,'cargos','Gestión de puestos y cargos'),(7,'licencias','Gestión de licencias docentes'),(8,'planilla_firmas','Planilla de firmas diaria'),(9,'auditoria','Registro de auditoría del sistema'),(10,'usuarios','Gestión de usuarios y accesos');
/*!40000 ALTER TABLE `modulos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil_modulo`
--

DROP TABLE IF EXISTS `perfil_modulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil_modulo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `perfil_id` int NOT NULL,
  `modulo_id` int NOT NULL,
  `permiso` enum('lectura','edicion','ninguno') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ninguno',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_perfil_modulo` (`perfil_id`,`modulo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_modulo`
--

LOCK TABLES `perfil_modulo` WRITE;
/*!40000 ALTER TABLE `perfil_modulo` DISABLE KEYS */;
INSERT INTO `perfil_modulo` VALUES (1,1,1,'edicion'),(2,2,1,'edicion'),(3,1,2,'edicion'),(4,2,2,'edicion'),(5,1,3,'edicion'),(6,2,3,'edicion'),(7,1,4,'edicion'),(8,2,4,'edicion'),(9,1,5,'edicion'),(10,2,5,'edicion'),(11,1,6,'edicion'),(12,2,6,'edicion'),(13,1,7,'edicion'),(14,2,7,'edicion'),(15,1,8,'edicion'),(16,2,8,'edicion'),(17,1,9,'edicion'),(18,2,9,'edicion'),(19,1,10,'edicion'),(20,2,10,'edicion'),(21,4,1,'edicion'),(23,6,2,'lectura'),(24,3,1,'lectura'),(25,3,2,'edicion'),(26,4,7,'edicion'),(27,4,8,'edicion'),(28,4,10,'lectura'),(30,4,4,'edicion'),(31,7,2,'lectura'),(32,9,2,'lectura'),(33,5,2,'edicion'),(34,5,1,'lectura'),(35,5,6,'lectura'),(36,4,6,'edicion'),(37,6,7,'lectura');
/*!40000 ALTER TABLE `perfil_modulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfiles`
--

DROP TABLE IF EXISTS `perfiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfiles`
--

LOCK TABLES `perfiles` WRITE;
/*!40000 ALTER TABLE `perfiles` DISABLE KEYS */;
INSERT INTO `perfiles` VALUES (1,'ADMINISTRADOR','2026-05-09 13:41:41'),(2,'SECRETARIO','2026-05-09 13:41:41'),(3,'CONDUCCION','2026-05-09 13:41:41'),(4,'AUXILIAR ADMINISTRATIVO','2026-05-09 13:41:41'),(5,'OFICINA DE ALUMNOS','2026-05-09 13:41:41'),(6,'PRECEPTOR/A','2026-05-09 13:41:41'),(7,'DOCENTE','2026-05-09 13:41:41'),(8,'BIBLIOTECA','2026-05-09 13:41:41'),(9,'ESTUDIANTE','2026-05-09 13:41:41');
/*!40000 ALTER TABLE `perfiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `situaciones_revista`
--

DROP TABLE IF EXISTS `situaciones_revista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `situaciones_revista` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cargo_id` bigint unsigned NOT NULL,
  `docente_id` bigint unsigned NOT NULL,
  `tipo` enum('TITULAR','INTERINO','SUPLENTE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `observaciones` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `causal_id` bigint unsigned NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `situaciones_revista_cargo_id_docente_id_fecha_inicio_unique` (`cargo_id`,`docente_id`,`fecha_inicio`),
  KEY `situaciones_revista_docente_id_foreign` (`docente_id`),
  KEY `situaciones_revista_causal_id_foreign` (`causal_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `situaciones_revista`
--

LOCK TABLES `situaciones_revista` WRITE;
/*!40000 ALTER TABLE `situaciones_revista` DISABLE KEYS */;
INSERT INTO `situaciones_revista` VALUES (1,1,1,'TITULAR','Cargo permanente',1,'2020-03-01',NULL,'2026-02-04 04:30:35','2026-02-04 04:30:35',NULL),(2,2,2,'SUPLENTE','Reemplazo temporal',2,'2021-08-15',NULL,'2026-02-04 04:30:35','2026-02-04 04:30:35',NULL),(3,3,3,'INTERINO','Designación provisoria',3,'2022-02-10',NULL,'2026-02-04 04:30:35','2026-02-04 04:30:35',NULL);
/*!40000 ALTER TABLE `situaciones_revista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_hora`
--

DROP TABLE IF EXISTS `tipos_hora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_hora` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_hora`
--

LOCK TABLES `tipos_hora` WRITE;
/*!40000 ALTER TABLE `tipos_hora` DISABLE KEYS */;
INSERT INTO `tipos_hora` VALUES (1,'Frente a curso',NULL,'2026-04-06 00:14:27',NULL),(2,'Extraclase',NULL,'2026-04-06 00:14:27',NULL),(3,'Cargo',NULL,'2026-04-06 00:14:27',NULL),(4,'No docente',NULL,'2026-04-06 00:14:27',NULL),(5,'Especiales',NULL,'2026-04-06 00:14:27',NULL),(6,'Visita',NULL,'2026-06-26 21:53:58',NULL);
/*!40000 ALTER TABLE `tipos_hora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tramitaciones`
--

DROP TABLE IF EXISTS `tramitaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tramitaciones` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `tipo_tramite` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_tramite_id` int DEFAULT NULL,
  `docente_id` bigint unsigned DEFAULT NULL,
  `rol` int DEFAULT NULL,
  `expediente` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cargo_id` bigint unsigned DEFAULT NULL,
  `estado` enum('caratulado','en_tramitacion','espera_documentacion','urgente','realizado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'caratulado',
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tramitaciones_cargo` (`cargo_id`),
  KEY `fk_tramitaciones_codigo` (`codigo_tramite_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tramitaciones`
--

LOCK TABLES `tramitaciones` WRITE;
/*!40000 ALTER TABLE `tramitaciones` DISABLE KEYS */;
INSERT INTO `tramitaciones` VALUES (1,'2026-04-03','',1,6,2,'EX-2025-14544125-GCABA-DGPDYNG',2,'realizado',NULL,'2026-04-03 17:34:27','2026-05-15 17:54:14',NULL,1),(2,'2026-04-03','',1,16,15,'EX-2025-1004125-GCABA-DGPDYNG',5,'caratulado',NULL,'2026-04-03 18:04:24','2026-04-03 18:14:28',NULL,1),(3,'2026-04-03','',3,16,45,'EX-2025-1000005-GCABA-DGPDYNG',2,'caratulado',NULL,'2026-04-03 18:30:33',NULL,NULL,1),(4,'2026-04-03','',4,16,45,'EX-2025-100006-GCABA-DGPDYNG',2,'realizado','FALTA QR','2026-04-03 18:34:54','2026-04-03 18:47:05',NULL,1),(5,'2026-04-03','',3,21,27,'EX-2025-100010-GCABA-DGPDYNG',5,'caratulado',NULL,'2026-04-03 19:41:08',NULL,NULL,1),(6,'2026-04-03','',4,21,27,'EX-2025-100011-GCABA-DGPDYNG',5,'caratulado',NULL,'2026-04-03 19:42:42',NULL,NULL,1),(7,'2024-08-12','',1,29,12,'EX-2025-100006-GCABA-DGPDYNG',16,'caratulado',NULL,'2026-04-19 15:26:26','2026-04-19 16:02:11',NULL,1),(8,'2026-04-19','',3,20,35,'EX-2025-222222-GCABA-DGPDYNG',16,'realizado',NULL,'2026-04-19 16:30:03','2026-05-09 14:20:41',NULL,1),(9,'2023-03-10','',1,30,27,'EX-2023- MUGUIWARA-ONEPIECE',17,'caratulado',NULL,'2026-06-26 21:49:32',NULL,NULL,2),(10,'2026-06-26','',3,12,28,'EX-2026- MUGUIWARA-ONEPIECE',17,'caratulado',NULL,'2026-06-26 22:41:56',NULL,NULL,3),(11,'2026-07-22','',6,12,28,'Exp: EX-2026- MUGUIWARA-ONEPIECE-CESE',17,'caratulado',NULL,'2026-07-22 12:04:07',NULL,NULL,2),(13,'2026-08-04','',1,28,57,'ex-2025-nojodas',10,'caratulado',NULL,'2026-08-04 19:36:11',NULL,NULL,2),(14,'2026-09-19','',1,20,43,'EX-2023- preceptoria-ecn1',3,'caratulado',NULL,'2026-09-19 16:00:52','2026-09-19 16:02:01',NULL,2),(15,'2026-10-05','',6,31,2,'EX-2023- MUGUIWARA-ONEPIECE',19,'caratulado',NULL,'2026-10-05 13:24:57','2026-10-05 13:26:15',NULL,6);
/*!40000 ALTER TABLE `tramitaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tramitaciones_legacy`
--

DROP TABLE IF EXISTS `tramitaciones_legacy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tramitaciones_legacy` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `estado` enum('urgente','realizado','en_tramitacion','espera_documentacion','caratulado','a_la_guarda') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_tramitacion',
  `cargo_docente_id` bigint unsigned NOT NULL,
  `abm` enum('alta','baja','modificacion') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expediente` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_tramite_id` bigint unsigned NOT NULL,
  `causal_id` bigint unsigned DEFAULT NULL,
  `licencia_id` bigint unsigned DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tramitaciones_legacy`
--

LOCK TABLES `tramitaciones_legacy` WRITE;
/*!40000 ALTER TABLE `tramitaciones_legacy` DISABLE KEYS */;
INSERT INTO `tramitaciones_legacy` VALUES (1,'2024-03-01','realizado',1,'alta','EXP-2024-0001',1,1,NULL,'Alta titular Arnau preceptor','2026-02-19 22:08:53','2026-02-19 22:08:53',NULL),(2,'2024-03-10','realizado',2,'alta','EXP-2024-0003',3,3,NULL,'Alta suplente Juárez reemplaza Arnau','2026-02-19 22:22:24','2026-02-19 22:22:24',NULL),(3,'2024-03-10','realizado',2,'alta','EXP-2024-0004',3,3,NULL,'Alta suplente Juárez reemplaza Arnau','2026-02-19 22:32:26','2026-02-19 22:32:26',NULL),(4,'2024-03-15','realizado',2,'baja','EXP-2024-0005',4,7,NULL,'Fin suplencia Juárez regreso titular Arnau','2026-02-19 22:45:34','2026-02-19 22:45:34',NULL);
/*!40000 ALTER TABLE `tramitaciones_legacy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_modulo`
--

DROP TABLE IF EXISTS `usuario_modulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_modulo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `modulo_id` int DEFAULT NULL,
  `permiso` enum('lectura','edicion') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`modulo_id`),
  KEY `modulo_id` (`modulo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_modulo`
--

LOCK TABLES `usuario_modulo` WRITE;
/*!40000 ALTER TABLE `usuario_modulo` DISABLE KEYS */;
INSERT INTO `usuario_modulo` VALUES (1,1,1,'edicion'),(2,1,2,'edicion'),(5,1,4,'edicion'),(6,1,3,'edicion'),(7,1,5,'edicion'),(8,1,6,'edicion'),(9,1,7,'edicion'),(10,1,8,'edicion'),(11,1,9,'edicion'),(12,1,10,'edicion');
/*!40000 ALTER TABLE `usuario_modulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('pendiente','activo','rechazado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `activo` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `perfil` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `perfil_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'sergio','$2b$10$MHbhT8eCj9TSp2EHIdimgOhZT58mMiEWlN9wEP9nyjGNchK39RXjG','Sergio','activo',1,'2026-02-21 18:18:59','SECRETARIO',2),(2,'7u7e','$2b$10$mMTNd5OEUGgP5r539.hQn.s/vkolckQ8lVp8AKXwnJ17OMx6Vt22W','7u7e','activo',1,'2026-05-09 13:27:43','ADMINISTRADOR',1),(6,'Naty','$2b$10$nc2TpHDQCksHmAe5TqTrVe/7cFJWZM219eZKe.7KDOoA7r/LpBKZu','Natalia Blanco','activo',1,'2026-10-05 10:16:16',NULL,1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-05 10:40:56
