const db = require('../../../config/database');

class BloqueHorarioController {
    async getPorTurno(req, res, next) {
        try {
            const { turno } = req.query;
            let sql = "SELECT * FROM bloques_horarios WHERE deleted_at IS NULL";
            let params = [];

            if (turno && !['COMPLETO', 'TODOS', 'ALL'].includes(turno.toUpperCase())) {
                sql += " AND turno = ?";
                params.push(turno);
            }

            sql += " ORDER BY hora_inicio ASC";

            const [rows] = await db.query(sql, params);
            res.json(rows);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new BloqueHorarioController();
