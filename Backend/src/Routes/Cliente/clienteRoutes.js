const router = require('express').Router();
const clienteController = require('../../Controllers/Cliente/clienteController');
const { handleValidationErrors } = require('../../Middlewares/validationMiddleware');
const { 
    crearClienteValidator, 
    actualizarClienteValidator, 
    clienteIdValidator 
} = require('../../Middlewares/Validators/clienteValidator');

/**
 * Rutas de Clientes
 * Base: /api/v1/clientes
 */

// GET /api/v1/clientes - Obtener todos los clientes (o buscar con ?buscar=termino)
router.get('/', clienteController.obtenerClientes);

// GET /api/v1/clientes/estadisticas/ultimos-7-dias - Obtener estadísticas de los últimos 7 días
router.get('/estadisticas/ultimos-7-dias', clienteController.obtenerEstadisticasUltimos7Dias);

// GET /api/v1/clientes/:id - Obtener un cliente específico
router.get('/:id', 
    clienteIdValidator, 
    handleValidationErrors, 
    clienteController.obtenerClientePorId
);

// GET /api/v1/clientes/:id/turnos - Obtener historial de turnos de un cliente
router.get('/:id/turnos', 
    clienteIdValidator, 
    handleValidationErrors, 
    clienteController.obtenerHistorialTurnos
);

// POST /api/v1/clientes - Crear un nuevo cliente
router.post('/', 
    crearClienteValidator, 
    handleValidationErrors, 
    clienteController.crearCliente
);

// PUT /api/v1/clientes/:id - Actualizar un cliente
router.put('/:id', 
    actualizarClienteValidator, 
    handleValidationErrors, 
    clienteController.actualizarCliente
);

// DELETE /api/v1/clientes/:id - Eliminar un cliente
router.delete('/:id', 
    clienteIdValidator, 
    handleValidationErrors, 
    clienteController.eliminarCliente
);

module.exports = router;
  