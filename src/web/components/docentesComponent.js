// ============================
// MODULO DOCENTES
// ============================

async function cargarDocentesData() {
    const res = await api.get("/api/v1/docentes");
    if (res.ok) docentesGlobal = await res.json();
    else return false;
    return true;
}

async function verDocentes() {
    const success = await cargarDocentesData();
    if (!success) return alert("No tiene permiso para ver docentes");
    renderTabla(docentesGlobal);
}

function renderTabla(data) {
    const container = document.getElementById("tablaDocentes");
    if (data.length === 0) { container.innerHTML = "<p class='text-center p-4'>No hay docentes registrados.</p>"; return; }

    let html = `<table class="table table-hover align-middle">
        <thead class="table-light">
            <tr><th>RRHH ID</th><th>Apellido y Nombre</th><th>DNI</th><th>Email</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>`;

    data.forEach(d => {
        html += `<tr>
            <td><span class="badge bg-light text-dark">${d.rrhh_id}</span></td>
            <td><strong>${d.apellido}, ${d.nombre}</strong></td>
            <td>${d.dni}</td>
            <td>${d.email ?? '-'}</td>
            <td><span class="badge ${d.estado === 'activo' ? 'bg-success' : 'bg-secondary'}">${d.estado}</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-info" onclick="verCargosDocente(${d.id})"><i class="bi bi-briefcase"></i></button>
                    <button class="btn btn-sm btn-outline-warning" onclick="abrirModalEditar(${d.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarDocente(${d.id})"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>`;
    });
    html += "</tbody></table>";
    container.innerHTML = html;
}

async function filtrar() {
    const texto = document.getElementById("buscador").value.toLowerCase();
    const filtrados = docentesGlobal.filter(d =>
        d.apellido.toLowerCase().includes(texto) ||
        d.nombre.toLowerCase().includes(texto) ||
        d.dni.includes(texto)
    );
    renderTabla(filtrados);
}

function abrirModal() {
    document.getElementById("modalTitulo").innerText = "Nuevo Docente";
    document.getElementById("docenteId").value = "";
    document.querySelectorAll("#modalDocente input").forEach(i => i.value = "");
    modal.show();
}

function abrirModalEditar(id) {
    const d = docentesGlobal.find(doc => doc.id === id);
    if (!d) return;
    document.getElementById("modalTitulo").innerText = "Editar Docente";
    document.getElementById("docenteId").value = d.id;
    document.getElementById("rrhh_id").value = d.rrhh_id;
    document.getElementById("apellido").value = d.apellido;
    document.getElementById("nombre").value = d.nombre;
    document.getElementById("fechaNac").value = d.fechaNac ? d.fechaNac.split('T')[0] : "";
    document.getElementById("dni").value = d.dni;
    document.getElementById("cuil").value = d.cuil;
    document.getElementById("fichaCensal").value = d.fichaCensal;
    document.getElementById("email").value = d.email;
    document.getElementById("direccion").value = d.direccion;
    document.getElementById("telefono").value = d.telefono;
    document.getElementById("fecha_ingreso").value = d.fecha_ingreso ? d.fecha_ingreso.split('T')[0] : "";
    modal.show();
}

async function guardarDocente() {
    const data = {
        rrhh_id: document.getElementById("rrhh_id").value,
        apellido: document.getElementById("apellido").value,
        nombre: document.getElementById("nombre").value,
        fechaNac: document.getElementById("fechaNac").value,
        dni: document.getElementById("dni").value,
        cuil: document.getElementById("cuil").value,
        fichaCensal: document.getElementById("fichaCensal").value,
        email: document.getElementById("email").value,
        direccion: document.getElementById("direccion").value,
        telefono: document.getElementById("telefono").value,
        fecha_ingreso: document.getElementById("fecha_ingreso").value
    };
    const id = document.getElementById("docenteId").value;
    const url = id ? `/api/v1/docentes/${id}` : "/api/v1/docentes";
    const res = await (id ? api.put(url, data) : api.post(url, data));
    if (!res.ok) { const msg = await res.json(); alert("Error: " + msg); return; }
    modal.hide();
    verDocentes();
}

async function eliminarDocente(id) {
    if (!confirm("¿Desea eliminar este docente?")) return;
    await api.delete(`/api/v1/docentes/${id}`);
    verDocentes();
}

