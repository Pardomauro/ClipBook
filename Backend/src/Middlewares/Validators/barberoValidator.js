const { body, param } = require('express-validator');

/**
 * VALIDACIONES PARA CREAR BARBERO
 * Valida formato, tipos de datos y requisitos básicos
 */
const crearBarberoValidator = [
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
        .matches(/^[0-9+\s()-]+$/)
        .withMessage('El celular debe contener solo números y caracteres válidos (+, espacios, paréntesis, guiones)')
        .isLength({ min: 10, max: 20 })
        .withMessage('El celular debe tener entre 10 y 20 caracteres'),
    
    body('direccion')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('La dirección no puede superar los 255 caracteres'),
    
    body('imagen_url')
        .optional()
        .trim()
        .custom((value) => {
            if (!value) return true; // Si está vacío, está bien (es opcional)
            
            // Permitir URLs http/https
            const isUrl = /^https?:\/\/.+/.test(value);
            // Permitir base64
            const isBase64 = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(value);
            
            if (!isUrl && !isBase64) {
                throw new Error('La imagen debe ser una URL válida (http/https) o una imagen en base64');
            }
            
            return true;
        }),
    
    body('descripcion')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede superar los 1000 caracteres'),
    
    body('activo')
        .optional()
        .isBoolean().withMessage('El campo activo debe ser booleano (true/false)'),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6, max: 50 })
        .withMessage('La contraseña debe tener entre 6 y 50 caracteres')
];

/**
 * VALIDACIONES PARA ACTUALIZAR BARBERO
 * Todos los campos son opcionales, pero si se envían deben ser válidos
 */
const actualizarBarberoValidator = [
    param('id')
        .isUUID().withMessage('El ID del barbero debe ser un UUID válido'),
    
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
        .matches(/^[0-9+\s()-]+$/)
        .withMessage('El celular debe contener solo números y caracteres válidos (+, espacios, paréntesis, guiones)')
        .isLength({ min: 10, max: 20 })
        .withMessage('El celular debe tener entre 10 y 20 caracteres'),
    
    body('direccion')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('La dirección no puede superar los 255 caracteres'),
    
    body('imagen_url')
        .optional()
        .trim()
        .custom((value) => {
            if (!value) return true; // Si está vacío, está bien (es opcional)
            
            // Permitir URLs http/https
            const isUrl = /^https?:\/\/.+/.test(value);
            // Permitir base64
            const isBase64 = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(value);
            
            if (!isUrl && !isBase64) {
                throw new Error('La imagen debe ser una URL válida (http/https) o una imagen en base64');
            }
            
            return true;
        }),
    
    body('descripcion')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede superar los 1000 caracteres'),
    
    body('activo')
        .optional()
        .isBoolean().withMessage('El campo activo debe ser booleano (true/false)'),
    
    body('password')
        .optional()
        .isLength({ min: 6, max: 50 })
        .withMessage('La contraseña debe tener entre 6 y 50 caracteres')
];

/**
 * VALIDACIÓN PARA CAMBIAR ESTADO
 */
const cambiarEstadoBarberoValidator = [
    param('id')
        .isUUID().withMessage('El ID del barbero debe ser un UUID válido'),
    
    body('activo')
        .notEmpty().withMessage('El campo activo es requerido')
        .isBoolean().withMessage('El campo activo debe ser booleano (true/false)')
];

/**
 * VALIDACIÓN PARA OPERACIONES POR ID
 */
const barberoIdValidator = [
    param('id')
        .isUUID().withMessage('El ID del barbero debe ser un UUID válido')
];

module.exports = {
    crearBarberoValidator,
    actualizarBarberoValidator,
    cambiarEstadoBarberoValidator,
    barberoIdValidator
};
