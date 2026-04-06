const db = require('../../../config/database');
const AppError = require('../../shared/errors/AppError');

module.exports = (nombreModulo, tipo) => {
    return async (req, res, next) => {
        try {
            const user = req.session.user;
            if (!user) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const [moduloRows] = await db.query(`
                SELECT id FROM modulos WHERE nombre = ?
            `, [nombreModulo]);

            if (moduloRows.length === 0) {
                return res.status(403).json({ error: "Módulo inexistente" });
            }

            const modulo_id = moduloRows[0].id;

            const [rows] = await db.query(`
                SELECT permiso
                FROM usuario_modulo
                WHERE usuario_id = ? AND modulo_id = ?
            `, [user.id, modulo_id]);

            if (rows.length === 0) {
                return res.status(403).json({ error: "Sin permiso para este módulo" });
            }

            const permiso = rows[0].permiso;

            if (tipo === "lectura") {
                if (permiso === "lectura" || permiso === "edicion") {
                    return next();
                }
            }

            if (tipo === "edicion") {
                if (permiso === "edicion") {
                    return next();
                }
            }

            return res.status(403).json({ error: `Permiso de ${tipo} denegado` });

        } catch (err) {
            next(err);
        }
    };
};
