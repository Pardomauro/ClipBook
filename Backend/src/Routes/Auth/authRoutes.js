const router = require('express').Router();
const authController = require('../../Controllers/Auth/authController');
const { loginValidator, cambiarPasswordValidator } = require('../../Middlewares/Validators/authValidator');
const { handleValidationErrors } = require('../../Middlewares/validationMiddleware');
const { protegerRuta } = require('../../Middlewares/authMiddleware');

/**
 * Rutas de Autenticación
 * Base: /api/v1/auth
 */

// POST /api/v1/auth/login - Login de barbero (público)
router.post('/login', 
    loginValidator, 
    handleValidationErrors, 
    authController.login
);

// GET /api/v1/auth/perfil - Obtener perfil del barbero autenticado (protegido)
router.get('/perfil', 
    protegerRuta, 
    authController.obtenerPerfil
);

// POST /api/v1/auth/verificar - Verificar si el token es válido (protegido)
router.post('/verificar', 
    protegerRuta, 
    authController.verificarToken
);

// PUT /api/v1/auth/cambiar-password - Cambiar contraseña del barbero autenticado (protegido)
router.put('/cambiar-password', 
    protegerRuta, 
    cambiarPasswordValidator, 
    handleValidationErrors, 
    authController.cambiarPassword
);

module.exports = router;
