const router = require('express').Router();
const servicioController = require('../../Controllers/Servicio/servicioController');
const { handleValidationErrors } = require('../../Middlewares/validationMiddleware');
const { 
    crearServicioValidator, 
    actualizarServicioValidator, 
    cambiarEstadoServicioValidator,
    servicioIdValidator 
} = require('../../Middlewares/Validators/servicioValidator');

/**
 * Rutas de Servicios
 * Base: /api/v1/servicios
 */

// GET /api/v1/servicios - Obtener todos los servicios (filtrar activos: ?activo=true)
router.get('/', servicioController.obtenerServicios);

// GET /api/v1/servicios/:id - Obtener un servicio específico
router.get('/:id', 
    servicioIdValidator, 
    handleValidationErrors, 
    servicioController.obtenerServicioPorId
);


// POST /api/v1/servicios - Crear un nuevo servicio
router.post('/', 
    crearServicioValidator, 
    handleValidationErrors, 
    servicioController.crearServicio
);

// PUT /api/v1/servicios/:id - Actualizar un servicio
router.put('/:id', 
    actualizarServicioValidator, 
    handleValidationErrors, 
    servicioController.actualizarServicio
);

// PATCH /api/v1/servicios/:id/estado - Cambiar estado activo/inactivo
router.patch('/:id/estado', 
    cambiarEstadoServicioValidator, 
    handleValidationErrors, 
    servicioController.cambiarEstadoServicio
);

// DELETE /api/v1/servicios/:id - Eliminar un servicio
router.delete('/:id', 
    servicioIdValidator, 
    handleValidationErrors, 
    servicioController.eliminarServicio
);

module.exports = router;