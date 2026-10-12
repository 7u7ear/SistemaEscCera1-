-- Permitir múltiples preceptores por curso en la tabla curso_preceptor
ALTER TABLE curso_preceptor DROP INDEX idx_curso_anio;
ALTER TABLE curso_preceptor ADD UNIQUE KEY idx_curso_docente_anio (curso_id, docente_id, anio_lectivo);
