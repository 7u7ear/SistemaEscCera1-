-- MySQL dump 10.13  Distrib 8.2.0, for Win64 (x86_64)
--
-- Host: mysql-fde0d9c-bdecn1.i.aivencloud.com    Database: defaultdb
-- ------------------------------------------------------
-- Server version	8.4.8

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
  PRIMARY KEY (`id`),
  UNIQUE KEY `alumnos_dni_unique` (`dni`),
  UNIQUE KEY `alumnos_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
INSERT INTO `auditoria` VALUES (1,2,'CREATE','CARGO',17,'{\"tipo_cargo\": \"TP 2 NAVEGACION\", \"total_horas\": 12, \"numero_puesto\": \"102431\"}','2026-06-26 21:44:09'),(2,2,'ASSIGN_DOCENTE','CARGO',17,'{\"rol\": 27, \"docente_id\": 30, \"reemplaza_a\": null, \"fecha_inicio\": \"2023-03-10\", \"expediente_alta\": \"EX-2023- MUGUIWARA-ONEPIECE\", \"situacion_revista\": \"titular\"}','2026-06-26 21:49:35'),(3,2,'ADD_DISTRIBUCION','CARGO',17,'{\"dia\": \"lunes\", \"curso_id\": 1, \"materia_id\": 49, \"hora_egreso\": \"09:00\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 1, \"cantidad_horas\": 2}','2026-06-26 21:52:05'),(4,2,'CREATE','TIPO_HORA',NULL,'{\"nombre\": \"Visita\"}','2026-06-26 21:53:58'),(5,2,'ADD_DISTRIBUCION','CARGO',17,'{\"dia\": \"martes\", \"curso_id\": 6, \"materia_id\": 4, \"hora_egreso\": \"09:00\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 6, \"cantidad_horas\": 2}','2026-06-26 21:54:10'),(6,2,'ADD_DISTRIBUCION','CARGO',17,'{\"dia\": \"miércoles\", \"curso_id\": 17, \"materia_id\": 10, \"hora_egreso\": \"09:00\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 1, \"cantidad_horas\": 2}','2026-06-26 21:56:34'),(7,2,'UPDATE_DISTRIBUCION','CARGO_DISTRIBUCION',10,'{\"dia\": \"miércoles\", \"curso_id\": 17, \"materia_id\": 10, \"hora_egreso\": \"10:30\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 1, \"cantidad_horas\": 4}','2026-06-26 21:57:16'),(8,2,'ADD_DISTRIBUCION','CARGO',17,'{\"dia\": \"jueves\", \"curso_id\": null, \"materia_id\": 14, \"hora_egreso\": \"09:00\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 2, \"cantidad_horas\": 2}','2026-06-26 22:01:33'),(9,2,'ADD_DISTRIBUCION','CARGO',17,'{\"dia\": \"viernes\", \"curso_id\": null, \"materia_id\": 14, \"hora_egreso\": \"10:00\", \"hora_ingreso\": \"07:40\", \"tipo_hora_id\": 2, \"cantidad_horas\": 2}','2026-06-26 22:04:37'),(10,2,'CREATE_USER_ADMIN','USUARIOS',3,'{\"username\": \"Celes\", \"perfil_id\": 4}','2026-06-26 22:10:31'),(11,3,'ASSIGN_DOCENTE','CARGO',17,'{\"rol\": 28, \"docente_id\": 12, \"reemplaza_a\": 28, \"fecha_inicio\": \"2026-06-26\", \"expediente_alta\": \"EX-2026- MUGUIWARA-ONEPIECE\", \"situacion_revista\": \"suplente\"}','2026-06-26 22:41:59'),(12,2,'BAJA_DOCENTE','CARGO',16,'{\"fecha_fin\": \"2026-04-30\", \"cargoDocenteId\": \"27\", \"expediente_baja\": \"ex-2026-1534-cera1-26\", \"titular_regresa\": true}','2026-07-22 12:28:21'),(13,2,'BAJA_DOCENTE','CARGO',16,'{\"fecha_fin\": \"2026-04-30\", \"cargoDocenteId\": \"27\", \"expediente_baja\": \"ex-2026-1534-cera1-26\", \"titular_regresa\": true}','2026-07-22 12:28:22');
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `autorizados`
--

DROP TABLE IF EXISTS `autorizados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `autorizados` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `apellido` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vinculo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alumno_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `autorizados_dni_unique` (`dni`),
  KEY `autorizados_alumno_id_foreign` (`alumno_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `autorizados`
--

LOCK TABLES `autorizados` WRITE;
/*!40000 ALTER TABLE `autorizados` DISABLE KEYS */;
/*!40000 ALTER TABLE `autorizados` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo_docente`
--

LOCK TABLES `cargo_docente` WRITE;
/*!40000 ALTER TABLE `cargo_docente` DISABLE KEYS */;
INSERT INTO `cargo_docente` VALUES (1,6,1,1,'titular','2024-03-01',NULL,'inactivo','2026-02-19 22:07:30','2026-02-19 22:07:30','2026-03-01 13:30:10',NULL,NULL,NULL),(2,7,1,23,'suplente','2024-03-10','2024-03-15','inactivo','2026-02-19 22:29:34','2026-02-19 22:29:34','2026-03-01 13:30:10',1,NULL,NULL),(3,8,1,0,'suplente','2026-03-01',NULL,'inactivo','2026-03-01 13:30:10',NULL,'2026-03-02 00:38:24',NULL,NULL,NULL),(6,6,3,0,'titular','2026-03-01',NULL,'licencia','2026-03-01 13:39:33',NULL,NULL,NULL,NULL,NULL),(11,9,1,0,'titular','2020-03-02',NULL,'inactivo','2026-03-02 00:45:44',NULL,'2026-03-02 00:45:48',NULL,NULL,NULL),(16,9,1,0,'titular','2020-03-02','2026-03-02','inactivo','2026-03-02 01:07:16',NULL,NULL,NULL,NULL,NULL),(17,6,1,0,'suplente','2026-03-02','2026-03-01','inactivo','2026-03-02 01:21:08',NULL,NULL,16,NULL,NULL),(18,6,15,13,'interino','2022-04-03',NULL,'licencia','2026-04-03 15:32:47',NULL,NULL,NULL,NULL,NULL),(19,6,2,2,'titular','2026-04-03',NULL,'licencia','2026-04-03 18:02:13',NULL,NULL,NULL,NULL,NULL),(20,16,5,15,'titular','2026-04-03','2026-04-03','inactivo','2026-04-03 18:04:24',NULL,NULL,NULL,NULL,NULL),(21,16,5,15,'titular','2026-04-03',NULL,'activo','2026-04-03 18:14:28',NULL,NULL,NULL,'EX-2025-1004125-GCABA-DGPDYNG',NULL),(22,16,2,45,'suplente','2026-04-03',NULL,'activo','2026-04-03 18:30:33',NULL,NULL,19,'EX-2025-1000005-GCABA-DGPDYNG',NULL),(23,21,5,27,'suplente','2026-04-03','2026-04-03','inactivo','2026-04-03 19:41:08',NULL,NULL,21,'EX-2025-100010-GCABA-DGPDYNG','EX-2025-100011-GCABA-DGPDYNG'),(24,29,16,12,'titular','2024-08-12','2024-08-12','inactivo','2026-04-19 15:26:26',NULL,NULL,NULL,NULL,NULL),(25,29,16,12,'titular','2024-08-12','2024-08-12','inactivo','2026-04-19 16:01:23',NULL,NULL,NULL,NULL,NULL),(26,29,16,12,'titular','2024-08-12',NULL,'licencia','2026-04-19 16:02:11',NULL,NULL,NULL,'EX-2025-100006-GCABA-DGPDYNG',NULL),(27,20,16,35,'suplente','2026-04-19','2026-04-30','inactivo','2026-04-19 16:30:03','2026-07-22 12:28:21',NULL,26,'EX-2025-222222-GCABA-DGPDYNG','ex-2026-1534-cera1-26'),(28,30,17,27,'titular','2023-03-10',NULL,'activo','2026-06-26 21:49:34','2026-07-22 12:11:04',NULL,NULL,'EX-2023- MUGUIWARA-ONEPIECE',NULL),(29,12,17,28,'suplente','2026-06-26','2026-07-22','inactivo','2026-06-26 22:41:58','2026-07-22 12:11:04',NULL,28,'EX-2026- MUGUIWARA-ONEPIECE','EX-2026- MUGUIWARA-ONEPIECE-CESE');
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargos`
--

LOCK TABLES `cargos` WRITE;
/*!40000 ALTER TABLE `cargos` DISABLE KEYS */;
INSERT INTO `cargos` VALUES (1,'101','TP3 Matemática',20,'Activo',NULL,'2026-02-04 04:30:35','2026-02-04 04:30:35'),(2,'102','TP2 Historia',15,'Activo',NULL,'2026-02-04 04:30:35','2026-02-04 04:30:35'),(3,'103','PRECEPTOR',18,'Activo',NULL,'2026-02-04 04:30:35','2026-02-04 04:30:35'),(4,'254797','Preceptor',30,'activo',NULL,'2026-02-19 22:04:46','2026-02-19 22:04:46'),(5,'345678','TP2',12,'activo',NULL,'2026-02-19 22:04:46','2026-02-19 22:04:46'),(6,'456789','TP3',18,'activo',NULL,'2026-02-19 22:04:46','2026-02-19 22:04:46'),(7,'567890','HC Matemática',2,'activo',NULL,'2026-02-19 22:04:46','2026-02-19 22:04:46'),(8,'678901','HC Lengua',3,'activo',NULL,'2026-02-19 22:04:46','2026-02-19 22:04:46'),(9,'789012','HC Historia',2,'activo',NULL,'2026-02-19 22:04:46','2026-02-19 22:04:46'),(10,'890123','HC Inglés',3,'activo',NULL,'2026-02-19 22:04:46','2026-02-19 22:04:46'),(11,'901234','HC Educación Física',4,'activo',NULL,'2026-02-19 22:04:46','2026-02-19 22:04:46'),(12,'112233','Jefe de área Matemática',6,'activo',NULL,'2026-02-19 22:04:46','2026-02-19 22:04:46'),(13,'223344','Coordinador pedagógico',12,'activo',NULL,'2026-02-19 22:04:46','2026-02-19 22:04:46'),(14,'456781','TP1 LENGUA Y LITERATURA',30,'activo',NULL,'2026-04-03 15:14:00','2026-04-03 15:32:12'),(15,'456787','TP1 ED.FISICA',30,'activo',NULL,'2026-04-03 15:31:35',NULL),(16,'31082013','TP Economia ',12,'activo',NULL,'2026-04-19 15:16:13',NULL),(17,'102431','TP 2 NAVEGACION',12,'activo',NULL,'2026-06-26 21:44:09',NULL);
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
-- Table structure for table `curso_materia`
--

DROP TABLE IF EXISTS `curso_materia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso_materia` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `curso_id` bigint unsigned NOT NULL,
  `materia_id` bigint unsigned NOT NULL,
  `modulos_asignados` int unsigned NOT NULL,
  `docente_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `curso_materia_curso_id_materia_id_docente_id_unique` (`curso_id`,`materia_id`,`docente_id`),
  KEY `curso_materia_materia_id_foreign` (`materia_id`),
  KEY `curso_materia_docente_id_foreign` (`docente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso_materia`
--

LOCK TABLES `curso_materia` WRITE;
/*!40000 ALTER TABLE `curso_materia` DISABLE KEYS */;
/*!40000 ALTER TABLE `curso_materia` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distribucion_horas`
--

LOCK TABLES `distribucion_horas` WRITE;
/*!40000 ALTER TABLE `distribucion_horas` DISABLE KEYS */;
INSERT INTO `distribucion_horas` VALUES (1,1,1,45,2,NULL,'clase','lunes','07:45:00','09:45:00','2026-02-19 23:42:32','2026-02-19 23:42:32',NULL),(2,1,1,14,1,NULL,'extraclase','martes','09:45:00','10:25:00','2026-02-19 23:42:32','2026-02-19 23:42:32',NULL),(3,1,8,45,2,NULL,'clase','miércoles','09:45:00','11:45:00','2026-02-19 23:42:32','2026-02-19 23:42:32',NULL),(4,15,9,10,2,NULL,'clase','martes','08:00:00','10:00:00','2026-04-03 15:33:42',NULL,NULL),(5,16,2,9,4,1,'materia','martes','08:00:00','10:30:00','2026-04-19 16:04:25','2026-04-19 16:12:19',NULL),(6,16,1,9,4,1,'materia','lunes','08:00:00','10:30:00','2026-04-19 16:16:15','2026-04-19 16:44:40',NULL),(7,16,0,14,4,2,'materia','miércoles','10:30:00','12:00:00','2026-04-19 16:17:59','2026-04-19 16:20:38',NULL),(8,17,1,49,2,1,'materia','lunes','07:40:00','09:00:00','2026-06-26 21:52:05',NULL,NULL),(9,17,6,4,2,6,'materia','martes','07:40:00','09:00:00','2026-06-26 21:54:10',NULL,NULL),(10,17,17,10,4,1,'materia','miércoles','07:40:00','10:30:00','2026-06-26 21:56:33','2026-06-26 21:57:16',NULL),(11,17,NULL,14,2,2,'materia','jueves','07:40:00','09:00:00','2026-06-26 22:01:32',NULL,NULL),(12,17,NULL,14,2,2,'materia','viernes','07:40:00','10:00:00','2026-06-26 22:04:37',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docentes`
--

LOCK TABLES `docentes` WRITE;
/*!40000 ALTER TABLE `docentes` DISABLE KEYS */;
INSERT INTO `docentes` VALUES (6,'1001','Arnau','Matías','1985-06-12','30123456','20-30123456-3','FC1001','marnau@mail.com','Av. Rivadavia 1234','1134567890','2015-03-01','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(7,'1002','Juárez','Laura','1988-09-22','28987654','27-28987654-1','FC1002','ljuarez@mail.com','Mitre 456','1123456789','2018-02-15','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(8,'1003','Pérez','Carlos','1979-11-10','27456789','20-27456789-5','FC1003','cperez@mail.com','Belgrano 890','1133344455','2010-07-01','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(9,'1004','Gómez','Ana','1990-01-30','29876543','27-29876543-2','FC1004','agomez@mail.com','San Juan 555','1167891234','2019-03-10','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(10,'1005','López','María','1984-04-18','29222333','27-29222333-7','FC1005','mlopez@mail.com','Lavalle 321','1145671234','2012-08-01','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(11,'1006','Fernández','Diego','1982-12-05','28111222','20-28111222-4','FC1006','dfernandez@mail.com','Corrientes 999','1156782345','2011-05-15','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(12,'1007','Martínez','Sofía','1993-03-25','30333444','27-30333444-8','FC1007','smartinez@mail.com','Callao 123','1165432211','2020-04-01','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(13,'1008','Sánchez','Pedro','1975-07-14','26123456','20-26123456-9','FC1008','psanchez@mail.com','Santa Fe 567','1143219876','2005-06-20','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(14,'1009','Ramírez','Lucía','1987-10-08','29555666','27-29555666-0','FC1009','lramirez@mail.com','Alvear 345','1132198765','2017-09-01','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(15,'1010','Torres','Javier','1981-02-17','27999888','20-27999888-2','FC1010','jtorres@mail.com','Moreno 765','1167895432','2009-11-15','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(16,'1011','Díaz','Carolina','1992-06-05','30444555','27-30444555-3','FC1011','cdiaz@mail.com','Entre Ríos 444','1145674321','2021-03-01','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(17,'1012','Vega','Andrés','1986-01-11','29111234','20-29111234-6','FC1012','avega@mail.com','Suipacha 234','1134567777','2014-02-10','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(18,'1013','Morales','Natalia','1994-08-19','30555123','27-30555123-1','FC1013','nmorales@mail.com','Perú 678','1155556666','2022-05-05','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(19,'1014','Castro','Fernando','1978-03-03','27000999','20-27000999-8','FC1014','fcastro@mail.com','Independencia 890','1122334455','2007-04-18','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(20,'1015','Rojas','Elena','1989-12-12','29777111','27-29777111-4','FC1015','erojas@mail.com','México 345','1144445555','2016-08-20','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(21,'1016','Ortega','Luis','1983-05-27','28222444','20-28222444-1','FC1016','lortega@mail.com','Bolívar 111','1133322111','2013-03-15','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(22,'1017','Silva','Patricia','1991-09-09','30222111','27-30222111-9','FC1017','psilva@mail.com','Lima 222','1166667777','2019-07-01','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(23,'1018','Navarro','Roberto','1976-10-01','26555444','20-26555444-7','FC1018','rnavarro@mail.com','Chacabuco 456','1155558888','2006-09-10','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(24,'1019','Acosta','Gabriela','1988-04-14','29000987','27-29000987-5','FC1019','gacosta@mail.com','Defensa 333','1133377788','2018-11-12','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(25,'1020','Herrera','Tomás','1995-02-21','30666123','20-30666123-6','FC1020','therrera@mail.com','Paseo Colón 999','1144412345','2023-02-01','activo','2026-02-19 22:02:35','2026-02-19 22:02:35',NULL,NULL),(26,'154873','al','lk','1789-04-12','12454541','20123456987','759468','alk@gmail.com',NULL,'115506981','2026-02-22','activo',NULL,NULL,NULL,NULL),(27,'12','Boca','juniors ','1979-03-12','12345656','20123456565','123345','boca@gmail.com','bransen 405','1212121212','2026-03-01','inactivo',NULL,NULL,'2026-04-19 15:05:00',1),(28,'00012','boca ','juniors','1984-03-12','11111111','22111111112','001','12bjs@gmail.com','Avenida Oca 5115','01155069845','2010-10-15','activo','2026-04-03 14:49:45','2026-04-03 14:50:03',NULL,NULL),(29,'31082013','Arnau D´Aloy','Celeste','1997-08-31','53418187','20234733716','0011010','arnauceles@gmail.com','Montes de Oca 600','0115504015','2014-08-03','activo','2026-04-19 15:04:32','2026-04-19 15:04:50',NULL,NULL),(30,'159','monkey D','luffy','2026-01-01','12345678','201234567812','12','onepiece@bue.edu.ar','Montes 4567','1155069327','2026-05-14','activo','2026-05-15 00:08:42',NULL,NULL,NULL),(31,'030','Arnau','Matias Ezequiel','2026-04-28','2774958','20277749583','4469041','arnaumatias@gmail.com','Montes de Oca 511','01155069327','2026-05-07','activo','2026-05-15 00:54:02',NULL,NULL,NULL);
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
  `alumno_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `familiares_dni_unique` (`dni`),
  KEY `familiares_alumno_id_foreign` (`alumno_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licencias`
--

LOCK TABLES `licencias` WRITE;
/*!40000 ALTER TABLE `licencias` DISABLE KEYS */;
INSERT INTO `licencias` VALUES (1,6,3,NULL,'2026-04-04','2026-04-04','70.j',0,NULL,NULL,'2026-04-04 02:30:27','2026-04-04 19:55:33','2026-04-04 19:55:33'),(2,6,15,NULL,'2026-04-04',NULL,'70.j',0,NULL,NULL,'2026-04-04 02:30:27','2026-04-04 19:55:31','2026-04-04 19:55:31'),(3,6,3,NULL,'2026-04-04','2026-04-04','70 T',0,NULL,NULL,'2026-04-04 19:56:49','2026-04-19 16:39:39',NULL),(4,6,15,NULL,'2026-04-04','2026-04-04','70 T',0,NULL,NULL,'2026-04-04 19:56:49','2026-05-04 12:00:59',NULL),(5,6,2,NULL,'2026-04-04','2026-04-04','70 T',0,NULL,NULL,'2026-04-04 19:56:49','2026-04-19 16:40:04',NULL),(6,29,16,NULL,'2026-04-17','2026-04-30','70a',1,NULL,NULL,'2026-04-19 16:26:11','2026-07-22 12:25:26',NULL),(7,30,17,NULL,'2026-06-26','2026-07-21','70.j',1,'ex-2026-onepiece-cera1',NULL,'2026-06-26 22:27:53','2026-07-22 11:51:17',NULL),(8,29,16,NULL,'2026-07-22',NULL,'70a',0,NULL,NULL,'2026-07-22 12:30:28','2026-07-22 12:30:28',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_modulo`
--

LOCK TABLES `perfil_modulo` WRITE;
/*!40000 ALTER TABLE `perfil_modulo` DISABLE KEYS */;
INSERT INTO `perfil_modulo` VALUES (1,1,1,'edicion'),(2,2,1,'edicion'),(3,1,2,'edicion'),(4,2,2,'edicion'),(5,1,3,'edicion'),(6,2,3,'edicion'),(7,1,4,'edicion'),(8,2,4,'edicion'),(9,1,5,'edicion'),(10,2,5,'edicion'),(11,1,6,'edicion'),(12,2,6,'edicion'),(13,1,7,'edicion'),(14,2,7,'edicion'),(15,1,8,'edicion'),(16,2,8,'edicion'),(17,1,9,'edicion'),(18,2,9,'edicion'),(19,1,10,'edicion'),(20,2,10,'edicion'),(21,4,1,'edicion'),(23,6,2,'lectura'),(24,3,1,'lectura'),(25,3,2,'edicion'),(26,4,7,'edicion'),(27,4,8,'edicion'),(28,4,10,'lectura'),(30,4,4,'edicion');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tramitaciones`
--

LOCK TABLES `tramitaciones` WRITE;
/*!40000 ALTER TABLE `tramitaciones` DISABLE KEYS */;
INSERT INTO `tramitaciones` VALUES (1,'2026-04-03','',1,6,2,'EX-2025-14544125-GCABA-DGPDYNG',2,'realizado',NULL,'2026-04-03 17:34:27','2026-05-15 17:54:14',NULL,1),(2,'2026-04-03','',1,16,15,'EX-2025-1004125-GCABA-DGPDYNG',5,'caratulado',NULL,'2026-04-03 18:04:24','2026-04-03 18:14:28',NULL,1),(3,'2026-04-03','',3,16,45,'EX-2025-1000005-GCABA-DGPDYNG',2,'caratulado',NULL,'2026-04-03 18:30:33',NULL,NULL,1),(4,'2026-04-03','',4,16,45,'EX-2025-100006-GCABA-DGPDYNG',2,'realizado','FALTA QR','2026-04-03 18:34:54','2026-04-03 18:47:05',NULL,1),(5,'2026-04-03','',3,21,27,'EX-2025-100010-GCABA-DGPDYNG',5,'caratulado',NULL,'2026-04-03 19:41:08',NULL,NULL,1),(6,'2026-04-03','',4,21,27,'EX-2025-100011-GCABA-DGPDYNG',5,'caratulado',NULL,'2026-04-03 19:42:42',NULL,NULL,1),(7,'2024-08-12','',1,29,12,'EX-2025-100006-GCABA-DGPDYNG',16,'caratulado',NULL,'2026-04-19 15:26:26','2026-04-19 16:02:11',NULL,1),(8,'2026-04-19','',3,20,35,'EX-2025-222222-GCABA-DGPDYNG',16,'realizado',NULL,'2026-04-19 16:30:03','2026-05-09 14:20:41',NULL,1),(9,'2023-03-10','',1,30,27,'EX-2023- MUGUIWARA-ONEPIECE',17,'caratulado',NULL,'2026-06-26 21:49:32',NULL,NULL,2),(10,'2026-06-26','',3,12,28,'EX-2026- MUGUIWARA-ONEPIECE',17,'caratulado',NULL,'2026-06-26 22:41:56',NULL,NULL,3),(11,'2026-07-22','',6,12,28,'Exp: EX-2026- MUGUIWARA-ONEPIECE-CESE',17,'caratulado',NULL,'2026-07-22 12:04:07',NULL,NULL,2);
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
-- Table structure for table `usuario_curso`
--

DROP TABLE IF EXISTS `usuario_curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `curso_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `curso_id` (`curso_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_curso`
--

LOCK TABLES `usuario_curso` WRITE;
/*!40000 ALTER TABLE `usuario_curso` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_curso` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'sergio','$2b$10$v7Jg0c.3OAGtRis7N3oW2OPZ2Bt14YEQNouxO8bnLCHUSDxbRk7Gu','Sergio','activo',1,'2026-02-21 18:18:59','SECRETARIO',2),(2,'7u7e','$2b$10$TQOwbv9RJ6y5dGhUT330RuM0SfquV8XMfUjdlVmNXhrgHCaioubg.','7u7e','activo',1,'2026-05-09 13:27:43','ADMINISTRADOR',1),(3,'Celes','$2b$10$ZSSbvB/gYreYv.6s5fqHTetpcM8hvWOu7NEd4/.nNkrtHZWfJPhPu','Arnau Celeste','activo',1,'2026-06-26 22:10:30',NULL,4);
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

-- Dump completed on 2026-07-29  7:21:36
