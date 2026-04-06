const express = require("express");
const session = require("express-session");
const path = require("path");

const usuariosRoutes = require("./routes/usuarios");
const docentesRoutes = require("./routes/docentes");
const estudiantesRoutes = require("./routes/estudiantes");
const cargosRoutes = require("./routes/cargos");
const materiasRoutes = require("./routes/materias");
const tramitacionesRoutes = require("./routes/tramitaciones");
const codigosRoutes = require("./routes/codigos_tramite");
const cursosRoutes = require("./routes/cursos");
const licenciasRoutes = require("./routes/licencias");

const app = express();

// ==================
// CONFIGURACIÓN
// ==================

app.use(express.json());

app.use(session({
    secret: "ceramica",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax"
    }
}));

// ==================
// ARCHIVOS ESTÁTICOS
// ==================

app.use(express.static(path.join(__dirname, "../frontend")));

// ==================
// RUTAS API
// ==================

app.use("/usuarios", usuariosRoutes);
app.use("/docentes", docentesRoutes);
app.use("/estudiantes", estudiantesRoutes);
app.use("/cargos", cargosRoutes);
app.use("/materias", materiasRoutes);
app.use("/tramitaciones", tramitacionesRoutes);
app.use("/codigos-tramite", codigosRoutes);
app.use("/cursos", cursosRoutes);
app.use("/licencias", licenciasRoutes);

// ==================
// RUTA PRINCIPAL
// ==================

app.get("/", (req, res) => {
    res.redirect("/login.html");
});

// ==================
// SERVIDOR
// ==================

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});