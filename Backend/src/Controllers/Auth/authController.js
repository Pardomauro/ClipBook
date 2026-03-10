const authService = require('../../Services/Auth/authService');

/**
 * Controlador de Autenticación
 * Maneja las peticiones HTTP relacionadas con login y sesiones de barberos
 */

/**
 * POST /api/v1/auth/login
 * Login de barbero (administrador)
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const resultado = await authService.loginBarbero(email, password);

        return res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: resultado
        });
    } catch (error) {
        const statusCode = error.message.includes('Credenciales') || error.message.includes('inactiva') ? 401 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/v1/auth/perfil
 * Obtener perfil del barbero autenticado
 */
const obtenerPerfil = async (req, res) => {
    try {
        // req.barbero viene del middleware protegerRuta
        const barbero = await authService.obtenerPerfilBarbero(req.barbero.barbero_id);

        return res.status(200).json({
            success: true,
            data: barbero
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * POST /api/v1/auth/verificar
 * Verificar si el token es válido (útil para el frontend)
 */
const verificarToken = async (req, res) => {
    try {
        // Si llegó hasta aquí, el token es válido (middleware protegerRuta)
        return res.status(200).json({
            success: true,
            message: 'Token válido',
            data: {
                barbero_id: req.barbero.barbero_id,
                email: req.barbero.email,
                nombre_completo: req.barbero.nombre_completo
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * PUT /api/v1/auth/cambiar-password
 * Cambiar contraseña del barbero autenticado
 */
const cambiarPassword = async (req, res) => {
    try {
        const { passwordActual, passwordNuevo } = req.body;
        // req.barbero viene del middleware protegerRuta
        
        const resultado = await authService.cambiarPassword(
            req.barbero.barbero_id,
            passwordActual,
            passwordNuevo
        );

        return res.status(200).json({
            success: true,
            message: resultado.message
        });
    } catch (error) {
        const statusCode = error.message.includes('incorrecta') ? 400 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    login,
    obtenerPerfil,
    verificarToken,
    cambiarPassword
};
