-- Migración: Agregar borrado lógico a tabla alumnos
-- Fecha: 2026-09-19
-- Motivo: Reemplazar DELETE físico por soft delete (deleted_at)

ALTER TABLE alumnos ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

-- Índice para eficiencia en filtros por alumnos activos
CREATE INDEX idx_alumnos_deleted_at ON alumnos (deleted_at);
