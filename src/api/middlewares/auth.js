const { verificarToken } = require('../utils/jwt.util');

module.exports = (req, res, next) => {
    // 1. Intentar obtener token del header Authorization
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verificarToken(token);
        
        if (decoded) {
            req.user = decoded; // Poblamos req.user desde JWT
            return next();
        }
    }

    // 2. Fallback: Verificar sesión tradicional
    if (req.session && req.session.user) {
        req.user = req.session.user; // Poblamos req.user desde Sesión para consistencia
        return next();
    }

    // 3. Fallo de ambos métodos
    return res.status(401).json({ error: "No autorizado. Inicie sesión para continuar." });
};
