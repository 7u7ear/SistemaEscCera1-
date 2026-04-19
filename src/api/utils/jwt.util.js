const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'ceramica_default_jwt_secret';
const JWT_EXPIRES_IN = '8h'; // Jornada laboral estándar

/**
 * Genera un token JWT para un usuario.
 * @param {Object} user Objeto del usuario (id, username, rol, etc.)
 * @returns {string} Token firmado
 */
const generarToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            rol: user.rol_nombre || user.rol 
        }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES_IN }
    );
};

/**
 * Verifica la validez de un token JWT.
 * @param {string} token 
 * @returns {Object|null} Payload decodificado o null si es inválido
 */
const verificarToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generarToken,
    verificarToken
};
