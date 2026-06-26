const { z } = require('zod');

const createTramitacionSchema = z.object({
    fecha: z.string().min(1, 'Fecha es requerida'),
    codigo_tramite_id: z.coerce.number({ required_error: 'Código de trámite es requerido' }),
    docente_id: z.coerce.number().optional().nullable(),
    cargo_id: z.coerce.number().optional().nullable(),
    rol: z.string().optional().nullable(),
    expediente: z.string().optional().nullable(),
    estado: z.enum(['caratulado', 'en_tramitacion', 'espera_documentacion', 'urgente', 'realizado']).optional(),
    observaciones: z.string().optional().nullable(),
});

const updateTramitacionSchema = z.object({
    fecha: z.string().optional(),
    codigo_tramite_id: z.coerce.number().optional().nullable(),
    docente_id: z.coerce.number().optional().nullable(),
    cargo_id: z.coerce.number().optional().nullable(),
    rol: z.string().optional().nullable(),
    expediente: z.string().optional().nullable(),
    estado: z.enum(['caratulado', 'en_tramitacion', 'espera_documentacion', 'urgente', 'realizado']).optional(),
    observaciones: z.string().optional().nullable(),
});

module.exports = { createTramitacionSchema, updateTramitacionSchema };
