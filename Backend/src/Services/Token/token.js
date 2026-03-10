const jwt = require('jsonwebtoken');

/**
 * Utilidades para manejar JWT (JSON Web Tokens)
 * Para autenticación de barberos (administradores)
 */

/**
 * Generar token de acceso JWT
 * @param {Object} payload - Datos a incluir en el token (barbero_id, email, rol)
 * @param {String} expiresIn - Tiempo de expiración (ej: '7d', '1h', '30m')
 * @returns {String} Token JWT firmado
 */
const generarToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Generar token de recuperación de contraseña (válido por 1 hora)
 * @param {String} barbero_id - UUID del barbero
 * @returns {String} Token de recuperación
 */
const generarTokenRecuperacion = (barbero_id) => {
    return generarToken({ barbero_id, tipo: 'recuperacion' }, '1h');
};

/**
 * Verificar y decodificar un token JWT
 * @param {String} token - Token a verificar
 * @returns {Object} Payload decodificado del token
 * @throws {Error} Si el token es inválido o expiró
 */
const verificarToken = (token) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está definido en las variables de entorno');
        }
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expirado');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Token inválido');
        }
        throw error;
    }
};

module.exports = {
    generarToken,
    generarTokenRecuperacion,
    verificarToken
};