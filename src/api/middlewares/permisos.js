const db = require('../../../config/database');

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

            // 3. PRIORIDAD 2: Si no hay permiso específico, verificar por PERFIL (RBAC Dinámico)
            if (!permisoFinal && user.perfil_id) {
                const [perfilPerm] = await db.query(`
                    SELECT permiso FROM perfil_modulo 
                    WHERE perfil_id = ? AND modulo_id = ?
                `, [user.perfil_id, moduloId]);
                
                if (perfilPerm.length > 0) {
                    permisoFinal = perfilPerm[0].permiso;
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
            console.error('Error en Middleware de Permisos:', err);
            res.status(500).json({ error: "Error interno de seguridad" });
        }
    };
};
