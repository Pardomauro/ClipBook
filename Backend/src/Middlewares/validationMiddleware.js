const { validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación de express-validator
 * Se ejecuta después de las validaciones y antes del controller
 * 
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express, sirve para pasar al siguiente middleware o controller
 * @returns {Object} JSON con errores o continúa al siguiente middleware
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Formatear errores para respuesta consistente
        const formattedErrors = errors.array().map(error => ({
            campo: error.path,
            mensaje: error.msg,
            valor_recibido: error.value
        }));
        
        return res.status(400).json({
            ok: false,
            mensaje: 'Error de validación en los datos enviados',
            errores: formattedErrors
        });
    }
    
    // Si no hay errores, continuar al siguiente middleware (controller)
    next();
};

module.exports = { handleValidationErrors };
