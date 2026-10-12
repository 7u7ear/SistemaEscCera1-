
let docentesGlobal = [];
let cargosGlobal = [];
let materiasGlobal = [];
let cursosGlobal = [];
let alumnosGlobal = [];
let modal;
let modalCargo;
let modalVerCargos;
let modalGestionCargo;
let modalTramitacion;
let usuarioActual = null;
let tramitacionesGlobal = [];
let codigosTramiteGlobal = [];
let historialTemporalTramite = [];
let modalGestionCodigos;
let modalLicencia;
let modalNuevoTipoLicencia;
let licenciasGlobal = [];
let tiposLicenciaGlobal = [];
let usuariosGlobal = [];
let modalUsuario;
let modalCrearUsuario;
let modalDetallePuesto;
let modalBajaSuplente;
let modalAlumno;
let modalMatricular;
let modalTrasladar;
let modalMateriaAdeudada;
let modalHistorialReemplazos;

// ============================
// INICIO
// ============================

window.addEventListener("DOMContentLoaded", () => {
    cargarUsuario();
    modal = new bootstrap.Modal(document.getElementById('modalDocente'));
    modalCargo = new bootstrap.Modal(document.getElementById('modalCargo'));
    modalVerCargos = new bootstrap.Modal(document.getElementById('modalVerCargos'));
    modalGestionCargo = new bootstrap.Modal(document.getElementById('modalGestionCargo'));
    modalTramitacion = new bootstrap.Modal(document.getElementById('modalTramitacion'));
    modalDetallePuesto = new bootstrap.Modal(document.getElementById('modalDetallePuesto'));
    modalBajaSuplente = new bootstrap.Modal(document.getElementById('modalBajaSuplente'));
    modalGestionCodigos = new bootstrap.Modal(document.getElementById('modalGestionCodigos'));
    modalLicencia = new bootstrap.Modal(document.getElementById('modalLicencia'));
    modalNuevoTipoLicencia = new bootstrap.Modal(document.getElementById('modalNuevoTipoLicencia'));
    modalUsuario = new bootstrap.Modal(document.getElementById('modalUsuario'));
    modalCrearUsuario = new bootstrap.Modal(document.getElementById('modalCrearUsuario'));
    modalAlumno = new bootstrap.Modal(document.getElementById('modalAlumno'));
    modalMatricular = new bootstrap.Modal(document.getElementById('modalMatricular'));
    modalTrasladar = new bootstrap.Modal(document.getElementById('modalTrasladar'));
    modalMateriaAdeudada = new bootstrap.Modal(document.getElementById('modalMateriaAdeudada'));
    // Reusar el modal de historial de reemplazos para movimientos y cadena de suplentes
    modalHistorialReemplazos = new bootstrap.Modal(document.getElementById('modalHistorialGenerico'));
});

// ============================
// CONTROL DE ACCESO Y PERMISOS SIDEBAR
// ============================

const SECCION_MODULO_MAP = {
    'docentes': 'docentes',
    'cargos': 'cargos',
    'tramitaciones': 'tramitaciones',
    'licencias': 'licencias',
    'planilla': 'planilla_firmas',
    'alumnos': 'estudiantes',
    'cursos_horarios': 'cursos_horarios',
    'usuarios': 'usuarios',
    'permisos': 'permisos',
    'auditoria': 'auditoria'
};

function tienePermisoModulo(modulo, nivel = 'lectura') {
    if (!usuarioActual) return false;

    // Perfil ADMINISTRADOR tiene acceso completo a todos los módulos
    const perfilNombre = (usuarioActual.perfil_nombre || '').toUpperCase();
    if (perfilNombre === 'ADMINISTRADOR') return true;

    if (!usuarioActual.permisos) return false;

    const permiso = usuarioActual.permisos[modulo];
    if (!permiso || permiso === 'ninguno') return false;

    if (nivel === 'lectura') {
        return permiso === 'lectura' || permiso === 'edicion';
    }
    if (nivel === 'edicion') {
        return permiso === 'edicion';
    }
    return false;
}

function aplicarPermisosSidebar() {
    if (!usuarioActual) return;

    const perfilNombre = (usuarioActual.perfil_nombre || '').toUpperCase();
    const esAdmin = perfilNombre === 'ADMINISTRADOR';

    document.querySelectorAll('.sidebar-link[data-modulo]').forEach(link => {
        const modulo = link.getAttribute('data-modulo');
        const tieneAcceso = esAdmin || tienePermisoModulo(modulo, 'lectura');

        if (tieneAcceso) {
            link.style.display = 'flex';
        } else {
            // Ocultar completamente (no deshabilitar) si no tiene permiso L o E
            link.style.display = 'none';
        }
    });
}

// ============================
// NAVEGACIÓN
// ============================

function mostrarSeccion(seccion) {
    // Si la sección corresponde a un módulo restringido, validar permiso de lectura antes de cargar
    const moduloRequerido = SECCION_MODULO_MAP[seccion];
    if (moduloRequerido && !tienePermisoModulo(moduloRequerido, 'lectura')) {
        alert("No cuenta con los permisos necesarios para acceder a este módulo.");
        mostrarSeccion('dashboard');
        return;
    }

    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        const onclickAttr = link.getAttribute('onclick') || '';
        if (onclickAttr.includes(`'${seccion}'`)) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(`seccion-${seccion}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Manejar visibilidad del header global
    const globalHeader = document.querySelector('.main-content > header');
    if (globalHeader) {
        globalHeader.style.display = (seccion === 'planilla') ? 'none' : 'flex';
    }

    if (seccion === 'dashboard') verInicio();
    if (seccion === 'docentes') verDocentes();
    if (seccion === 'cargos') verCargos();
    if (seccion === 'tramitaciones') verTramitaciones();
    if (seccion === 'licencias') verLicencias();
    if (seccion === 'planilla') verPlanillaFirmas();
    if (seccion === 'usuarios') verUsuarios();
    if (seccion === 'permisos') verPermisos();
    if (seccion === 'alumnos') verAlumnos();
    if (seccion === 'cursos_horarios') verCursosHorarios();
    if (seccion === 'auditoria') verAuditoria();
}

// ============================
// VALIDAR SESIÓN
// ============================

async function cargarUsuario() {
    const res = await api.get("/api/v1/usuarios/me");
    if (!res.ok) { window.location.href = "login.html"; return; }
    usuarioActual = await res.json();
    const perfilStr = usuarioActual.perfil_nombre ? usuarioActual.perfil_nombre : "Usuario";
    document.getElementById("titulo").innerText = `Bienvenido/a, ${usuarioActual.nombre}`;
    document.getElementById("userInfo").innerText = `Cargo: ${perfilStr} | Usuario: ${usuarioActual.username}`;

    // Aplicar filtrado dinámico del menú según permisos de lectura/edición
    aplicarPermisosSidebar();

    verInicio();
}

window.tienePermisoModulo = tienePermisoModulo;
window.aplicarPermisosSidebar = aplicarPermisosSidebar;

// ============================
// UTILS
// ============================

async function verCargosDocente(id) {
    const res = await api.get(`/api/v1/docentes/${id}/cargos`);
    if (!res.ok) return alert("Error");
    const data = await res.json();

    let html = `<table class="table table-sm"><thead><tr><th>Puesto</th><th>Tipo</th><th>Desde</th></tr></thead><tbody>`;
    if (data.length === 0) { html = "<p class='text-center p-3'>Sin cargos.</p>"; }
    else {
        data.forEach(c => {
            html += `<tr><td>${c.numero_puesto}</td><td>${c.tipo_cargo}</td><td>${c.fecha_inicio ? new Date(c.fecha_inicio).toLocaleDateString() : '-'}</td></tr>`;
        });
        html += "</tbody></table>";
    }
    document.getElementById("bodyCargosDocente").innerHTML = html;
    modalVerCargos.show();
}

async function logout() {
    await api.post("/api/v1/usuarios/logout");
    localStorage.removeItem('token');
    window.location.href = "login.html";
}

