const clienteService = require('../../Services/Cliente/clienteService');

/**
 * Controlador de Clientes
 * Maneja las peticiones HTTP y respuestas relacionadas con clientes
 */

/**
 * GET /api/v1/clientes
 * Obtener todos los clientes o buscar por término
 */
const obtenerClientes = async (req, res) => {
    try {
        const { buscar } = req.query;

        let clientes;
        if (buscar) {
            clientes = await clienteService.buscarClientes(buscar);
        } else {
            clientes = await clienteService.obtenerTodosLosClientes();
        }

        return res.status(200).json({
            success: true,
            count: clientes.length,
            data: clientes
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/v1/clientes/:id
 * Obtener un cliente específico por ID
 */
const obtenerClientePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await clienteService.obtenerClientePorId(id);

        return res.status(200).json({
            success: true,
            data: cliente
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
 * POST /api/v1/clientes
 * Crear un nuevo cliente
 */
const crearCliente = async (req, res) => {
    try {
        const datosCliente = req.body;
        const nuevoCliente = await clienteService.crearCliente(datosCliente);

        return res.status(201).json({
            success: true,
            message: 'Cliente creado exitosamente',
            data: nuevoCliente
        });
    } catch (error) {
        // Si el error es de validación (email/celular duplicado), status 400
        const statusCode = error.message.includes('ya está registrado') ? 400 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * PUT /api/v1/clientes/:id
 * Actualizar un cliente existente
 */
const actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const clienteActualizado = await clienteService.actualizarCliente(id, datosActualizados);

        return res.status(200).json({
            success: true,
            message: 'Cliente actualizado exitosamente',
            data: clienteActualizado
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
 * DELETE /api/v1/clientes/:id
 * Eliminar un cliente
 */
const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await clienteService.eliminarCliente(id);

        return res.status(200).json({
            success: true,
            message: resultado.message
        });
    } catch (error) {
        let statusCode = 500;
        if (error.message.includes('no encontrado')) {
            statusCode = 404;
        } else if (error.message.includes('tiene') && error.message.includes('turno')) {
            statusCode = 400; // No se puede eliminar por lógica de negocio
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/v1/clientes/:id/turnos
 * Obtener historial de turnos de un cliente
 */
const obtenerHistorialTurnos = async (req, res) => {
    try {
        const { id } = req.params;
        const turnos = await clienteService.obtenerHistorialTurnos(id);

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

/**
 * GET /api/v1/clientes/estadisticas/ultimos-7-dias
 * Obtener estadísticas de clientes de los últimos 7 días
 */
const obtenerEstadisticasUltimos7Dias = async (req, res) => {
    try {
        const estadisticas = await clienteService.obtenerEstadisticasUltimos7Dias();

        return res.status(200).json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerHistorialTurnos,
    obtenerEstadisticasUltimos7Dias
};
