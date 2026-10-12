// ============================
// MODULO USUARIOS
// ============================

let perfilesListaGlobal = [];

async function cargarUsuariosData() {
    const res = await api.get("/api/v1/usuarios");
    if (res.ok) usuariosGlobal = await res.json();

    const resP = await api.get("/api/v1/usuarios/perfiles");
    if (resP.ok) {
        perfilesListaGlobal = await resP.json();
    }

    if (!res.ok) return false;
    return true;
}

/** Genera el HTML de un <select> de perfil con botón × para eliminar la fila */
function _crearFilaSelectPerfil(containerId, valorSeleccionado = '') {
    const row = document.createElement('div');
    row.className = 'd-flex gap-2 mb-2 align-items-center perfil-fila';

    const sel = document.createElement('select');
    sel.className = 'form-select form-select-sm perfil-select';

    const optBlank = document.createElement('option');
    optBlank.value = '';
    optBlank.textContent = '-- Seleccionar perfil --';
    sel.appendChild(optBlank);

    perfilesListaGlobal.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nombre;
        if (String(p.id) === String(valorSeleccionado)) opt.selected = true;
        sel.appendChild(opt);
    });

    const btnQuitar = document.createElement('button');
    btnQuitar.type = 'button';
    btnQuitar.className = 'btn btn-outline-danger btn-sm flex-shrink-0';
    btnQuitar.title = 'Quitar este perfil';
    btnQuitar.innerHTML = '<i class="bi bi-x-lg"></i>';
    btnQuitar.onclick = () => {
        const container = document.getElementById(containerId);
        if (container && container.querySelectorAll('.perfil-fila').length > 1) {
            row.remove();
        } else {
            // Si es la única fila, solo limpiar el valor
            sel.value = '';
        }
    };

    row.appendChild(sel);
    row.appendChild(btnQuitar);
    return row;
}

/** Inicializa (o reinicia) el contenedor con filas según los IDs dados */
function renderFilasPerfiles(containerId, selectedIds = []) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const ids = selectedIds.length > 0 ? selectedIds : [''];
    ids.forEach(id => {
        container.appendChild(_crearFilaSelectPerfil(containerId, id));
    });
}

/** Agrega una nueva fila de select vacía */
function agregarFilaPerfil(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.appendChild(_crearFilaSelectPerfil(containerId, ''));
}

/** Lee los IDs seleccionados en el contenedor (sin duplicados, sin vacíos) */
function leerPerfilIds(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    const vals = Array.from(container.querySelectorAll('.perfil-select'))
        .map(sel => parseInt(sel.value, 10))
        .filter(v => !isNaN(v) && v > 0);
    return [...new Set(vals)]; // eliminar duplicados
}

async function verUsuarios() {
    const success = await cargarUsuariosData();
    if (!success) return alert("No tiene permiso para ver usuarios");
    renderTablaUsuarios(usuariosGlobal);
}

function renderTablaUsuarios(data) {
    const container = document.getElementById("tablaUsuarios");
    if (data.length === 0) { container.innerHTML = "<p class='text-center p-4'>No hay usuarios registrados.</p>"; return; }

    // Separar pendientes de activos/otros
    const pendientes = data.filter(u => u.estado === 'pendiente');
    const otros = data.filter(u => u.estado !== 'pendiente');

    let html = "";

    if (pendientes.length > 0) {
        html += `<div class="alert alert-warning border-0 shadow-sm mb-4">
            <h6 class="fw-bold mb-2"><i class="bi bi-exclamation-triangle-fill"></i> Usuarios Pendientes de Aprobación</h6>
            <table class="table table-sm table-hover align-middle mb-0 bg-white rounded">
                <thead><tr><th>Usuario</th><th>Nombre</th><th>Acciones</th></tr></thead>
                <tbody>`;
        pendientes.forEach(u => {
            html += `<tr>
                <td><strong>${u.username}</strong></td>
                <td>${u.nombre}</td>
                <td>
                    <button class="btn btn-sm btn-success fw-bold" onclick="gestionarUsuario(${u.id})">Aprobar / Perfiles</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="cambiarEstadoUsuario(${u.id}, 'rechazado')">Rechazar</button>
                </td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
    }

    html += `<h6 class="fw-bold mb-3 text-muted">Todos los Usuarios</h6>
    <table class="table table-hover align-middle">
        <thead class="table-light">
            <tr><th>Usuario</th><th>Nombre</th><th>Perfiles (Roles)</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>`;

    otros.forEach(u => {
        let perfilesBadges = '';
        if (Array.isArray(u.perfiles_nombres) && u.perfiles_nombres.length > 0) {
            perfilesBadges = u.perfiles_nombres.map(p => `<span class="badge bg-primary me-1">${p}</span>`).join('');
        } else if (u.perfil_nombre) {
            perfilesBadges = u.perfil_nombre.split(', ').map(p => `<span class="badge bg-primary me-1">${p}</span>`).join('');
        } else {
            perfilesBadges = `<span class="badge bg-secondary">Sin Perfil</span>`;
        }

        html += `<tr>
            <td><span class="badge bg-light text-dark">${u.username}</span></td>
            <td>${u.nombre}</td>
            <td>${perfilesBadges}</td>
            <td><span class="badge ${u.estado === 'activo' ? 'bg-success' : 'bg-secondary'}">${u.estado}</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" title="Gestionar Perfiles / Estado" onclick="gestionarUsuario(${u.id})"><i class="bi bi-shield-lock"></i></button>
                    <button class="btn btn-sm btn-outline-warning" title="Pausar / Pasar a Pendiente" onclick="cambiarEstadoUsuario(${u.id}, 'pendiente')"><i class="bi bi-pause"></i></button>
                </div>
            </td>
        </tr>`;
    });
    html += "</tbody></table>";
    container.innerHTML = html;
}

async function gestionarUsuario(id) {
    const u = usuariosGlobal.find(user => user.id === id);
    if (!u) return;

    if (!perfilesListaGlobal || perfilesListaGlobal.length === 0) {
        const resP = await api.get("/api/v1/usuarios/perfiles");
        if (resP.ok) {
            perfilesListaGlobal = await resP.json();
        }
    }

    document.getElementById("usuarioId").value = u.id;
    document.getElementById("usuarioNombre").value = u.nombre;
    document.getElementById("usuarioUsername").value = u.username;
    document.getElementById("usuarioEstado").value = u.estado;

    const userPerfilIds = Array.isArray(u.perfil_ids) && u.perfil_ids.length > 0
        ? u.perfil_ids
        : (u.perfil_id ? [u.perfil_id] : []);

    renderFilasPerfiles("usuarioPerfilesContainer", userPerfilIds);

    modalUsuario.show();
}

async function guardarCambiosUsuario() {
    const id = document.getElementById("usuarioId").value;
    const estado = document.getElementById("usuarioEstado").value;

    const perfil_ids = leerPerfilIds("usuarioPerfilesContainer");

    if (perfil_ids.length === 0 && estado === 'activo') {
        alert("Debe asignar al menos un perfil para activar al usuario");
        return;
    }

    try {
        // Guardar Perfiles
        const resPerfil = await api.patch(`/api/v1/usuarios/${id}/perfil`, { perfil_ids });
        if (!resPerfil.ok) {
            const err = await resPerfil.json();
            alert("Error al actualizar perfiles: " + api.getErrorMessage(err));
            return;
        }

        // Guardar Estado
        const resEstado = await api.patch(`/api/v1/usuarios/${id}/status`, { estado });
        if (!resEstado.ok) {
            const err = await resEstado.json();
            alert("Error al actualizar estado: " + api.getErrorMessage(err));
            return;
        }

        modalUsuario.hide();
        await verUsuarios();
    } catch (err) {
        alert("Error al guardar cambios: " + api.getErrorMessage(err));
    }
}

async function cambiarEstadoUsuario(id, estado) {
    if (!confirm(`¿Desea cambiar el estado del usuario a ${estado}?`)) return;
    try {
        const res = await api.patch(`/api/v1/usuarios/${id}/status`, { estado });
        if (res.ok) {
            await verUsuarios();
        } else {
            const err = await res.json();
            alert("Error al cambiar estado: " + api.getErrorMessage(err));
        }
    } catch (err) {
        alert("Error al cambiar estado: " + api.getErrorMessage(err));
    }
}

async function abrirModalCrearUsuario() {
    if (!perfilesListaGlobal || perfilesListaGlobal.length === 0) {
        const resP = await api.get("/api/v1/usuarios/perfiles");
        if (resP.ok) perfilesListaGlobal = await resP.json();
    }
    document.querySelectorAll("#modalCrearUsuario input").forEach(i => i.value = "");
    renderFilasPerfiles("crearPerfilesContainer", []);
    modalCrearUsuario.show();
}

async function ejecutarCrearUsuario() {
    const perfil_ids = leerPerfilIds("crearPerfilesContainer");

    const data = {
        nombre: document.getElementById("crearNombre").value.trim(),
        username: document.getElementById("crearUsername").value.trim(),
        password: document.getElementById("crearPassword").value,
        perfil_ids: perfil_ids
    };

    if (!data.nombre || !data.username || !data.password) return alert("Complete todos los campos obligatorios");

    try {
        const res = await api.post("/api/v1/usuarios/admin-create", data);
        if (res.ok) {
            modalCrearUsuario.hide();
            await verUsuarios();
        } else {
            const err = await res.json();
            alert("Error al crear usuario: " + api.getErrorMessage(err));
        }
    } catch (err) {
        alert("Error al crear usuario: " + api.getErrorMessage(err));
    }
}

