const getStyles = () => `
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; }
        .header { background-color: #0d6efd; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background-color: #fcfcfc; }
        .footer { text-align: center; padding: 15px; font-size: 12px; color: #777; border-top: 1px solid #eaeaea; }
        .badge { display: inline-block; padding: 5px 10px; font-weight: bold; border-radius: 4px; color: white; }
        .badge-pendiente { background-color: #ffc107; color: black; }
        .badge-aprobada { background-color: #198754; }
        .badge-rechazada { background-color: #dc3545; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
        th { width: 35%; color: #555; }
    </style>
`;

const plantillaSolicitud = (docente, licencia) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        ${getStyles()}
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Nueva Solicitud de Licencia</h2>
            </div>
            <div class="content">
                <p>Hola,</p>
                <p>El docente <strong>${docente.nombre} ${docente.apellido}</strong> (DNI: ${docente.dni}) ha solicitado una nueva licencia y requiere revisión.</p>
                
                <table>
                    <tr><th>Tipo de Licencia</th><td>${licencia.articulo}</td></tr>
                    <tr><th>Fecha Inicio</th><td>${licencia.fecha_inicio}</td></tr>
                    <tr><th>Fecha Fin</th><td>${licencia.fecha_fin}</td></tr>
                    <tr><th>Estado</th><td><span class="badge badge-pendiente">PENDIENTE</span></td></tr>
                </table>
                
                <p style="margin-top: 20px;">Por favor, ingresá al Sistema ECN N°1 para aprobar o rechazar esta solicitud.</p>
            </div>
            <div class="footer">
                <p>Este es un correo automático, por favor no responder.</p>
                <p>Sistema de Gestión Escolar - ECN N°1 Cerámica</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const plantillaResolucion = (docente, licencia, aprobada) => {
    const estadoStr = aprobada ? 'APROBADA' : 'RECHAZADA';
    const badgeClass = aprobada ? 'badge-aprobada' : 'badge-rechazada';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        ${getStyles()}
    </head>
    <body>
        <div class="container">
            <div class="header" style="background-color: ${aprobada ? '#198754' : '#dc3545'};">
                <h2>Resolución de Licencia</h2>
            </div>
            <div class="content">
                <p>Hola <strong>${docente.nombre}</strong>,</p>
                <p>Te informamos que tu solicitud de licencia ha sido revisada y su estado actual es: <span class="badge ${badgeClass}">${estadoStr}</span>.</p>
                
                <table>
                    <tr><th>Tipo de Licencia</th><td>${licencia.articulo}</td></tr>
                    <tr><th>Fecha Inicio</th><td>${licencia.fecha_inicio}</td></tr>
                    <tr><th>Fecha Fin</th><td>${licencia.fecha_fin}</td></tr>
                </table>
                
                ${!aprobada ? '<p style="color: #dc3545; margin-top: 15px;"><strong>Nota:</strong> Tu solicitud fue rechazada. Si tenés dudas, contactate con Secretaría o Conducción.</p>' : ''}
            </div>
            <div class="footer">
                <p>Este es un correo automático, por favor no responder.</p>
                <p>Sistema de Gestión Escolar - ECN N°1 Cerámica</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {
    plantillaSolicitud,
    plantillaResolucion
};
