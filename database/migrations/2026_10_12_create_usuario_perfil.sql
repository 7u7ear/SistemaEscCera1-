-- Migración: Tabla intermedia usuario_perfil para soporte de múltiples perfiles por usuario

CREATE TABLE IF NOT EXISTS `usuario_perfil` (
  `usuario_id` INT NOT NULL,
  `perfil_id` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_id`, `perfil_id`),
  KEY `idx_usuario_perfil_usuario` (`usuario_id`),
  KEY `idx_usuario_perfil_perfil` (`perfil_id`),
  CONSTRAINT `fk_usuario_perfil_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_usuario_perfil_perfil` FOREIGN KEY (`perfil_id`) REFERENCES `perfiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrar perfiles actuales de usuarios existentes
INSERT IGNORE INTO `usuario_perfil` (`usuario_id`, `perfil_id`)
SELECT `id`, `perfil_id` FROM `usuarios` WHERE `perfil_id` IS NOT NULL;
