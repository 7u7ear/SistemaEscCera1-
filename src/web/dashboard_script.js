
let docentesGlobal = [];
let cargosGlobal = [];
let materiasGlobal = [];
let cursosGlobal = [];
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
});

// ============================
// NAVEGACIÓN
// ============================

function mostrarSeccion(seccion) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.toLowerCase().includes(seccion)) link.classList.add('active');
    });

    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`seccion-${seccion}`).classList.add('active');
    
    // Manejar visibilidad del header global
    const globalHeader = document.querySelector('.main-content > header');
    if (globalHeader) {
        globalHeader.style.display = (seccion === 'planilla') ? 'none' : 'flex';
    }

    if (seccion === 'docentes') verDocentes();
    if (seccion === 'cargos') verCargos();
    if (seccion === 'tramitaciones') verTramitaciones();
    if (seccion === 'licencias') verLicencias();
    if (seccion === 'planilla') verPlanillaFirmas();
}

// ============================
// VALIDAR SESIÓN
// ============================

async function cargarUsuario() {
    const res = await api.get("/api/v1/usuarios/me");
    if (!res.ok) { window.location.href = "login.html"; return; }
    usuarioActual = await res.json();
    document.getElementById("titulo").innerText = "Bienvenido/a " + usuarioActual.nombre;
    document.getElementById("userInfo").innerText = `Usuario: ${usuarioActual.username}`;
}

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

