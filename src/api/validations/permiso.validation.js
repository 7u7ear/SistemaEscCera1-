const { z } = require('zod');

const updatePermisoSchema = z.object({
    perfil_id: z.coerce.number({ required_error: 'perfil_id es requerido' }),
    modulo_id: z.coerce.number({ required_error: 'modulo_id es requerido' }),
    permiso: z.enum(['ninguno', 'lectura', 'edicion'], {
        errorMap: () => ({ message: "permiso debe ser 'ninguno', 'lectura' o 'edicion'" }),
    }),
});

module.exports = { updatePermisoSchema };
