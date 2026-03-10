const turnosService = require('../../Services/Turnos/turnosService');

/**
 * CREAR UN NUEVO TURNO
 * POST /api/v1/turnos
 */
const crearTurno = async (req, res) => {
    try {
        const turno = await turnosService.crearTurno(req.body);
        
        res.status(201).json({
            ok: true,
            mensaje: 'Turno creado exitosamente',
            turno
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * OBTENER HORARIOS DISPONIBLES DE UN BARBERO
 * GET /api/v1/turnos/disponibles?barbero_id=xxx&fecha=YYYY-MM-DD&servicio_id=xxx
 */
const obtenerHorariosDisponibles = async (req, res) => {
    try {
        const { barbero_id, fecha, servicio_id } = req.query;
        
        const horariosDisponibles = await turnosService.obtenerHorariosDisponibles(
            barbero_id,
            fecha,
            servicio_id
        );
        
        res.status(200).json({
            ok: true,
            fecha,
            barbero_id,
            cantidad: horariosDisponibles.length,
            horarios: horariosDisponibles
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * OBTENER UN TURNO POR ID
 * GET /api/v1/turnos/:turno_id
 */
const obtenerTurnoPorId = async (req, res) => {
    try {
        const { turno_id } = req.params;
        const turno = await turnosService.obtenerTurnoPorId(turno_id);
        
        res.status(200).json({
            ok: true,
            turno
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 400;
        res.status(statusCode).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * OBTENER TURNOS DE UN CLIENTE
 * GET /api/v1/turnos/cliente/:cliente_id
 */
const obtenerTurnosPorCliente = async (req, res) => {
    try {
        const { cliente_id } = req.params;
        const turnos = await turnosService.obtenerTurnosPorCliente(cliente_id);
        
        res.status(200).json({
            ok: true,
            cantidad: turnos.length,
            turnos
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 400;
        res.status(statusCode).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * OBTENER TURNOS DE UN BARBERO
 * GET /api/v1/turnos/barbero/:barbero_id?fecha=YYYY-MM-DD&estado=pendiente
 */
const obtenerTurnosPorBarbero = async (req, res) => {
    try {
        const { barbero_id } = req.params;
        const { fecha, estado } = req.query;
        
        const filtros = {};
        if (fecha) filtros.fecha = fecha;
        if (estado) filtros.estado = estado;
        
        const turnos = await turnosService.obtenerTurnosPorBarbero(barbero_id, filtros);
        
        res.status(200).json({
            ok: true,
            cantidad: turnos.length,
            turnos
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 400;
        res.status(statusCode).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * OBTENER TURNOS POR FECHA
 * GET /api/v1/turnos/fecha?fecha=YYYY-MM-DD
 */
const obtenerTurnosPorFecha = async (req, res) => {
    try {
        const { fecha } = req.query;
        const turnos = await turnosService.obtenerTurnosPorFecha(fecha);
        
        res.status(200).json({
            ok: true,
            fecha,
            cantidad: turnos.length,
            turnos
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * ACTUALIZAR ESTADO DE UN TURNO
 * PATCH /api/v1/turnos/:turno_id/estado
 */
const actualizarEstadoTurno = async (req, res) => {
    try {
        const { turno_id } = req.params;
        const { estado } = req.body;
        
        const turno = await turnosService.actualizarEstadoTurno(turno_id, estado);
        
        res.status(200).json({
            ok: true,
            mensaje: 'Estado del turno actualizado exitosamente',
            turno
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 400;
        res.status(statusCode).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * CANCELAR UN TURNO
 * PATCH /api/v1/turnos/:turno_id/cancelar
 */
const cancelarTurno = async (req, res) => {
    try {
        const { turno_id } = req.params;
        const turno = await turnosService.cancelarTurno(turno_id);
        
        res.status(200).json({
            ok: true,
            mensaje: 'Turno cancelado exitosamente',
            turno
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 400;
        res.status(statusCode).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * OBTENER ESTADÍSTICAS DE INGRESOS DEL MES
 * GET /api/v1/turnos/estadisticas/ingresos-mes?barbero_id=xxx
 */
const obtenerEstadisticasIngresosMes = async (req, res) => {
    try {
        const { barbero_id } = req.query;
        const estadisticas = await turnosService.obtenerEstadisticasIngresosMes(barbero_id);
        
        res.status(200).json({
            ok: true,
            estadisticas
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * OBTENER ESTADÍSTICAS DE LA SEMANA
 * GET /api/v1/turnos/estadisticas/semana?barbero_id=xxx
 */
const obtenerEstadisticasSemana = async (req, res) => {
    try {
        const { barbero_id } = req.query;
        const estadisticas = await turnosService.obtenerEstadisticasSemana(barbero_id);
        
        res.status(200).json({
            ok: true,
            estadisticas
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * OBTENER CLIENTES ÚNICOS DEL BARBERO EN LOS ÚLTIMOS 7 DÍAS
 * GET /api/v1/turnos/estadisticas/clientes-barbero/:barbero_id
 */
const obtenerClientesUnicosBarbero = async (req, res) => {
    try {
        const { barbero_id } = req.params;
        const cantidad = await turnosService.obtenerClientesUnicosBarbero(barbero_id);
        
        res.status(200).json({
            ok: true,
            cantidad
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * OBTENER TURNOS POR DÍA (ÚLTIMOS 7 DÍAS)
 * GET /api/v1/turnos/estadisticas/turnos-por-dia?barbero_id=xxx
 */
const obtenerTurnosPorDia = async (req, res) => {
    try {
        const { barbero_id } = req.query;
        const estadisticas = await turnosService.obtenerTurnosPorDia(barbero_id);
        
        res.status(200).json({
            ok: true,
            data: estadisticas
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/**
 * FINALIZAR AUTOMÁTICAMENTE TURNOS PASADOS
 * POST /api/v1/turnos/finalizar-pasados
 * Actualiza turnos pendientes/confirmados cuya fecha y hora ya pasaron
 */
const finalizarTurnosPasados = async (req, res) => {
    try {
        const turnosFinalizados = await turnosService.finalizarTurnosPasados();
        
        res.status(200).json({
            ok: true,
            mensaje: `${turnosFinalizados} turno(s) finalizado(s) automáticamente`,
            turnosFinalizados
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: error.message
        });
    }
};

module.exports = {
    crearTurno,
    obtenerHorariosDisponibles,
    obtenerTurnoPorId,
    obtenerTurnosPorCliente,
    obtenerTurnosPorBarbero,
    obtenerTurnosPorFecha,
    actualizarEstadoTurno,
    cancelarTurno,
    finalizarTurnosPasados,
    obtenerEstadisticasIngresosMes,
    obtenerEstadisticasSemana,
    obtenerClientesUnicosBarbero,
    obtenerTurnosPorDia
};
