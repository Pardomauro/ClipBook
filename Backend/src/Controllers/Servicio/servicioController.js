const servicioService = require('../../Services/Servicio/servicioService');

/**
 * Controlador de Servicios
 * Maneja las peticiones HTTP y respuestas relacionadas con el catálogo de servicios
 */

/**
 * GET /api/v1/servicios
 * Obtener todos los servicios
 */
const obtenerServicios = async (req, res) => {
    try {
        const { activo } = req.query;
        const soloActivos = activo === 'true';

        const servicios = await servicioService.obtenerTodosLosServicios(soloActivos);

        return res.status(200).json({
            success: true,
            count: servicios.length,
            data: servicios
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/v1/servicios/:id
 * Obtener un servicio específico por ID
 */
const obtenerServicioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await servicioService.obtenerServicioPorId(id);

        return res.status(200).json({
            success: true,
            data: servicio
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
 * POST /api/v1/servicios
 * Crear un nuevo servicio
 */
const crearServicio = async (req, res) => {
    try {
        const datosServicio = req.body;
        const nuevoServicio = await servicioService.crearServicio(datosServicio);

        return res.status(201).json({
            success: true,
            message: 'Servicio creado exitosamente',
            data: nuevoServicio
        });
    } catch (error) {
        const statusCode = error.message.includes('ya existe') || 
                          error.message.includes('inválido') ||
                          error.message.includes('debe') ? 400 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * PUT /api/v1/servicios/:id
 * Actualizar un servicio existente
 */
const actualizarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const servicioActualizado = await servicioService.actualizarServicio(id, datosActualizados);

        return res.status(200).json({
            success: true,
            message: 'Servicio actualizado exitosamente',
            data: servicioActualizado
        });
    } catch (error) {
        let statusCode = 500;
        if (error.message.includes('no encontrado')) {
            statusCode = 404;
        } else if (error.message.includes('ya existe') || error.message.includes('debe')) {
            statusCode = 400;
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * PATCH /api/v1/servicios/:id/estado
 * Cambiar estado activo/inactivo de un servicio
 */
const cambiarEstadoServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;

        if (typeof activo !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'El campo "activo" debe ser un valor booleano'
            });
        }

        const servicio = await servicioService.cambiarEstadoServicio(id, activo);

        return res.status(200).json({
            success: true,
            message: `Servicio ${activo ? 'activado' : 'desactivado'} exitosamente`,
            data: servicio
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
 * DELETE /api/v1/servicios/:id
 * Eliminar un servicio
 */
const eliminarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await servicioService.eliminarServicio(id);

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

module.exports = {
    obtenerServicios,
    obtenerServicioPorId,
    crearServicio,
    actualizarServicio,
    cambiarEstadoServicio,
    eliminarServicio
};
