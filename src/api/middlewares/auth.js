const { verificarToken } = require('../utils/jwt.util');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verificarToken(token);

        if (decoded) {
            req.user = decoded;
            return next();
        }
    }

    return res.status(401).json({ error: 'No autorizado. Inicie sesión para continuar.' });
};
