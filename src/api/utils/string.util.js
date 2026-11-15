/**
 * Utilidades para sanitización y normalización de cadenas de texto.
 */

/**
 * Normaliza un texto convirtiéndolo a MAYÚSCULAS, eliminando acentos/tildes/diacríticos
 * y espacios redundantes, preservando la letra 'Ñ' y caracteres alfanuméricos.
 * 
 * Ejemplo:
 *  "Educación Física" -> "EDUCACION FISICA"
 *  "  Peña   agüero " -> "PEÑA AGUERO"
 * 
 * @param {string|null|undefined} text 
 * @returns {string|null|undefined}
 */
function normalizeText(text) {
    if (text === null || text === undefined) {
        return text;
    }
    if (typeof text !== 'string') {
        return String(text);
    }

    const trimmed = text.trim();
    if (trimmed === '') {
        return '';
    }

    // 1. Proteger la 'ñ' y 'Ñ' para que el descomponer en NFD no la transforme en 'N'
    const preservedEnie = trimmed
        .replace(/ñ/g, '__ENIE_LOWER__')
        .replace(/Ñ/g, '__ENIE_UPPER__');

    // 2. Descomponer diacríticos (á -> a + \u0301) y remover marcas combinadas
    const withoutAccents = preservedEnie
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    // 3. Restaurar la Ñ en mayúsculas
    const withEnieRestored = withoutAccents
        .replace(/__ENIE_LOWER__/g, 'Ñ')
        .replace(/__ENIE_UPPER__/g, 'Ñ');

    // 4. Pasar a mayúsculas y normalizar múltiples espacios a uno solo
    return withEnieRestored
        .toUpperCase()
        .replace(/\s+/g, ' ');
}

/**
 * Normaliza un correo electrónico eliminando espacios y convirtiéndolo a minúsculas.
 * 
 * @param {string|null|undefined} email 
 * @returns {string|null|undefined}
 */
function normalizeEmail(email) {
    if (email === null || email === undefined) {
        return email;
    }
    if (typeof email !== 'string') {
        return String(email).trim().toLowerCase();
    }
    const trimmed = email.trim();
    return trimmed ? trimmed.toLowerCase() : '';
}

module.exports = {
    normalizeText,
    normalizeEmail
};
