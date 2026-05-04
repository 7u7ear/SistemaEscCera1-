const logger = require('../services/logger.service');

const xssClean = (req, res, next) => {
    try {
        if (req.body) {
            for (let key in req.body) {
                if (typeof req.body[key] === 'string') {
                    // Reemplazamos los < y > simples para evitar tags HTML
                    req.body[key] = req.body[key].replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }
            }
        }
        if (req.query) {
            for (let key in req.query) {
                if (typeof req.query[key] === 'string') {
                    req.query[key] = req.query[key].replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }
            }
        }
        next();
    } catch (err) {
        logger.error(`Error en XSS Sanitize: ${err.message}`);
        next(err);
    }
};

module.exports = xssClean;
