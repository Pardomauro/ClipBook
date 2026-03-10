import { get, post, put, patch, del } from './api';

/**
 * =============================================================
 * SERVICIO DE BARBEROS
 * =============================================================
 * Servicio para manejar operaciones relacionadas con los barberos
 * Endpoint base: /api/v1/barberos
 */

/**
 * Obtener lista de barberos
 * @param {object} filtros - Filtros opcionales (ej: { activo: 'true', buscar: 'nombre' })
 * @returns {Promise<object>} - { success: true, count: number, data: Array }
 * @example
 * 
 * // Obtener todos los barberos
 * const response = await getBarberos();
 * console.log(response.data); // Array de barberos
 * 
 * // Obtener solo barberos activos
 * const activos = await getBarberos({ activo: 'true' });
 */
export const getBarberos = async (filtros = {}) => {
    return await get('/barberos', filtros);
}

/**
 * Obtener un barbero por su ID
 * @param {string} id - UUID del barbero
 * @returns {Promise<object>} - { ok: true, barbero: Object }
 * @throws {Error} - Si el barbero no existe
 */
export const getBarberoById = async (id) => {
    return await get(`/barberos/${id}`);
}

/**
 * Obtener agenda/turnos de un barbero
 * @param {string} id - UUID del barbero
 * @returns {Promise<object>} - { ok: true, barbero: Object, turnos: Array }
 */
export const getAgendaBarbero = async (id) => {
    return await get(`/barberos/${id}/agenda`);
}

/**
 * Crear un nuevo barbero
 * @param {object} datosBarbero - Datos del barbero a crear
 * @param {string} datosBarbero.nombre_completo - Nombre completo del barbero
 * @param {string} datosBarbero.email - Email del barbero
 * @param {string} datosBarbero.celular - Número de celular
 * @param {string} [datosBarbero.direccion] - Dirección (opcional)
 * @param {string} [datosBarbero.imagen_url] - URL de imagen (opcional)
 * @param {boolean} [datosBarbero.activo=true] - Estado activo/inactivo
 * @returns {Promise<object>} - { ok: true, mensaje: string, barbero: Object }
 * @throws {Error} - Si hay errores de validación
 */
export const createBarbero = async (datosBarbero) => {
    return await post('/barberos', datosBarbero);
}

/**
 * Actualizar un barbero existente
 * @param {string} id - UUID del barbero
 * @param {object} datosBarbero - Datos a actualizar (parcial o completo)
 * @returns {Promise<object>} - { ok: true, mensaje: string, barbero: Object }
 * @throws {Error} - Si el barbero no existe o hay errores de validación
 */
export const updateBarbero = async (id, datosBarbero) => {
    return await put(`/barberos/${id}`, datosBarbero);
}

/**
 * Cambiar estado activo/inactivo de un barbero
 * @param {string} id - UUID del barbero
 * @param {boolean} activo - true para activar, false para desactivar
 * @returns {Promise<object>} - { ok: true, mensaje: string, barbero: Object }
 * @throws {Error} - Si el barbero no existe
 */
export const cambiarEstadoBarbero = async (id, activo) => {
    return await patch(`/barberos/${id}/estado`, { activo });
}

/**
 * Eliminar un barbero
 * @param {string} id - UUID del barbero
 * @returns {Promise<object>} - { ok: true, mensaje: string }
 * @throws {Error} - Si el barbero no existe o tiene turnos asociados
 */
export const deleteBarbero = async (id) => {
    return await del(`/barberos/${id}`);
}


