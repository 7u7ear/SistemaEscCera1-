// ============================
// MODULO CARGOS
// ============================

async function verCargos() {
    const res = await api.get("/api/v1/cargos");
    if (!res.ok) return alert("No tiene permiso para ver cargos");
    cargosGlobal = await res.json();
    renderTablaCargos(cargosGlobal);
}

function renderTablaCargos(data) {
    const container = document.getElementById("tablaCargos");
    if (data.length === 0) { container.innerHTML = "<p class='text-center p-4'>No hay cargos registrados.</p>"; return; }
    let html = `<table class="table table-hover align-middle">
        <thead class="table-light">
            <tr><th>Puesto</th><th>Tipo</th><th>Docente Asignado</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>`;
    data.forEach(c => {
        html += `<tr>
            <td><span class="badge bg-secondary">${c.numero_puesto}</span></td>
            <td>${c.tipo_cargo}</td>
            <td><i class="bi bi-person-circle"></i> ${c.docente_nombre ?? '<span class="text-danger small fw-bold">VACANTE</span>'}</td>
            <td><span class="badge ${c.estado === 'activo' ? 'bg-success' : 'bg-secondary'}">${c.estado}</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-info text-white" onclick="abrirModalGestion(${c.id})" title="Gestionar Detalle"><i class="bi bi-gear-fill"></i></button>
                    <button class="btn btn-sm btn-outline-warning" onclick="abrirModalEditarCargo(${c.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarCargo(${c.id})"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>`;
    });
    html += "</tbody></table>";
    container.innerHTML = html;
}

function filtrarCargos() {
    const texto = document.getElementById("buscadorCargos").value.toLowerCase();
    const filtrados = cargosGlobal.filter(c =>
        (c.numero_puesto && c.numero_puesto.toString().toLowerCase().includes(texto)) ||
        (c.docente_nombre && c.docente_nombre.toLowerCase().includes(texto)) ||
        (c.tipo_cargo && c.tipo_cargo.toLowerCase().includes(texto))
    );
    renderTablaCargos(filtrados);
}

function abrirModalCargo() {
    document.getElementById("modalTituloCargo").innerText = "Nuevo Puesto";
    document.getElementById("cargoId").value = "";
    document.querySelectorAll("#modalCargo input").forEach(i => i.value = "");
    modalCargo.show();
}

function abrirModalEditarCargo(id) {
    const c = cargosGlobal.find(car => car.id === id);
    if (!c) return;
    document.getElementById("modalTituloCargo").innerText = "Editar Puesto";
    document.getElementById("cargoId").value = c.id;
    document.getElementById("numero_puesto").value = c.numero_puesto;
    document.getElementById("tipo_cargo").value = c.tipo_cargo;
    document.getElementById("total_horas").value = c.total_horas;
    modalCargo.show();
}

async function guardarCargo() {
    const data = {
        numero_puesto: document.getElementById("numero_puesto").value,
        tipo_cargo: document.getElementById("tipo_cargo").value,
        total_horas: document.getElementById("total_horas").value
    };
    const id = document.getElementById("cargoId").value;
    const url = id ? `/api/v1/cargos/${id}` : "/api/v1/cargos";
    const res = await (id ? api.put(url, data) : api.post(url, data));
    if (!res.ok) { const msg = await res.json(); alert("Error: " + msg); return; }
    modalCargo.hide();
    verCargos();
}

async function eliminarCargo(id) {
    if (!confirm("¿Desea eliminar este cargo?")) return;
    await api.delete(`/api/v1/cargos/${id}`);
    verCargos();
}

// ============================
// GESTIÓN AVANZADA DE CARGOS
// ============================

async function abrirModalGestion(cargoId, defaultTab = 'asignaciones') {
    const cargo = cargosGlobal.find(c => c.id == cargoId);
    if (!cargo) return;

    document.getElementById("gestionCargoId").value = cargoId;
    document.getElementById("gestionCargoTitulo").innerText = `Gestión de Puesto: ${cargo.numero_puesto} - ${cargo.tipo_cargo}`;

    // Reset UI visibility
    document.getElementById("formRapidoMateria").style.display = "none";

    // Forzar tab según parámetro
    const tabTarget = document.getElementById(defaultTab === 'historial' ? 'tab-historial' : (defaultTab === 'alta' ? 'tab-alta' : 'tab-asignaciones'));
    if (tabTarget) new bootstrap.Tab(tabTarget).show();

    // Cargar listas para selects si están vacías (silenciosamente)
    if (docentesGlobal.length === 0) await cargarDocentesData();
    if (materiasGlobal.length === 0) await cargarMaterias();
    if (cursosGlobal.length === 0) await cargarCursos();
    await cargarTiposHora();

    // Poblar Select Docentes (Para la solapa de Alta)
    const selectD = document.getElementById("selectDocente");
    selectD.innerHTML = '<option value="">-- Seleccionar Docente --</option>';
    docentesGlobal.sort((a,b) => a.apellido.localeCompare(b.apellido)).forEach(d => {
        selectD.innerHTML += `<option value="${d.id}">${d.apellido}, ${d.nombre}</option>`;
    });

    // Poblar Select Materias
    const selectM = document.getElementById("selectMateria");
    selectM.innerHTML = '<option value="">-- Materia --</option>';
    materiasGlobal.forEach(m => {
        selectM.innerHTML += `<option value="${m.id}">${m.nombre}</option>`;
    });

    // Poblar Select Cursos
    const selectCursos = document.getElementById("selectCurso");
    selectCursos.innerHTML = '<option value="">-- Seleccionar Curso --</option>';
    selectCursos.innerHTML += '<option value="null">-- No aplica (Extraclase) --</option>';
    cursosGlobal.forEach(c => {
        let nombreCurso = `${c.anio} ${c.division || ''} ${c.modalidad || ''}`;
        if (c.especialidad && c.especialidad.trim() !== '') {
            nombreCurso += ` ${c.especialidad}`;
        }
        nombreCurso += ` ${c.turno || ''}`;
        selectCursos.innerHTML += `<option value="${c.id}">${nombreCurso.trim().replace(/\s+/g, ' ')}</option>`;
    });

    await renderCadenaAsignaciones(cargoId);
    await cargarDistribucion(cargoId);
    await cargarHistorialCargo(cargoId);

    // Configurar fechas y limpiar inputs de Alta
    document.getElementById("fechaAsignacion").value = new Date().toISOString().split('T')[0];
    document.getElementById("situacionRevista").value = "interino"; // Default
    document.getElementById("selectReemplazaA").innerHTML = '<option value="">-- Seleccionar Docente Licenciado --</option>';
    document.getElementById("divReemplazaA").style.display = "none";
    document.getElementById("inputExpedienteAlta").value = "";
    document.getElementById("inputRolAsignacion").value = "";

    modalGestionCargo.show();
}

async function renderCadenaAsignaciones(cargoId) {
    const container = document.getElementById("contenedorCadenaAsignacion");
    container.innerHTML = '<div class="text-center p-3 text-muted small"><div class="spinner-border spinner-border-sm" role="status"></div> Cargando cadena...</div>';

    try {
        const res = await api.get(`/api/v1/cargos/${cargoId}/cadena-activa`);
        if (!res.ok) throw new Error("Error API");
        const chain = await res.json();

        if (chain.length === 0) {
            container.innerHTML = `
                <div class="text-center p-5">
                    <i class="bi bi-person-exclamation text-muted display-6"></i>
                    <p class="mt-2 text-muted fw-bold">PUESTO VACANTE</p>
                    <button class="btn btn-sm btn-primary" onclick="new bootstrap.Tab(document.getElementById('tab-alta')).show()">Asignar un docente</button>
                </div>`;
            return;
        }

        let html = '';
        chain.forEach((node, index) => {
            const isLast = (index === chain.length - 1);
            const statusBadge = node.licencia_actual ? 
                `<span class="badge bg-warning text-dark badge-saas">Licencia: ${node.licencia_actual}</span>` : 
                (isLast ? '<span class="badge bg-white text-primary badge-saas">ACTUAL EN CURSO</span>' : '<span class="badge bg-success badge-saas">Activo</span>');
            
            const cardClass = isLast ? 'active-chain-node node-actual' : 'active-chain-node node-highlight';
            const icon = node.situacion_revista === 'titular' ? 'bi-person-badge-fill' : 'bi-person-fill';

            html += `
                <div class="${cardClass} position-relative">
                    ${index > 0 ? '<div class="chain-connector" style="position:absolute; top:-15px; left:20px; height:15px; border-left:2px dashed #ccc;"></div>' : ''}
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="d-flex gap-3 align-items-center">
                            <div class="bg-white rounded-circle p-2 shadow-sm text-primary">
                                <i class="bi ${icon} fs-5"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold">${node.docente_nombre}</h6>
                                <p class="mb-0 small opacity-75">${node.situacion_revista.toUpperCase()} • ROL: ${node.rol || '-'}</p>
                                <p class="mb-0 small text-muted">Alta: ${node.expediente_alta || 'S/E'}</p>
                            </div>
                        </div>
                        <div class="text-end">
                            ${statusBadge}
                        </div>
                    </div>
                </div>`;
        });
        container.innerHTML = html;
        
        // Actualizar selectReemplazaA para la solapa de Alta
        const selectR = document.getElementById("selectReemplazaA");
        selectR.innerHTML = '<option value="">-- Seleccionar Docente Licenciado --</option>';
        chain.forEach(node => {
            selectR.innerHTML += `<option value="${node.id}">[${node.situacion_revista.toUpperCase()}] ${node.docente_nombre}</option>`;
        });

    } catch (err) {
        container.innerHTML = '<div class="alert alert-danger p-2 small">Error al reconstruir cadena</div>';
    }
}

function mostrarFormMateria() {
    const div = document.getElementById("formRapidoMateria");
    
    // Si se está abriendo (estaba en none), reseteamos para que sea una NUEVA materia
    if (div.style.display === "none") {
        document.getElementById("editDistribucionId").value = "";
        document.querySelector("#formRapidoMateria button.btn-primary").innerText = "Guardar";
        limpiarFormMateria();
    }
    
    div.style.display = (div.style.display === "none") ? "block" : "none";
}

function limpiarFormMateria() {
    document.getElementById("inputHoras").value = "";
    document.getElementById("inputHoraIngreso").value = "";
    document.getElementById("inputHoraEgreso").value = "";
    document.getElementById("selectMateria").value = "";
    document.getElementById("selectCurso").value = "";
    document.getElementById("selectDia").value = "lunes";
    document.getElementById("selectTipoHora").value = "";
}

async function cargarTiposHora() {
    const res = await api.get("/api/v1/cargos/config/tipos-hora");
    const select = document.getElementById("selectTipoHora");
    select.innerHTML = '<option value="">-- Tipo de Hora --</option>';
    if (res.ok) {
        const tipos = await res.json();
        tipos.forEach(t => {
            select.innerHTML += `<option value="${t.id}">${t.nombre}</option>`;
        });
    }
}

async function cargarMaterias() {
    const res = await api.get("/api/v1/materias");
    if (res.ok) materiasGlobal = await res.json();
}

async function cargarCursos() {
    const res = await api.get("/api/v1/cursos");
    if (res.ok) cursosGlobal = await res.json();
}

function toggleReemplazoDrop() {
    const sit = document.getElementById("situacionRevista").value;
    const div = document.getElementById("divReemplazaA");
    if (sit.toLowerCase() === 'suplente') {
        div.style.display = "block";
    } else {
        div.style.display = "none";
        document.getElementById("selectReemplazaA").value = "";
    }
}

async function cargarHistorialCargo(cargoId) {
    const res = await api.get(`/api/v1/cargos/${cargoId}/historial`);
    const container = document.getElementById("tablaHistorial");
    if (!res.ok) {
        container.innerHTML = "<div class='alert alert-danger'>Error al cargar historial</div>";
        return;
    }
    const data = await res.json();

    if (data.length === 0) {
        container.innerHTML = "<p class='text-center text-muted'>No hay docentes registrados históricamente en este cargo.</p>";
        return;
    }

    let html = `<table class="table table-sm align-middle mt-2">
        <thead class="table-light text-muted small">
            <tr><th>Status</th><th>Docente</th><th>Revista/Rol</th><th>Expedientes</th><th>Desde</th><th>Hasta</th><th>X</th></tr>
        </thead>
        <tbody>`;

    data.forEach(d => {
        let badge = '<span class="badge bg-secondary">Inactivo</span>';
        if (d.estado === 'activo') badge = '<span class="badge bg-success">Activo</span>';
        if (d.estado === 'licencia') badge = '<span class="badge bg-warning text-dark">Licencia</span>';

        const desde = d.fecha_inicio ? new Date(d.fecha_inicio).toLocaleDateString() : '-';
        const hasta = d.fecha_fin ? new Date(d.fecha_fin).toLocaleDateString() : 'Presente';
        const reemplazaText = d.reemplaza_a ? `<br><small class="text-danger fw-bold">Reemplaza a: ${d.reemplaza_nombre || d.reemplaza_a}</small>` : '';

        const expes = `
            <small class="d-block text-success" title="Exp. Alta"><i class="bi bi-file-earmark-check"></i> ${d.expediente_alta || '-'}</small>
            <small class="d-block text-danger" title="Exp. Baja"><i class="bi bi-file-earmark-x"></i> ${d.expediente_baja || '-'}</small>
        `;

        const actionBtn = (d.estado === 'activo' || d.estado === 'licencia') ? `<button class="btn btn-sm btn-outline-danger" onclick="darDeBaja(${cargoId}, ${d.id})" title="Registrar Baja"><i class="bi bi-box-arrow-right"></i></button>` : '';

        const rolText = d.rol && parseInt(d.rol) !== 0 ? ` <span class="badge bg-info text-dark">Rol: ${d.rol}</span>` : '';

        html += `<tr>
            <td>${badge}</td>
            <td class="fw-bold">${d.docente_nombre ?? 'N/A'}${reemplazaText}</td>
            <td class="small"><span class="text-capitalize">${d.situacion_revista}</span>${rolText}</td>
            <td>${expes}</td>
            <td class="small">${desde}</td>
            <td class="small text-muted">${hasta}</td>
            <td>${actionBtn}</td>
        </tr>`;
    });
    html += "</tbody></table>";
    container.innerHTML = html;
}

function darDeBaja(cargoId, cargoDocenteId) {
    document.getElementById("bajaCargoId").value = cargoId;
    document.getElementById("bajaCargoDocenteId").value = cargoDocenteId;
    document.getElementById("bajaFecha").value = new Date().toISOString().split('T')[0];
    document.getElementById("bajaExpediente").value = "";
    document.getElementById("bajaRetornaTitular").checked = true;
    modalBajaSuplente.show();
}

async function confirmarBaja() {
    const cargoId = document.getElementById("bajaCargoId").value;
    const cargoDocenteId = document.getElementById("bajaCargoDocenteId").value;
    const fechaFin = document.getElementById("bajaFecha").value;
    const expBaja = document.getElementById("bajaExpediente").value;
    const retornaTitular = document.getElementById("bajaRetornaTitular").checked;

    const res = await api.post(`/api/v1/cargos/${cargoId}/baja/${cargoDocenteId}`, { 
        fecha_fin: fechaFin, 
        expediente_baja: expBaja, 
        titular_regresa: retornaTitular 
    });

    if (res.ok) {
        modalBajaSuplente.hide();
        alert("Baja registrada correctamente");
        cargarHistorialCargo(cargoId);
        verCargos();
    } else {
        const msg = await res.json();
        alert("Error al registrar baja: " + JSON.stringify(msg));
    }
}

async function asignarDocente() {
    const cargoId = document.getElementById("gestionCargoId").value;
    const docenteId = document.getElementById("selectDocente").value;
    const situacion = document.getElementById("situacionRevista").value;
    const fechaInicio = document.getElementById("fechaAsignacion").value;
    const reemplazaA = document.getElementById("selectReemplazaA").value;
    const rol = document.getElementById("inputRolAsignacion").value;
    const expAlta = document.getElementById("inputExpedienteAlta").value;

    if (!docenteId) return alert("Seleccione un docente");
    if (!situacion) return alert("Indique situación de revista");

    const bodyData = {
        docente_id: docenteId,
        situacion_revista: situacion,
        fecha_inicio: fechaInicio || null,
        reemplaza_a: reemplazaA || null,
        rol: rol ? parseInt(rol, 10) : 0,
        expediente_alta: expAlta
    };

    const res = await api.post(`/api/v1/cargos/${cargoId}/asignar`, bodyData);

    if (res.ok) {
        alert("Docente asignado correctamente.");
        verCargos();
        renderCadenaAsignaciones(cargoId);
        cargarHistorialCargo(cargoId);
        // Volver a la solapa de asignaciones
        new bootstrap.Tab(document.getElementById('tab-asignaciones')).show();
    } else {
        const msg = await res.json();
        alert("Error al asignar: " + (msg.message || JSON.stringify(msg)));
    }
}

let distribucionActual = [];

async function agregarMateria() {
    const cargoId = document.getElementById("gestionCargoId").value;
    const editId = document.getElementById("editDistribucionId").value;
    const materiaId = document.getElementById("selectMateria").value;
    const cursoId = document.getElementById("selectCurso").value;
    const horas = document.getElementById("inputHoras").value;
    const dia = document.getElementById("selectDia").value;
    const horaIngreso = document.getElementById("inputHoraIngreso").value;
    const horaEgreso = document.getElementById("inputHoraEgreso").value;
    const tipoHoraId = document.getElementById("selectTipoHora").value;

    if (!materiaId || !horas) return alert("Materia y Horas son obligatorios");

    const bodyData = {
        materia_id: parseInt(materiaId),
        curso_id: (cursoId && cursoId !== "null") ? parseInt(cursoId) : null,
        cantidad_horas: parseInt(horas),
        dia: dia,
        hora_ingreso: horaIngreso || null,
        hora_egreso: horaEgreso || null,
        tipo_hora_id: tipoHoraId ? parseInt(tipoHoraId) : null
    };

    const url = editId ? `/api/v1/cargos/distribucion/${editId}` : `/api/v1/cargos/${cargoId}/distribucion`;
    const res = await (editId ? api.put(url, bodyData) : api.post(url, bodyData));

    if (res.ok) {
        cargarDistribucion(cargoId);
        // Limpiar y Resetear
        document.getElementById("editDistribucionId").value = "";
        limpiarFormMateria();
        document.getElementById("formRapidoMateria").style.display = "none";
    } else {
        const msg = await res.json();
        alert("Error al guardar materia: " + JSON.stringify(msg));
    }
}

async function cargarDistribucion(cargoId) {
    const res = await api.get(`/api/v1/cargos/${cargoId}/distribucion`);
    if (!res.ok) return;
    distribucionActual = await res.json();

    let html = `<table class="table table-sm table-hover mt-0">
        <thead class="text-muted small border-bottom bg-light">
            <tr><th>Materia</th><th>Tipo Hora</th><th>Curso</th><th>Día</th><th>Horario</th><th>Horas</th><th class="text-end">Acciones</th></tr>
        </thead>
        <tbody>`;
    distribucionActual.forEach(d => {
        const horario = (d.hora_ingreso && d.hora_egreso) ? `${d.hora_ingreso.substring(0, 5)} a ${d.hora_egreso.substring(0, 5)}` : 'A definir';
        let cursoTxt = 'N/A';
        if (d.curso_anio) {
            cursoTxt = `${d.curso_anio} ${d.curso_division || ''} ${d.curso_modalidad || ''} ${d.curso_turno || ''}`;
            cursoTxt = cursoTxt.trim().replace(/\s+/g, ' ');
        }
        html += `<tr>
            <td class="small fw-bold text-primary">${d.materia_nombre}</td>
            <td class="small"><span class="badge bg-light text-dark border">${d.tipo_hora_nombre || '-'}</span></td>
            <td class="small text-muted">${cursoTxt}</td>
            <td class="small text-capitalize">${d.dia}</td>
            <td class="small text-muted">${horario}</td>
            <td><span class="badge bg-primary-subtle text-primary">${d.cantidad_horas} hs</span></td>
            <td class="text-end">
                <button class="btn btn-link btn-sm p-0 text-primary me-2" onclick="editarMateria(${d.id})" title="Editar"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-link btn-sm p-0 text-danger" onclick="eliminarMateria(${d.id})" title="Eliminar"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;
    });
    html += "</tbody></table>";
    document.getElementById("tablaDistribucion").innerHTML = html;
}

function editarMateria(id) {
    const d = distribucionActual.find(x => x.id == id);
    if (!d) return;

    document.getElementById("editDistribucionId").value = d.id;
    document.getElementById("selectMateria").value = d.materia_id;
    document.getElementById("selectCurso").value = d.curso_id;
    document.getElementById("selectDia").value = d.dia;
    document.getElementById("inputHoraIngreso").value = d.hora_ingreso ? d.hora_ingreso.substring(0, 5) : "";
    document.getElementById("inputHoraEgreso").value = d.hora_egreso ? d.hora_egreso.substring(0, 5) : "";
    document.getElementById("inputHoras").value = d.cantidad_horas;
    document.getElementById("selectTipoHora").value = d.tipo_hora_id || "";

    document.getElementById("formRapidoMateria").style.display = "block";
    document.querySelector("#formRapidoMateria button.btn-primary").innerText = "Actualizar";
}

async function eliminarMateria(id) {
    if (!confirm("¿Desea eliminar este horario/materia de la composición?")) return;
    const res = await api.delete(`/api/v1/cargos/distribucion/${id}`);
    if (res.ok) {
        const cargoId = document.getElementById("gestionCargoId").value;
        cargarDistribucion(cargoId);
    } else {
        alert("Error al eliminar");
    }
}

// Gestión simple de tipos de hora
async function abrirGestionTiposHora() {
    const nombre = prompt("Ingrese el nombre del nuevo tipo de hora (ej: Extraclase):");
    if (!nombre) return;
    const res = await api.post("/api/v1/cargos/config/tipos-hora", { nombre });
    if (res.ok) {
        cargarTiposHora();
    }
}

