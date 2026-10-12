// ============================
// MODULO CURSOS Y HORARIOS
// ============================

let cursoActivoId = null;
let cursosListGlobal = [];
let cursoPreceptorActualId = null;
let dataEmailsCursoGlobal = null;
let dataDocentesCursoGlobal = null;

// Sanitiza el año/división: evita duplicación de símbolos ordinales (ej: 1º° -> 1º)
function fmtOrdinal(val) {
    if (!val && val !== 0) return '';
    const clean = String(val).trim().replace(/[°º]+$/g, '');
    return clean ? `${clean}º` : '';
}

function fmtAnio(val) {
    return fmtOrdinal(val);
}

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
                    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 no-print flex-wrap gap-2">
                        <div>
                            <h3 class="fw-bold mb-1 text-dark" id="cursoDetalleTitulo">1º 1º B.E.C</h3>
                            <p class="text-muted small mb-0" id="cursoDetalleSubtitulo">Especialidad: Computación | Turno Mañana</p>
                        </div>
                        <div class="d-flex align-items-center bg-light px-3 py-2 rounded border gap-2">
                            <div class="text-end">
                                <span class="d-block text-muted text-uppercase fw-bold" style="font-size: 0.7rem; letter-spacing: 0.5px;">Preceptor/a</span>
                                <span id="cursoPreceptorNombre" class="text-muted small fst-italic">Sin asignar</span>
                            </div>
                            <button type="button" class="btn btn-sm btn-outline-primary fw-semibold" id="btnAsignarPreceptor" onclick="abrirModalAsignarPreceptor()" title="Asignar o cambiar preceptor">
                                <i class="bi bi-person-gear me-1"></i> Asignar
                            </button>
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
                        <li class="nav-item">
                            <button class="nav-link fw-bold" id="tab-docentes-curso" data-bs-toggle="tab" data-bs-target="#panel-docentes-curso" type="button">
                                <i class="bi bi-person-badge me-1"></i> Docentes Asignados
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link fw-bold" id="tab-emails-curso" data-bs-toggle="tab" data-bs-target="#panel-emails-curso" type="button">
                                <i class="bi bi-envelope-at me-1"></i> Mails del Curso
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
                                    <select class="form-select form-select-sm fw-bold text-dark" id="selectAnioLectivoCurso" onchange="onCambioAnioLectivoCurso()">
                                        <option value="2026">2026</option>
                                        <option value="2025">2025</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>
                                <div class="col-auto d-flex gap-2">
                                    <button type="button" class="btn btn-sm btn-outline-primary fw-bold" onclick="window.imprimirListaAlumnos('nombres')">
                                        <i class="bi bi-person me-1"></i> Solo Nombres
                                    </button>
                                    <button type="button" class="btn btn-sm btn-primary fw-bold" onclick="window.imprimirListaAlumnos('dni')">
                                        <i class="bi bi-person-lines-fill me-1"></i> Con DNI
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-primary fw-bold" onclick="window.imprimirListaAlumnos('completo')">
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
                                <button type="button" class="btn btn-sm btn-primary fw-bold" onclick="window.imprimirGrillaHoraria()">
                                    <i class="bi bi-printer me-1"></i> Imprimir Horario Semanal
                                </button>
                            </div>
                            <div class="table-responsive" id="grillaHorariaContainer">
                                <div class="text-center p-5"><div class="spinner-border text-primary"></div></div>
                            </div>
                        </div>

                        <!-- Panel Docentes Asignados -->
                        <div class="tab-pane fade" id="panel-docentes-curso" role="tabpanel">
                            <div class="d-flex justify-content-between align-items-center mb-3 no-print bg-light p-3 rounded flex-wrap gap-2">
                                <div>
                                    <h6 class="fw-bold mb-0 text-dark"><i class="bi bi-person-badge text-primary me-2"></i>Planta Docente y Asignaturas</h6>
                                    <span class="text-muted small">Profesores asignados a las materias y preceptor/a a cargo</span>
                                </div>
                                <button type="button" class="btn btn-sm btn-primary fw-bold" onclick="window.imprimirDocentesCurso()">
                                    <i class="bi bi-printer me-1"></i> Imprimir Lista Docente
                                </button>
                            </div>
                            <div class="table-responsive" id="listaDocentesCursoContainer">
                                <div class="text-center p-5"><div class="spinner-border text-primary"></div></div>
                            </div>
                        </div>

                        <!-- Panel Correos del Curso -->
                        <div class="tab-pane fade" id="panel-emails-curso" role="tabpanel">
                            <!-- Métricas resumen de correos -->
                            <div class="row g-3 mb-4 no-print" id="resumenMailsCards">
                                <div class="col-md-4">
                                    <div class="card border-0 bg-primary bg-opacity-10 p-3 rounded-3 shadow-none">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div>
                                                <span class="text-muted small fw-bold text-uppercase">Estudiantes</span>
                                                <h4 class="fw-bold text-primary mb-0 mt-1" id="badgeTotalEstudiantes">0 / 0</h4>
                                                <small class="text-muted" id="badgeSubEstudiantes">con correo electrónico</small>
                                            </div>
                                            <i class="bi bi-mortarboard fs-1 text-primary opacity-50"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card border-0 bg-info bg-opacity-10 p-3 rounded-3 shadow-none">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div>
                                                <span class="text-muted small fw-bold text-uppercase">Padres / Tutores</span>
                                                <h4 class="fw-bold text-info mb-0 mt-1" id="badgeTotalTutores">0 / 0</h4>
                                                <small class="text-muted" id="badgeSubTutores">con correo electrónico</small>
                                            </div>
                                            <i class="bi bi-people fs-1 text-info opacity-50"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card border-0 bg-success bg-opacity-10 p-3 rounded-3 shadow-none">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div>
                                                <span class="text-muted small fw-bold text-uppercase">Docentes</span>
                                                <h4 class="fw-bold text-success mb-0 mt-1" id="badgeTotalDocentes">0 / 0</h4>
                                                <small class="text-muted" id="badgeSubDocentes">con correo electrónico</small>
                                            </div>
                                            <i class="bi bi-person-video3 fs-1 text-success opacity-50"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Navegación de 3 listas independientes -->
                            <ul class="nav nav-pills mb-3 no-print bg-light p-2 rounded gap-2" id="pillsMailsTipo" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active fw-bold btn-sm" id="pill-mails-estudiantes" data-bs-toggle="pill" data-bs-target="#subpanel-mails-estudiantes" type="button">
                                        <i class="bi bi-mortarboard me-1"></i> Estudiantes <span class="badge bg-white text-primary ms-1" id="pillCountEstudiantes">0</span>
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link fw-bold btn-sm" id="pill-mails-tutores" data-bs-toggle="pill" data-bs-target="#subpanel-mails-tutores" type="button">
                                        <i class="bi bi-people me-1"></i> Padres / Tutores <span class="badge bg-white text-info ms-1" id="pillCountTutores">0</span>
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link fw-bold btn-sm" id="pill-mails-docentes" data-bs-toggle="pill" data-bs-target="#subpanel-mails-docentes" type="button">
                                        <i class="bi bi-person-badge me-1"></i> Docentes <span class="badge bg-white text-success ms-1" id="pillCountDocentes">0</span>
                                    </button>
                                </li>
                            </ul>

                            <div class="tab-content" id="pillsMailsContent">
                                <!-- Subpanel Estudiantes -->
                                <div class="tab-pane fade show active" id="subpanel-mails-estudiantes" role="tabpanel">
                                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2 p-2 bg-light rounded no-print">
                                        <div class="d-flex align-items-center gap-2 flex-wrap">
                                            <span class="fw-bold small text-muted">Acciones:</span>
                                            <button type="button" class="btn btn-sm btn-outline-primary fw-semibold" id="btnCopiarEstudiantes" onclick="copiarMails('estudiantes')">
                                                <i class="bi bi-clipboard me-1"></i> Copiar CCO / BCC
                                            </button>
                                            <button type="button" class="btn btn-sm btn-outline-secondary fw-semibold" onclick="descargarMails('estudiantes', 'txt')">
                                                <i class="bi bi-file-earmark-text me-1"></i> Descargar TXT
                                            </button>
                                            <button type="button" class="btn btn-sm btn-outline-success fw-semibold" onclick="descargarMails('estudiantes', 'csv')">
                                                <i class="bi bi-file-earmark-spreadsheet me-1"></i> Descargar CSV
                                            </button>
                                        </div>
                                        <div class="input-group input-group-sm" style="max-width: 250px;">
                                            <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                                            <input type="text" class="form-control" id="filtroMailsEstudiantes" placeholder="Buscar estudiante..." onkeyup="filtrarTablaMails('estudiantes')">
                                        </div>
                                    </div>
                                    <div class="table-responsive" id="tablaMailsEstudiantesContainer">
                                        <div class="text-center p-4"><div class="spinner-border text-primary"></div></div>
                                    </div>
                                </div>

                                <!-- Subpanel Tutores -->
                                <div class="tab-pane fade" id="subpanel-mails-tutores" role="tabpanel">
                                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2 p-2 bg-light rounded no-print">
                                        <div class="d-flex align-items-center gap-2 flex-wrap">
                                            <span class="fw-bold small text-muted">Acciones:</span>
                                            <button type="button" class="btn btn-sm btn-outline-primary fw-semibold" id="btnCopiarTutores" onclick="copiarMails('tutores')">
                                                <i class="bi bi-clipboard me-1"></i> Copiar CCO / BCC
                                            </button>
                                            <button type="button" class="btn btn-sm btn-outline-secondary fw-semibold" onclick="descargarMails('tutores', 'txt')">
                                                <i class="bi bi-file-earmark-text me-1"></i> Descargar TXT
                                            </button>
                                            <button type="button" class="btn btn-sm btn-outline-success fw-semibold" onclick="descargarMails('tutores', 'csv')">
                                                <i class="bi bi-file-earmark-spreadsheet me-1"></i> Descargar CSV
                                            </button>
                                        </div>
                                        <div class="input-group input-group-sm" style="max-width: 250px;">
                                            <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                                            <input type="text" class="form-control" id="filtroMailsTutores" placeholder="Buscar tutor o alumno..." onkeyup="filtrarTablaMails('tutores')">
                                        </div>
                                    </div>
                                    <div class="table-responsive" id="tablaMailsTutoresContainer">
                                        <div class="text-center p-4"><div class="spinner-border text-primary"></div></div>
                                    </div>
                                </div>

                                <!-- Subpanel Docentes -->
                                <div class="tab-pane fade" id="subpanel-mails-docentes" role="tabpanel">
                                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2 p-2 bg-light rounded no-print">
                                        <div class="d-flex align-items-center gap-2 flex-wrap">
                                            <span class="fw-bold small text-muted">Acciones:</span>
                                            <button type="button" class="btn btn-sm btn-outline-primary fw-semibold" id="btnCopiarDocentes" onclick="copiarMails('docentes')">
                                                <i class="bi bi-clipboard me-1"></i> Copiar CCO / BCC
                                            </button>
                                            <button type="button" class="btn btn-sm btn-outline-secondary fw-semibold" onclick="descargarMails('docentes', 'txt')">
                                                <i class="bi bi-file-earmark-text me-1"></i> Descargar TXT
                                            </button>
                                            <button type="button" class="btn btn-sm btn-outline-success fw-semibold" onclick="descargarMails('docentes', 'csv')">
                                                <i class="bi bi-file-earmark-spreadsheet me-1"></i> Descargar CSV
                                            </button>
                                        </div>
                                        <div class="input-group input-group-sm" style="max-width: 250px;">
                                            <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                                            <input type="text" class="form-control" id="filtroMailsDocentes" placeholder="Buscar docente o materia..." onkeyup="filtrarTablaMails('docentes')">
                                        </div>
                                    </div>
                                    <div class="table-responsive" id="tablaMailsDocentesContainer">
                                        <div class="text-center p-4"><div class="spinner-border text-primary"></div></div>
                                    </div>
                                </div>
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

        <!-- Modal Asignar Preceptor -->
        <div class="modal fade" id="modalAsignarPreceptor" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow border-0">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title fs-6 fw-bold"><i class="bi bi-person-badge me-2"></i>Asignar Preceptor al Curso</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body p-4">
                        <p class="small text-muted mb-3" id="modalPreceptorInfo">
                            Seleccione el docente con cargo de preceptor para este curso.
                        </p>
                        <div class="mb-3">
                            <label class="form-label fw-semibold small text-dark" for="selectPreceptoresModal">Preceptor/a a cargo:</label>
                            <select class="form-select" id="selectPreceptoresModal">
                                <option value="">Cargando preceptores...</option>
                            </select>
                            <div class="form-text small">Lista de docentes con cargo activo de preceptor.</div>
                        </div>
                    </div>
                    <div class="modal-footer bg-light">
                        <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-sm btn-primary fw-bold" id="btnGuardarPreceptorModal" onclick="guardarAsignacionPreceptor()">
                            <i class="bi bi-check2-circle me-1"></i> Guardar Asignación
                        </button>
                    </div>
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
                body.imprimir-solo-horario #panel-alumnos,
                body.imprimir-solo-horario #panel-docentes-curso,
                body.imprimir-solo-horario #panel-emails-curso { display: none !important; }
                body.imprimir-solo-horario #panel-horario { display: block !important; width: 100% !important; opacity: 1 !important; visibility: visible !important; }
                
                body.imprimir-solo-alumnos #panel-horario,
                body.imprimir-solo-alumnos #panel-docentes-curso,
                body.imprimir-solo-alumnos #panel-emails-curso { display: none !important; }
                body.imprimir-solo-alumnos #panel-alumnos { display: block !important; width: 100% !important; opacity: 1 !important; visibility: visible !important; }
                
                body.imprimir-solo-docentes #panel-alumnos,
                body.imprimir-solo-docentes #panel-horario,
                body.imprimir-solo-docentes #panel-emails-curso { display: none !important; }
                body.imprimir-solo-docentes #panel-docentes-curso { display: block !important; width: 100% !important; opacity: 1 !important; visibility: visible !important; }

                /* Formato de la Lista de Docentes en Impresión */
                table.tabla-docentes-print {
                    width: 100% !important;
                    border-collapse: collapse !important;
                }
                table.tabla-docentes-print th, table.tabla-docentes-print td {
                    border: 1px solid #000 !important;
                    padding: 8px 6px !important;
                    font-size: 8.5pt !important;
                }
                table.tabla-docentes-print th {
                    background-color: #f0f0f0 !important;
                    -webkit-print-color-adjust: exact;
                }
                
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
    const tabDocentes = document.getElementById("tab-docentes-curso");
    const tabEmails = document.getElementById("tab-emails-curso");

    if (tabAlumnos) {
        tabAlumnos.addEventListener("click", () => actualizarMenuImpresion('alumnos'));
        tabAlumnos.addEventListener("shown.bs.tab", () => actualizarMenuImpresion('alumnos'));
    }
    if (tabHorario) {
        tabHorario.addEventListener("click", () => actualizarMenuImpresion('horario'));
        tabHorario.addEventListener("shown.bs.tab", () => actualizarMenuImpresion('horario'));
    }
    if (tabDocentes) {
        tabDocentes.addEventListener("click", () => {
            actualizarMenuImpresion('docentes');
            cargarDocentesDelCursoActivo();
        });
        tabDocentes.addEventListener("shown.bs.tab", () => {
            actualizarMenuImpresion('docentes');
            cargarDocentesDelCursoActivo();
        });
    }
    if (tabEmails) {
        tabEmails.addEventListener("click", () => {
            actualizarMenuImpresion('emails');
            cargarEmailsDelCursoActivo();
        });
        tabEmails.addEventListener("shown.bs.tab", () => {
            actualizarMenuImpresion('emails');
            cargarEmailsDelCursoActivo();
        });
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
    } else if (pestaña === 'docentes') {
        menu.innerHTML = `
            <li>
                <button type="button" class="dropdown-item fw-bold text-dark py-2" id="btnImpDocentes">
                    <i class="bi bi-person-badge text-primary me-2"></i> Imprimir Planta Docente
                </button>
            </li>
        `;
        document.getElementById("btnImpDocentes")?.addEventListener("click", (e) => {
            e.preventDefault();
            window.imprimirDocentesCurso();
        });
    } else if (pestaña === 'emails') {
        menu.innerHTML = `
            <li>
                <button type="button" class="dropdown-item fw-bold text-dark py-2" onclick="descargarMails('estudiantes', 'csv')">
                    <i class="bi bi-file-earmark-spreadsheet text-success me-2"></i> Exportar Estudiantes (CSV)
                </button>
            </li>
            <li>
                <button type="button" class="dropdown-item fw-bold text-dark py-2" onclick="descargarMails('tutores', 'csv')">
                    <i class="bi bi-file-earmark-spreadsheet text-info me-2"></i> Exportar Tutores (CSV)
                </button>
            </li>
            <li>
                <button type="button" class="dropdown-item fw-bold text-dark py-2" onclick="descargarMails('docentes', 'csv')">
                    <i class="bi bi-file-earmark-spreadsheet text-primary me-2"></i> Exportar Docentes (CSV)
                </button>
            </li>
        `;
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
                    const anioStr = fmtOrdinal(c.anio);
                    const divStr = c.division ? ` ${fmtOrdinal(c.division)}` : '';
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
                const cleanKey = anioKey.replace(/[°º]+$/g, '');
                const anioLabel = cleanKey === 'General' ? 'General' : `${cleanKey}º Año`;
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
                    const divStr = c.division ? `Div. ${fmtOrdinal(c.division)}` : 'Única div.';

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
    const divStr = curso.division ? ` ${fmtOrdinal(curso.division)}` : '';
    document.getElementById("cursoDetalleTitulo").innerText = `${fmtOrdinal(curso.anio)}${divStr} ${curso.especialidad.toUpperCase()}`;
    document.getElementById("cursoDetalleSubtitulo").innerText = `Especialidad: ${curso.especialidad} (${curso.modalidad}) | Turno: ${curso.turno.toUpperCase()}`;

    // Cargar horario, alumnos, preceptor, docentes y emails
    actualizarMenuImpresion('alumnos');
    cargarHorarioDelCurso();
    cargarAlumnosDelCursoActivo();
    cargarPreceptorDelCurso();
    cargarDocentesDelCursoActivo();
    cargarEmailsDelCursoActivo();
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
                <h4 class="mb-0">HORARIO SEMANAL: ${fmtOrdinal(curso.anio)}${curso.division ? ' ' + fmtOrdinal(curso.division) : ''} ${curso.especialidad.toUpperCase()}</h4>
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
        const divStr = curso.division ? ` ${fmtOrdinal(curso.division)}` : '';

        let html = `
            <!-- Encabezado de Impresión -->
            <div class="d-none d-print-block mb-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h3 class="fw-bold mb-1">E.S.E.A en Ceramica Nº1 D.E II</h3>
                        <h4 class="mb-0">LISTA DE ESTUDIANTES: ${fmtOrdinal(curso.anio)}${divStr} ${curso.especialidad.toUpperCase()}</h4>
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
                        <th class="text-center" style="width: 1%; white-space: nowrap;">#</th>
                        <th>Apellido y Nombre</th>
                        <th class="col-dni text-center" style="width: 120px; white-space: nowrap;">DNI</th>
                        <th class="col-email text-center" style="width: 220px; white-space: nowrap;">Email</th>
                    </tr>
                </thead>
                <tbody>
        `;

        alumnos.forEach((a, index) => {
            html += `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td><strong>${a.apellido}, ${a.nombre}</strong></td>
                    <td class="col-dni text-center">${a.dni}</td>
                    <td class="col-email text-center">${a.email || '-'}</td>
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
            th, td { border: 1px solid #000 !important; padding: 5px 8px !important; font-size: 8.5pt !important; text-align: left !important; vertical-align: middle !important; }
            th { background-color: #f0f0f0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; text-align: center !important; }
            .text-center { text-align: center !important; }
            th:first-child, td:first-child { width: 35px !important; text-align: center !important; }
            .col-dni { width: 110px !important; white-space: nowrap !important; text-align: center !important; }
            .col-email { width: 220px !important; white-space: nowrap !important; text-align: center !important; }
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

// ============================
// LOGICA DE PRECEPTOR POR CURSO
// ============================

function onCambioAnioLectivoCurso() {
    cargarAlumnosDelCursoActivo();
    cargarPreceptorDelCurso();
    cargarDocentesDelCursoActivo();
    cargarEmailsDelCursoActivo();
}

async function cargarPreceptorDelCurso() {
    if (!cursoActivoId) return;
    const anioSelect = document.getElementById("selectAnioLectivoCurso");
    const anio = anioSelect ? anioSelect.value : new Date().getFullYear();
    const preceptorSpan = document.getElementById("cursoPreceptorNombre");
    if (!preceptorSpan) return;

    try {
        const res = await api.get(`/api/v1/cursos/${cursoActivoId}/preceptor?anio_lectivo=${anio}`);
        if (res.ok) {
            const data = await res.json();
            if (data.preceptor && data.preceptor.id) {
                preceptorSpan.textContent = `${data.preceptor.apellido}, ${data.preceptor.nombre}`;
                preceptorSpan.className = "fw-semibold text-primary small";
                cursoPreceptorActualId = data.preceptor.id;
            } else {
                preceptorSpan.textContent = "Sin asignar";
                preceptorSpan.className = "text-muted small fst-italic";
                cursoPreceptorActualId = null;
            }
        } else {
            preceptorSpan.textContent = "Sin asignar";
            preceptorSpan.className = "text-muted small fst-italic";
            cursoPreceptorActualId = null;
        }
    } catch (err) {
        preceptorSpan.textContent = "Error al cargar";
        preceptorSpan.className = "text-danger small";
        cursoPreceptorActualId = null;
    }
}

async function abrirModalAsignarPreceptor() {
    if (!cursoActivoId) return;
    const anioSelect = document.getElementById("selectAnioLectivoCurso");
    const anio = anioSelect ? anioSelect.value : new Date().getFullYear();
    const curso = cursosListGlobal.find(c => c.id === cursoActivoId);
    const cursoNombre = curso ? `${fmtOrdinal(curso.anio)}${curso.division ? ' ' + fmtOrdinal(curso.division) : ''} ${curso.especialidad.toUpperCase()}` : '';

    const infoEl = document.getElementById("modalPreceptorInfo");
    if (infoEl) {
        infoEl.innerHTML = `Asignar preceptor para <strong>${cursoNombre}</strong> (Ciclo Lectivo: <strong>${anio}</strong>).`;
    }

    const select = document.getElementById("selectPreceptoresModal");
    if (select) {
        select.innerHTML = '<option value="">Cargando preceptores...</option>';
    }

    const modalEl = document.getElementById("modalAsignarPreceptor");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    try {
        const res = await api.get('/api/v1/docentes/preceptores');
        if (!res.ok) throw new Error("Error al obtener lista de preceptores");
        const preceptores = await res.json();

        if (!preceptores || preceptores.length === 0) {
            select.innerHTML = '<option value="">No hay docentes con cargo de preceptor activo</option>';
            return;
        }

        let optionsHtml = '<option value="">-- Seleccionar Preceptor --</option>';
        preceptores.forEach(p => {
            const isSelected = (cursoPreceptorActualId && cursoPreceptorActualId === p.id) ? 'selected' : '';
            optionsHtml += `<option value="${p.id}" ${isSelected}>${p.apellido}, ${p.nombre} (DNI: ${p.dni})</option>`;
        });
        select.innerHTML = optionsHtml;
    } catch (err) {
        if (select) {
            select.innerHTML = `<option value="">Error al cargar preceptores: ${api.getErrorMessage(err)}</option>`;
        }
    }
}

async function guardarAsignacionPreceptor() {
    if (!cursoActivoId) return;
    const select = document.getElementById("selectPreceptoresModal");
    const docenteId = select.value;
    if (!docenteId) {
        alert("Por favor seleccione un preceptor de la lista.");
        return;
    }

    const anioSelect = document.getElementById("selectAnioLectivoCurso");
    const anio = anioSelect ? parseInt(anioSelect.value, 10) : new Date().getFullYear();
    const btn = document.getElementById("btnGuardarPreceptorModal");
    const originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Guardando...';
    }

    try {
        const res = await api.post(`/api/v1/cursos/${cursoActivoId}/preceptor`, {
            docente_id: parseInt(docenteId, 10),
            anio_lectivo: anio
        });

        if (res.ok) {
            const modalEl = document.getElementById("modalAsignarPreceptor");
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            await cargarPreceptorDelCurso();
        } else {
            const err = await res.json();
            alert("Error al asignar preceptor: " + api.getErrorMessage(err));
        }
    } catch (err) {
        alert("Error al comunicarse con el servidor: " + api.getErrorMessage(err));
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }
}

window.onCambioAnioLectivoCurso = onCambioAnioLectivoCurso;
window.abrirModalAsignarPreceptor = abrirModalAsignarPreceptor;
window.guardarAsignacionPreceptor = guardarAsignacionPreceptor;

// ============================
// LOGICA DE DOCENTES Y MAILS POR CURSO
// ============================

async function cargarDocentesDelCursoActivo() {
    const container = document.getElementById("listaDocentesCursoContainer");
    if (!container || !cursoActivoId) return;

    container.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary"></div></div>';
    const anioSelect = document.getElementById("selectAnioLectivoCurso");
    const anio = anioSelect ? anioSelect.value : new Date().getFullYear();

    try {
        const res = await api.get(`/api/v1/cursos/${cursoActivoId}/docentes?anio_lectivo=${anio}`);
        if (!res.ok) throw new Error("Error al obtener docentes del curso");
        dataDocentesCursoGlobal = await res.json();

        if (!dataDocentesCursoGlobal || dataDocentesCursoGlobal.length === 0) {
            container.innerHTML = '<div class="alert alert-info text-center my-3"><i class="bi bi-info-circle me-1"></i> No hay materias ni docentes asignados a este curso.</div>';
            return;
        }

        const curso = cursosListGlobal.find(c => c.id === cursoActivoId);
        const divStr = curso.division ? ` ${fmtOrdinal(curso.division)}` : '';
        const cursoNombre = `${fmtOrdinal(curso.anio)}${divStr} ${curso.especialidad ? curso.especialidad.toUpperCase() : ''}`;

        let html = `
            <!-- Encabezado para impresión -->
            <div class="d-none d-print-block text-center mb-4">
                <h3 class="fw-bold mb-1">E.S.E.A en Ceramica Nº1 D.E II</h3>
                <h4 class="mb-0">PLANTA DOCENTE Y MATERIAS: ${cursoNombre}</h4>
                <p class="text-muted small">Ciclo Lectivo: ${anio} | Turno: ${curso.turno.toUpperCase()}</p>
                <hr style="border-top: 2px solid #000; margin: 15px 0;">
            </div>

            <table class="table table-hover align-middle mb-0 tabla-docentes-print border">
                <thead class="table-light">
                    <tr>
                        <th style="width: 40px;" class="text-center">#</th>
                        <th>Función / Materia</th>
                        <th>Docente a Cargo</th>
                        <th>Rol</th>
                        <th>Puesto</th>
                        <th>Sit. Revista</th>
                        <th>Correo Electrónico</th>
                        <th>Teléfono</th>
                    </tr>
                </thead>
                <tbody>
        `;

        dataDocentesCursoGlobal.forEach((d, idx) => {
            const esPreceptor = d.rol && d.rol.includes('Preceptor');
            const rowClass = esPreceptor ? 'table-primary bg-opacity-25' : '';
            const rolBadge = esPreceptor
                ? '<span class="badge bg-primary">Preceptor/a</span>'
                : '<span class="badge bg-secondary">Profesor/a</span>';
            const situacionBadge = d.situacion_revista
                ? `<span class="badge bg-light text-dark border">${d.situacion_revista.toUpperCase()}</span>`
                : '-';
            const puestoText = d.numero_puesto ? `Puesto ${d.numero_puesto}` : '-';

            const emailHtml = d.email
                ? `<div class="d-flex align-items-center gap-1">
                     <a href="mailto:${d.email}" class="text-primary text-decoration-none fw-semibold small" title="Enviar correo">
                       <i class="bi bi-envelope me-1"></i>${d.email}
                     </a>
                     <button type="button" class="btn btn-sm btn-link text-muted p-0 no-print" onclick="copiarTextoIndividual('${d.email}', this)" title="Copiar correo">
                       <i class="bi bi-clipboard"></i>
                     </button>
                   </div>`
                : `<span class="badge bg-warning text-dark"><i class="bi bi-exclamation-circle me-1"></i>Sin correo</span>`;

            const telHtml = d.telefono ? `<span class="small text-muted"><i class="bi bi-telephone me-1"></i>${d.telefono}</span>` : '-';

            html += `
                <tr class="${rowClass}">
                    <td class="text-center text-muted fw-bold small">${idx + 1}</td>
                    <td class="fw-bold text-dark">${d.materia_nombre}</td>
                    <td>
                        <span class="fw-semibold ${d.docente_completo === 'VACANTE' ? 'text-danger fst-italic' : 'text-dark'}">
                            ${d.docente_completo}
                        </span>
                    </td>
                    <td>${rolBadge}</td>
                    <td class="small">${puestoText}</td>
                    <td>${situacionBadge}</td>
                    <td>${emailHtml}</td>
                    <td>${telHtml}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (err) {
        container.innerHTML = `<div class="alert alert-danger my-3">Error al cargar docentes: ${api.getErrorMessage(err)}</div>`;
    }
}

async function cargarEmailsDelCursoActivo() {
    if (!cursoActivoId) return;
    const anioSelect = document.getElementById("selectAnioLectivoCurso");
    const anio = anioSelect ? anioSelect.value : new Date().getFullYear();

    const cEstudiantes = document.getElementById("tablaMailsEstudiantesContainer");
    const cTutores = document.getElementById("tablaMailsTutoresContainer");
    const cDocentes = document.getElementById("tablaMailsDocentesContainer");

    if (cEstudiantes) cEstudiantes.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary"></div></div>';
    if (cTutores) cTutores.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary"></div></div>';
    if (cDocentes) cDocentes.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary"></div></div>';

    try {
        const res = await api.get(`/api/v1/cursos/${cursoActivoId}/emails?anio_lectivo=${anio}`);
        if (!res.ok) throw new Error("Error al obtener correos del curso");
        dataEmailsCursoGlobal = await res.json();

        const stats = dataEmailsCursoGlobal.stats || {
            estudiantes_total: 0, estudiantes_con_email: 0,
            tutores_total: 0, tutores_con_email: 0,
            docentes_total: 0, docentes_con_email: 0
        };

        const elBadgeEst = document.getElementById("badgeTotalEstudiantes");
        const elBadgeTut = document.getElementById("badgeTotalTutores");
        const elBadgeDoc = document.getElementById("badgeTotalDocentes");
        if (elBadgeEst) elBadgeEst.innerText = `${stats.estudiantes_con_email} / ${stats.estudiantes_total}`;
        if (elBadgeTut) elBadgeTut.innerText = `${stats.tutores_con_email} / ${stats.tutores_total}`;
        if (elBadgeDoc) elBadgeDoc.innerText = `${stats.docentes_con_email} / ${stats.docentes_total}`;

        const elPillEst = document.getElementById("pillCountEstudiantes");
        const elPillTut = document.getElementById("pillCountTutores");
        const elPillDoc = document.getElementById("pillCountDocentes");
        if (elPillEst) elPillEst.innerText = stats.estudiantes_con_email;
        if (elPillTut) elPillTut.innerText = stats.tutores_con_email;
        if (elPillDoc) elPillDoc.innerText = stats.docentes_con_email;

        renderTablaMailsEstudiantes(dataEmailsCursoGlobal.estudiantes || []);
        renderTablaMailsTutores(dataEmailsCursoGlobal.tutores || []);
        renderTablaMailsDocentes(dataEmailsCursoGlobal.docentes || []);

    } catch (err) {
        const errHtml = `<div class="alert alert-danger my-3">Error al cargar correos: ${api.getErrorMessage(err)}</div>`;
        if (cEstudiantes) cEstudiantes.innerHTML = errHtml;
        if (cTutores) cTutores.innerHTML = errHtml;
        if (cDocentes) cDocentes.innerHTML = errHtml;
    }
}

function renderTablaMailsEstudiantes(estudiantes) {
    const container = document.getElementById("tablaMailsEstudiantesContainer");
    if (!container) return;

    if (estudiantes.length === 0) {
        container.innerHTML = '<div class="alert alert-light text-center border p-4 text-muted">No hay estudiantes inscriptos en este ciclo lectivo.</div>';
        return;
    }

    let html = `
        <table class="table table-hover align-middle border mb-0" id="tabla-raw-estudiantes">
            <thead class="table-light">
                <tr>
                    <th style="width: 40px;" class="text-center">#</th>
                    <th>Estudiante</th>
                    <th>DNI</th>
                    <th>Correo Electrónico</th>
                    <th style="width: 100px;" class="text-center">Estado</th>
                    <th style="width: 60px;" class="text-center">Acción</th>
                </tr>
            </thead>
            <tbody>
    `;

    estudiantes.forEach((e, idx) => {
        const estadoBadge = e.has_email
            ? '<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-check-circle me-1"></i>Válido</span>'
            : '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"><i class="bi bi-exclamation-triangle me-1"></i>Sin mail</span>';

        const emailText = e.has_email
            ? `<a href="mailto:${e.email}" class="fw-semibold text-primary text-decoration-none">${e.email}</a>`
            : '<span class="text-muted fst-italic">No registrado</span>';

        const copyBtn = e.has_email
            ? `<button type="button" class="btn btn-sm btn-outline-secondary" onclick="copiarTextoIndividual('${e.email}', this)" title="Copiar"><i class="bi bi-clipboard"></i></button>`
            : '-';

        html += `
            <tr class="fila-mail-estudiante" data-nombre="${(e.apellido + ' ' + e.nombre).toLowerCase()}" data-email="${(e.email || '').toLowerCase()}" data-dni="${e.dni || ''}">
                <td class="text-center text-muted small">${idx + 1}</td>
                <td class="fw-bold text-dark">${e.apellido}, ${e.nombre}</td>
                <td>${e.dni || '-'}</td>
                <td>${emailText}</td>
                <td class="text-center">${estadoBadge}</td>
                <td class="text-center">${copyBtn}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderTablaMailsTutores(tutores) {
    const container = document.getElementById("tablaMailsTutoresContainer");
    if (!container) return;

    if (tutores.length === 0) {
        container.innerHTML = '<div class="alert alert-light text-center border p-4 text-muted">No hay datos de padres o tutores cargados para los alumnos del curso.</div>';
        return;
    }

    let html = `
        <table class="table table-hover align-middle border mb-0" id="tabla-raw-tutores">
            <thead class="table-light">
                <tr>
                    <th style="width: 40px;" class="text-center">#</th>
                    <th>Tutor / Familiar</th>
                    <th>Parentesco</th>
                    <th>Estudiante a Cargo</th>
                    <th>Teléfono</th>
                    <th>Correo Electrónico</th>
                    <th style="width: 100px;" class="text-center">Estado</th>
                    <th style="width: 60px;" class="text-center">Acción</th>
                </tr>
            </thead>
            <tbody>
    `;

    tutores.forEach((t, idx) => {
        const estadoBadge = t.has_email
            ? '<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-check-circle me-1"></i>Válido</span>'
            : '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"><i class="bi bi-exclamation-triangle me-1"></i>Sin mail</span>';

        const emailText = t.has_email
            ? `<a href="mailto:${t.email}" class="fw-semibold text-primary text-decoration-none">${t.email}</a>`
            : '<span class="text-muted fst-italic">No registrado</span>';

        const copyBtn = t.has_email
            ? `<button type="button" class="btn btn-sm btn-outline-secondary" onclick="copiarTextoIndividual('${t.email}', this)" title="Copiar"><i class="bi bi-clipboard"></i></button>`
            : '-';

        html += `
            <tr class="fila-mail-tutor" data-nombre="${(t.apellido + ' ' + t.nombre).toLowerCase()}" data-alumno="${(t.alumno_nombre_completo || '').toLowerCase()}" data-email="${(t.email || '').toLowerCase()}">
                <td class="text-center text-muted small">${idx + 1}</td>
                <td class="fw-bold text-dark">${t.apellido}, ${t.nombre}</td>
                <td><span class="badge bg-light text-dark border">${t.parentesco}</span></td>
                <td class="small text-secondary fw-semibold">${t.alumno_nombre_completo}</td>
                <td class="small">${t.telefono ? `<i class="bi bi-telephone me-1"></i>${t.telefono}` : '-'}</td>
                <td>${emailText}</td>
                <td class="text-center">${estadoBadge}</td>
                <td class="text-center">${copyBtn}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderTablaMailsDocentes(docentes) {
    const container = document.getElementById("tablaMailsDocentesContainer");
    if (!container) return;

    if (docentes.length === 0) {
        container.innerHTML = '<div class="alert alert-light text-center border p-4 text-muted">No hay docentes vinculados con correo a este curso.</div>';
        return;
    }

    let html = `
        <table class="table table-hover align-middle border mb-0" id="tabla-raw-docentes">
            <thead class="table-light">
                <tr>
                    <th style="width: 40px;" class="text-center">#</th>
                    <th>Docente</th>
                    <th>Rol Institucional</th>
                    <th>Materias / Áreas</th>
                    <th>Teléfono</th>
                    <th>Correo Electrónico</th>
                    <th style="width: 100px;" class="text-center">Estado</th>
                    <th style="width: 60px;" class="text-center">Acción</th>
                </tr>
            </thead>
            <tbody>
    `;

    docentes.forEach((d, idx) => {
        const estadoBadge = d.has_email
            ? '<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-check-circle me-1"></i>Válido</span>'
            : '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle"><i class="bi bi-exclamation-triangle me-1"></i>Sin mail</span>';

        const emailText = d.has_email
            ? `<a href="mailto:${d.email}" class="fw-semibold text-primary text-decoration-none">${d.email}</a>`
            : '<span class="text-muted fst-italic">No registrado</span>';

        const copyBtn = d.has_email
            ? `<button type="button" class="btn btn-sm btn-outline-secondary" onclick="copiarTextoIndividual('${d.email}', this)" title="Copiar"><i class="bi bi-clipboard"></i></button>`
            : '-';

        html += `
            <tr class="fila-mail-docente" data-nombre="${(d.nombre_completo || '').toLowerCase()}" data-materia="${(d.materias || '').toLowerCase()}" data-email="${(d.email || '').toLowerCase()}">
                <td class="text-center text-muted small">${idx + 1}</td>
                <td class="fw-bold text-dark">${d.nombre_completo}</td>
                <td><span class="badge bg-primary bg-opacity-75">${d.rol}</span></td>
                <td class="small text-secondary">${d.materias || '-'}</td>
                <td class="small">${d.telefono ? `<i class="bi bi-telephone me-1"></i>${d.telefono}` : '-'}</td>
                <td>${emailText}</td>
                <td class="text-center">${estadoBadge}</td>
                <td class="text-center">${copyBtn}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ============================
// ACCIONES: COPIAR AL PORTAPAPELES Y DESCARGAR
// ============================

function copiarMails(tipo) {
    if (!dataEmailsCursoGlobal || !dataEmailsCursoGlobal[tipo]) {
        alert("Los datos de correos aún no están disponibles.");
        return;
    }

    const items = dataEmailsCursoGlobal[tipo];
    const emailsValidos = items.filter(i => i.has_email && i.email).map(i => i.email.trim());

    if (emailsValidos.length === 0) {
        alert(`No hay correos registrados para ${tipo}.`);
        return;
    }

    // Formato estándar CCO/BCC: separados por coma
    const textoParaCopiar = emailsValidos.join(", ");
    const btnId = tipo === 'estudiantes' ? 'btnCopiarEstudiantes' : (tipo === 'tutores' ? 'btnCopiarTutores' : 'btnCopiarDocentes');
    const btn = document.getElementById(btnId);

    copiarTextoAlPortapapeles(textoParaCopiar, btn, `¡${emailsValidos.length} correos copiados (formato CCO)!`);
}

function copiarTextoIndividual(texto, btn) {
    if (!texto) return;
    copiarTextoAlPortapapeles(texto, btn, '¡Copiado!');
}

function copiarTextoAlPortapapeles(texto, btnElement, mensajeExito) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(() => {
            feedbackBotonCopia(btnElement, mensajeExito);
        }).catch(() => fallbackCopiarTexto(texto, btnElement, mensajeExito));
    } else {
        fallbackCopiarTexto(texto, btnElement, mensajeExito);
    }
}

function fallbackCopiarTexto(texto, btnElement, mensajeExito) {
    const textArea = document.createElement("textarea");
    textArea.value = texto;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        feedbackBotonCopia(btnElement, mensajeExito);
    } catch (err) {
        alert("No se pudo copiar automáticamente. Por favor seleccione y copie manualmente.");
    }
    document.body.removeChild(textArea);
}

function feedbackBotonCopia(btn, mensaje) {
    if (!btn) {
        alert(mensaje);
        return;
    }
    const htmlOriginal = btn.innerHTML;
    btn.classList.add('btn-success');
    btn.classList.remove('btn-outline-primary', 'btn-outline-secondary');
    btn.innerHTML = `<i class="bi bi-check2 me-1"></i> ${mensaje}`;
    setTimeout(() => {
        btn.innerHTML = htmlOriginal;
        btn.classList.remove('btn-success');
        if (btn.id && btn.id.includes('btnCopiar')) {
            btn.classList.add('btn-outline-primary');
        } else {
            btn.classList.add('btn-outline-secondary');
        }
    }, 2200);
}

function descargarMails(tipo, formato) {
    if (!dataEmailsCursoGlobal || !dataEmailsCursoGlobal[tipo]) {
        alert("Los datos de correos aún no están disponibles.");
        return;
    }

    const items = dataEmailsCursoGlobal[tipo];
    const curso = cursosListGlobal.find(c => c.id === cursoActivoId);
    const divStr = curso.division ? `_${curso.division}` : '';
    const cursoTag = `${curso.anio}${divStr}_${(curso.especialidad || 'gral').toLowerCase()}`.replace(/[^a-zA-Z0-9_-]/g, '');
    const anio = dataEmailsCursoGlobal.anio_lectivo || new Date().getFullYear();

    if (formato === 'txt') {
        const emailsValidos = items.filter(i => i.has_email && i.email).map(i => i.email.trim());
        let contenido = `SISTEMA ESCOLAR ECN Nº1 CERAMICA (CERA 1)\n`;
        contenido += `LISTA DE CORREOS: ${tipo.toUpperCase()}\n`;
        contenido += `CURSO: ${fmtOrdinal(curso.anio)} ${curso.division ? fmtOrdinal(curso.division) : ''} ${curso.especialidad.toUpperCase()} | CICLO: ${anio}\n`;
        contenido += `FECHA DE GENERACION: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
        contenido += `TOTAL CON CORREO: ${emailsValidos.length} de ${items.length}\n`;
        contenido += `--------------------------------------------------------\n\n`;
        contenido += `# LISTA PARA CCO / BCC (COPIAR Y PEGAR):\n`;
        contenido += `${emailsValidos.join(', ')}\n\n`;
        contenido += `--------------------------------------------------------\n`;
        contenido += `# DETALLE INDIVIDUAL:\n`;
        items.forEach(it => {
            const nom = it.nombre_completo || `${it.apellido}, ${it.nombre}`;
            const mail = it.email ? it.email : '(Sin correo)';
            contenido += `${nom} <${mail}>\n`;
        });

        descargarArchivo(contenido, `correos_${tipo}_curso_${cursoTag}_${anio}.txt`, 'text/plain');

    } else if (formato === 'csv') {
        let csvContent = "";
        if (tipo === 'estudiantes') {
            csvContent += "Apellido,Nombre,DNI,Email,Tiene_Email\n";
            items.forEach(e => {
                csvContent += `"${e.apellido || ''}","${e.nombre || ''}","${e.dni || ''}","${e.email || ''}","${e.has_email ? 'SI' : 'NO'}"\n`;
            });
        } else if (tipo === 'tutores') {
            csvContent += "Apellido,Nombre,Parentesco,Estudiante_A_Cargo,Telefono,Email,Tiene_Email\n";
            items.forEach(t => {
                csvContent += `"${t.apellido || ''}","${t.nombre || ''}","${t.parentesco || ''}","${t.alumno_nombre_completo || ''}","${t.telefono || ''}","${t.email || ''}","${t.has_email ? 'SI' : 'NO'}"\n`;
            });
        } else if (tipo === 'docentes') {
            csvContent += "Docente,Rol,Materias,Telefono,Email,Tiene_Email\n";
            items.forEach(d => {
                csvContent += `"${d.nombre_completo || ''}","${d.rol || ''}","${d.materias || ''}","${d.telefono || ''}","${d.email || ''}","${d.has_email ? 'SI' : 'NO'}"\n`;
            });
        }

        descargarArchivo(csvContent, `correos_${tipo}_curso_${cursoTag}_${anio}.csv`, 'text/csv');
    }
}

function descargarArchivo(contenido, nombreArchivo, mimeType) {
    const blob = new Blob(["\ufeff" + contenido], { type: mimeType + ';charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", nombreArchivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function filtrarTablaMails(tipo) {
    const inputId = tipo === 'estudiantes' ? 'filtroMailsEstudiantes' : (tipo === 'tutores' ? 'filtroMailsTutores' : 'filtroMailsDocentes');
    const input = document.getElementById(inputId);
    if (!input) return;
    const q = input.value.toLowerCase().trim();

    const filas = document.querySelectorAll(tipo === 'estudiantes' ? '.fila-mail-estudiante' : (tipo === 'tutores' ? '.fila-mail-tutor' : '.fila-mail-docente'));
    filas.forEach(f => {
        const texto = f.innerText.toLowerCase();
        if (!q || texto.includes(q)) {
            f.style.display = '';
        } else {
            f.style.display = 'none';
        }
    });
}

window.imprimirDocentesCurso = function() {
    const el = document.getElementById("listaDocentesCursoContainer");
    if (!el || el.querySelector(".spinner-border")) {
        alert("La lista de docentes aún no está cargada.");
        return;
    }
    const clon = el.cloneNode(true);
    clon.querySelectorAll('.no-print').forEach(e => e.style.display = 'none');
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
            th, td { border: 1px solid #000 !important; padding: 6px 8px !important; font-size: 8.5pt !important; text-align: left !important; vertical-align: middle !important; }
            th { background-color: #f0f0f0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; text-align: center !important; }
            .text-center { text-align: center !important; }
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

window.copiarMails = copiarMails;
window.copiarTextoIndividual = copiarTextoIndividual;
window.descargarMails = descargarMails;
window.filtrarTablaMails = filtrarTablaMails;


