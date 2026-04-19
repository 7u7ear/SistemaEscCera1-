/**
 * Componente: Planilla de Firmas
 * Maneja la generación y visualización de la asistencia diaria por turnos.
 */

let planillaDataActiva = { cargos: [], licencias: [] };

async function verPlanillaFirmas() {
    const container = document.getElementById("seccion-planilla");
    container.innerHTML = `
        <div class="card p-4 shadow-sm border-0 mb-4 no-print">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 class="fw-bold mb-0 text-primary"><i class="bi bi-pen-fill"></i> Planilla de Firmas</h3>
                    <p class="text-muted small mb-0">Generación de asistencia diaria por turnos</p>
                </div>
                <button class="btn btn-dark px-4 shadow-sm" onclick="imprimirPlanilla()">
                    <i class="bi bi-printer"></i> Imprimir Planilla
                </button>
            </div>
            
            <div class="row g-3 align-items-end mb-4 bg-light p-3 rounded">
                <div class="col-md-4">
                    <label class="form-label small fw-bold">Fecha</label>
                    <input type="date" id="fechaPlanilla" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="col-md-4">
                    <label class="form-label small fw-bold">Turno</label>
                    <select id="turnoPlanilla" class="form-select">
                        <option value="mañana">Mañana (08:00 - 12:40)</option>
                        <option value="tarde">Tarde (12:40 - 18:30)</option>
                        <option value="noche">Noche (18:30+)</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <button class="btn btn-primary w-100 fw-bold" onclick="cargarDatosPlanilla()">
                        <i class="bi bi-arrow-repeat"></i> Generar Planilla
                    </button>
                </div>
            </div>
        </div>

        <div id="contenedor-impresion-planilla" class="bg-white p-2">
            <div class="text-center p-5 text-muted no-print">
                <i class="bi bi-file-earmark-text display-1"></i>
                <p class="mt-3">Seleccione fecha y turno para generar la planilla.</p>
            </div>
        </div>

        <style>
            @media print {
                @page { size: landscape; margin: 0.5cm; }
                .no-print, .sidebar, .main-content > header, .btn-group, .btn, #titulo, #userInfo { display: none !important; }
                .main-content { margin-left: 0 !important; padding: 0 !important; margin-top: 0 !important; }
                body { background: white !important; font-family: 'Inter', sans-serif; }
                .card { box-shadow: none !important; border: none !important; padding: 0 !important; }
                .planilla-header { display: block !important; margin-bottom: 10px; }
                table { width: 100% !important; border-collapse: collapse !important; table-layout: fixed; }
                th, td { 
                    border: 1px solid #000 !important; 
                    padding: 6px 3px !important; 
                    font-size: 8pt; 
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                thead { display: table-header-group; background-color: #eee !important; -webkit-print-color-adjust: exact; }
                .signature-cell { height: 35px; background-color: #fff !important; }
                .text-licencia { color: #444 !important; font-style: italic; }
                .single-line { white-space: nowrap; }
            }
            .planilla-header { display: none; text-align: center; }
            .badge-licencia { background-color: #f8f9fa; color: #6c757d; border: 1px solid #dee2e6; }
            
            /* Ajustes para la vista en pantalla (Dashboard) */
            #seccion-planilla table { 
                table-layout: fixed; 
                width: 100%; 
            }
            #seccion-planilla td {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 0.85rem;
                padding: 10px 5px !important;
            }
            #seccion-planilla th {
                font-size: 0.8rem;
                text-align: center;
                background-color: #f8f9fa;
            }
        </style>
    `;
}

async function cargarDatosPlanilla() {
    const fecha = document.getElementById("fechaPlanilla").value;
    const turno = document.getElementById("turnoPlanilla").value;
    const viewContainer = document.getElementById("contenedor-impresion-planilla");

    if (!fecha) return alert("Seleccione una fecha");

    viewContainer.innerHTML = `
        <div class="text-center p-5 no-print">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Consultando cargos y horarios...</p>
        </div>
    `;

    try {
        const res = await api.get(`/api/v1/planilla-firmas?fecha=${fecha}&turno=${turno}`);
        if (!res.ok) throw new Error("Error al obtener datos");
        
        const data = await res.json();
        planillaDataActiva = data;
        renderPlanilla(data, fecha, turno);
    } catch (err) {
        viewContainer.innerHTML = `<div class="alert alert-danger no-print">Error: ${err.message}</div>`;
    }
}

function renderPlanilla(data, fecha, turno) {
    const viewContainer = document.getElementById("contenedor-impresion-planilla");
    const formattedFecha = new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    
    let html = `
        <!-- ENCABEZADO PARA IMPRESIÓN -->
        <div class="planilla-header">
            <h4 class="mb-1 fw-bold text-uppercase">E.S.E.A en Ceramica Nº1 D.E II</h4>
            <p class="mb-0"><strong>PLANILLA DE FIRMAS - TURNO ${turno.toUpperCase()}</strong></p>
            <p class="small mb-1">${formattedFecha.toUpperCase()}</p>
            <hr style="border-top: 2px solid #000; margin: 10px 0;">
        </div>

        <!-- LISTADO PRINCIPAL -->
        <div class="mb-4">
            <h6 class="fw-bold mb-3 no-print text-muted small">Lista de Firmas (Vista Previa)</h6>
            <table class="table table-bordered align-middle">
                <thead class="table-light">
                    <tr class="text-center align-middle">
                        <th style="width: 16%">Apellido y Nombre</th>
                        <th style="width: 5%">Rol</th>
                        <th style="width: 17%">Puesto / Curso / Materia</th>
                        <th style="width: 7%">Entrada<br><small>(Prog.)</small></th>
                        <th style="width: 9%">Entrada<br><small>(Manual)</small></th>
                        <th style="width: 12%">Firma Entrada</th>
                        <th style="width: 7%">Salida<br><small>(Prog.)</small></th>
                        <th style="width: 9%">Salida<br><small>(Manual)</small></th>
                        <th style="width: 12%">Firma Salida</th>
                        <th style="width: 6%">Obs.</th>
                    </tr>
                </thead>
                <tbody>
    `;

    if (data.cargos.length === 0) {
        html += `<tr><td colspan="10" class="text-center p-4 text-muted">No hay cargos programados para este día/turno.</td></tr>`;
    } else {
        data.cargos.forEach(c => {
            const docente = c.docente_display || '--------------------------';
            const rol = c.rol || '';
            const infoPuesto = `<b>${c.numero_puesto}</b> | ${c.curso_anio}°${c.curso_division || ''} | ${c.materia_nombre}`;
            const horaEntrada = c.hora_ingreso ? c.hora_ingreso.substring(0, 5) : '--:--';
            const horaSalida = c.hora_egreso ? c.hora_egreso.substring(0, 5) : '--:--';

            html += `
                <tr>
                    <td class="single-line" style="font-weight: 600; ${c.en_licencia ? 'color: #888; font-style: italic;' : ''}" title="${docente}">${docente}</td>
                    <td class="text-center fw-bold single-line">${rol}</td>
                    <td class="single-line" title="${infoPuesto}">${infoPuesto}</td>
                    <td class="text-center fw-bold single-line" style="background-color: #f9f9f9 !important;">${horaEntrada}</td>
                    <td class="signature-cell"></td>
                    <td class="signature-cell"></td>
                    <td class="text-center fw-bold single-line" style="background-color: #f9f9f9 !important;">${horaSalida}</td>
                    <td class="signature-cell"></td>
                    <td class="signature-cell"></td>
                    <td class="small text-center">${c.en_licencia ? 'LIC.' : ''}</td>
                </tr>
            `;
        });
    }

    html += `
                </tbody>
            </table>
        </div>

        <!-- SECCIÓN LICENCIAS -->
        <div class="mt-5 pt-3">
            <h6 class="fw-bold mb-2"><i class="bi bi-calendar-x"></i> Personal de Licencia / Ausente</h6>
            <table class="table table-bordered table-sm align-middle">
                <thead class="table-light small">
                    <tr>
                        <th style="width: 30%">Docente</th>
                        <th style="width: 10%">Rol</th>
                        <th style="width: 15%">Situación</th>
                        <th style="width: 25%">Puesto Afectado</th>
                        <th style="width: 20%">Estado</th>
                    </tr>
                </thead>
                <tbody class="small">
    `;

    if (data.licencias.length === 0) {
        html += `<tr><td colspan="5" class="text-center text-muted p-2">No se registran licencias para este día/turno.</td></tr>`;
    } else {
        data.licencias.forEach(l => {
            html += `
                <tr class="text-licencia">
                    <td>${l.apellido}, ${l.docente_nombre}</td>
                    <td class="text-center">${l.rol || '-'}</td>
                    <td class="text-capitalize">${l.situacion_revista}</td>
                    <td>Puesto: ${l.numero_puesto} - ${l.tipo_cargo}</td>
                    <td><span class="badge badge-licencia">LICENCIA (${l.estado_licencia})</span></td>
                </tr>
            `;
        });
    }

    html += `
                </tbody>
            </table>
        </div>
        
        <div class="mt-5 text-end no-print">
            <p class="small text-muted">Fin de planilla.</p>
        </div>
    `;

    viewContainer.innerHTML = html;
}

function imprimirPlanilla() {
    if (planillaDataActiva.cargos.length === 0) {
        return alert("Genere la planilla primero con datos válidos.");
    }
    window.print();
}
