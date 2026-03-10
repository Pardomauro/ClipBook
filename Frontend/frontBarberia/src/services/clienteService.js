import { get } from './api';

/**
 * =============================================================
 * SERVICIO DE CLIENTES
 * =============================================================
 * Servicio para manejar operaciones relacionadas con los clientes
 * Endpoint base: /api/v1/clientes
 */

/**
 * Obtener estadísticas de clientes de los últimos 7 días
 * @returns {Promise<object>} - { success: true, data: Array<{ fecha: string, cantidad: number }> }
 * @example
 * 
 * const response = await getEstadisticasUltimos7Dias();
 * console.log(response.data); // [{ fecha: '2026-03-01', cantidad: 5 }, ...]
 */
export const getEstadisticasUltimos7Dias = async () => {
    return await get('/clientes/estadisticas/ultimos-7-dias');
}

/**
 * Obtener lista de todos los clientes
 * @returns {Promise<object>} - { success: true, count: number, data: Array }
 */
export const getClientes = async () => {
    return await get('/clientes');
}

/**
 * Obtener un cliente por su ID
 * @param {string} id - UUID del cliente
 * @returns {Promise<object>} - { success: true, data: Object }
 */
export const getClienteById = async (id) => {
    return await get(`/clientes/${id}`);
}

/**
 * Obtener historial de turnos de un cliente
 * @param {string} id - UUID del cliente
 * @returns {Promise<object>} - { success: true, count: number, data: Array }
 */
export const getHistorialTurnos = async (id) => {
    return await get(`/clientes/${id}/turnos`);
}
