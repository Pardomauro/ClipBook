const { Barbero } = require('../../Models/index');
const { generarToken } = require('../Token/token');

/**
 * Servicio de Autenticación
 * Lógica de negocio para login y gestión de sesiones de barberos
 */

/**
 * Login de barbero (administrador)
 * @param {String} email - Email del barbero
 * @param {String} password - Contraseña en texto plano
 * @returns {Promise<Object>} Objeto con token y datos del barbero
 */
const loginBarbero = async (email, password) => {
    try {
        // 1. Buscar barbero por email
        const barbero = await Barbero.findOne({ 
            where: { email: email.toLowerCase() } 
        });

        if (!barbero) {
            throw new Error('Credenciales inválidas');
        }

        // 2. Verificar que el barbero esté activo
        if (!barbero.activo) {
            throw new Error('Tu cuenta está inactiva. Contacta al administrador');
        }

        // 3. Comparar contraseñas
        const passwordValido = await barbero.compararPassword(password);

        if (!passwordValido) {
            throw new Error('Credenciales inválidas');
        }

        // 4. Generar token JWT
        const token = generarToken({
            barbero_id: barbero.barbero_id,
            email: barbero.email,
            nombre_completo: barbero.nombre_completo,
            rol: 'barbero'
        });

        // 5. Retornar token y datos del barbero (sin password)
        return {
            token,
            barbero: {
                barbero_id: barbero.barbero_id,
                nombre_completo: barbero.nombre_completo,
                email: barbero.email,
                celular: barbero.celular,
                direccion: barbero.direccion,
                imagen_url: barbero.imagen_url,
                activo: barbero.activo
            }
        };
    } catch (error) {
        throw new Error(`Error en login: ${error.message}`);
    }
};

/**
 * Obtener perfil del barbero autenticado
 * @param {String} barbero_id - UUID del barbero
 * @returns {Promise<Object>} Datos del barbero
 */
const obtenerPerfilBarbero = async (barbero_id) => {
    try {
        const barbero = await Barbero.findByPk(barbero_id, {
            attributes: { exclude: ['password'] }
        });

        if (!barbero) {
            throw new Error('Barbero no encontrado');
        }

        return barbero;
    } catch (error) {
        throw new Error(`Error al obtener perfil: ${error.message}`);
    }
};

/**
 * Cambiar contraseña del barbero autenticado
 * @param {String} barbero_id - UUID del barbero
 * @param {String} passwordActual - Contraseña actual
 * @param {String} passwordNuevo - Nueva contraseña
 * @returns {Promise<Object>} Confirmación
 */
const cambiarPassword = async (barbero_id, passwordActual, passwordNuevo) => {
    try {
        // 1. Buscar barbero
        const barbero = await Barbero.findByPk(barbero_id);

        if (!barbero) {
            throw new Error('Barbero no encontrado');
        }

        // 2. Verificar contraseña actual
        const passwordValido = await barbero.compararPassword(passwordActual);

        if (!passwordValido) {
            throw new Error('La contraseña actual es incorrecta');
        }

        // 3. Verificar que la nueva contraseña sea diferente
        const mismPassword = await barbero.compararPassword(passwordNuevo);
        
        if (mismPassword) {
            throw new Error('La nueva contraseña debe ser diferente a la actual');
        }

        // 4. Actualizar contraseña (el hook beforeUpdate la hasheará automáticamente)
        await barbero.update({ password: passwordNuevo });

        return {
            message: 'Contraseña actualizada exitosamente'
        };
    } catch (error) {
        throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
};

module.exports = {
    loginBarbero,
    obtenerPerfilBarbero,
    cambiarPassword
};
