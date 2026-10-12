const db = require('../../../config/database');
const logger = require('../services/logger.service');

/**
 * Middleware de Control de Acceso (RBAC + Excepciones)
 * @param {string} nombreModulo - Nombre del módulo (ej: 'docentes', 'cargos')
 * @param {string} tipoRequerido - 'lectura' o 'edicion'
 */
module.exports = (nombreModulo, tipoRequerido) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) return res.status(401).json({ error: "No autorizado" });

            // 1. Obtener ID del módulo
            const [modulos] = await db.query("SELECT id FROM modulos WHERE nombre = ?", [nombreModulo]);
            if (modulos.length === 0) return res.status(403).json({ error: "Módulo inexistente" });
            const moduloId = modulos[0].id;

            // 2. PRIORIDAD 1: Verificar permiso específico por usuario (Excepciones)
            const [userPerm] = await db.query(`
                SELECT permiso FROM usuario_modulo 
                WHERE usuario_id = ? AND modulo_id = ?
            `, [user.id, moduloId]);

            let permisoFinal = userPerm.length > 0 ? userPerm[0].permiso : null;

            // 3. PRIORIDAD 2: Si no hay permiso específico, verificar por PERFILES asignados (RBAC Dinámico)
            if (!permisoFinal) {
                const [userPerfiles] = await db.query(
                    'SELECT perfil_id FROM usuario_perfil WHERE usuario_id = ?',
                    [user.id]
                );
                let perfilIds = userPerfiles.map(r => r.perfil_id);
                if (perfilIds.length === 0) {
                    if (Array.isArray(user.perfil_ids) && user.perfil_ids.length > 0) {
                        perfilIds = user.perfil_ids;
                    } else if (user.perfil_id) {
                        perfilIds = [user.perfil_id];
                    }
                }

                if (perfilIds.length > 0) {
                    const [perfilPerms] = await db.query(`
                        SELECT permiso FROM perfil_modulo 
                        WHERE perfil_id IN (?) AND modulo_id = ?
                    `, [perfilIds, moduloId]);
                    
                    if (perfilPerms.length > 0) {
                        // El permiso mayor prevalece: edicion > lectura > ninguno
                        if (perfilPerms.some(p => p.permiso === 'edicion')) {
                            permisoFinal = 'edicion';
                        } else if (perfilPerms.some(p => p.permiso === 'lectura')) {
                            permisoFinal = 'lectura';
                        } else {
                            permisoFinal = 'ninguno';
                        }
                    }
                }
            }

            // 4. VALIDACIÓN FINAL
            if (!permisoFinal || permisoFinal === 'ninguno') {
                return res.status(403).json({ error: `Acceso denegado al módulo ${nombreModulo}` });
            }

            if (tipoRequerido === 'lectura') {
                if (['lectura', 'edicion'].includes(permisoFinal)) return next();
            }

            if (tipoRequerido === 'edicion') {
                if (permisoFinal === 'edicion') return next();
            }

            return res.status(403).json({ error: `Permiso de ${tipoRequerido} insuficiente para el módulo ${nombreModulo}` });

        } catch (err) {
            logger.error(`Error en Middleware de Permisos: ${err.message}`, { stack: err.stack });
            res.status(500).json({ error: "Error interno de seguridad" });
        }
    };
};
