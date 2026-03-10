import { get, post, put } from './api';

/**
 * =============================================================
 * SERVICIO DE AUTENTICACIÓN
 * =============================================================
 * Servicio para manejar login, logout y verificación de sesión de barberos
 * Endpoint base: /api/v1/auth
 */

/**
 * Login de barbero (administrador)
 * @param {string} email - Email del barbero
 * @param {string} password - Contraseña
 * @returns {Promise<object>} - { success: true, data: { token, barbero } }
 * @throws {Error} - Si las credenciales son inválidas
 */
export const login = async (email, password) => {
    const response = await post('/auth/login', { email, password });
    
    // Guardar token y datos del barbero en localStorage
    if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('barbero', JSON.stringify(response.data.barbero));
    }
    
    return response;
};

/**
 * Logout - Eliminar token y datos del barbero
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('barbero');
};

/**
 * Verificar si el token es válido
 * @returns {Promise<object>} - { success: true, data: { barbero_id, email, nombre_completo } }
 * @throws {Error} - Si el token es inválido o expiró
 */
export const verificarToken = async () => {
    return await post('/auth/verificar');
};

/**
 * Obtener perfil del barbero autenticado
 * @returns {Promise<object>} - { success: true, data: barbero }
 * @throws {Error} - Si no está autenticado
 */
export const obtenerPerfil = async () => {
    return await get('/auth/perfil');
};

/**
 * Cambiar contraseña del barbero autenticado
 * @param {string} passwordActual - Contraseña actual
 * @param {string} passwordNuevo - Nueva contraseña
 * @param {string} passwordConfirmacion - Confirmación de la nueva contraseña
 * @returns {Promise<object>} - { success: true, message: string }
 * @throws {Error} - Si la contraseña actual es incorrecta
 */
export const cambiarPassword = async (passwordActual, passwordNuevo, passwordConfirmacion) => {
    return await put('/auth/cambiar-password', {
        passwordActual,
        passwordNuevo,
        passwordConfirmacion
    });
};

/**
 * Obtener token del localStorage
 * @returns {string|null} - Token JWT o null si no existe
 */
export const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Obtener datos del barbero autenticado del localStorage
 * @returns {object|null} - Objeto barbero o null si no existe
 */
export const getBarbero = () => {
    const barbero = localStorage.getItem('barbero');
    return barbero ? JSON.parse(barbero) : null;
};

/**
 * Verificar si hay una sesión activa (solo verifica localStorage, no valida el token)
 * @returns {boolean} - true si hay token, false si no
 */
export const isAuthenticated = () => {
    return !!getToken();
};
