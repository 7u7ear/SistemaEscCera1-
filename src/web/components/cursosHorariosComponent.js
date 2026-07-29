// ============================
// MODULO CURSOS Y HORARIOS
// ============================

let cursoActivoId = null;
let cursosListGlobal = [];

async function verCursosHorarios() {
    const container = document.getElementById("seccion-cursos_horarios");
    container.innerHTML = `
        <div class="row g-4">
            <!-- Columna Izquierda: Listado de Cursos -->
            <div class="col-md-3 no-print">
                <div class="card p-3 shadow-sm border-0 h-100 bg-white">
                    <h5 class="fw-bold mb-3 text-primary"><i class="bi bi-folder-fill"></i> Cursos</h5>
                    <div class="list-group list-group-flush" id="listaCursosSidebar" style="max-height: 70vh; overflow-y: auto;">
                        <div class="text-center p-3"><div class="spinner-border spinner-border-sm text-primary"></div></div>
                    </div>
                </div>
            </div>

            <!-- Columna Derecha: Horario y Alumnos del Curso Seleccionado -->
            <div class="col-md-9">
                <div id="detalleCursoCard" class="card p-4 shadow-sm border-0 bg-white h-100" style="display: none;">
                    <!-- Cabecera del Detalle -->
                    <div class="d-flex justify-content-between align-items-start mb-4 border-bottom pb-3 no-print">
                        <div>
                            <h3 class="fw-bold mb-1 text-dark" id="cursoDetalleTitulo">1º 1º B.E.C</h3>
                            <p class="text-muted small mb-0" id="cursoDetalleSubtitulo">Especialidad: Computación | Turno Mañana</p>
                        </div>
                    </div>

                    <!-- Pestañas de Navegación -->
                    <ul class="nav nav-tabs mb-4 no-print" id="cursoTabs" role="tablist">
                        <li class="nav-item">
                            <button class="nav-link active fw-bold" id="tab-alumnos" data-bs-toggle="tab" data-bs-target="#panel-alumnos" type="button">
                                <i class="bi bi-people me-1"></i> Lista de Estudiantes
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link fw-bold" id="tab-horario" data-bs-toggle="tab" data-bs-target="#panel-horario" type="button">
                                <i class="bi bi-calendar3 me-1"></i> Horario Semanal
                            </button>
                        </li>
                    </ul>

                    <!-- Contenido de las Pestañas -->
                    <div class="tab-content" id="cursoTabsContent">
                        <!-- Panel Alumnos -->
                        <div class="tab-pane fade show active" id="panel-alumnos" role="tabpanel">
                            <div class="row g-3 align-items-center justify-content-between mb-3 no-print bg-light p-3 rounded">
                                <div class="col-auto d-flex align-items-center gap-2">
                                    <label class="col-form-label fw-bold text-muted small mb-0">Año Lectivo:</label>
                                    <select class="form-select form-select-sm fw-bold text-dark" id="selectAnioLectivoCurso" onchange="cargarAlumnosDelCursoActivo()">
                                        <option value="2026">2026</option>
                                        <option value="2025">2025</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>
                                <div class="col-auto d-flex gap-2">
                                    <button type="button" class="btn btn-sm btn-outline-dark fw-bold shadow-sm" onclick="window.imprimirListaAlumnos('nombres')">
                                        <i class="bi bi-person me-1"></i> Solo Nombres
                                    </button>
                                    <button type="button" class="btn btn-sm btn-dark fw-bold shadow-sm" onclick="window.imprimirListaAlumnos('dni')">
                                        <i class="bi bi-person-lines-fill me-1"></i> Con DNI
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-dark fw-bold shadow-sm" onclick="window.imprimirListaAlumnos('completo')">
                                        <i class="bi bi-envelope-at me-1"></i> DNI y Email
                                    </button>
                                </div>
                            </div>
                            <div class="table-responsive" id="listaAlumnosCursoContainer">
                                <div class="text-center p-5"><div class="spinner-border text-primary"></div></div>
                            </div>
                        </div>

                        <!-- Panel Horario -->
                        <div class="tab-pane fade" id="panel-horario" role="tabpanel">
                            <div class="d-flex justify-content-end mb-3 no-print bg-light p-3 rounded">
                                <button type="button" class="btn btn-sm btn-dark fw-bold shadow-sm" onclick="window.imprimirGrillaHoraria()">
                                    <i class="bi bi-printer me-1"></i> Imprimir Horario Semanal
                                </button>
                            </div>
                            <div class="table-responsive" id="grillaHorariaContainer">
                                <div class="text-center p-5"><div class="spinner-border text-primary"></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="sinCursoSeleccionado" class="card p-5 shadow-sm border-0 bg-white h-100 d-flex flex-column align-items-center justify-content-center text-center text-muted no-print">
                    <i class="bi bi-calendar3 display-1 mb-3 text-secondary"></i>
                    <h5 class="fw-bold">Seleccione un curso del panel izquierdo</h5>
                    <p class="small">Aquí podrá visualizar el horario dinámico y gestionar las listas de alumnos matriculados.</p>
                </div>
            </div>
        </div>

        <style id="estiloImpresionCurso">
            @media print {
                body { background: white !important; }
                .no-print, .sidebar, .main-content > header, .btn, .dropdown, #titulo, #userInfo, hr { display: none !important; }
                .main-content { margin-left: 0 !important; padding: 0 !important; margin-top: 0 !important; width: 100% !important; }
                .col-md-9 { width: 100% !important; flex: 0 0 100% !important; max-width: 100% !important; }
                .card { border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; }
                .view-section.active { display: block !important; width: 100% !important; }
                
                /* Comportamiento según el elemento a imprimir */
                body.imprimir-solo-horario #panel-alumnos { display: none !important; }
                body.imprimir-solo-horario #panel-horario { display: block !important; width: 100% !important; opacity: 1 !important; visibility: visible !important; }
                
                body.imprimir-solo-alumnos #panel-horario { display: none !important; }
                body.imprimir-solo-alumnos #panel-alumnos { display: block !important; width: 100% !important; opacity: 1 !important; visibility: visible !important; }
                
                /* Formato del Horario Semanal en Impresión */
                table.tabla-horario-print {
                    width: 100% !important;
                    border-collapse: collapse !important;
                    table-layout: fixed !important;
                }
                table.tabla-horario-print th, table.tabla-horario-print td {
                    border: 1px solid #000 !important;
                    padding: 8px 4px !important;
                    font-size: 8pt !important;
                    text-align: center !important;
                    vertical-align: middle !important;
                    word-wrap: break-word !important;
                }
                table.tabla-horario-print th {
                    background-color: #f0f0f0 !important;
                    -webkit-print-color-adjust: exact;
                }

                /* Formato de la Lista de Alumnos en Impresión */
                table.tabla-alumnos-print {
                    width: 100% !important;
                    border-collapse: collapse !important;
                }
                table.tabla-alumnos-print th, table.tabla-alumnos-print td {
                    border: 1px solid #000 !important;
                    padding: 8px 6px !important;
                    font-size: 9pt !important;
                }
                table.tabla-alumnos-print th {
                    background-color: #f0f0f0 !important;
                    -webkit-print-color-adjust: exact;
                }
            }
        </style>
    `;

    await cargarCursosList();

    // Escuchar cambios de pestaña para actualizar menú de impresión dinámicamente
    const tabAlumnos = document.getElementById("tab-alumnos");
    const tabHorario = document.getElementById("tab-horario");

    if (tabAlumnos) {
        tabAlumnos.addEventListener("click", () => actualizarMenuImpresion('alumnos'));
        tabAlumnos.addEventListener("shown.bs.tab", () => actualizarMenuImpresion('alumnos'));
    }
    if (tabHorario) {
        tabHorario.addEventListener("click", () => actualizarMenuImpresion('horario'));
        tabHorario.addEventListener("shown.bs.tab", () => actualizarMenuImpresion('horario'));
    }

    actualizarMenuImpresion('alumnos');
}

function actualizarMenuImpresion(pestaña) {
    const menu = document.getElementById("menuOpcionesImpresion");
    if (!menu) return;

    if (pestaña === 'horario') {
        menu.innerHTML = `
            <li>
                <button type="button" class="dropdown-item fw-bold text-dark py-2" id="btnImpHorario">
                    <i class="bi bi-calendar3 text-primary me-2"></i> Imprimir Horario Semanal
                </button>
            </li>
        `;
        document.getElementById("btnImpHorario")?.addEventListener("click", (e) => {
            e.preventDefault();
            lanzarImpresionConRetardo('horario');
        });
    } else {
        menu.innerHTML = `
            <li>
                <button type="button" class="dropdown-item fw-bold text-dark py-2" id="btnImpAlumnosDni">
                    <i class="bi bi-person-lines-fill text-primary me-2"></i> Imprimir Alumnos (con DNI)
                </button>
            </li>
            <li>
                <button type="button" class="dropdown-item fw-bold text-dark py-2" id="btnImpAlumnosEmail">
                    <i class="bi bi-envelope-at text-primary me-2"></i> Imprimir Alumnos (DNI y Email)
                </button>
            </li>
        `;
        document.getElementById("btnImpAlumnosDni")?.addEventListener("click", (e) => {
            e.preventDefault();
            lanzarImpresionConRetardo('alumnos-dni');
        });
        document.getElementById("btnImpAlumnosEmail")?.addEventListener("click", (e) => {
            e.preventDefault();
            lanzarImpresionConRetardo('alumnos-email');
        });
    }
}

function lanzarImpresionConRetardo(tipo) {
    const btnDrop = document.getElementById("btnDropdownImpresion");
    if (btnDrop && typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
        const instance = bootstrap.Dropdown.getInstance(btnDrop);
        if (instance) instance.hide();
    }
    setTimeout(() => {
        imprimirElemento(tipo);
    }, 150);
}

async function cargarCursosList() {
    const res = await api.get("/api/v1/cursos");
    if (!res.ok) return;
    cursosListGlobal = await res.json();

    const sidebar = document.getElementById("listaCursosSidebar");
    if (cursosListGlobal.length === 0) {
        sidebar.innerHTML = '<p class="text-center text-muted p-3">No hay cursos.</p>';
        return;
    }

    // 1. Agrupar por Modalidad
    const porModalidad = {};
    cursosListGlobal.forEach(c => {
        const mod = (c.modalidad || c.especialidad || 'General').toUpperCase().trim();
        if (!porModalidad[mod]) porModalidad[mod] = [];
        porModalidad[mod].push(c);
    });

    // Ordenar explícitamente: 1. B.E.C, 2. T.C.A, 3. AUX
    const ordenPrioridad = ['B.E.C', 'T.C.A', 'AUX'];
    const modalidadesOrdenadas = Object.entries(porModalidad).sort(([a], [b]) => {
        let idxA = ordenPrioridad.findIndex(p => a.includes(p));
        let idxB = ordenPrioridad.findIndex(p => b.includes(p));
        if (idxA === -1) idxA = 99;
        if (idxB === -1) idxB = 99;
        return idxA - idxB;
    });

    let html = '<div class="accordion accordion-flush" id="accModalidades">';
    let modIndex = 0;

    for (const [modName, cursosMod] of modalidadesOrdenadas) {
        const modCollapseId = `collapse-mod-${modIndex}`;
        const modHeadingId = `heading-mod-${modIndex}`;
        const isModTcaOrAux = modName.includes('T.C.A') || modName.includes('AUX');

        html += `
            <div class="accordion-item border-0 mb-2">
                <h2 class="accordion-header" id="${modHeadingId}">
                    <button class="accordion-button collapsed fw-bold text-dark py-2 px-2 bg-light rounded text-uppercase small shadow-sm" 
                            type="button" data-bs-toggle="collapse" data-bs-target="#${modCollapseId}">
                        <i class="bi bi-folder-fill me-2 text-primary"></i> ${modName} <span class="badge bg-secondary ms-auto me-2">${cursosMod.length}</span>
                    </button>
                </h2>
                <div id="${modCollapseId}" class="accordion-collapse collapse" data-bs-parent="#accModalidades">
                    <div class="accordion-body p-1 pt-2">
        `;

        if (isModTcaOrAux) {
            // Estructura para T.C.A y AUX: Subgrupos por TURNO (MAÑANA -> TARDE -> NOCHE) -> Año/División
            const porTurno = {};
            cursosMod.forEach(c => {
                const tur = (c.turno || 'Sin Turno').toUpperCase().trim();
                if (!porTurno[tur]) porTurno[tur] = [];
                porTurno[tur].push(c);
            });

            const ordenTurnos = ['MAÑANA', 'TARDE', 'NOCHE'];
            const turnosOrdenados = Object.entries(porTurno).sort(([a], [b]) => {
                let idxA = ordenTurnos.findIndex(t => a.includes(t));
                let idxB = ordenTurnos.findIndex(t => b.includes(t));
                if (idxA === -1) idxA = 99;
                if (idxB === -1) idxB = 99;
                return idxA - idxB;
            });

            html += `<div class="accordion accordion-flush" id="accSubTurnos-${modIndex}">`;
            let turIndex = 0;
            for (const [turName, cursosTur] of turnosOrdenados) {
                const turCollapseId = `collapse-tur-${modIndex}-${turIndex}`;
                const turHeadingId = `heading-tur-${modIndex}-${turIndex}`;

                html += `
                    <div class="accordion-item border-0 mb-1 ps-2">
                        <h2 class="accordion-header" id="${turHeadingId}">
                            <button class="accordion-button collapsed fw-bold text-muted py-1 px-2 bg-white text-uppercase" style="font-size:0.75rem;" 
                                    type="button" data-bs-toggle="collapse" data-bs-target="#${turCollapseId}">
                                <i class="bi bi-clock me-1 text-info"></i> Turno ${turName} (${cursosTur.length})
                            </button>
                        </h2>
                        <div id="${turCollapseId}" class="accordion-collapse collapse" data-bs-parent="#accSubTurnos-${modIndex}">
                            <div class="accordion-body p-1">
                                <div class="list-group list-group-flush">
                `;

                cursosTur.forEach(c => {
                    const anioStr = c.anio ? (c.anio.includes('°') ? c.anio : `${c.anio}°`) : '';
                    const divStr = c.division ? (c.division.includes('°') ? ` ${c.division}` : ` ${c.division}°`) : '';
                    const espStr = (c.especialidad && c.especialidad.trim() !== '') ? ` (${c.especialidad})` : '';

                    html += `
                        <button class="list-group-item list-group-item-action border-0 rounded mb-1 py-1 px-2 fw-semibold" 
                                id="btn-sidebar-curso-${c.id}"
                                onclick="seleccionarCurso(${c.id})">
                            <span class="small"><i class="bi bi-mortarboard text-secondary me-1"></i> ${anioStr}${divStr}${espStr}</span>
                        </button>
                    `;
                });

                html += `
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                turIndex++;
            }
            html += `</div>`;

        } else {
            // Estructura para B.E.C: Subgrupos por AÑO -> División
            const porAnio = {};
            cursosMod.forEach(c => {
                const anioKey = (c.anio || 'General').trim();
                const anioLabel = anioKey.includes('º') || anioKey.includes('°') ? `${anioKey} Año` : `${anioKey}° Año`;
                if (!porAnio[anioLabel]) porAnio[anioLabel] = [];
                porAnio[anioLabel].push(c);
            });

            html += `<div class="accordion accordion-flush" id="accSubAnio-${modIndex}">`;
            let anioIndex = 0;
            for (const [anioName, cursosAnio] of Object.entries(porAnio)) {
                const anioCollapseId = `collapse-anio-${modIndex}-${anioIndex}`;
                const anioHeadingId = `heading-anio-${modIndex}-${anioIndex}`;

                html += `
                    <div class="accordion-item border-0 mb-1 ps-2">
                        <h2 class="accordion-header" id="${anioHeadingId}">
                            <button class="accordion-button collapsed fw-bold text-muted py-1 px-2 bg-white text-uppercase" style="font-size:0.75rem;" 
                                    type="button" data-bs-toggle="collapse" data-bs-target="#${anioCollapseId}">
                                <i class="bi bi-calendar-event me-1 text-primary"></i> ${anioName} (${cursosAnio.length})
                            </button>
                        </h2>
                        <div id="${anioCollapseId}" class="accordion-collapse collapse" data-bs-parent="#accSubAnio-${modIndex}">
                            <div class="accordion-body p-1">
                                <div class="list-group list-group-flush">
                `;

                cursosAnio.forEach(c => {
                    const divStr = c.division ? (c.division.includes('°') ? `Div. ${c.division}` : `Div. ${c.division}°`) : 'Única div.';

                    html += `
                        <button class="list-group-item list-group-item-action border-0 rounded mb-1 py-1 px-2 fw-semibold" 
                                id="btn-sidebar-curso-${c.id}"
                                onclick="seleccionarCurso(${c.id})">
                            <span class="small"><i class="bi bi-mortarboard text-secondary me-1"></i> ${divStr}</span>
                        </button>
                    `;
                });

                html += `
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                anioIndex++;
            }
            html += `</div>`;
        }

        html += `
                    </div>
                </div>
            </div>
        `;
        modIndex++;
    }

    html += '</div>';
    sidebar.innerHTML = html;
}

function seleccionarCurso(id) {
    cursoActivoId = id;
    
    // Activar botón en el sidebar
    document.querySelectorAll("#listaCursosSidebar .list-group-item").forEach(btn => {
        btn.classList.remove("active", "bg-primary", "text-white");
    });
    const activeBtn = document.getElementById(`btn-sidebar-curso-${id}`);
    if (activeBtn) {
        activeBtn.classList.add("active", "bg-primary", "text-white");
    }

    // Mostrar panel de detalle
    document.getElementById("sinCursoSeleccionado").style.display = "none";
    document.getElementById("detalleCursoCard").style.display = "block";

    // Configurar cabecera
    const curso = cursosListGlobal.find(c => c.id === id);
    const divStr = curso.division ? ` ${curso.division}` : '';
    document.getElementById("cursoDetalleTitulo").innerText = `${curso.anio}°${divStr} ${curso.especialidad.toUpperCase()}`;
    document.getElementById("cursoDetalleSubtitulo").innerText = `Especialidad: ${curso.especialidad} (${curso.modalidad}) | Turno: ${curso.turno.toUpperCase()}`;

    // Cargar horario y alumnos
    actualizarMenuImpresion('alumnos');
    cargarHorarioDelCurso();
    cargarAlumnosDelCursoActivo();
}

async function cargarHorarioDelCurso() {
    const container = document.getElementById("grillaHorariaContainer");
    container.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary"></div></div>';

    const curso = cursosListGlobal.find(c => c.id === cursoActivoId);
    
    try {
        // 1. Obtener bloques horarios del turno
        const resBloques = await api.get(`/api/v1/bloques-horarios?turno=${curso.turno}`);
        if (!resBloques.ok) throw new Error("Error al obtener bloques horarios");
        const bloques = await resBloques.json();

        // 2. Obtener la distribución de horas del curso
        const resHorario = await api.get(`/api/v1/cursos/${cursoActivoId}/horario`);
        if (!resHorario.ok) throw new Error("Error al obtener la distribución del curso");
        const horarioData = await resHorario.json();

        if (bloques.length === 0) {
            container.innerHTML = '<p class="text-center text-muted p-4">No hay bloques horarios configurados para el turno de este curso.</p>';
            return;
        }

        // Armamos la grilla HTML
        let html = `
            <!-- Encabezado exclusivo de Impresión -->
            <div class="d-none d-print-block text-center mb-4">
                <h3 class="fw-bold mb-1">E.S.E.A en Ceramica Nº1 D.E II</h3>
                <h4 class="mb-0">HORARIO SEMANAL: ${curso.anio}°${curso.division || ''} ${curso.especialidad.toUpperCase()}</h4>
                <p class="text-muted small">Turno: ${curso.turno.toUpperCase()}</p>
                <hr style="border-top: 2px solid #000; margin: 15px 0;">
            </div>

            <table class="table table-bordered align-middle text-center tabla-horario-print">
                <thead class="table-light">
                    <tr>
                        <th style="width: 15%;">Hora / Módulo</th>
                        <th style="width: 17%;">Lunes</th>
                        <th style="width: 17%;">Martes</th>
                        <th style="width: 17%;">Miércoles</th>
                        <th style="width: 17%;">Jueves</th>
                        <th style="width: 17%;">Viernes</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];

        bloques.forEach(bloque => {
            const hInicio = bloque.hora_inicio.substring(0, 5);
            const hFin = bloque.hora_fin.substring(0, 5);

            if (bloque.es_recreo) {
                html += `
                    <tr class="table-light text-muted fw-bold" style="background-color: #f8f9fa !important;">
                        <td>${hInicio} a ${hFin}</td>
                        <td colspan="5" class="text-uppercase tracking-wider small py-1" style="background-color: #f1f3f5 !important; letter-spacing: 2px;">RECREO</td>
                    </tr>
                `;
            } else {
                html += `<tr><td class="fw-bold">${hInicio} a ${hFin}</td>`;

                diasSemana.forEach(dia => {
                    const diaNorm = dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    // Buscar si hay clases cargadas en este bloque y día (por solapamiento de horario)
                    const clases = horarioData.filter(h => {
                        const hDiaNorm = (h.dia || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        return hDiaNorm === diaNorm &&
                            h.hora_ingreso < bloque.hora_fin &&
                            h.hora_egreso > bloque.hora_inicio;
                    });

                    if (clases.length === 0) {
                        html += '<td class="text-muted small">-</td>';
                    } else {
                        html += '<td>';
                        clases.forEach((c, idx) => {
                            if (idx > 0) html += '<hr class="my-2 opacity-25">';
                            
                            const docente = c.docente_display || 'VACANTE';
                            const situacion = c.situacion_revista ? `(${c.situacion_revista[0].toUpperCase()})` : '';

                            // Si es suplente, permitimos ver la cadena
                            let docenteLink = `<strong>${docente}</strong> ${situacion}`;
                            if (c.situacion_revista === 'suplente' && c.cargo_docente_id) {
                                docenteLink = `<a href="javascript:void(0)" class="text-primary fw-bold text-decoration-none" onclick="verCadenaCargoPorDocente(${c.cargo_id})">${docente} <i class="bi bi-info-circle small"></i></a> ${situacion}`;
                            }

                            html += `
                                <div class="p-1">
                                    <div class="fw-bold text-dark small text-uppercase" style="line-height:1.2;">${c.materia_nombre}</div>
                                    <div class="text-muted small mt-1" style="font-size:0.75rem;">${docenteLink}</div>
                                    <div class="mt-1"><span class="badge bg-light text-secondary border small" style="font-size:0.6rem;">Puesto ${c.numero_puesto}</span></div>
                                </div>
                            `;
                        });
                        html += '</td>';
                    }
                });

                html += '</tr>';
            }
        });

        html += '</tbody></table>';
        container.innerHTML = html;

    } catch (err) {
        container.innerHTML = `<div class="alert alert-danger">Error al armar el horario: ${err.message}</div>`;
    }
}

async function cargarAlumnosDelCursoActivo() {
    const container = document.getElementById("listaAlumnosCursoContainer");
    container.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary"></div></div>';

    const anioLectivo = document.getElementById("selectAnioLectivoCurso").value;

    try {
        const res = await api.get(`/api/v1/alumnos/curso/${cursoActivoId}?anioLectivo=${anioLectivo}`);
        if (!res.ok) throw new Error("Error al obtener listado de alumnos");
        const alumnos = await res.json();

        const curso = cursosListGlobal.find(c => c.id === cursoActivoId);
        const divStr = curso.division ? ` ${curso.division}` : '';

        let html = `
            <!-- Encabezado de Impresión -->
            <div class="d-none d-print-block mb-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h3 class="fw-bold mb-1">E.S.E.A en Ceramica Nº1 D.E II</h3>
                        <h4 class="mb-0">LISTA DE ESTUDIANTES: ${curso.anio}°${divStr} ${curso.especialidad.toUpperCase()}</h4>
                    </div>
                    <div class="text-end">
                        <h5 class="fw-bold mb-0">Ciclo Lectivo: ${anioLectivo}</h5>
                        <p class="text-muted small mb-0">Turno: ${curso.turno.toUpperCase()}</p>
                    </div>
                </div>
                <hr style="border-top: 2px solid #000; margin: 15px 0;">
            </div>
        `;

        if (alumnos.length === 0) {
            html += `<p class="text-center p-4 text-muted">No se registran alumnos inscritos para el ciclo lectivo ${anioLectivo}.</p>`;
            container.innerHTML = html;
            return;
        }

        html += `
            <table class="table table-striped align-middle tabla-alumnos-print">
                <thead class="table-light">
                    <tr>
                        <th style="width: 5%">#</th>
                        <th style="width: 40%">Apellido y Nombre</th>
                        <th class="col-dni" style="width: 25%">DNI</th>
                        <th class="col-email" style="width: 30%">Email</th>
                    </tr>
                </thead>
                <tbody>
        `;

        alumnos.forEach((a, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${a.apellido}, ${a.nombre}</strong></td>
                    <td class="col-dni">${a.dni}</td>
                    <td class="col-email">${a.email || '-'}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;

    } catch (err) {
        container.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
    }
}

// --- CADENA DE REEMPLAZOS POR CARGO ---
async function verCadenaCargoPorDocente(cargoId) {
    const res = await api.get(`/api/v1/cargos/${cargoId}/cadena-activa`);
    if (!res.ok) return alert("Error al cargar la cadena de reemplazos del puesto");
    const cadena = await res.json();

    let html = `
        <div class="modal-header border-0 bg-dark text-white">
            <h5 class="modal-title fw-bold"><i class="bi bi-shield-lock-fill"></i> Cadena de Reemplazos (Puesto ${cargoId})</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-4">
            <h6 class="fw-bold mb-3 text-muted small">Línea de Asignación Activa en este Puesto:</h6>
            <div class="list-group list-group-flush">
    `;

    if (cadena.length === 0) {
        html += '<p class="text-center text-muted p-3">El cargo está actualmente vacante.</p>';
    } else {
        cadena.forEach((cd, index) => {
            let badgeClass = 'bg-primary';
            if (cd.situacion_revista === 'titular') badgeClass = 'bg-success';
            if (cd.situacion_revista === 'suplente') badgeClass = 'bg-warning text-dark';

            let desc = '';
            if (cd.estado === 'licencia') {
                desc = `<span class="badge bg-danger ms-2">DE LICENCIA (${cd.licencia_actual || 'Artículo'})</span>`;
            } else if (cd.estado === 'activo') {
                desc = `<span class="badge bg-success ms-2">ACTIVO (FRENTE A CLASE)</span>`;
            }

            html += `
                <div class="list-group-item py-3 px-0 border-0 border-bottom">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="fw-bold text-dark" style="font-size:1.05rem;">${cd.docente_nombre}</span>
                        <span class="badge ${badgeClass}">${cd.situacion_revista.toUpperCase()}</span>
                    </div>
                    <div class="small text-muted">
                        DNI: ${cd.docente_dni} | Desde: ${new Date(cd.fecha_inicio).toLocaleDateString()} ${desc}
                    </div>
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

// --- IMPRESIÓN DIRECTA ---
window.imprimirGrillaHoraria = function() {
    const el = document.getElementById("grillaHorariaContainer");
    if (!el || el.querySelector(".spinner-border")) {
        alert("El horario aún no está cargado. Seleccione un curso válido.");
        return;
    }
    const clon = el.cloneNode(true);
    clon.querySelectorAll('.d-none').forEach(e => e.style.display = 'block');
    clon.querySelectorAll('.d-print-block').forEach(e => e.style.display = 'block');

    const area = document.createElement('div');
    area.id = 'areaPrintTemp';
    area.appendChild(clon);
    document.body.appendChild(area);

    const style = document.createElement('style');
    style.id = 'stylePrintTemp';
    style.innerHTML = `
        @media screen { #areaPrintTemp { display: none !important; } }
        @media print {
            body > *:not(#areaPrintTemp) { display: none !important; }
            #areaPrintTemp { display: block !important; padding: 15px; }
            table { width: 100% !important; border-collapse: collapse !important; table-layout: fixed !important; }
            th, td { border: 1px solid #000 !important; padding: 6px 4px !important; font-size: 8.5pt !important; text-align: center !important; vertical-align: middle !important; word-wrap: break-word !important; }
            th { background-color: #f0f0f0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { margin: 1cm; }
        }
    `;
    document.head.appendChild(style);

    window.print();

    setTimeout(() => {
        area.remove();
        style.remove();
    }, 1000);
};

window.imprimirListaAlumnos = function(modo) {
    const el = document.getElementById("listaAlumnosCursoContainer");
    if (!el || el.querySelector(".spinner-border")) {
        alert("La lista de estudiantes aún no está cargada.");
        return;
    }
    const clon = el.cloneNode(true);
    
    if (modo === 'nombres') {
        clon.querySelectorAll('.col-dni').forEach(e => e.style.display = 'none');
        clon.querySelectorAll('.col-email').forEach(e => e.style.display = 'none');
    } else if (modo === 'dni' || modo === false) {
        clon.querySelectorAll('.col-email').forEach(e => e.style.display = 'none');
    }

    clon.querySelectorAll('.d-none').forEach(e => e.style.display = 'block');
    clon.querySelectorAll('.d-print-block').forEach(e => e.style.display = 'block');

    const area = document.createElement('div');
    area.id = 'areaPrintTemp';
    area.appendChild(clon);
    document.body.appendChild(area);

    const style = document.createElement('style');
    style.id = 'stylePrintTemp';
    style.innerHTML = `
        @media screen { #areaPrintTemp { display: none !important; } }
        @media print {
            body > *:not(#areaPrintTemp) { display: none !important; }
            #areaPrintTemp { display: block !important; padding: 15px; }
            table { width: 100% !important; border-collapse: collapse !important; }
            th, td { border: 1px solid #000 !important; padding: 6px 4px !important; font-size: 8.5pt !important; text-align: left !important; vertical-align: middle !important; word-wrap: break-word !important; }
            th { background-color: #f0f0f0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; text-align: center !important; }
            @page { margin: 1cm; }
        }
    `;
    document.head.appendChild(style);

    window.print();

    setTimeout(() => {
        area.remove();
        style.remove();
    }, 1000);
};
