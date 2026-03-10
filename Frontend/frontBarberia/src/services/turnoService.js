import { get, post, put, patch, del } from './api';

/**
 * =============================================================
 * SERVICIO DE TURNOS
 * =============================================================
 * Servicio para manejar operaciones relacionadas con los turnos/agendas de los barberos
 * Endpoint base: /api/v1/turnos
 */

/** 
 * Obtener un turno por ID
 * @param {string} turno_id - UUID del turno
 * @return {Promise<object>} - { ok: true, turno: Object }
 * @throws {Error} - Si el turno no existe
 */
export const getTurnoById = async (turno_id) => {
    return await get(`/turnos/${turno_id}`);
}


/**
 * Obtener turnos por barbero
 * @param {string} barbero_id - UUID del barbero
 * @param {object} filtros - Filtros opcionales (ej: { fecha: '2024-06-30', estado: 'pendiente' })
 * @return {Promise<object>} - { ok: true, cantidad: number, turnos: Array }
 * @throws {Error} - Si el barbero no existe
 */
export const getTurnosByBarbero = async (barbero_id, filtros = {}) => {
    return await get(`/turnos/barbero/${barbero_id}`, filtros);
}

/**
 * Obtener turnos por cliente
 * @param {string} cliente_id - UUID del cliente
 * @return {Promise<object>} - { ok: true, cantidad: number, turnos: Array }
 * @throws {Error} - Si el cliente no existe
 */
export const getTurnosByCliente = async (cliente_id) => {
    return await get(`/turnos/cliente/${cliente_id}`);
}

/**
 * Obtener turnos por fecha
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @return {Promise<object>} - { ok: true, cantidad: number, turnos: Array }
 */
export const getTurnosByFecha = async (fecha) => {
    return await get('/turnos/fecha', { fecha });
}

/**
 * Obtener horarios disponibles para un barbero en una fecha específica
 * @param {string} barbero_id - UUID del barbero
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} servicio_id - UUID del servicio (para calcular duración)
 * @return {Promise<object>} - { ok: true, horarios: Array }
 * @throws {Error} - Si el barbero no existe o hay errores de validación
 */
export const getHorariosDisponibles = async (barbero_id, fecha, servicio_id) => {
    return await get('/turnos/disponibles', { barbero_id, fecha, servicio_id });
}

/** 
 * Crear un nuevo turno
 * @param {object} datosTurno - Datos del turno a crear
 * @param {string} datosTurno.cliente_id - UUID del cliente (opcional)
 * @param {object} datosTurno.cliente - Datos del cliente (opcional)
 * @param {string} datosTurno.barbero_id - UUID del barbero
 * @param {string} datosTurno.servicio_id - UUID del servicio
 * @param {string} datosTurno.fecha_turno - Fecha del turno en formato YYYY-MM-DD
 * @param {string} datosTurno.hora_inicio - Hora de inicio en formato HH:mm
 * @param {number} datosTurno.precio_final - Precio final del turno (opcional)
 * @return {Promise<object>} - { ok: true, mensaje: string, turno: Object }
 * @throws {Error} - Si hay errores de validación
 */
export const createTurno = async (datosTurno) => {
    return await post('/turnos', datosTurno);
}

/**
 * Actualizar el estado de un turno 
 * @param {string} turno_id - UUID del turno a actualizar
 * @param {string} nuevoEstado - Nuevo estado del turno ('pendiente', 'confirmado', 'finalizado', 'cancelado')
 * @return {Promise<object>} - { ok: true, mensaje: string, turno: Object }
 * @throws {Error} - Si el turno no existe o hay errores de validación
 */
export const actualizarEstadoTurno = async (turno_id, nuevoEstado) => {
    return await patch(`/turnos/${turno_id}/estado`, { estado: nuevoEstado });
}

/**
 * Cancelar un turno
 * @param {string} turno_id - UUID del turno a cancelar
 * @return {Promise<object>} - { ok: true, mensaje: string, turno: Object }
 * @throws {Error} - Si el turno no existe o hay errores de validación
 */
export const cancelarTurno = async (turno_id) => {
    return await patch(`/turnos/${turno_id}/cancelar`, {});
}

/**
 * Obtener estadísticas de ingresos del mes actual
 * @param {string|null} barbero_id - UUID del barbero (opcional, filtra por barbero)
 * @return {Promise<object>} - { ok: true, estadisticas: Object }
 * @throws {Error} - Si hay errores al obtener las estadísticas
 */
export const getEstadisticasIngresosMes = async (barbero_id = null) => {
    const url = barbero_id 
        ? `/turnos/estadisticas/ingresos-mes?barbero_id=${barbero_id}`
        : '/turnos/estadisticas/ingresos-mes';
    return await get(url);
}

/**
 * Obtener estadísticas de la última semana
 * @param {string|null} barbero_id - UUID del barbero (opcional, filtra por barbero)
 * @return {Promise<object>} - { ok: true, estadisticas: Object }
 * @throws {Error} - Si hay errores al obtener las estadísticas
 */
export const getEstadisticasSemana = async (barbero_id = null) => {
    const url = barbero_id 
        ? `/turnos/estadisticas/semana?barbero_id=${barbero_id}`
        : '/turnos/estadisticas/semana';
    return await get(url);
}

/**
 * Obtener cantidad de clientes únicos del barbero en los últimos 7 días
 * @param {string} barbero_id - UUID del barbero
 * @return {Promise<object>} - { ok: true, cantidad: number }
 * @throws {Error} - Si hay errores al obtener las estadísticas
 */
export const getClientesUnicosBarbero = async (barbero_id) => {
    return await get(`/turnos/estadisticas/clientes-barbero/${barbero_id}`);
}

/**
 * Obtener turnos por día en los últimos 7 días
 * @param {string|null} barbero_id - UUID del barbero (opcional, filtra por barbero)
 * @return {Promise<object>} - { ok: true, data: Array }
 * @throws {Error} - Si hay errores al obtener las estadísticas
 */
export const getTurnosPorDia = async (barbero_id = null) => {
    const url = barbero_id 
        ? `/turnos/estadisticas/turnos-por-dia?barbero_id=${barbero_id}`
        : '/turnos/estadisticas/turnos-por-dia';
    return await get(url);
}