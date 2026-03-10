const { body } = require('express-validator');

/**
 * VALIDACIÓN PARA LOGIN
 */
const loginValidator = [
    body('email')
        .notEmpty().withMessage('El email es requerido')
        .trim()
        .toLowerCase()
        .isEmail().withMessage('Debe ser un email válido'),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isString().withMessage('La contraseña debe ser texto')
];

/**
 * VALIDACIÓN PARA CAMBIAR CONTRASEÑA
 */
const cambiarPasswordValidator = [
    body('passwordActual')
        .notEmpty().withMessage('La contraseña actual es requerida')
        .isString().withMessage('La contraseña actual debe ser texto'),
    
    body('passwordNuevo')
        .notEmpty().withMessage('La nueva contraseña es requerida')
        .isLength({ min: 6, max: 50 })
        .withMessage('La nueva contraseña debe tener entre 6 y 50 caracteres')
        .isString().withMessage('La nueva contraseña debe ser texto'),
    
    body('passwordConfirmacion')
        .notEmpty().withMessage('Debes confirmar la nueva contraseña')
        .custom((value, { req }) => {
            if (value !== req.body.passwordNuevo) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
];

module.exports = {
    loginValidator,
    cambiarPasswordValidator
};
