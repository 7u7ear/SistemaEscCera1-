// ============================
// MODULO ALUMNOS
// ============================

let alumnoDataActivo = null;

// Sanitiza año/división: evita duplicar ordinales (ej: 1º° -> 1º)
function fmtOrdinal(val) {
    if (!val && val !== 0) return '';
    const clean = String(val).trim().replace(/[°º]+$/g, '');
    return clean ? `${clean}º` : '';
}

async function cargarAlumnosData() {
    const res = await api.get("/api/v1/alumnos");
    if (res.ok) {
        alumnosGlobal = await res.json();
    } else {
        return false;
    }
    return true;
}

async function verAlumnos() {
    const success = await cargarAlumnosData();
    if (!success) return alert("No tiene permiso para ver alumnos");
    renderTablaAlumnos(alumnosGlobal);
}

function renderTablaAlumnos(data) {
    const container = document.getElementById("tablaAlumnos");
    if (data.length === 0) {
        container.innerHTML = "<p class='text-center p-4 text-muted'>No hay alumnos registrados.</p>";
        return;
    }

    let html = `
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Apellido y Nombre</th>
                    <th>DNI</th>
                    <th>Email</th>
                    <th>Curso Actual</th>
                    <th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(a => {
        html += `
            <tr>
                <td><strong>${a.apellido}, ${a.nombre}</strong></td>
                <td>${a.dni}</td>
                <td>${a.email || '-'}</td>
                <td><span class="badge bg-light text-dark border">${a.curso_actual || 'No Inscripto'}</span></td>
                <td class="text-end">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="verFichaAlumno(${a.id})" title="Ficha del Alumno">
                            <i class="bi bi-file-earmark-person"></i> Ficha
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="abrirModalEditarAlumno(${a.id})" title="Editar Alumno">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="abrirModalMatricular(${a.id})" title="Matricular en Curso">
                            <i class="bi bi-mortarboard"></i> Matriculación
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarAlumno(${a.id})" title="Eliminar Alumno">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

function filtrarAlumnos() {
    const query = document.getElementById("buscadorAlumnos").value.toLowerCase();
    const filtrados = alumnosGlobal.filter(a => 
        a.apellido.toLowerCase().includes(query) ||
        a.nombre.toLowerCase().includes(query) ||
        a.dni.includes(query)
    );
    renderTablaAlumnos(filtrados);
}

function agregarFilaResponsable(fam = {}) {
    const container = document.getElementById("contenedorResponsables");
    const idUnico = 'fam_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    
    const row = document.createElement("div");
    row.className = "card p-3 border shadow-sm item-responsable";
    row.id = idUnico;
    row.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-secondary">Responsable</span>
            <button type="button" class="btn btn-sm btn-outline-danger border-0" onclick="document.getElementById('${idUnico}').remove()">
                <i class="bi bi-trash"></i> Eliminar
            </button>
        </div>
        <div class="row g-2">
            <div class="col-md-4">
                <label class="form-label text-muted small fw-bold mb-1">Parentesco</label>
                <select class="form-select form-select-sm familiar-parentesco">
                    <option value="Padre" ${fam.parentesco === 'Padre' ? 'selected' : ''}>Padre</option>
                    <option value="Madre" ${fam.parentesco === 'Madre' ? 'selected' : ''}>Madre</option>
                    <option value="Tutor / Encargado" ${fam.parentesco === 'Tutor / Encargado' ? 'selected' : ''}>Tutor / Encargado</option>
                    <option value="Abuelo/a" ${fam.parentesco === 'Abuelo/a' ? 'selected' : ''}>Abuelo/a</option>
                    <option value="Tío/a" ${fam.parentesco === 'Tío/a' ? 'selected' : ''}>Tío/a</option>
                    <option value="Hermano/a" ${fam.parentesco === 'Hermano/a' ? 'selected' : ''}>Hermano/a</option>
                    <option value="Otro" ${!['Padre','Madre','Tutor / Encargado','Abuelo/a','Tío/a','Hermano/a'].includes(fam.parentesco) && fam.parentesco ? 'selected' : ''}>Otro</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label text-muted small fw-bold mb-1">Apellido *</label>
                <input type="text" class="form-control form-control-sm familiar-apellido" value="${fam.apellido || ''}" required>
            </div>
            <div class="col-md-4">
                <label class="form-label text-muted small fw-bold mb-1">Nombre *</label>
                <input type="text" class="form-control form-control-sm familiar-nombre" value="${fam.nombre || ''}" required>
            </div>
            <div class="col-md-4">
                <label class="form-label text-muted small fw-bold mb-1">DNI *</label>
                <input type="text" class="form-control form-control-sm familiar-dni" value="${fam.dni || ''}" required>
            </div>
            <div class="col-md-4">
                <label class="form-label text-muted small fw-bold mb-1">Teléfono</label>
                <input type="text" class="form-control form-control-sm familiar-telefono" value="${fam.telefono || ''}">
            </div>
            <div class="col-md-4">
                <label class="form-label text-muted small fw-bold mb-1">Email</label>
                <input type="email" class="form-control form-control-sm familiar-email" value="${fam.email || ''}">
            </div>
        </div>
    `;
    container.appendChild(row);
}

function abrirModalNuevoAlumno() {
    document.getElementById("modalAlumnoTitulo").innerText = "Nuevo Alumno";
    document.getElementById("alumnoId").value = "";
    document.getElementById("alumnoNombre").value = "";
    document.getElementById("alumnoApellido").value = "";
    document.getElementById("alumnoDni").value = "";
    document.getElementById("alumnoFechaNac").value = "";
    document.getElementById("alumnoDireccion").value = "";
    document.getElementById("alumnoEmail").value = "";
    
    document.getElementById("contenedorResponsables").innerHTML = "";
    agregarFilaResponsable();

    modalAlumno.show();
}

async function abrirModalEditarAlumno(id) {
    const res = await api.get(`/api/v1/alumnos/${id}`);
    if (!res.ok) return alert("Error al cargar datos del alumno");
    const a = await res.json();

    document.getElementById("modalAlumnoTitulo").innerText = "Editar Alumno";
    document.getElementById("alumnoId").value = a.id;
    document.getElementById("alumnoNombre").value = a.nombre;
    document.getElementById("alumnoApellido").value = a.apellido;
    document.getElementById("alumnoDni").value = a.dni;
    document.getElementById("alumnoFechaNac").value = a.fecha_nacimiento ? a.fecha_nacimiento.split('T')[0] : '';
    document.getElementById("alumnoDireccion").value = a.direccion || "";
    document.getElementById("alumnoEmail").value = a.email || "";

    const container = document.getElementById("contenedorResponsables");
    container.innerHTML = "";

    if (a.familiares && a.familiares.length > 0) {
        a.familiares.forEach(f => agregarFilaResponsable(f));
    } else {
        agregarFilaResponsable();
    }

    modalAlumno.show();
}

async function guardarAlumno() {
    const id = document.getElementById("alumnoId").value;
    const data = {
        nombre: document.getElementById("alumnoNombre").value.trim(),
        apellido: document.getElementById("alumnoApellido").value.trim(),
        dni: document.getElementById("alumnoDni").value.trim(),
        fecha_nacimiento: document.getElementById("alumnoFechaNac").value,
        direccion: document.getElementById("alumnoDireccion").value.trim() || null,
        email: document.getElementById("alumnoEmail").value.trim() || null,
        familiares: []
    };

    if (!data.apellido || !data.nombre || !data.dni || !data.fecha_nacimiento) {
        return alert("Por favor complete los campos obligatorios del alumno (Apellido, Nombre, DNI y Fecha de Nacimiento).");
    }

    // Recolectar lista de responsables
    const itemsResponsable = document.querySelectorAll(".item-responsable");
    for (let i = 0; i < itemsResponsable.length; i++) {
        const card = itemsResponsable[i];
        const parentesco = card.querySelector(".familiar-parentesco").value;
        const apellido = card.querySelector(".familiar-apellido").value.trim();
        const nombre = card.querySelector(".familiar-nombre").value.trim();
        const dni = card.querySelector(".familiar-dni").value.trim();
        const telefono = card.querySelector(".familiar-telefono").value.trim() || null;
        const email = card.querySelector(".familiar-email").value.trim() || null;

        // Si se llenó cualquier dato del responsable, requerir nombre, apellido y DNI
        if (dni || nombre || apellido || telefono || email) {
            if (!nombre || !apellido || !dni) {
                return alert(`En el responsable #${i + 1}, debe completar Nombre, Apellido y DNI.`);
            }
            data.familiares.push({ parentesco, apellido, nombre, dni, telefono, email });
        }
    }

    try {
        let res;
        if (id) {
            res = await api.put(`/api/v1/alumnos/${id}`, data);
        } else {
            res = await api.post("/api/v1/alumnos", data);
        }

        if (res.ok) {
            modalAlumno.hide();
            verAlumnos();
        } else {
            const err = await res.json();
            alert(`Error: ${api.getErrorMessage(err)}`);
        }
    } catch (err) {
        alert(`Error de red: ${err.message}`);
    }
}

async function eliminarAlumno(id) {
    if (!confirm("¿Está seguro de eliminar este alumno? Esta acción eliminará permanentemente sus inscripciones e historial.")) return;

    const res = await api.delete(`/api/v1/alumnos/${id}`);
    if (res.ok) {
        verAlumnos();
    } else {
        const err = await res.json();
        alert(`Error: ${api.getErrorMessage(err)}`);
    }
}

// --- FICHA DEL ALUMNO ---
async function verFichaAlumno(id) {
    const res = await api.get(`/api/v1/alumnos/${id}`);
    if (!res.ok) return alert("Error al cargar ficha");
    const a = await res.json();
    alumnoDataActivo = a;

    // Mostrar sección Ficha y ocultar listado general
    document.getElementById("listaAlumnosCard").style.display = "none";
    const container = document.getElementById("fichaAlumnoContainer");
    container.style.display = "block";

    // Cargar contenido
    renderFichaLayout(a);
}

function volverAListadoAlumnos() {
    document.getElementById("fichaAlumnoContainer").style.display = "none";
    document.getElementById("listaAlumnosCard").style.display = "block";
    verAlumnos();
}

function renderFichaLayout(a) {
    const container = document.getElementById("fichaAlumnoContainer");
    const nacimiento = new Date(a.fecha_nacimiento + 'T00:00:00').toLocaleDateString();

    let familiaresHtml = '';
    if (a.familiares.length === 0) {
        familiaresHtml = '<p class="text-muted small">No hay familiares / responsables registrados.</p>';
    } else {
        a.familiares.forEach(f => {
            familiaresHtml += `
                <div class="border rounded p-3 mb-2 bg-light shadow-sm">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary">${f.parentesco || 'Responsable'}</span>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <p class="mb-1 small text-muted">Nombre y Apellido</p>
                            <h6 class="fw-bold">${f.apellido}, ${f.nombre}</h6>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-1 small text-muted">DNI</p>
                            <h6 class="fw-bold">${f.dni}</h6>
                        </div>
                        <div class="col-md-6 mt-2">
                            <p class="mb-1 small text-muted">Teléfono</p>
                            <h6 class="fw-bold">${f.telefono || '-'}</h6>
                        </div>
                        <div class="col-md-6 mt-2">
                            <p class="mb-1 small text-muted">Email</p>
                            <h6 class="fw-bold">${f.email || '-'}</h6>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    let inscripcionesHtml = '';
    if (a.inscripciones.length === 0) {
        inscripcionesHtml = '<tr><td colspan="5" class="text-center text-muted p-3">El alumno no registra inscripciones.</td></tr>';
    } else {
        a.inscripciones.forEach(i => {
            const divisionStr = i.division ? ` ${fmtOrdinal(i.division)}` : '';
            inscripcionesHtml += `
                <tr>
                    <td><strong>${i.anio_lectivo}</strong></td>
                    <td>${fmtOrdinal(i.anio)}${divisionStr}</td>
                    <td><span class="badge bg-light text-dark border">${i.turno.toUpperCase()}</span></td>
                    <td>${i.especialidad} (${i.modalidad})</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="confirmarDesinscripcion(${a.id}, ${i.curso_id}, ${i.anio_lectivo})">
                            <i class="bi bi-trash"></i> Desinscribir
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    let adeudadasHtml = '';
    if (a.materias_adeudadas.length === 0) {
        adeudadasHtml = '<tr><td colspan="4" class="text-center text-muted p-3">No tiene materias adeudadas.</td></tr>';
    } else {
        a.materias_adeudadas.forEach(ma => {
            const isPendiente = ma.estado === 'pendiente';
            adeudadasHtml += `
                <tr>
                    <td><strong>${ma.materia_nombre}</strong></td>
                    <td>
                        <span class="badge ${isPendiente ? 'bg-danger' : 'bg-success'}">${ma.estado.toUpperCase()}</span>
                    </td>
                    <td>${new Date(ma.created_at).toLocaleDateString()}</td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary" onclick="cambiarEstadoMateria(${ma.id}, '${isPendiente ? 'aprobada' : 'pendiente'}')">
                                <i class="bi ${isPendiente ? 'bi-check-circle' : 'bi-x-circle'}"></i> Marcar ${isPendiente ? 'Aprobada' : 'Pendiente'}
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarMateriaAdeudada(${ma.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <button class="btn btn-light border btn-sm mb-2" onclick="volverAListadoAlumnos()">
                    <i class="bi bi-arrow-left"></i> Volver a listado
                </button>
                <h3 class="fw-bold mb-0 text-dark"><i class="bi bi-person-badge"></i> Ficha Escolar: ${a.apellido}, ${a.nombre}</h3>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="abrirModalTrasladar(${a.id})"><i class="bi bi-arrow-left-right"></i> Pase de Curso</button>
                <button class="btn btn-outline-primary fw-bold" onclick="verBitacoraAlumno(${a.id})"><i class="bi bi-clock-history"></i> Historial de Movimientos</button>
            </div>
        </div>

        <div class="row g-4">
            <!-- Columna Datos Generales y Familiares -->
            <div class="col-md-5">
                <div class="card p-4 shadow-sm border-0 mb-4 bg-white">
                    <h5 class="fw-bold mb-3 text-primary"><i class="bi bi-info-circle-fill"></i> Datos Personales</h5>
                    <div class="mb-2">
                        <label class="text-muted small d-block">DNI / Documento</label>
                        <span class="fw-bold text-dark">${a.dni}</span>
                    </div>
                    <div class="mb-2">
                        <label class="text-muted small d-block">Fecha de Nacimiento</label>
                        <span class="fw-bold text-dark">${nacimiento}</span>
                    </div>
                    <div class="mb-2">
                        <label class="text-muted small d-block">Email de Contacto</label>
                        <span class="fw-bold text-dark">${a.email || '-'}</span>
                    </div>
                    <div class="mb-2">
                        <label class="text-muted small d-block">Dirección Residencial</label>
                        <span class="fw-bold text-dark">${a.direccion || '-'}</span>
                    </div>
                </div>

                <div class="card p-4 shadow-sm border-0 bg-white">
                    <h5 class="fw-bold mb-3 text-primary"><i class="bi bi-people-fill"></i> Responsable / Familiar</h5>
                    ${familiaresHtml}
                </div>
            </div>

            <!-- Columna Inscripciones y Previas -->
            <div class="col-md-7">
                <div class="card p-4 shadow-sm border-0 mb-4 bg-white">
                    <h5 class="fw-bold mb-3 text-primary"><i class="bi bi-mortarboard-fill"></i> Inscripciones y Cursos</h5>
                    <div class="table-responsive">
                        <table class="table table-sm align-middle table-hover">
                            <thead>
                                <tr>
                                    <th>Ciclo</th>
                                    <th>Curso</th>
                                    <th>Turno</th>
                                    <th>Especialidad</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${inscripcionesHtml}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card p-4 shadow-sm border-0 bg-white">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-bold mb-0 text-primary"><i class="bi bi-exclamation-triangle-fill"></i> Materias Adeudadas (Previas)</h5>
                        <button class="btn btn-sm btn-danger fw-bold" onclick="abrirModalCargarMateria()"><i class="bi bi-plus-lg"></i> Cargar Previa</button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm align-middle table-hover">
                            <thead>
                                <tr>
                                    <th>Materia</th>
                                    <th>Estado</th>
                                    <th>Fecha Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${adeudadasHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function formatCursoCompleto(c) {
    if (!c) return '';
    const anioStr = fmtOrdinal(c.anio);
    const divStr = fmtOrdinal(c.division);
    const anioDiv = `${anioStr} ${divStr}`.trim();
    const esp = (c.especialidad && c.especialidad.trim() !== '') ? ` ${c.especialidad}` : (c.modalidad ? ` ${c.modalidad}` : '');
    const mod = (c.modalidad && c.modalidad !== '-' && c.especialidad && c.especialidad.trim() !== '') ? ` - ${c.modalidad}` : '';
    const tur = c.turno ? ` (${c.turno.toUpperCase()})` : '';
    return `${anioDiv}${esp}${mod}${tur}`.trim();
}

// --- MATRICULACIÓN / INSCRIPCIONES ---
async function abrirModalMatricular(id) {
    const res = await api.get(`/api/v1/alumnos/${id}`);
    if (!res.ok) return alert("Error al buscar alumno");
    const a = await res.json();

    document.getElementById("matricularAlumnoId").value = a.id;
    document.getElementById("matricularAlumnoNombre").innerText = `${a.apellido}, ${a.nombre}`;
    document.getElementById("matricularCiclo").value = new Date().getFullYear();
    document.getElementById("matricularCursoId").value = "";
    document.getElementById("cursoSeleccionadoMatricular").innerHTML = `
        <i class="bi bi-arrow-left-circle display-5 mb-2 d-block"></i>
        <p class="small">Seleccione un curso del menú</p>`;

    // Cargar cursos y construir acordeón
    const resCursos = await api.get("/api/v1/cursos");
    if (!resCursos.ok) return alert("Error al cargar cursos");
    const cursos = await resCursos.json();

    buildAcordeonMatricular(cursos);
    modalMatricular.show();
}

function buildAcordeonMatricular(cursos) {
    const MODAL_ORDER = ['B.E.C', 'T.C.A', 'AUX'];
    const TURNO_ORDER = ['MAÑANA', 'TARDE', 'NOCHE'];

    const grouped = {};
    cursos.forEach(c => {
        const mod = c.modalidad || 'SIN MODALIDAD';
        if (!grouped[mod]) grouped[mod] = [];
        grouped[mod].push(c);
    });

    const mods = MODAL_ORDER.filter(m => grouped[m]).concat(
        Object.keys(grouped).filter(m => !MODAL_ORDER.includes(m))
    );

    let html = '<div class="accordion accordion-flush" id="accMat">';
    mods.forEach((mod, mi) => {
        const collapseId = `accMat-mod-${mi}`;
        html += `
        <div class="accordion-item border-0">
            <h2 class="accordion-header">
                <button class="accordion-button py-2 px-2 fw-bold small collapsed" type="button"
                    data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                    <i class="bi bi-folder2 text-primary me-2"></i>${mod}
                </button>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse">
                <div class="accordion-body p-0 ps-2">`;

        if (mod === 'B.E.C') {
            const byAnio = {};
            grouped[mod].forEach(c => {
                const k = c.anio || '?';
                if (!byAnio[k]) byAnio[k] = [];
                byAnio[k].push(c);
            });
            Object.keys(byAnio).sort().forEach((anio, ai) => {
                const subId = `accMat-${mi}-anio-${ai}`;
                const cleanAnio = String(anio).trim().replace(/[°º]+$/g, '');
                const displayAnio = cleanAnio ? `${cleanAnio}º` : anio;
                html += `
                <div class="accordion-item border-0">
                    <h2 class="accordion-header">
                        <button class="accordion-button py-1 px-2 small collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#${subId}">
                            <i class="bi bi-folder2 text-primary me-2"></i>${displayAnio} Año
                        </button>
                    </h2>
                    <div id="${subId}" class="accordion-collapse collapse">
                        <div class="accordion-body p-0 ps-3">`;
                byAnio[anio].sort((a, b) => (a.division || '').localeCompare(b.division || '')).forEach(c => {
                    const label = `${fmtOrdinal(c.anio)} ${fmtOrdinal(c.division)} ${c.especialidad || c.modalidad}`.trim().replace(/\s+/g, ' ');
                    html += `<button class="list-group-item list-group-item-action py-1 px-2 small border-0"
                        onclick="seleccionarCursoMatricular(${c.id}, '${label.replace(/'/g, "\\'")}')">
                        ${label}
                    </button>`;
                });
                html += `</div></div></div>`;
            });
        } else {
            const byTurno = {};
            grouped[mod].forEach(c => {
                const k = (c.turno || 'SIN TURNO').toUpperCase();
                if (!byTurno[k]) byTurno[k] = [];
                byTurno[k].push(c);
            });
            const turnos = TURNO_ORDER.filter(t => byTurno[t]).concat(
                Object.keys(byTurno).filter(t => !TURNO_ORDER.includes(t))
            );
            turnos.forEach((turno, ti) => {
                const subId = `accMat-${mi}-turno-${ti}`;
                html += `
                <div class="accordion-item border-0">
                    <h2 class="accordion-header">
                        <button class="accordion-button py-1 px-2 small collapsed" type="button"
                            data-bs-toggle="collapse" data-bs-target="#${subId}">
                            <i class="bi bi-folder2 text-primary me-2"></i>${turno.charAt(0) + turno.slice(1).toLowerCase()}
                        </button>
                    </h2>
                    <div id="${subId}" class="accordion-collapse collapse">
                        <div class="accordion-body p-0 ps-3">`;
                byTurno[turno].sort((a, b) => (`${a.anio}${a.division}`).localeCompare(`${b.anio}${b.division}`)).forEach(c => {
                    const label = `${fmtOrdinal(c.anio)} ${fmtOrdinal(c.division)} ${c.especialidad || c.modalidad}`.trim().replace(/\s+/g, ' ');
                    html += `<button class="list-group-item list-group-item-action py-1 px-2 small border-0"
                        onclick="seleccionarCursoMatricular(${c.id}, '${label.replace(/'/g, "\\'")}')">
                        ${label}
                    </button>`;
                });
                html += `</div></div></div>`;
            });
        }

        html += `</div></div></div>`;
    });

    html += '</div>';
    document.getElementById("acordeonMatricular").innerHTML = html;
}

function seleccionarCursoMatricular(id, label) {
    document.getElementById("matricularCursoId").value = id;
    // Highlight activo
    document.querySelectorAll("#acordeonMatricular .list-group-item").forEach(btn => {
        btn.classList.remove("active", "bg-primary", "text-white");
    });
    event.currentTarget.classList.add("active", "bg-primary", "text-white");
    // Panel derecho
    document.getElementById("cursoSeleccionadoMatricular").innerHTML = `
        <i class="bi bi-check-circle-fill text-success display-5 mb-2 d-block"></i>
        <p class="fw-bold mb-1">${label}</p>
        <p class="small text-muted">Curso seleccionado</p>`;
}


async function guardarMatriculacion() {
    const data = {
        alumno_id: parseInt(document.getElementById("matricularAlumnoId").value),
        curso_id: parseInt(document.getElementById("matricularCursoId").value),
        anio_lectivo: parseInt(document.getElementById("matricularCiclo").value)
    };

    if (!data.curso_id || !data.anio_lectivo) return alert("Por favor complete todos los datos");

    const res = await api.post("/api/v1/alumnos/matricular", data);
    if (res.ok) {
        modalMatricular.hide();
        verAlumnos();
    } else {
        const err = await res.json();
        alert(`Error: ${api.getErrorMessage(err)}`);
    }
}

async function confirmarDesinscripcion(alumnoId, cursoId, anioLectivo) {
    if (!confirm(`¿Está seguro de dar de baja la inscripción de este alumno del curso para el ciclo ${anioLectivo}? Se registrará este movimiento.`)) return;

    const res = await api.post("/api/v1/alumnos/desinscribir", { alumno_id: alumnoId, cursoId, anioLectivo });
    if (res.ok) {
        verFichaAlumno(alumnoId);
    } else {
        const err = await res.json();
        alert(`Error: ${api.getErrorMessage(err)}`);
    }
}

// --- TRASLADOS / PASES ---
async function abrirModalTrasladar(id) {
    const res = await api.get(`/api/v1/alumnos/${id}`);
    if (!res.ok) return alert("Error");
    const a = await res.json();

    document.getElementById("trasladarAlumnoId").value = a.id;
    document.getElementById("trasladarAlumnoNombre").innerText = `${a.apellido}, ${a.nombre}`;
    document.getElementById("trasladarCiclo").value = new Date().getFullYear();

    // Determinar curso origen de este año
    const inscripActual = a.inscripciones.find(i => i.anio_lectivo === new Date().getFullYear());
    if (inscripActual) {
        document.getElementById("trasladarCursoOrigenId").value = inscripActual.curso_id;
        document.getElementById("trasladarCursoOrigenDisplay").value = formatCursoCompleto(inscripActual);
    } else {
        document.getElementById("trasladarCursoOrigenId").value = "";
        document.getElementById("trasladarCursoOrigenDisplay").value = "No Inscripto en Ciclo Actual";
    }

    // Cargar select de cursos
    const resCursos = await api.get("/api/v1/cursos");
    const cursos = await resCursos.json();
    let options = '<option value="">-- Seleccione Curso Destino --</option>';
    cursos.forEach(c => {
        if (!inscripActual || c.id !== inscripActual.curso_id) {
            options += `<option value="${c.id}">${formatCursoCompleto(c)}</option>`;
        }
    });
    document.getElementById("trasladarCursoDestinoId").innerHTML = options;

    modalTrasladar.show();
}

async function guardarTraslado() {
    const data = {
        alumno_id: parseInt(document.getElementById("trasladarAlumnoId").value),
        curso_origen_id: document.getElementById("trasladarCursoOrigenId").value ? parseInt(document.getElementById("trasladarCursoOrigenId").value) : null,
        curso_destino_id: parseInt(document.getElementById("trasladarCursoDestinoId").value),
        anio_lectivo: parseInt(document.getElementById("trasladarCiclo").value)
    };

    if (!data.curso_destino_id) return alert("Seleccione el curso de destino");

    const res = await api.post("/api/v1/alumnos/trasladar", data);
    if (res.ok) {
        modalTrasladar.hide();
        verFichaAlumno(data.alumno_id);
    } else {
        const err = await res.json();
        alert(`Error: ${api.getErrorMessage(err)}`);
    }
}

// --- HISTORIAL / BITÁCORA MOVIMIENTOS ---
async function verBitacoraAlumno(id) {
    const res = await api.get(`/api/v1/alumnos/${id}/movimientos`);
    if (!res.ok) return alert("Error al cargar historial");
    const movimientos = await res.json();

    let html = `
        <div class="modal-header border-0 bg-primary text-white">
            <h5 class="modal-title fw-bold"><i class="bi bi-clock-history"></i> Historial de Movimientos</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="timeline p-3">
    `;

    if (movimientos.length === 0) {
        html += '<p class="text-center text-muted">No se registran movimientos para este alumno.</p>';
    } else {
        movimientos.forEach(m => {
            const fecha = new Date(m.created_at).toLocaleString();
            let badgeClass = 'bg-secondary';
            if (m.tipo_movimiento === 'alta') badgeClass = 'bg-success';
            if (m.tipo_movimiento === 'matriculacion') badgeClass = 'bg-primary';
            if (m.tipo_movimiento === 'pase_curso') badgeClass = 'bg-warning text-dark';
            if (m.tipo_movimiento === 'baja_inscripcion') badgeClass = 'bg-danger';

            let detalleStr = '';
            try {
                const det = m.detalle;
                if (det.curso_nombre) {
                    detalleStr = `Curso: <strong>${det.curso_nombre}</strong> (Ciclo ${det.anio_lectivo})`;
                } else if (det.curso_origen_nombre && det.curso_destino_nombre) {
                    detalleStr = `Traslado de <strong>${det.curso_origen_nombre}</strong> a <strong>${det.curso_destino_nombre}</strong>`;
                } else {
                    detalleStr = det.detalle || '';
                }
            } catch (e) {
                detalleStr = m.detalle || '';
            }

            html += `
                <div class="border-left pb-4 ps-4 position-relative" style="border-left: 3px solid #dee2e6; margin-left: 10px;">
                    <div class="position-absolute bg-white border rounded-circle d-flex align-items-center justify-content-center" 
                         style="width: 24px; height: 24px; left: -14px; top: 0;">
                        <i class="bi bi-circle-fill text-primary" style="font-size: 8px;"></i>
                    </div>
                    <span class="badge ${badgeClass} mb-1">${m.tipo_movimiento.toUpperCase()}</span>
                    <p class="mb-1 text-dark">${detalleStr}</p>
                    <small class="text-muted"><i class="bi bi-calendar"></i> ${fecha} | Realizado por: <b>${m.usuario_nombre || 'Sistema'}</b></small>
                </div>
            `;
        });
    }

    html += `
            </div>
        </div>
        <div class="modal-footer border-0">
            <button class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
        </div>
    `;

    document.getElementById("modalHistorialReemplazosContent").innerHTML = html;
    modalHistorialReemplazos.show();
}

// --- MATERIAS ADEUDADAS ACCIONES ---
async function abrirModalCargarMateria() {
    // Cargar materias
    const res = await api.get("/api/v1/materias");
    if (!res.ok) return alert("Error al cargar materias");
    const materias = await res.json();

    let options = '<option value="">-- Seleccione Materia --</option>';
    materias.forEach(m => {
        options += `<option value="${m.id}">${m.nombre}</option>`;
    });
    document.getElementById("materiaAdeudadaId").innerHTML = options;
    document.getElementById("materiaAdeudadaEstado").value = "pendiente";

    modalMateriaAdeudada.show();
}

async function guardarMateriaAdeudada() {
    const data = {
        alumno_id: alumnoDataActivo.id,
        materia_id: parseInt(document.getElementById("materiaAdeudadaId").value),
        estado: document.getElementById("materiaAdeudadaEstado").value
    };

    if (!data.materia_id) return alert("Seleccione una materia");

    const res = await api.post("/api/v1/alumnos/materias-adeudadas", data);
    if (res.ok) {
        modalMateriaAdeudada.hide();
        verFichaAlumno(alumnoDataActivo.id);
    } else {
        const err = await res.json();
        alert(`Error: ${api.getErrorMessage(err)}`);
    }
}

async function cambiarEstadoMateria(id, nuevoEstado) {
    const res = await api.put(`/api/v1/alumnos/materias-adeudadas/${id}`, { estado: nuevoEstado });
    if (res.ok) {
        verFichaAlumno(alumnoDataActivo.id);
    } else {
        const err = await res.json();
        alert(`Error: ${api.getErrorMessage(err)}`);
    }
}

async function eliminarMateriaAdeudada(id) {
    if (!confirm("¿Está seguro de eliminar este registro de materia adeudada?")) return;

    const res = await api.delete(`/api/v1/alumnos/materias-adeudadas/${id}`);
    if (res.ok) {
        verFichaAlumno(alumnoDataActivo.id);
    } else {
        const err = await res.json();
        alert(`Error: ${api.getErrorMessage(err)}`);
    }
}
