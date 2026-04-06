const db = require('../../../config/database');

class DocenteRepository {
    async findAll() {
        const [rows] = await db.query(`
            SELECT id, rrhh_id, apellido, nombre, fechaNac, dni, cuil, fichaCensal, email, direccion, telefono, fecha_ingreso, estado
            FROM docentes
            WHERE deleted_at IS NULL
        `);
        return rows;
    }

    async findById(id) {
        const [rows] = await db.query(
            "SELECT * FROM docentes WHERE id = ? AND deleted_at IS NULL",
            [id]
        );
        return rows[0];
    }

    async findDuplicate(rrhh_id, dni, cuil, excludeId = null) {
        let sql = "SELECT id FROM docentes WHERE (rrhh_id = ? OR dni = ? OR cuil = ?) AND deleted_at IS NULL";
        const params = [rrhh_id, dni, cuil];
        
        if (excludeId) {
            sql += " AND id != ?";
            params.push(excludeId);
        }

        const [rows] = await db.query(sql, params);
        return rows[0];
    }

    async create(data) {
        const { rrhh_id, apellido, nombre, fechaNac, dni, cuil, fichaCensal, email, direccion, telefono, fecha_ingreso } = data;
        const [result] = await db.query(`
            INSERT INTO docentes
            (rrhh_id, apellido, nombre, fechaNac, dni, cuil, fichaCensal, email, direccion, telefono, fecha_ingreso, estado, created_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?, 'activo', NOW())
        `, [rrhh_id, apellido, nombre, fechaNac || null, dni, cuil, fichaCensal || null, email || null, direccion || null, telefono || null, fecha_ingreso || null]);
        return result.insertId;
    }

    async update(id, data) {
        const { rrhh_id, apellido, nombre, fechaNac, dni, cuil, fichaCensal, email, direccion, telefono, fecha_ingreso, estado } = data;
        await db.query(`
            UPDATE docentes SET
            rrhh_id=?, apellido=?, nombre=?, fechaNac=?, dni=?, cuil=?, fichaCensal=?, email=?, direccion=?, telefono=?, fecha_ingreso=?, estado=?, updated_at=NOW()
            WHERE id=? AND deleted_at IS NULL
        `, [rrhh_id, apellido, nombre, fechaNac || null, dni, cuil, fichaCensal || null, email || null, direccion || null, telefono || null, fecha_ingreso || null, estado || 'activo', id]);
    }

    async delete(id, userId) {
        await db.query(
            "UPDATE docentes SET deleted_at=NOW(), deleted_by=?, estado='inactivo' WHERE id=?",
            [userId, id]
        );
    }

    async findCargos(docenteId) {
        const [rows] = await db.query(`
            SELECT c.id AS cargo_id, c.numero_puesto, c.tipo_cargo, cd.situacion_revista, cd.fecha_inicio
            FROM cargo_docente cd
            JOIN cargos c ON cd.cargo_id = c.id
            WHERE cd.docente_id = ? AND cd.deleted_at IS NULL AND c.deleted_at IS NULL AND cd.estado IN ('activo', 'licencia')
        `, [docenteId]);
        return rows;
    }
}

module.exports = new DocenteRepository();
