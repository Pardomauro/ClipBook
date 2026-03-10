const router = require('express').Router();
const barberoController = require('../../Controllers/Barbero/barberoController');
const { handleValidationErrors } = require('../../Middlewares/validationMiddleware');
const { 
    crearBarberoValidator, 
    actualizarBarberoValidator, 
    cambiarEstadoBarberoValidator,
    barberoIdValidator 
} = require('../../Middlewares/Validators/barberoValidator');

/**
 * Rutas de Barberos
 * Base: /api/v1/barberos
 */

// GET /api/v1/barberos - Obtener todos los barberos (con filtros: ?activo=true o ?buscar=nombre)
router.get('/', barberoController.obtenerBarberos);

// GET /api/v1/barberos/:id - Obtener un barbero específico
router.get('/:id', 
    barberoIdValidator, 
    handleValidationErrors, 
    barberoController.obtenerBarberoPorId
);

// GET /api/v1/barberos/:id/agenda - Obtener agenda/turnos de un barbero
router.get('/:id/agenda', 
    barberoIdValidator, 
    handleValidationErrors, 
    barberoController.obtenerAgendaBarbero
);

// POST /api/v1/barberos - Crear un nuevo barbero
router.post('/', 
    crearBarberoValidator, 
    handleValidationErrors, 
    barberoController.crearBarbero
);

// PUT /api/v1/barberos/:id - Actualizar un barbero
router.put('/:id', 
    actualizarBarberoValidator, 
    handleValidationErrors, 
    barberoController.actualizarBarbero
);

// PATCH /api/v1/barberos/:id/estado - Cambiar estado activo/inactivo
router.patch('/:id/estado', 
    cambiarEstadoBarberoValidator, 
    handleValidationErrors, 
    barberoController.cambiarEstadoBarbero
);

// DELETE /api/v1/barberos/:id - Eliminar un barbero
router.delete('/:id', 
    barberoIdValidator, 
    handleValidationErrors, 
    barberoController.eliminarBarbero
);

module.exports = router;