module.exports = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "No autorizado. Inicie sesión para continuar." });
    }
    next();
};
