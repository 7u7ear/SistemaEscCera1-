const { normalizeText, normalizeEmail } = require('../../src/api/utils/string.util');

describe('string.util', () => {
    describe('normalizeText', () => {
        test('debe convertir a mayúsculas y remover acentos/tildes simples y diéresis', () => {
            expect(normalizeText('Educación Física')).toBe('EDUCACION FISICA');
            expect(normalizeText('Fïsica')).toBe('FISICA');
            expect(normalizeText('matemática aplicada')).toBe('MATEMATICA APLICADA');
            expect(normalizeText('Agüero')).toBe('AGUERO');
            expect(normalizeText('árbol, camión, murciélago')).toBe('ARBOL, CAMION, MURCIELAGO');
        });

        test('debe preservar la letra Ñ tanto en mayúscula como en minúscula', () => {
            expect(normalizeText('Acuña')).toBe('ACUÑA');
            expect(normalizeText('PEÑA')).toBe('PEÑA');
            expect(normalizeText('Muñoz')).toBe('MUÑOZ');
            expect(normalizeText('diseño cerámico')).toBe('DISEÑO CERAMICO');
            expect(normalizeText('año lectivo')).toBe('AÑO LECTIVO');
        });

        test('debe colapsar espacios múltiples y recortar bordes', () => {
            expect(normalizeText('  Gómez    Juan   Carlos  ')).toBe('GOMEZ JUAN CARLOS');
        });

        test('debe manejar valores nulos, indefinidos o vacíos correctamente', () => {
            expect(normalizeText(null)).toBeNull();
            expect(normalizeText(undefined)).toBeUndefined();
            expect(normalizeText('')).toBe('');
            expect(normalizeText('   ')).toBe('');
        });
    });

    describe('normalizeEmail', () => {
        test('debe pasar el correo a minúsculas y quitar espacios en los extremos', () => {
            expect(normalizeEmail('  DOCENTE@ESCUELA.EDU.AR  ')).toBe('docente@escuela.edu.ar');
            expect(normalizeEmail('Profesor.Matematica@Gmail.Com')).toBe('profesor.matematica@gmail.com');
        });

        test('debe manejar valores nulos, indefinidos o vacíos', () => {
            expect(normalizeEmail(null)).toBeNull();
            expect(normalizeEmail(undefined)).toBeUndefined();
            expect(normalizeEmail('')).toBe('');
        });
    });
});
