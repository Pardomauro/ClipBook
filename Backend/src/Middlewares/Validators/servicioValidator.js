const { body, param } = require('express-validator');

/**
 * VALIDACIONES PARA CREAR SERVICIO
 * Valida formato, tipos de datos y requisitos básicos
 */
const crearServicioValidator = [
    body('nombre_servicio')
        .notEmpty().withMessage('El nombre del servicio es requerido')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('El nombre del servicio debe tener entre 3 y 100 caracteres'),
    
    body('descripcion')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede superar los 500 caracteres'),
    
    body('precio_base')
        .notEmpty().withMessage('El precio base es requerido')
        .isFloat({ min: 0.01 })
        .withMessage('El precio debe ser mayor a 0')
        .custom((value) => {
            // Validar que tenga máximo 2 decimales
            const decimalPlaces = (value.toString().split('.')[1] || '').length;
            if (decimalPlaces > 2) {
                throw new Error('El precio solo puede tener hasta 2 decimales');
            }
            return true;
        }),
    
    body('duracion')
        .notEmpty().withMessage('La duración es requerida')
        .isInt({ min: 15, max: 240 })
        .withMessage('La duración debe estar entre 15 y 240 minutos'),
    
    body('activo')
        .optional()
        .isBoolean().withMessage('El campo activo debe ser booleano (true/false)')
];

/**
 * VALIDACIONES PARA ACTUALIZAR SERVICIO
 * Todos los campos son opcionales, pero si se envían deben ser válidos
 */
const actualizarServicioValidator = [
    param('id')
        .isUUID().withMessage('El ID del servicio debe ser un UUID válido'),
    
    body('nombre_servicio')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('El nombre del servicio debe tener entre 3 y 100 caracteres'),
    
    body('descripcion')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede superar los 500 caracteres'),
    
    body('precio_base')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('El precio debe ser mayor a 0')
        .custom((value) => {
            const decimalPlaces = (value.toString().split('.')[1] || '').length;
            if (decimalPlaces > 2) {
                throw new Error('El precio solo puede tener hasta 2 decimales');
            }
            return true;
        }),
    
    body('duracion')
        .optional()
        .isInt({ min: 15, max: 240 })
        .withMessage('La duración debe estar entre 15 y 240 minutos'),
    
    body('activo')
        .optional()
        .isBoolean().withMessage('El campo activo debe ser booleano (true/false)')
];

/**
 * VALIDACIÓN PARA CAMBIAR ESTADO
 */
const cambiarEstadoServicioValidator = [
    param('id')
        .isUUID().withMessage('El ID del servicio debe ser un UUID válido'),
    
    body('activo')
        .notEmpty().withMessage('El campo activo es requerido')
        .isBoolean().withMessage('El campo activo debe ser booleano (true/false)')
];

/**
 * VALIDACIÓN PARA OPERACIONES POR ID
 */
const servicioIdValidator = [
    param('id')
        .isUUID().withMessage('El ID del servicio debe ser un UUID válido')
];

/**
 * VALIDACIÓN PARA BUSCAR SERVICIO POR NOMBRE
 */
const servicioNombreValidator = [
    param('nombre')
        .notEmpty().withMessage('El nombre del servicio es requerido')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('El nombre del servicio debe tener entre 3 y 100 caracteres')
];

module.exports = {
    crearServicioValidator,
    actualizarServicioValidator,
    cambiarEstadoServicioValidator,
    servicioIdValidator,
    servicioNombreValidator
};
