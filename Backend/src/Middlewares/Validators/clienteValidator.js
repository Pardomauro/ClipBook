const { body, param } = require('express-validator');

/**
 * VALIDACIONES PARA CREAR CLIENTE
 * Valida formato, tipos de datos y requisitos básicos
 */
const crearClienteValidator = [
    body('nombre_completo')
        .notEmpty().withMessage('El nombre completo es requerido')
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage('El nombre debe tener entre 3 y 150 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    
    body('email')
        .notEmpty().withMessage('El email es requerido')
        .trim()
        .toLowerCase()
        .isEmail().withMessage('Debe ser un email válido')
        .isLength({ max: 100 })
        .withMessage('El email no puede superar los 100 caracteres'),
    
    body('celular')
        .notEmpty().withMessage('El celular es requerido')
        .trim()
        .matches(/^[0-9]{10,15}$/)
        .withMessage('El celular debe tener entre 10 y 15 dígitos numéricos'),
    
    body('direccion')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('La dirección no puede superar los 255 caracteres')
];

/**
 * VALIDACIONES PARA ACTUALIZAR CLIENTE
 * Todos los campos son opcionales, pero si se envían deben ser válidos
 */
const actualizarClienteValidator = [
    param('id')
        .isUUID().withMessage('El ID del cliente debe ser un UUID válido'),
    
    body('nombre_completo')
        .optional()
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage('El nombre debe tener entre 3 y 150 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    
    body('email')
        .optional()
        .trim()
        .toLowerCase()
        .isEmail().withMessage('Debe ser un email válido')
        .isLength({ max: 100 })
        .withMessage('El email no puede superar los 100 caracteres'),
    
    body('celular')
        .optional()
        .trim()
        .matches(/^[0-9]{10,15}$/)
        .withMessage('El celular debe tener entre 10 y 15 dígitos numéricos'),
    
    body('direccion')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('La dirección no puede superar los 255 caracteres')
];

/**
 * VALIDACIÓN PARA OPERACIONES POR ID
 */
const clienteIdValidator = [
    param('id')
        .isUUID().withMessage('El ID del cliente debe ser un UUID válido')
];

module.exports = {
    crearClienteValidator,
    actualizarClienteValidator,
    clienteIdValidator
};
