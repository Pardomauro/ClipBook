const barberoService = require('../../Services/Barbero/barberoService');

/**
 * Controlador de Barberos
 * Maneja las peticiones HTTP y respuestas relacionadas con barberos
 */

/**
 * GET /api/v1/barberos
 * Obtener todos los barberos (con filtros opcionales)
 */
const obtenerBarberos = async (req, res) => {
    try {
        const { buscar, activo } = req.query;

        let barberos;

        if (buscar) {
            barberos = await barberoService.buscarBarberos(buscar);
        } else if (activo === 'true') {
            barberos = await barberoService.obtenerBarberosActivos();
        } else {
            const filtros = {};
            if (activo !== undefined) {
                filtros.activo = activo === 'true';
            }
            barberos = await barberoService.obtenerTodosLosBarberos(filtros);
        }

        return res.status(200).json({
            success: true,
            count: barberos.length,
            data: barberos
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/v1/barberos/:id
 * Obtener un barbero específico por ID
 */
const obtenerBarberoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const { incluirTurnos } = req.query;

        const barbero = await barberoService.obtenerBarberoPorId(
            id,
            incluirTurnos === 'true'
        );

        return res.status(200).json({
            success: true,
            data: barbero
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * POST /api/v1/barberos
 * Crear un nuevo barbero
 */
const crearBarbero = async (req, res) => {
    try {
        const datosBarbero = req.body;
        const nuevoBarbero = await barberoService.crearBarbero(datosBarbero);

        return res.status(201).json({
            success: true,
            message: 'Barbero creado exitosamente',
            data: nuevoBarbero
        });
    } catch (error) {
        const statusCode = error.message.includes('ya está registrado') ? 400 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * PUT /api/v1/barberos/:id
 * Actualizar un barbero existente
 */
const actualizarBarbero = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const barberoActualizado = await barberoService.actualizarBarbero(id, datosActualizados);

        return res.status(200).json({
            success: true,
            message: 'Barbero actualizado exitosamente',
            data: barberoActualizado
        });
    } catch (error) {
        let statusCode = 500;
        if (error.message.includes('no encontrado')) {
            statusCode = 404;
        } else if (error.message.includes('ya está en uso')) {
            statusCode = 400;
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * PATCH /api/v1/barberos/:id/estado
 * Cambiar estado activo/inactivo de un barbero
 */
const cambiarEstadoBarbero = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;

        if (typeof activo !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'El campo "activo" debe ser un valor booleano'
            });
        }

        const barbero = await barberoService.cambiarEstadoBarbero(id, activo);

        return res.status(200).json({
            success: true,
            message: `Barbero ${activo ? 'activado' : 'desactivado'} exitosamente`,
            data: barbero
        });
    } catch (error) {
        let statusCode = 500;
        if (error.message.includes('no encontrado')) {
            statusCode = 404;
        } else if (error.message.includes('tiene') && error.message.includes('turno')) {
            statusCode = 400;
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * DELETE /api/v1/barberos/:id
 * Eliminar un barbero
 */
const eliminarBarbero = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await barberoService.eliminarBarbero(id);

        return res.status(200).json({
            success: true,
            message: resultado.message
        });
    } catch (error) {
        let statusCode = 500;
        if (error.message.includes('no encontrado')) {
            statusCode = 404;
        } else if (error.message.includes('tiene') && error.message.includes('turno')) {
            statusCode = 400;
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/v1/barberos/:id/agenda
 * Obtener agenda/turnos de un barbero
 */
const obtenerAgendaBarbero = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha } = req.query;

        const turnos = await barberoService.obtenerAgendaBarbero(id, fecha);

        return res.status(200).json({
            success: true,
            count: turnos.length,
            data: turnos
        });
    } catch (error) {
        const statusCode = error.message.includes('no encontrado') ? 404 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    obtenerBarberos,
    obtenerBarberoPorId,
    crearBarbero,
    actualizarBarbero,
    cambiarEstadoBarbero,
    eliminarBarbero,
    obtenerAgendaBarbero
};
