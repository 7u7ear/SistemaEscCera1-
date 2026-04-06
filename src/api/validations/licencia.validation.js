const { z } = require('zod');

const createLicenciaSchema = z.object({
    docente_id: z.number({ required_error: 'Docente es requerido' }),
    cargo_ids: z.array(z.number()).optional().nullable(),
    fecha_inicio: z.string().min(1, 'Fecha inicio es requerida'),
    fecha_fin: z.string().optional().nullable(),
    tipo_licencia: z.string().min(1, 'Tipo de licencia es requerido'),
    corresponde_expediente: z.boolean().optional(),
    expediente: z.string().optional().nullable(),
    observaciones: z.string().optional().nullable(),
    actualizar_puesto: z.boolean().optional(),
    generar_tramite: z.boolean().optional(),
    codigo_tramite_id: z.number().optional().nullable()
});

const updateLicenciaSchema = z.object({
    fecha_inicio: z.string().optional(),
    fecha_fin: z.string().optional().nullable(),
    tipo_licencia: z.string().optional(),
    corresponde_expediente: z.boolean().optional(),
    expediente: z.string().optional().nullable(),
    observaciones: z.string().optional().nullable(),
    finalizar_puesto: z.boolean().optional()
});

const createTipoLicenciaSchema = z.object({
    cod_licencia: z.string().min(1, 'Código es requerido'),
    descripcion: z.string().min(1, 'Descripción es requerida')
});

module.exports = {
    createLicenciaSchema,
    updateLicenciaSchema,
    createTipoLicenciaSchema
};
