-- Migración: Agregar columna email a usuarios y crear tabla password_resets
-- Fecha: 2026-10-12

-- 1. Agregar columna email a la tabla usuarios si no existe
SET @exist := (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'usuarios' 
      AND COLUMN_NAME = 'email'
);
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE usuarios ADD COLUMN email VARCHAR(150) NULL AFTER nombre', 'SELECT "columna email ya existe"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Crear tabla password_resets para tokens de restablecimiento de contraseña (1 hora de vigencia)
CREATE TABLE IF NOT EXISTS password_resets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token),
    INDEX idx_usuario (usuario_id),
    CONSTRAINT fk_password_resets_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
