// ============================
// MODULO INICIO / DASHBOARD
// ============================

async function verInicio() {
    const container = document.getElementById("seccion-dashboard");
    if (!container) return;

    // Render baseline loading layout
    container.innerHTML = `
        <div id="alertUsuariosPendientes"></div>
        <div class="row g-4">
            <div class="col-md-4">
                <div class="card p-4 bg-primary text-white h-100 shadow-sm border-0">
                    <h5 class="fw-bold"><i class="bi bi-graph-up-arrow me-2"></i> Resumen Institucional</h5>
                    <p class="mb-0 mt-3 opacity-75">Sistema de administración escolar sincronizado y actualizado.</p>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card p-4 h-100 shadow-sm border-0 bg-white">
                    <h5 class="fw-bold mb-3"><i class="bi bi-rocket-takeoff me-2 text-primary"></i> Accesos Rápidos</h5>
                    <div class="row g-3">
                        <div class="col-sm-6 col-md-3">
                            <button class="btn btn-outline-primary w-100 p-3 text-start d-flex flex-column gap-2 rounded-3 shadow-sm h-100" onclick="mostrarSeccion('docentes')">
                                <i class="bi bi-people fs-3"></i>
                                <span class="fw-bold small">Docentes</span>
                            </button>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <button class="btn btn-outline-primary w-100 p-3 text-start d-flex flex-column gap-2 rounded-3 shadow-sm h-100" onclick="mostrarSeccion('alumnos')">
                                <i class="bi bi-person-workspace fs-3"></i>
                                <span class="fw-bold small">Estudiantes</span>
                            </button>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <button class="btn btn-outline-primary w-100 p-3 text-start d-flex flex-column gap-2 rounded-3 shadow-sm h-100" onclick="mostrarSeccion('cursos_horarios')">
                                <i class="bi bi-calendar3 fs-3"></i>
                                <span class="fw-bold small">Cursos / Horarios</span>
                            </button>
                        </div>
                        <div class="col-sm-6 col-md-3">
                            <button class="btn btn-outline-primary w-100 p-3 text-start d-flex flex-column gap-2 rounded-3 shadow-sm h-100" onclick="mostrarSeccion('planilla')">
                                <i class="bi bi-pen fs-3"></i>
                                <span class="fw-bold small">Planilla Firmas</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Cargar alerta de usuarios pendientes si es Admin / Secretario o tiene permisos
    await cargarAlertaUsuariosPendientes();
}

async function cargarAlertaUsuariosPendientes() {
    const alertDiv = document.getElementById("alertUsuariosPendientes");
    if (!alertDiv) return;

    try {
        const res = await api.get("/api/v1/usuarios");
        if (!res.ok) {
            alertDiv.innerHTML = "";
            return;
        }

        const usuarios = await res.json();
        const pendientes = usuarios.filter(u => u.estado === 'pendiente');

        if (pendientes.length > 0) {
            const count = pendientes.length;
            const pluralUser = count === 1 ? '1 usuario' : `${count} usuarios`;
            const pluralPend = count === 1 ? 'pendiente' : 'pendientes';
            const nombresPendientes = pendientes.map(u => `<strong>${u.nombre || u.username}</strong> (@${u.username})`).join(', ');

            alertDiv.innerHTML = `
                <div class="card border-0 shadow-sm mb-4 bg-warning-subtle border-start border-4 border-warning">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
                            <div class="d-flex align-items-center gap-3">
                                <div class="bg-warning text-dark rounded-circle p-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width: 52px; height: 52px;">
                                    <i class="bi bi-person-exclamation fs-3"></i>
                                </div>
                                <div>
                                    <h5 class="fw-bold mb-1 text-dark">
                                        Tenés ${pluralUser} ${pluralPend} de aprobación
                                    </h5>
                                    <p class="mb-0 text-dark opacity-75 small">
                                        Usuarios a revisar: ${nombresPendientes}
                                    </p>
                                </div>
                            </div>
                            <button class="btn btn-warning fw-bold text-dark px-4 shadow-sm" onclick="mostrarSeccion('usuarios')">
                                <i class="bi bi-person-check-fill me-1"></i> Ir a Gestión de Usuarios (${count})
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Si es administrador/secretario y no hay pendientes
            const perfilNombre = (usuarioActual && usuarioActual.perfil_nombre) ? usuarioActual.perfil_nombre.toUpperCase() : '';
            if (perfilNombre.includes('ADMIN') || perfilNombre.includes('SECRETARI')) {
                alertDiv.innerHTML = `
                    <div class="card border-0 shadow-sm mb-4 bg-success-subtle border-start border-4 border-success">
                        <div class="card-body py-3 px-4">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center gap-2">
                                    <i class="bi bi-check-circle-fill text-success fs-5"></i>
                                    <span class="fw-semibold text-dark small">No hay usuarios pendientes de aprobación. Todos los accesos se encuentran al día.</span>
                                </div>
                                <button class="btn btn-sm btn-outline-success border-0 fw-bold" onclick="mostrarSeccion('usuarios')">
                                    <i class="bi bi-people me-1"></i> Ver Usuarios
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                alertDiv.innerHTML = "";
            }
        }
    } catch (err) {
        console.error("Error al cargar usuarios pendientes para el dashboard:", err);
        alertDiv.innerHTML = "";
    }
}
