// ============================
// MODULO LICENCIAS
// ============================

async function verLicencias() {
    const res = await fetch("/api/v1/licencias", { credentials: "include" });
    if (res.status === 401) { window.location.href = "login.html"; return; }
    if (res.status === 403) return alert("No tiene permisos para ver este módulo.");
    if (!res.ok) return alert("Error al cargar licencias");

    licenciasGlobal = await res.json();
    
    // Por defecto mostramos solo las activas/vigentes
    const hoy = new Date().toISOString().split('T')[0];
    const activas = licenciasGlobal.filter(l => !l.fecha_fin || l.fecha_fin >= hoy);
    
    renderTablaLicencias(activas);
}

function renderTablaLicencias(data) {
    const container = document.getElementById("tablaLicencias");
    if (data.length === 0) {
        container.innerHTML = "<p class='text-center p-4 text-muted'>No hay licencias registradas actualmente.</p>";
        return;
    }

    let html = `<table class="table table-hover align-middle">
        <thead class="table-light">
            <tr><th>Docente</th><th>Puesto</th><th>Inicio</th><th>Fin</th><th>Tipo / Artículo</th><th>Expediente</th><th>Acciones</th></tr>
        </thead>
        <tbody>`;

    data.forEach(l => {
        const inicio = l.fecha_inicio ? new Date(l.fecha_inicio).toLocaleDateString() : '-';
        const fin = l.fecha_fin ? new Date(l.fecha_fin).toLocaleDateString() : '<span class="text-success fw-bold">Vigente</span>';
        const expText = l.corresponde_expediente ? `<strong>${l.expediente ?? '-'}</strong>` : '<span class="text-muted small">No corresponde</span>';
        
        let tramiteBadge = '';
        if (l.tramite_id) {
            let badgeClass = 'bg-info text-white';
            if (l.tramite_estado === 'caratulado') badgeClass = 'bg-light text-dark border';
            if (l.tramite_estado === 'realizado') badgeClass = 'bg-success';
            tramiteBadge = `<br><span class="badge ${badgeClass} mt-1" style="font-size:10px; cursor:pointer;" onclick="mostrarSeccion('tramitaciones'); abrirModalEditarTramitacion(${l.tramite_id})">
                Trámite: ${l.tramite_estado.replace('_', ' ')}
            </span>`;
        }

        html += `<tr>
            <td><strong>${l.docente_nombre}</strong></td>
            <td>${l.numero_puesto ? `${l.numero_puesto} (${l.tipo_cargo})` : '<span class="text-muted small">General</span>'}</td>
            <td class="small">${inicio}</td>
            <td class="small">${fin}</td>
            <td><span class="badge bg-light text-dark border">${l.tipo_licencia}</span></td>
            <td>${expText}${tramiteBadge}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editarLicencia(${l.id})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarLicencia(${l.id})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;
    });
    html += "</tbody></table>";
    container.innerHTML = html;
}

function filtrarLicencias() {
    const texto = document.getElementById("buscadorLicencias").value.toLowerCase().trim();
    
    // Si el buscador está vacío, volvemos al filtro de "solo activas"
    if (texto === "") {
        const hoy = new Date().toISOString().split('T')[0];
        const activas = licenciasGlobal.filter(l => !l.fecha_fin || l.fecha_fin >= hoy);
        renderTablaLicencias(activas);
        return;
    }

    // Si hay texto, buscamos en TODO el historial (búsqueda global)
    const filtrados = licenciasGlobal.filter(l =>
        (l.docente_nombre && l.docente_nombre.toLowerCase().includes(texto)) ||
        (l.tipo_licencia && l.tipo_licencia.toLowerCase().includes(texto)) ||
        (l.expediente && l.expediente.toLowerCase().includes(texto)) ||
        (l.numero_puesto && l.numero_puesto.toString().includes(texto))
    );
    renderTablaLicencias(filtrados);
}

async function cargarTiposLicencia() {
    const res = await fetch("/api/v1/licencias/tipos", { credentials: "include" });
    if (res.ok) tiposLicenciaGlobal = await res.json();
}

function poblarSelectTiposLicencia() {
    const list = document.getElementById("listaTiposLicencia");
    list.innerHTML = '';
    tiposLicenciaGlobal.forEach(t => {
        const option = document.createElement('option');
        option.value = t.cod_licencia;
        option.innerText = t.descripcion;
        list.appendChild(option);
    });
}

async function abrirModalLicencia() {
    console.log("Abriendo modal de licencias...");
    try {
        if (!modalLicencia) {
            const el = document.getElementById('modalLicencia');
            if (el) modalLicencia = new bootstrap.Modal(el);
            else return alert("Error: No se encontró el modalLicencia en el HTML.");
        }

        // Resetear título y botón por si venimos de editar
        document.querySelector('#modalLicencia .modal-title').innerHTML = '<i class="bi bi-calendar-check-fill me-2"></i>Registrar Licencia / Ausentismo';
        document.getElementById("btnGuardarLicencia").innerText = "Guardar Licencia";

        // Limpiar campos primero por si acaso
        const ids = ["licenciaId", "licenciaDocenteSearch", "licenciaDocenteId", "licenciaCargoSearch", "licenciaCargoId", "licenciaFechaFin", "licenciaTipo", "licenciaExpediente", "licenciaObs", "licenciaCodigoTramiteSearch", "licenciaCodigoTramiteId"];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

        const chkTramite = document.getElementById("checkGenerarTramite");
        if (chkTramite) chkTramite.checked = false;
        const divTramite = document.getElementById("divSelectCodigoTramite");
        if (divTramite) divTramite.style.display = "none";

        const inicio = document.getElementById("licenciaFechaInicio");
        if (inicio) inicio.value = new Date().toISOString().split('T')[0];

        const chkExp = document.getElementById("checkCorrespondeExpediente");
        if (chkExp) chkExp.checked = false;

        const divExp = document.getElementById("divLicenciaExpediente");
        if (divExp) divExp.style.display = "none";

        const divSync = document.getElementById("divSyncPuestoLicencia");
        if (divSync) divSync.style.display = "none";

        const labelSync = document.querySelector('label[for="checkActualizarEstadoPuesto"]');
        if (labelSync) labelSync.innerHTML = '<strong>Cambiar estado a "Licencia"</strong> en los puestos seleccionados (permite cargar suplentes).';

        const contCargos = document.getElementById("contenedorCargosLicencia");
        if (contCargos) contCargos.innerHTML = '<span class="text-muted small">Seleccione un docente para ver sus cargos activos...</span>';

        const divTodo = document.getElementById("divSeleccionarTodoLicencia");
        if (divTodo) divTodo.style.display = "none";

        // Mostrar modal ya mismo
        modalLicencia.show();

        // Cargar datos en paralelo para no bloquear
        verDocentes().then(() => poblarSelectDocentesLicencia()).catch(e => console.warn(e));
        verCargos().catch(e => console.warn(e));
        cargarTiposLicencia().then(() => poblarSelectTiposLicencia()).catch(e => console.warn(e));
        cargarCodigosTramite().then(() => {
            poblarSelectCodigosTramite();
            // También poblar el datalist específico de licencias si fuera necesario, 
            // aunque el de tramitaciones usa el mismo ID 'listaCodigosTramite'
        }).catch(e => console.warn(e));

    } catch (err) {
        alert("Fallo al abrir modal: " + err.message);
    }
}

function abrirModalNuevoTipoLicencia() {
    document.getElementById("nuevoTipoCod").value = "";
    document.getElementById("nuevoTipoDesc").value = "";
    modalNuevoTipoLicencia.show();
}

async function guardarNuevoTipoLicencia() {
    const cod_licencia = document.getElementById("nuevoTipoCod").value.trim();
    const descripcion = document.getElementById("nuevoTipoDesc").value.trim();

    if (!cod_licencia || !descripcion) return alert("Código y descripción requeridos");

    const res = await fetch("/api/v1/licencias/tipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cod_licencia, descripcion })
    });

    if (res.ok) {
        modalNuevoTipoLicencia.hide();
        await cargarTiposLicencia();
        poblarSelectTiposLicencia();
        document.getElementById("licenciaTipo").value = cod_licencia;
    } else {
        alert("Error al guardar el tipo de licencia");
    }
}


function toggleLicenciaExpediente() {
    const check = document.getElementById("checkCorrespondeExpediente").checked;
    document.getElementById("divLicenciaExpediente").style.display = check ? "block" : "none";
}

function toggleGenerarTramite() {
    const check = document.getElementById("checkGenerarTramite").checked;
    const div = document.getElementById("divSelectCodigoTramite");
    if (div) div.style.display = check ? "block" : "none";
    
    // Si se activa tránite, forzar que corresponda expediente
    if (check) {
        const chkExp = document.getElementById("checkCorrespondeExpediente");
        if (chkExp && !chkExp.checked) {
            chkExp.checked = true;
            toggleLicenciaExpediente();
        }
    }
}

function seleccionarCodigoTramiteLicencia(valor) {
    const cod = codigosTramiteGlobal.find(c => `${c.codigo} - ${c.descripcion_tramite}` === valor);
    if (cod) {
        document.getElementById("licenciaCodigoTramiteId").value = cod.id;
    } else {
        document.getElementById("licenciaCodigoTramiteId").value = "";
    }
}

function poblarSelectDocentesLicencia() {
    const list = document.getElementById("listaDocentesLicencia");
    list.innerHTML = '';
    docentesGlobal.forEach(d => {
        const option = document.createElement('option');
        option.value = `${d.apellido}, ${d.nombre} (${d.dni})`;
        list.appendChild(option);
    });
}

async function seleccionarDocenteLicencia(valor) {
    const d = docentesGlobal.find(doc => `${doc.apellido}, ${doc.nombre} (${doc.dni})` === valor);
    const docenteId = d ? d.id : "";
    document.getElementById("licenciaDocenteId").value = docenteId;

    const container = document.getElementById("contenedorCargosLicencia");
    const divSelectTodo = document.getElementById("divSeleccionarTodoLicencia");
    const divSync = document.getElementById("divSyncPuestoLicencia");

    if (!docenteId) {
        container.innerHTML = '<span class="text-muted small">Seleccione un docente para ver sus cargos activos...</span>';
        divSelectTodo.style.display = "none";
        divSync.style.display = "none";
        return;
    }

    const res = await fetch(`/api/v1/docentes/${docenteId}/cargos`, { credentials: "include" });
    if (!res.ok) {
        container.innerHTML = '<span class="text-danger small">Error al cargar cargos.</span>';
        return;
    }

    const cargos = await res.json();
    if (cargos.length === 0) {
        container.innerHTML = '<span class="text-muted small">El docente no tiene cargos activos asignados.</span>';
        divSelectTodo.style.display = "none";
        divSync.style.display = "none";
    } else {
        divSelectTodo.style.display = "block";
        divSync.style.display = "block";
        let html = "";
        cargos.forEach(c => {
            html += `
            <div class="form-check border-bottom mb-2 pb-2">
                <input class="form-check-input check-cargo-licencia" type="checkbox" value="${c.cargo_id}" id="chk_cargo_${c.cargo_id}">
                <label class="form-check-label small" for="chk_cargo_${c.cargo_id}">
                    <strong>${c.numero_puesto}</strong> (${c.tipo_cargo}) - ${c.situacion_revista.toUpperCase()}
                </label>
            </div>`;
        });
        container.innerHTML = html;
        document.getElementById("checkTodosLosCargos").checked = false;
    }
}

function seleccionarTodosLosCargosLicencia(checked) {
    document.querySelectorAll(".check-cargo-licencia").forEach(chk => chk.checked = checked);
}

async function guardarLicencia(evt) {
    if (evt) evt.preventDefault();

    const id = document.getElementById("licenciaId").value;
    const btn = document.getElementById("btnGuardarLicencia");
    const originalText = btn ? (id ? 'Actualizar Licencia' : 'Guardar Licencia') : 'Guardar Licencia';

    const docenteId = document.getElementById("licenciaDocenteId").value;
    if (!docenteId) {
        alert("Error: ID de docente no seleccionado. Elija un docente de la lista.");
        return;
    }

    const data = {
        docente_id: parseInt(docenteId, 10),
        fecha_inicio: document.getElementById("licenciaFechaInicio").value,
        fecha_fin: document.getElementById("licenciaFechaFin").value,
        tipo_licencia: document.getElementById("licenciaTipo").value,
        corresponde_expediente: document.getElementById("checkCorrespondeExpediente").checked,
        expediente: document.getElementById("licenciaExpediente").value,
        observaciones: document.getElementById("licenciaObs").value,
        actualizar_puesto: document.getElementById("checkActualizarEstadoPuesto").checked,
        generar_tramite: document.getElementById("checkGenerarTramite").checked,
        codigo_tramite_id: document.getElementById("licenciaCodigoTramiteId").value ? parseInt(document.getElementById("licenciaCodigoTramiteId").value, 10) : null
    };

    if (!data.fecha_inicio || !data.tipo_licencia) {
        alert("Error: Fecha de Inicio y Tipo de Licencia son obligatorios.");
        return;
    }

    if (id) {
        data.finalizar_puesto = data.actualizar_puesto;
    } else {
        const cargo_ids = [];
        document.querySelectorAll(".check-cargo-licencia:checked").forEach(chk => {
            cargo_ids.push(parseInt(chk.value, 10));
        });
        data.cargo_ids = cargo_ids;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Guardando...';
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/v1/licencias/${id}` : "/api/v1/licencias";

    try {
        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        });

        if (res.ok) {
            modalLicencia.hide();
            verLicencias();
            if (data.actualizar_puesto || data.finalizar_puesto) verCargos();
        } else {
            const error = await res.json();
            alert("Error: " + JSON.stringify(error));
        }
    } catch (err) {
        alert("Error de conexión con el servidor");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = originalText;
        }
    }
}

async function editarLicencia(id) {
    const l = licenciasGlobal.find(lic => lic.id === id);
    if (!l) return;

    await abrirModalLicencia();

    document.querySelector('#modalLicencia .modal-title').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Editar Licencia';
    document.getElementById("btnGuardarLicencia").innerText = "Actualizar Licencia";

    document.getElementById("licenciaId").value = l.id;
    document.getElementById("licenciaDocenteId").value = l.docente_id;
    document.getElementById("licenciaDocenteSearch").value = l.docente_nombre;

    if (l.fecha_inicio) document.getElementById("licenciaFechaInicio").value = l.fecha_inicio.split('T')[0];
    if (l.fecha_fin) document.getElementById("licenciaFechaFin").value = l.fecha_fin.split('T')[0];
    else document.getElementById("licenciaFechaFin").value = "";

    document.getElementById("licenciaTipo").value = l.tipo_licencia;

    if (l.corresponde_expediente) {
        document.getElementById("checkCorrespondeExpediente").checked = true;
        document.getElementById("divLicenciaExpediente").style.display = "block";
        document.getElementById("licenciaExpediente").value = l.expediente || "";
    }

    document.getElementById("licenciaObs").value = l.observaciones || "";

    if (l.cargo_id) {
        document.getElementById("divSeleccionarTodoLicencia").style.display = "none";
        const container = document.getElementById("contenedorCargosLicencia");
        container.innerHTML = `
            <div class="form-check border-bottom mb-2 pb-2">
                <input class="form-check-input check-cargo-licencia" type="checkbox" value="${l.cargo_id}" checked disabled>
                <label class="form-check-label small">
                    <strong>${l.numero_puesto}</strong> (${l.tipo_cargo}) - Puesto Afectado
                </label>
            </div>`;

        document.getElementById("divSyncPuestoLicencia").style.display = "block";
        document.getElementById("checkActualizarEstadoPuesto").checked = false;
        document.querySelector('label[for="checkActualizarEstadoPuesto"]').innerHTML = '<strong>Finalizar licencia</strong> y volver puesto a "Vigente".';
    }
}

async function eliminarLicencia(id) {
    if (!confirm("¿Desea eliminar este registro de licencia?")) return;
    const res = await fetch(`/api/v1/licencias/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) verLicencias();
}
