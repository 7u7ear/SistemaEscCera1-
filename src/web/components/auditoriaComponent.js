// ============================================================
// MODULO: VISUALIZADOR DE AUDITORIA
// Roles: Administrador, Secretario, Conduccion
// ============================================================

let auditoriaData = [];
let auditoriaFiltrosCache = null;
let auditoriaPaginaActual = 1;
const AUDITORIA_LIMIT = 50;

const ACCION_LABELS = {
    'crear': { label: 'Creacion', color: 'success' },
    'editar': { label: 'Edicion', color: 'primary' },
    'eliminar': { label: 'Eliminacion', color: 'danger' },
    'aprobar': { label: 'Aprobacion', color: 'info' },
    'rechazar': { label: 'Rechazo', color: 'warning' },
    'login': { label: 'Ingreso', color: 'secondary' },
    'logout': { label: 'Salida', color: 'secondary' },
    'reset_password': { label: 'Reset Clave', color: 'warning' },
};

const ENTIDAD_LABELS = {
    'docente': 'Docente',
    'cargo': 'Puesto',
    'licencia': 'Licencia',
    'tramitacion': 'Tramitacion',
    'alumno': 'Alumno',
    'usuario': 'Usuario',
    'permiso': 'Permiso',
    'curso': 'Curso',
};

async function verAuditoria() {
    await cargarFiltrosAuditoria();
    await buscarAuditoria(1);
}

async function cargarFiltrosAuditoria() {
    if (auditoriaFiltrosCache) return;
    try {
        const res = await api.get('/api/v1/auditoria/filtros');
        if (!res.ok) return;
        const { data } = await res.json();
        auditoriaFiltrosCache = data;

        // Poblar select de entidades
        const selEntidad = document.getElementById('filtroAuditoriaEntidad');
        if (selEntidad) {
            selEntidad.innerHTML = '<option value="">Todas las entidades</option>';
            data.entidades.forEach(e => {
                const label = ENTIDAD_LABELS[e] || e;
                selEntidad.innerHTML += `<option value="${e}">${label}</option>`;
            });
        }

        // Poblar select de acciones
        const selAccion = document.getElementById('filtroAuditoriaAccion');
        if (selAccion) {
            selAccion.innerHTML = '<option value="">Todas las acciones</option>';
            data.acciones.forEach(a => {
                const { label } = ACCION_LABELS[a] || { label: a };
                selAccion.innerHTML += `<option value="${a}">${label}</option>`;
            });
        }
    } catch (err) {
        // No critico - continua sin filtros dinamicos
    }
}

async function buscarAuditoria(pagina = 1) {
    auditoriaPaginaActual = pagina;

    const fechaDesde = document.getElementById('filtroAuditoriaDesde')?.value || '';
    const fechaHasta = document.getElementById('filtroAuditoriaHasta')?.value || '';
    const entidad = document.getElementById('filtroAuditoriaEntidad')?.value || '';
    const accion = document.getElementById('filtroAuditoriaAccion')?.value || '';
    const usuarioId = document.getElementById('filtroAuditoriaUsuarioId')?.value || '';

    const params = new URLSearchParams({
        page: pagina,
        limit: AUDITORIA_LIMIT,
        ...(fechaDesde && { fechaDesde }),
        ...(fechaHasta && { fechaHasta }),
        ...(entidad && { entidad }),
        ...(accion && { accion }),
        ...(usuarioId && { usuarioId }),
    });

    const contenedor = document.getElementById('tablaAuditoria');
    if (contenedor) contenedor.innerHTML = `<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Cargando registros...</p></div>`;

    try {
        const res = await api.get(`/api/v1/auditoria?${params}`);
        if (!res.ok) {
            if (contenedor) contenedor.innerHTML = `<div class="alert alert-danger">Error al cargar la auditoria.</div>`;
            return;
        }
        const json = await res.json();
        const { rows, total, page, limit } = json.data;
        auditoriaData = rows;
        renderTablaAuditoria(rows, total, page, limit);
    } catch (err) {
        if (contenedor) contenedor.innerHTML = `<div class="alert alert-danger">${api.getErrorMessage(err)}</div>`;
    }
}

function renderTablaAuditoria(rows, total, page, limit) {
    const contenedor = document.getElementById('tablaAuditoria');
    if (!contenedor) return;

    document.getElementById('auditoriaTotal').textContent = `${total} registros`;

    if (rows.length === 0) {
        contenedor.innerHTML = `<div class="text-center py-5 text-muted"><i class="bi bi-clipboard-x fs-1 d-block mb-2"></i>No se encontraron registros con los filtros aplicados.</div>`;
        document.getElementById('auditoriaPaginacion').innerHTML = '';
        return;
    }

    let html = `
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0" id="tablaAuditoriaInner">
                <thead class="table-dark sticky-top">
                    <tr>
                        <th style="width:160px">Fecha y Hora</th>
                        <th>Usuario</th>
                        <th style="width:130px">Accion</th>
                        <th style="width:130px">Entidad</th>
                        <th>ID Entidad</th>
                        <th>Detalle</th>
                    </tr>
                </thead>
                <tbody>
    `;

    rows.forEach(r => {
        const fecha = r.creado_el ? new Date(r.creado_el).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '-';
        const accionInfo = ACCION_LABELS[r.accion] || { label: r.accion, color: 'secondary' };
        const entidadLabel = ENTIDAD_LABELS[r.entidad] || r.entidad;
        const usuario = r.usuario_nombre || r.usuario_username || `(id: ${r.user_id || '-'})`;
        let detallesStr = '';
        try {
            const det = typeof r.detalles === 'string' ? JSON.parse(r.detalles) : r.detalles;
            if (det && Object.keys(det).length > 0) {
                detallesStr = Object.entries(det)
                    .filter(([, v]) => v !== null && v !== undefined && v !== '')
                    .slice(0, 4)
                    .map(([k, v]) => `<span class="badge bg-light text-dark border me-1">${k}: ${v}</span>`)
                    .join('');
            }
        } catch (_) { detallesStr = r.detalles || ''; }

        html += `
            <tr>
                <td class="text-muted small fw-semibold">${fecha}</td>
                <td>
                    <span class="fw-semibold">${usuario}</span>
                </td>
                <td>
                    <span class="badge bg-${accionInfo.color} px-2 py-1 fs-6-sm">${accionInfo.label}</span>
                </td>
                <td>
                    <span class="text-capitalize">${entidadLabel}</span>
                </td>
                <td class="text-muted">${r.entidad_id || '-'}</td>
                <td>${detallesStr}</td>
            </tr>
        `;
    });

    html += '</tbody></table></div>';
    contenedor.innerHTML = html;

    // Paginacion
    renderPaginacionAuditoria(total, page, limit);
}

function renderPaginacionAuditoria(total, page, limit) {
    const totalPaginas = Math.ceil(total / limit);
    const pag = document.getElementById('auditoriaPaginacion');
    if (!pag) return;

    if (totalPaginas <= 1) { pag.innerHTML = ''; return; }

    let html = '<nav><ul class="pagination pagination-sm mb-0">';
    html += `<li class="page-item${page <= 1 ? ' disabled' : ''}">
                <a class="page-link" href="#" onclick="buscarAuditoria(${page - 1}); return false;">&laquo;</a>
             </li>`;

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPaginas, page + 2);

    if (start > 1) {
        html += `<li class="page-item"><a class="page-link" href="#" onclick="buscarAuditoria(1); return false;">1</a></li>`;
        if (start > 2) html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }

    for (let i = start; i <= end; i++) {
        html += `<li class="page-item${i === page ? ' active' : ''}">
                    <a class="page-link" href="#" onclick="buscarAuditoria(${i}); return false;">${i}</a>
                 </li>`;
    }

    if (end < totalPaginas) {
        if (end < totalPaginas - 1) html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        html += `<li class="page-item"><a class="page-link" href="#" onclick="buscarAuditoria(${totalPaginas}); return false;">${totalPaginas}</a></li>`;
    }

    html += `<li class="page-item${page >= totalPaginas ? ' disabled' : ''}">
                <a class="page-link" href="#" onclick="buscarAuditoria(${page + 1}); return false;">&raquo;</a>
             </li>`;
    html += '</ul></nav>';
    pag.innerHTML = html;
}

function limpiarFiltrosAuditoria() {
    ['filtroAuditoriaDesde', 'filtroAuditoriaHasta', 'filtroAuditoriaEntidad', 'filtroAuditoriaAccion', 'filtroAuditoriaUsuarioId'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    buscarAuditoria(1);
}

function exportarAuditoriaCSV() {
    if (!auditoriaData || auditoriaData.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }
    const headers = ['Fecha y Hora', 'Usuario', 'Username', 'Accion', 'Entidad', 'ID Entidad', 'Detalles'];
    const rows = auditoriaData.map(r => {
        const fecha = r.creado_el ? new Date(r.creado_el).toLocaleString('es-AR') : '';
        let detalles = '';
        try { detalles = JSON.stringify(typeof r.detalles === 'string' ? JSON.parse(r.detalles) : r.detalles); } catch (_) { detalles = r.detalles || ''; }
        return [
            fecha,
            r.usuario_nombre || '',
            r.usuario_username || '',
            r.accion || '',
            r.entidad || '',
            r.entidad_id || '',
            detalles
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

window.verAuditoria = verAuditoria;
window.buscarAuditoria = buscarAuditoria;
window.limpiarFiltrosAuditoria = limpiarFiltrosAuditoria;
window.exportarAuditoriaCSV = exportarAuditoriaCSV;
