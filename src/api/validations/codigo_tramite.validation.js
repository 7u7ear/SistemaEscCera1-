const { z } = require('zod');

const codigoTramiteSchema = z.object({
    codigo: z.string().min(1, 'Código es requerido'),
    descripcion_tramite: z.string().min(1, 'Descripción es requerida'),
});

module.exports = { codigoTramiteSchema };
