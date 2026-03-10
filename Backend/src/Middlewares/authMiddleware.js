const { verificarToken } = require('../Services/Token/token');

/**
 * Middleware para proteger rutas que requieren autenticación
 * Verifica el token JWT en el header Authorization
 */
const protegerRuta = (req, res, next) => {
    try {
        // Obtener token del header Authorization: "Bearer TOKEN"
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token de autenticación'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verificar y decodificar el token
        const decoded = verificarToken(token);
        
        // Agregar información del barbero autenticado a la request
        req.barbero = decoded;
        
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || 'Token inválido o expirado'
        });
    }
};

/**
 * Middleware opcional: permite acceso sin autenticación pero agrega info si hay token
 */
const autenticarOpcional = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verificarToken(token);
            req.barbero = decoded;
        }
        
        next();
    } catch (error) {
        // Si el token es inválido, continuar sin autenticación
        next();
    }
};

module.exports = {
    protegerRuta,
    autenticarOpcional
};
