/**
 * Plantilla HTML para la notificación por correo electrónico de solicitudes de licencias pendientes.
 */

function generarHtmlNotificacionLicencia({ docenteNombre, docenteDni, puestoNombre, puestoNumero, fechaInicio, fechaFin, tipoLicencia, codigoTramite, observaciones, destinatarioRol }) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background-color: #0d6efd; color: #ffffff; padding: 20px; text-align: center; }
            .header h2 { margin: 0; font-size: 20px; }
            .content { padding: 24px; line-height: 1.6; }
            .badge { display: inline-block; background-color: #ffc107; color: #000; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 12px; }
            .info-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            .info-table td { padding: 10px; border-bottom: 1px solid #eee; }
            .info-table td.label { font-weight: bold; width: 35%; color: #555; }
            .footer { background-color: #f8f9fa; padding: 16px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <h2>Sistema ECN Nº1 Cerámica</h2>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Aviso de Solicitud de Licencia Docente</p>
            </div>
            <div class="content">
                <p>Estimado/a <strong>${destinatarioRol}</strong>,</p>
                <p>Se ha registrado una nueva solicitud de licencia docente en estado <span class="badge">PENDIENTE DE APROBACIÓN</span>.</p>

                <table class="info-table">
                    <tr>
                        <td class="label">Docente:</td>
                        <td><strong>${docenteNombre}</strong> (DNI: ${docenteDni})</td>
                    </tr>
                    <tr>
                        <td class="label">Puesto / Cargo:</td>
                        <td>${puestoNombre || 'Cargo N° ' + puestoNumero} (N° ${puestoNumero || '-'})</td>
                    </tr>
                    <tr>
                        <td class="label">Tipo / Motivo:</td>
                        <td>${tipoLicencia || 'Licencia General'} ${codigoTramite ? '(' + codigoTramite + ')' : ''}</td>
                    </tr>
                    <tr>
                        <td class="label">Fecha Inicio:</td>
                        <td>${fechaInicio}</td>
                    </tr>
                    <tr>
                        <td class="label">Fecha Fin:</td>
                        <td>${fechaFin || 'A confirmar'}</td>
                    </tr>
                    ${observaciones ? `
                    <tr>
                        <td class="label">Observaciones:</td>
                        <td>${observaciones}</td>
                    </tr>
                    ` : ''}
                </table>

                <p style="margin-top: 20px; font-size: 13px; color: #666;">
                    Por favor, tome conocimiento para coordinar la cobertura del curso y el seguimiento del trámite administrativo.
                </p>
            </div>
            <div class="footer">
                Este es un mensaje automático generado por el Sistema de Gestión Escolar ECN Nº1 Cerámica (CERA 1).
            </div>
        </div>
    </body>
    </html>
    `;
}

module.exports = {
    generarHtmlNotificacionLicencia
};
