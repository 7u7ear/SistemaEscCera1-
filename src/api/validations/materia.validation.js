const { z } = require('zod');

const createMateriaSchema = z.object({
    nombre: z.string().trim().min(1, 'El nombre de la materia es requerido')
});

module.exports = {
    createMateriaSchema
};
