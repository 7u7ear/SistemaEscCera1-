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
        popularSelectsPerfiles();
    }

    if (!res.ok) return false;
    return true;
}

function popularSelectsPerfiles() {
    const selects = [document.getElementById("usuarioPerfil"), document.getElementById("crearPerfil")];
    selects.forEach(sel => {
        if (!sel) return;
        const currentVal = sel.value;
        sel.innerHTML = '<option value="">-- Seleccionar Perfil --</option>';
        perfilesListaGlobal.forEach(p => {
            sel.innerHTML += `<option value="${p.id}">${p.nombre}</option>`;
        });
        sel.value = currentVal;
    });
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
                    <button class="btn btn-sm btn-success fw-bold" onclick="gestionarUsuario(${u.id})">Aprobar / Perfil</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="cambiarEstadoUsuario(${u.id}, 'rechazado')">Rechazar</button>
                </td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
    }

    html += `<h6 class="fw-bold mb-3 text-muted">Todos los Usuarios</h6>
    <table class="table table-hover align-middle">
        <thead class="table-light">
            <tr><th>Usuario</th><th>Nombre</th><th>Perfil</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>`;

    otros.forEach(u => {
        html += `<tr>
            <td><span class="badge bg-light text-dark">${u.username}</span></td>
            <td>${u.nombre}</td>
            <td>${u.perfil_nombre
                ? `<span class="badge bg-primary">${u.perfil_nombre}</span>`
                : `<span class="badge bg-secondary">Sin Perfil</span>`
            }</td>
            <td><span class="badge ${u.estado === 'activo' ? 'bg-success' : 'bg-secondary'}">${u.estado}</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" onclick="gestionarUsuario(${u.id})"><i class="bi bi-shield-lock"></i></button>
                    <button class="btn btn-sm btn-outline-warning" onclick="cambiarEstadoUsuario(${u.id}, 'pendiente')"><i class="bi bi-pause"></i></button>
                </div>
            </td>
        </tr>`;
    });
    html += "</tbody></table>";
    container.innerHTML = html;
}

function gestionarUsuario(id) {
    const u = usuariosGlobal.find(user => user.id === id);
    if (!u) return;

    document.getElementById("usuarioId").value = u.id;
    document.getElementById("usuarioNombre").value = u.nombre;
    document.getElementById("usuarioUsername").value = u.username;
    document.getElementById("usuarioPerfil").value = u.perfil_id || "";
    document.getElementById("usuarioEstado").value = u.estado;

    modalUsuario.show();
}

async function guardarCambiosUsuario() {
    const id = document.getElementById("usuarioId").value;
    const perfil_id = document.getElementById("usuarioPerfil").value;
    const estado = document.getElementById("usuarioEstado").value;

    if (!perfil_id && estado === 'activo') {
        alert("Debe asignar un perfil para activar al usuario");
        return;
    }

    // Guardar Perfil
    const resPerfil = await api.patch(`/api/v1/usuarios/${id}/perfil`, { perfil_id });
    if (!resPerfil.ok) {
        const err = await resPerfil.json();
        alert("Error al actualizar perfil: " + api.getErrorMessage(err));
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
    verUsuarios();
}

async function cambiarEstadoUsuario(id, estado) {
    if (!confirm(`¿Desea cambiar el estado del usuario a ${estado}?`)) return;
    const res = await api.patch(`/api/v1/usuarios/${id}/status`, { estado });
    if (res.ok) {
        verUsuarios();
    } else {
        const err = await res.json();
        alert("Error al cambiar estado: " + api.getErrorMessage(err));
    }
}

function abrirModalCrearUsuario() {
    document.querySelectorAll("#modalCrearUsuario input").forEach(i => i.value = "");
    modalCrearUsuario.show();
}

async function ejecutarCrearUsuario() {
    const data = {
        nombre: document.getElementById("crearNombre").value,
        username: document.getElementById("crearUsername").value,
        password: document.getElementById("crearPassword").value,
        perfil_id: document.getElementById("crearPerfil").value
    };

    if (!data.nombre || !data.username || !data.password) return alert("Complete todos los campos");

    const res = await api.post("/api/v1/usuarios/admin-create", data);
    if (res.ok) {
        modalCrearUsuario.hide();
        verUsuarios();
    } else {
        const err = await res.json();
        alert("Error al crear usuario: " + api.getErrorMessage(err));
    }
}
