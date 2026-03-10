import { get, post, put, patch, del } from './api';

/**
 * =============================================================
 * SERVICIO DE SERVICIOS
 * ============================================================
 * Servicio para manejar operaciones relacionadas con los servicios que ofrece la barbería
 * Endpoint base: /api/v1/servicios
 */

/**
 * Obtener lista de servicios
 * @param {object} filtros - Filtros opcionales (ej: { activo: 'true', buscar: 'nombre' })
 * @returns {Promise<object>} - { ok: true, cantidad: number, servicios: Array }
 * @example
 * 
 */

export const getServicios = async (filtros = {}) => {
    return await get('/servicios', filtros);
}

/** 
 * Obtener un servicio por su ID
 * @param {string} servicio_id - UUID del servicio
 * @returns {Promise<object>} - { ok: true, servicio: Object }
 * @throws {Error} - Si el servicio no existe
 */
export const getServicioById = async (servicio_id) => {
    return await get(`/servicios/${servicio_id}`);
}



/**
 * Crear un nuevo servicio
 * @param {object} datosServicio - Datos del servicio a crear
 * @param {string} datosServicio.nombre_servicio - Nombre del servicio (ej: 'corte', 'corte + barba', 'tintura')
 * @param {number} datosServicio.precio_base - Precio base del servicio
 * @param {number} datosServicio.duracion - Duración estimada del servicio en minuto
 * @param {boolean} [datosServicio.activo=true] - Estado activo/inactivo del servicio
 * @return {Promise<object>} - { ok: true, mensaje: string, servicio: Object }
 * @throws {Error} - Si hay errores de validación
 * 
**/
export const createServicio = async (datosServicio) => {
    return await post('/servicios', datosServicio);
}

/**
 * Actualizar un servicio existente
 * @param {string} servicio_id - UUID del servicio a actualizar
 * @param {object} datosActualizados - Datos a actualizar (nombre_servicio, precio_base, duracion, activo)
 * @return {Promise<object>} - { ok: true, mensaje: string, servicio: Object }
 * @throws {Error} - Si el servicio no existe o hay errores de validación
 */
export const updateServicio = async (servicio_id, datosActualizados) => {
    return await put(`/servicios/${servicio_id}`, datosActualizados);
}

/**
 * Cambiar estado activo/inactivo de un servicio
 * @param {string} servicio_id - UUID del servicio
 * @param {boolean} activo - Nuevo estado (true para activo, false para inactivo)
 * @return {Promise<object>} - { ok: true, mensaje: string, servicio: Object }
 * @throws {Error} - Si el servicio no existe
 */
export const cambiarEstadoServicio = async (servicio_id, activo) => {
    return await patch(`/servicios/${servicio_id}/estado`, { activo });
}

/**
 * Eliminar un servicio
 * @param {String} servicio_id - UUID del servicio a eliminar
 * @return {Promise<object>} - { ok: true, mensaje: string }
 * @throws {Error} - Si el servicio no existe o tiene turnos asociados
*/
export const deleteServicio = async (servicio_id) => {
    return await del(`/servicios/${servicio_id}`);
} 