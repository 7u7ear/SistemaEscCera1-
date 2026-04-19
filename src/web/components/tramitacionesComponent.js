// ============================
// MODULO TRAMITACIONES
// ============================

async function verTramitaciones() {
    const res = await api.get("/api/v1/tramitaciones");
    if (res.status === 401) { window.location.href = "login.html"; return; }
    if (res.status === 403) return alert("No tiene permisos para ver este módulo.");
    if (!res.ok) return alert("Error al cargar tramitaciones");

    tramitacionesGlobal = await res.json();
    renderTablaTramitaciones(tramitacionesGlobal);
}

function renderTablaTramitaciones(data, isSearching = false) {
    const container = document.getElementById("tablaTramitaciones");

    // Si no estamos buscando, ocultamos los 'realizado'
    const displayData = isSearching ? data : data.filter(t => t.estado !== 'realizado');

    if (displayData.length === 0) {
        container.innerHTML = `<p class='text-center p-4 text-muted'>
            ${isSearching ? 'No se encontraron resultados para su búsqueda.' : 'No hay tramitaciones pendientes (las finalizadas están ocultas).'}
        </p>`;
        return;
    }

    let html = `<table class="table table-hover align-middle">
        <thead class="table-light">
            <tr><th>Fecha</th><th>Tipo</th><th>Docente</th><th>Puesto</th><th>Ref. Admin</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>`;

    displayData.forEach(t => {
        let badgeClass = 'bg-secondary';
        if (t.estado === 'caratulado') badgeClass = 'bg-light text-dark border';
        if (t.estado === 'en_tramitacion') badgeClass = 'bg-info text-white';
        if (t.estado === 'espera_documentacion') badgeClass = 'bg-warning text-dark';
        if (t.estado === 'urgente') badgeClass = 'bg-danger';
        if (t.estado === 'realizado') badgeClass = 'bg-success';

        const esAlertaAuto = t.observaciones && t.observaciones.includes('ALERTA AUTOMÁTICA');
        const rowStyle = esAlertaAuto ? 'table-warning' : '';
        const alertBadge = esAlertaAuto ? '<span class="badge bg-danger ms-1 animate__animated animate__pulse animate__infinite" title="Acción Requerida"><i class="bi bi-exclamation-triangle"></i> ACCIÓN REQUERIDA</span>' : '';

        html += `<tr class="${rowStyle}">
            <td class="small">${t.fecha ? new Date(t.fecha).toLocaleDateString() : '-'}</td>
            <td>
                <div class="fw-bold">${t.tramite_codigo ?? 'S/C'}</div>
                <div class="small text-muted">${t.tramite_descripcion ?? 'Sucesión Pendiente'}</div>
            </td>
            <td><i class="bi bi-person-circle text-muted"></i> ${t.docente_nombre ?? 'N/A'}</td>
            <td>
                ${t.numero_puesto ? `
                <button class="btn btn-sm btn-link p-0 text-decoration-none fw-bold text-center" onclick="abrirModalGestion(${t.cargo_id}, 'historial')">
                    ${t.numero_puesto}
                </button>` : '-'}
            </td>
            <td>
                <div class="small">${t.rol ? `ROL: <strong>${t.rol}</strong>` : ''}</div>
                <div class="small text-muted">${t.expediente ? `Exp: ${t.expediente}` : ''}</div>
            </td>
            <td>
                <span class="badge ${badgeClass}">${t.estado.replace('_', ' ')}</span>
                ${alertBadge}
            </td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-warning" onclick="abrirModalEditarTramitacion(${t.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarTramitacion(${t.id})"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>`;
    });
    html += "</tbody></table>";
    container.innerHTML = html;
}

function filtrarTramitaciones() {
    const texto = document.getElementById("buscadorTramitaciones").value.toLowerCase().trim();

    if (texto === "") {
        renderTablaTramitaciones(tramitacionesGlobal, false);
        return;
    }

    const filtrados = tramitacionesGlobal.filter(t =>
        (t.docente_nombre && t.docente_nombre.toLowerCase().includes(texto)) ||
        (t.tramite_codigo && t.tramite_codigo.toLowerCase().includes(texto)) ||
        (t.tramite_descripcion && t.tramite_descripcion.toLowerCase().includes(texto)) ||
        (t.expediente && t.expediente.toLowerCase().includes(texto)) ||
        (t.estado && t.estado.toLowerCase().includes(texto))
    );

    renderTablaTramitaciones(filtrados, true);
}

async function abrirModalEditarTramitacion(id) {
    const t = tramitacionesGlobal.find(tr => tr.id === id);
    if (!t) return;

    if (codigosTramiteGlobal.length === 0) await cargarCodigosTramite();
    if (cargosGlobal.length === 0) await verCargos(); // asegurarnos que tenemos los cargos
    if (docentesGlobal.length === 0) await verDocentes();

    document.getElementById("modalTramiteTitulo").innerText = "Editar Tramitación";
    document.getElementById("tramiteId").value = t.id;
    document.getElementById("tramiteFecha").value = t.fecha ? t.fecha.split('T')[0] : "";
    document.getElementById("tramiteRol").value = t.rol ?? "";
    document.getElementById("tramiteExpediente").value = t.expediente ?? "";
    document.getElementById("tramiteEstado").value = t.estado;
    document.getElementById("tramiteObs").value = t.observaciones ?? "";

    poblarSelectCargosTramite();
    poblarSelectDocentesTramite();
    poblarSelectCodigosTramite();

    // Buscar el Puesto actual
    const c = cargosGlobal.find(x => x.id == t.cargo_id);
    document.getElementById("tramiteCargoSearch").value = c ? `${c.numero_puesto} (${c.tipo_cargo})` : "";
    document.getElementById("tramiteCargo").value = t.cargo_id || "";

    // Buscar Docente actual
    const d = docentesGlobal.find(x => x.id == t.docente_id);
    document.getElementById("tramiteDocenteSearch").value = d ? `${d.apellido}, ${d.nombre} (${d.dni})` : "";
    document.getElementById("tramiteDocente").value = t.docente_id || "";

    // Buscar el código actual para mostrarlo en el search
    const cod = codigosTramiteGlobal.find(x => x.id == t.codigo_tramite_id);
    if (cod) {
        document.getElementById("tramiteCodigoSearch").value = `${cod.codigo} - ${cod.descripcion}`;
        document.getElementById("tramiteCodigoId").value = cod.id;
    } else {
        document.getElementById("tramiteCodigoSearch").value = "";
        document.getElementById("tramiteCodigoId").value = "";
    }

    modalTramitacion.show();
}

async function cargarCodigosTramite() {
    const res = await api.get("/api/v1/codigos-tramite");
    if (res.ok) codigosTramiteGlobal = await res.json();
}

function poblarSelectCodigosTramite() {
    const list = document.getElementById("listaCodigosTramite");
    if (!list) return;
    list.innerHTML = '';
    codigosTramiteGlobal.forEach(c => {
        const option = document.createElement('option');
        // Usar value para lo que se muestra y lo que se busca
        option.value = `${c.codigo} - ${c.descripcion_tramite}`;
        list.appendChild(option);
    });
    console.log("Datalist poblado con", codigosTramiteGlobal.length, "ítems");
}

function seleccionarCodigoTramite(valor) {
    const cod = codigosTramiteGlobal.find(c => `${c.codigo} - ${c.descripcion_tramite}` === valor);
    if (cod) {
        document.getElementById("tramiteCodigoId").value = cod.id;
        console.log("Código seleccionado:", cod.id);
    } else {
        document.getElementById("tramiteCodigoId").value = "";
    }
}

// --- Gestión de Códigos ---
async function verGestionCodigos() {
    await cargarCodigosTramite();
    renderTablaCodigos();
    document.getElementById("codigoTramiteId").value = "";
    document.getElementById("inputCodigoHex").value = "";
    document.getElementById("inputDescripcionHex").value = "";
    modalGestionCodigos.show();
}

function renderTablaCodigos() {
    const tbody = document.getElementById("tablaCuerpoCodigos");
    tbody.innerHTML = "";
    codigosTramiteGlobal.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td><span class="badge bg-light text-dark border">${c.codigo}</span></td>
                <td>${c.descripcion_tramite}</td>
                <td class="text-end">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-warning" onclick="editarCodigoTramite(${c.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarCodigoTramite(${c.id})"><i class="bi bi-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
}

async function guardarCodigoTramite() {
    const id = document.getElementById("codigoTramiteId").value;
    const codigo = document.getElementById("inputCodigoHex").value;
    const descripcion = document.getElementById("inputDescripcionHex").value;

    if (!codigo || !descripcion) return alert("Código y descripción son obligatorios");

    const url = id ? `/api/v1/codigos-tramite/${id}` : "/api/v1/codigos-tramite";
    const res = await (id ? api.put(url, { codigo, descripcion_tramite: descripcion }) : api.post(url, { codigo, descripcion_tramite: descripcion }));

    if (res.ok) {
        document.getElementById("codigoTramiteId").value = "";
        document.getElementById("inputCodigoHex").value = "";
        document.getElementById("inputDescripcionHex").value = "";
        await verGestionCodigos();
        poblarSelectCodigosTramite(); // Refrescar datalist de Nueva Tramitación
    } else {
        alert("Error al guardar código");
    }
}

function editarCodigoTramite(id) {
    const c = codigosTramiteGlobal.find(x => x.id == id);
    if (c) {
        document.getElementById("codigoTramiteId").value = c.id;
        document.getElementById("inputCodigoHex").value = c.codigo;
        document.getElementById("inputDescripcionHex").value = c.descripcion_tramite;
    }
}

async function eliminarCodigoTramite(id) {
    if (!confirm("¿Desea desactivar este código de trámite?")) return;
    const res = await api.delete(`/api/v1/codigos-tramite/${id}`);
    if (res.ok) {
        await verGestionCodigos();
        poblarSelectCodigosTramite();
    }
}


function poblarSelectDocentesTramite() {
    const list = document.getElementById("listaDocentesTramite");
    if (!list) return;
    list.innerHTML = '';
    docentesGlobal.forEach(d => {
        const option = document.createElement('option');
        option.dataset.id = d.id;
        option.value = `${d.apellido}, ${d.nombre} (${d.dni})`;
        list.appendChild(option);
    });
}

function seleccionarDocenteTramite(valor) {
    const list = document.getElementById("listaDocentesTramite");
    const option = Array.from(list.options).find(opt => opt.value === valor);
    document.getElementById("tramiteDocente").value = option ? option.dataset.id : "";
}

function poblarSelectCargosTramite() {
    const list = document.getElementById("listaPuestosTramite");
    if (!list) return;
    list.innerHTML = '';
    cargosGlobal.forEach(c => {
        const option = document.createElement('option');
        option.dataset.id = c.id;
        option.value = `${c.numero_puesto} (${c.tipo_cargo})`;
        list.appendChild(option);
    });
}

function seleccionarPuestoTramite(valor) {
    const list = document.getElementById("listaPuestosTramite");
    const option = Array.from(list.options).find(opt => opt.value === valor);
    if (option) {
        document.getElementById("tramiteCargo").value = option.dataset.id;
        cargarReemplazosTramite(option.dataset.id);
    } else {
        document.getElementById("tramiteCargo").value = "";
    }
}

async function cargarReemplazosTramite(cargoId) {
    if (!cargoId) return;
    const res = await api.get(`/api/v1/cargos/${cargoId}/historial`);
    if (res.ok) {
        historialTemporalTramite = await res.json();
        const selectR = document.getElementById("tramiteABMReemplaza");
        const selectB = document.getElementById("tramiteABMAsignacionBaja");

        selectR.innerHTML = '<option value="">-- Seleccionar a quién reemplaza --</option>';
        if (selectB) selectB.innerHTML = '<option value="">-- Seleccionar designación a dar de baja --</option>';

        historialTemporalTramite.forEach(h => {
            // Solo mostrar los activos o en licencia
            if (h.estado !== 'inactivo') {
                const text = `[${h.situacion_revista.toUpperCase()} ROL: ${h.rol || '0'}] ${h.docente_nombre}`;
                selectR.innerHTML += `<option value="${h.id}">${text}</option>`;
                if (selectB) selectB.innerHTML += `<option value="${h.id}">${text}</option>`;
            }
        });
    }
}

function toggleTramiteABM() {
    const check = document.getElementById("checkAplicarABMPuesto").checked;
    document.getElementById("divTramiteABM").style.display = check ? "block" : "none";
}

async function cargarDocentesDelCargo(cargoId, selectedDocenteId = null) {
    // ...
    const res = await api.get(`/api/v1/cargos/${cargoId}/historial`);
    if (res.ok) {
        const historial = await res.json();
        select.innerHTML = '<option value="">-- Seleccionar Docente --</option>';
        historial.forEach(h => {
            const selected = h.docente_id == selectedDocenteId ? 'selected' : '';
            select.innerHTML += `<option value="${h.docente_id}" ${selected}>[${h.situacion_revista.toUpperCase()}] ${h.docente_nombre}</option>`;
        });
    } else {
        select.innerHTML = '<option value="">Error al cargar</option>';
    }
}

async function abrirModalTramitacion() {
    if (cargosGlobal.length === 0) await verCargos(); // necesitamos la lista global de cargos
    if (codigosTramiteGlobal.length === 0) await cargarCodigosTramite();
    if (docentesGlobal.length === 0) await verDocentes();

    document.getElementById("modalTramiteTitulo").innerText = "Nueva Tramitación";
    document.getElementById("tramiteId").value = "";
    document.getElementById("tramiteRol").value = "";
    document.getElementById("tramiteExpediente").value = "";
    document.getElementById("tramiteObs").value = "";
    document.getElementById("tramiteFecha").value = new Date().toISOString().split('T')[0];
    document.getElementById("tramiteEstado").value = "caratulado";
    document.getElementById("tramiteCodigoSearch").value = "";
    document.getElementById("tramiteCodigoId").value = "";

    document.getElementById("tramiteDocenteSearch").value = "";
    document.getElementById("tramiteDocente").value = "";

    document.getElementById("tramiteCargoSearch").value = "";
    document.getElementById("tramiteCargo").value = "";

    document.getElementById("checkAplicarABMPuesto").checked = false;
    toggleTramiteABM();
    document.getElementById("tramiteABMSituacion").value = "";
    document.getElementById("tramiteABMReemplaza").innerHTML = '<option value="">-- Seleccionar a quién reemplaza --</option>';
    if (document.getElementById("tramiteABMAsignacionBaja")) document.getElementById("tramiteABMAsignacionBaja").innerHTML = '<option value="">-- Seleccionar designación a dar de baja --</option>';
    document.getElementById("tramiteABMRegresaTitular").checked = true;

    poblarSelectCargosTramite();
    poblarSelectDocentesTramite();
    poblarSelectCodigosTramite();

    modalTramitacion.show();
}

async function guardarTramitacion() {
    const data = {
        fecha: document.getElementById("tramiteFecha").value,
        docente_id: document.getElementById("tramiteDocente").value,
        rol: document.getElementById("tramiteRol").value,
        expediente: document.getElementById("tramiteExpediente").value,
        cargo_id: document.getElementById("tramiteCargo").value,
        codigo_tramite_id: document.getElementById("tramiteCodigoId").value,
        estado: document.getElementById("tramiteEstado").value,
        observaciones: document.getElementById("tramiteObs").value
    };

    if (!data.fecha || !data.codigo_tramite_id) return alert("Fecha y Código de Trámite son obligatorios");

    const id = document.getElementById("tramiteId").value;
    const url = id ? `/api/v1/tramitaciones/${id}` : "/api/v1/tramitaciones";
    const res = await (id ? api.put(url, data) : api.post(url, data));

    if (res.ok) {
        // Logica de ABM unificado
        if (document.getElementById("checkAplicarABMPuesto").checked && data.cargo_id && data.docente_id) {
            const situacionABM = document.getElementById("tramiteABMSituacion").value;
            if (situacionABM) {
                // Es un ALTA
                const payloadAlta = {
                    docente_id: data.docente_id,
                    situacion_revista: situacionABM,
                    fecha_inicio: data.fecha,
                    reemplaza_a: document.getElementById("tramiteABMReemplaza").value || null,
                    rol: data.rol ? parseInt(data.rol, 10) : 0,
                    expediente_alta: data.expediente
                };
                await api.post(`/api/v1/cargos/${data.cargo_id}/asignar`, payloadAlta);
            } else {
                // Es una BAJA
                const bajaId = document.getElementById("tramiteABMAsignacionBaja").value;
                if (bajaId) {
                    const payloadBaja = {
                        fecha_fin: data.fecha,
                        expediente_baja: data.expediente,
                        titular_regresa: document.getElementById("tramiteABMRegresaTitular").checked
                    };
                    await api.post(`/api/v1/cargos/${data.cargo_id}/baja/${bajaId}`, payloadBaja);
                }
            }
        }

        modalTramitacion.hide();
        verTramitaciones();
    } else {
        alert("Error al guardar tramitación");
    }
}
