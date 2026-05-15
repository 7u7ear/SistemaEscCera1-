// ============================
// MODULO MATRIZ DE PERMISOS (RBAC)
// ============================

let matrizPermisosGlobal = null;

async function cargarMatrizData() {
    const res = await api.get("/api/v1/permisos/matriz");
    if (res.ok) matrizPermisosGlobal = await res.json();
    else return false;
    return true;
}

async function verPermisos() {
    const success = await cargarMatrizData();
    if (!success) return alert("No tiene permiso para ver la matriz de seguridad");
    renderMatriz(matrizPermisosGlobal);
}

function renderMatriz(data) {
    const container = document.getElementById("contenedorMatrizPermisos");
    const { perfiles, modulos, permisos } = data;

    // Ordenar perfiles: ADMINISTRADOR primero, SECRETARIO segundo, el resto después
    perfiles.sort((a, b) => {
        const order = { 'ADMINISTRADOR': 1, 'SECRETARIO': 2 };
        const valA = order[a.nombre.toUpperCase()] || 99;
        const valB = order[b.nombre.toUpperCase()] || 99;
        return valA - valB;
    });

    let html = `<table class="table table-bordered align-middle text-center shadow-sm" style="border-collapse: separate; border-spacing: 0;">
        <thead class="table-dark sticky-top">
            <tr>
                <th class="text-start bg-dark table-sticky-column" style="z-index: 40; min-width: 180px;">Módulos / Perfiles</th>`;
    
    // Encabezados de Perfiles
    perfiles.forEach(p => {
        html += `<th style="min-width: 120px;">${p.nombre}</th>`;
    });
    html += `</tr></thead><tbody>`;

    // Filas de Módulos
    modulos.forEach(m => {
        html += `<tr>
            <td class="text-start fw-bold bg-light table-sticky-column">${m.nombre.toUpperCase()}</td>`;
        
        perfiles.forEach(p => {
            const perm = permisos.find(pr => pr.perfil_id === p.id && pr.modulo_id === m.id);
            const val = perm ? perm.permiso : 'ninguno';

            html += `<td>
                <select class="form-select form-select-sm border-0 bg-transparent text-center" 
                        onchange="actualizarPermiso(${p.id}, ${m.id}, this.value)"
                        style="color: ${getColorPermiso(val)}; font-weight: bold;">
                    <option value="ninguno" ${val === 'ninguno' ? 'selected' : ''}>❌ Bloqueado</option>
                    <option value="lectura" ${val === 'lectura' ? 'selected' : ''}>👁️ Lectura</option>
                    <option value="edicion" ${val === 'edicion' ? 'selected' : ''}>✍️ Edición (Full)</option>
                </select>
            </td>`;
        });
        html += `</tr>`;
    });

    html += "</tbody></table>";
    container.innerHTML = html;
}

function getColorPermiso(val) {
    if (val === 'edicion') return '#2dce89'; // Verde
    if (val === 'lectura') return '#11cdef'; // Celeste
    return '#f5365c'; // Rojo
}

async function actualizarPermiso(perfil_id, modulo_id, permiso) {
    const res = await api.post("/api/v1/permisos/update", { perfil_id, modulo_id, permiso });
    if (!res.ok) {
        alert("Error al actualizar permiso. Verifique sus privilegios.");
        verPermisos(); // Recargar para revertir visualmente
    } else {
        // Opcional: Feedback visual suave
        console.log(`Permiso actualizado: Perfil ${perfil_id}, Módulo ${modulo_id} -> ${permiso}`);
    }
}
