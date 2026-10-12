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

function popularCheckboxesPerfiles(containerId, prefix, selectedIds = []) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!perfilesListaGlobal || perfilesListaGlobal.length === 0) {
        container.innerHTML = '<p class="text-muted small mb-0">No hay perfiles disponibles.</p>';
        return;
    }

    const selectedSet = new Set((selectedIds || []).map(Number));
    let html = '<div class="row g-2">';
    perfilesListaGlobal.forEach(p => {
        const isChecked = selectedSet.has(Number(p.id)) ? 'checked' : '';
        html += `
            <div class="col-sm-6">
                <div class="form-check p-2 border rounded bg-white h-100">
                    <input class="form-check-input ms-1 me-2" type="checkbox" value="${p.id}" id="${prefix}_${p.id}" ${isChecked}>
                    <label class="form-check-label small fw-bold text-dark user-select-none" for="${prefix}_${p.id}">
                        ${p.nombre}
                    </label>
                </div>
            </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
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

    popularCheckboxesPerfiles("usuarioPerfilesContainer", "editPerfil", userPerfilIds);

    modalUsuario.show();
}

async function guardarCambiosUsuario() {
    const id = document.getElementById("usuarioId").value;
    const estado = document.getElementById("usuarioEstado").value;

    const checkedBoxes = document.querySelectorAll("#usuarioPerfilesContainer input[type='checkbox']:checked");
    const perfil_ids = Array.from(checkedBoxes).map(cb => parseInt(cb.value, 10));

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
    popularCheckboxesPerfiles("crearPerfilesContainer", "crearPerfil", []);
    modalCrearUsuario.show();
}

async function ejecutarCrearUsuario() {
    const checkedBoxes = document.querySelectorAll("#crearPerfilesContainer input[type='checkbox']:checked");
    const perfil_ids = Array.from(checkedBoxes).map(cb => parseInt(cb.value, 10));

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

