const { Barbero } = require('../../Models/index');
const { Op } = require('sequelize');
const cloudinary = require('../../Config/cloudinary');


/** 
 * Servicio de Barberos
 * Contiene toda la lógica de negocio relacionada con barberos
 */

/**
 * Obtener todos los barberos
 * @param {Object} filtros - Filtros opcionales (activo)
 * @returns {Promise<Array>} Lista de barberos
 */
const obtenerTodosLosBarberos = async (filtros = {}) => {
    try {
        const where = {};

        // Filtrar por barberos activos si se especifica
        if (filtros.activo !== undefined) {
            where.activo = filtros.activo;
        }

        const barberos = await Barbero.findAll({
            where,
            order: [['nombre_completo', 'ASC']],
            attributes: { exclude: ['password', 'updatedAt'] }
        });

        return barberos;
    } catch (error) {
        throw new Error(`Error al obtener barberos: ${error.message}`);
    }
};

/**
 * Obtener barberos activos (para mostrar en el frontend al reservar turno)
 * @returns {Promise<Array>} Lista de barberos activos
 */
const obtenerBarberosActivos = async () => {
    try {
        const barberos = await Barbero.findAll({
            where: { activo: true },
            order: [['nombre_completo', 'ASC']],
            attributes: ['barbero_id', 'nombre_completo', 'imagen_url', 'activo']
        });

        return barberos;
    } catch (error) {
        throw new Error(`Error al obtener barberos activos: ${error.message}`);
    }
};

/**
 * Obtener un barbero por ID
 * @param {string} barbero_id - UUID del barbero
 * @param {boolean} incluirTurnos - Si incluir los turnos del barbero
 * @returns {Promise<Object>} Barbero encontrado
 */
const obtenerBarberoPorId = async (barbero_id, incluirTurnos = false) => {
    try {
        const opciones = {
            attributes: { exclude: ['password'] }
        };

        if (incluirTurnos) {
            opciones.include = [
                {
                    association: 'turnos',
                    include: ['cliente', 'servicio']
                }
            ];
        }

        /**
         * Obtiene un barbero de la base de datos por su ID primario
         * @param {number} barbero_id - El ID único del barbero a buscar
         * @param {Object} opciones - Opciones de configuración para la consulta (ej: include, attributes, etc.)
         * @returns {Promise<Barbero|null>} Una promesa que resuelve al objeto Barbero encontrado o null si no existe
         */
        const barbero = await Barbero.findByPk(barbero_id, opciones);

        if (!barbero) {
            throw new Error('Barbero no encontrado');
        }

        return barbero;
    } catch (error) {
        throw new Error(`Error al obtener barbero: ${error.message}`);
    }
};

/**
 * Buscar barberos por nombre o email
 * @param {string} termino - Término de búsqueda
 * @returns {Promise<Array>} Barberos encontrados
 */
const buscarBarberos = async (termino) => {
    try {
        const barberos = await Barbero.findAll({
            where: {
                [Op.or]: [
                    { nombre_completo: { [Op.like]: `%${termino}%` } },
                    { email: { [Op.like]: `%${termino}%` } }
                ]
            },
            order: [['nombre_completo', 'ASC']],
            attributes: { exclude: ['password'] }
        });

        return barberos;
    } catch (error) {
        throw new Error(`Error al buscar barberos: ${error.message}`);
    }
};

/**
 * Crear un nuevo barbero
 * @param {Object} datosBarbero - Datos del barbero a crear
 * @returns {Promise<Object>} Barbero creado
 */
const crearBarbero = async (datosBarbero) => {
    try {
        // VALIDACIÓN: Verificar que el email no exista
        const emailExistente = await Barbero.findOne({
            where: { email: datosBarbero.email.toLowerCase() }
        });

        if (emailExistente) {
            throw new Error('El email ya está registrado en el sistema');
        }

        // Subir imagen a Cloudinary si se proporciona
        let urlImagenCloudinary = datosBarbero.imagen_url;

        if (datosBarbero.imagen_url && datosBarbero.imagen_url.startsWith('data:image')) {
            const resultadoCloudinary = await cloudinary.uploader.upload(datosBarbero.imagen_url, {
                folder: 'clipbook/barberos',
                resource_type: 'image'
            });
            urlImagenCloudinary = resultadoCloudinary.secure_url;
        }

        // NORMALIZACIÓN: Limpiar y formatear datos
        const datosNormalizados = {
            nombre_completo: datosBarbero.nombre_completo.trim(),
            email: datosBarbero.email.trim().toLowerCase(),
            celular: datosBarbero.celular.trim(),
            password: datosBarbero.password, // Será hasheado por el hook beforeCreate
            direccion: datosBarbero.direccion ? datosBarbero.direccion.trim() : null,
            imagen_url: urlImagenCloudinary || undefined, // Usará el default del modelo
            activo: datosBarbero.activo !== undefined ? datosBarbero.activo : true
        };

        // Crear el barbero
        const nuevoBarbero = await Barbero.create(datosNormalizados);

        // Eliminar password de la respuesta por seguridad
        const barberoJSON = nuevoBarbero.toJSON();
        delete barberoJSON.password;

        return barberoJSON;
    } catch (error) {
        throw new Error(`Error al crear barbero: ${error.message}`);
    }
};

/**
 * Actualizar un barbero existente
 * @param {string} barbero_id - UUID del barbero
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {Promise<Object>} Barbero actualizado
 */
const actualizarBarbero = async (barbero_id, datosActualizados) => {
    try {
        const barbero = await Barbero.findByPk(barbero_id);

        if (!barbero) {
            throw new Error('Barbero no encontrado');
        }

        // Si se actualiza el email, verificar que no esté en uso
        if (datosActualizados.email && datosActualizados.email !== barbero.email) {
            const emailExistente = await Barbero.findOne({
                where: {
                    email: datosActualizados.email.toLowerCase(),
                    barbero_id: { [Op.ne]: barbero_id }
                }
            });

            if (emailExistente) {
                throw new Error('El email ya está en uso por otro barbero');
            }
        }

        // Normalizar datos
        if (datosActualizados.nombre_completo) {
            datosActualizados.nombre_completo = datosActualizados.nombre_completo.trim();
        }
        if (datosActualizados.email) {
            datosActualizados.email = datosActualizados.email.trim().toLowerCase();
        }
        if (datosActualizados.celular) {
            datosActualizados.celular = datosActualizados.celular.trim();
        }
        if (datosActualizados.direccion) {
            datosActualizados.direccion = datosActualizados.direccion.trim();
        }
        if (datosActualizados.imagen_url) {
            if (datosActualizados.imagen_url.startsWith('data:image')) {
                // Nueva imagen base64, subir a Cloudinary
                const resultado = await cloudinary.uploader.upload(datosActualizados.imagen_url, {
                    folder: 'clipbook/barberos',
                    resource_type: 'image'
                });
                datosActualizados.imagen_url = resultado.secure_url;
            }
            // Si no es base64, es una URL ya válida (no hacer nada)
        } else {
            // No se envió imagen_url, mantener la actual
            delete datosActualizados.imagen_url;
        }
        
        await barbero.update(datosActualizados);

        // Eliminar password de la respuesta por seguridad
        const barberoJSON = barbero.toJSON();
        delete barberoJSON.password;

        return barberoJSON;
    } catch (error) {
        throw new Error(`Error al actualizar barbero: ${error.message}`);
    }
};

/**
 * Cambiar estado activo/inactivo de un barbero
 * @param {string} barbero_id - UUID del barbero
 * @param {boolean} activo - Nuevo estado
 * @returns {Promise<Object>} Barbero actualizado
 */
const cambiarEstadoBarbero = async (barbero_id, activo) => {
    try {
        const barbero = await Barbero.findByPk(barbero_id);

        if (!barbero) {
            throw new Error('Barbero no encontrado');
        }

        // Si se desactiva, verificar que no tenga turnos pendientes/confirmados
        if (!activo) {
            const { Turno } = require('../../Models/index');
            const turnosActivos = await Turno.count({
                where: {
                    barbero_id: barbero_id,
                    estado: { [Op.in]: ['pendiente', 'confirmado'] }
                }
            });

            if (turnosActivos > 0) {
                throw new Error(
                    `No se puede desactivar el barbero porque tiene ${turnosActivos} turno(s) activo(s)`
                );
            }
        }

        await barbero.update({ activo });

        // Eliminar password de la respuesta por seguridad
        const barberoJSON = barbero.toJSON();
        delete barberoJSON.password;

        return barberoJSON;
    } catch (error) {
        throw new Error(`Error al cambiar estado del barbero: ${error.message}`);
    }
};

/**
 * Eliminar un barbero
 * @param {string} barbero_id - UUID del barbero
 * @returns {Promise<Object>} Resultado de la eliminación
 */
const eliminarBarbero = async (barbero_id) => {
    try {
        const barbero = await Barbero.findByPk(barbero_id, {
            include: ['turnos']
        });

        if (!barbero) {
            throw new Error('Barbero no encontrado');
        }

        // VALIDACIÓN: No permitir eliminar si tiene turnos
        if (barbero.turnos && barbero.turnos.length > 0) {
            throw new Error(
                `No se puede eliminar el barbero porque tiene ${barbero.turnos.length} turno(s) registrado(s)`
            );
        }

        await barbero.destroy();

        return {
            message: 'Barbero eliminado exitosamente',
            barbero_id: barbero_id
        };
    } catch (error) {
        throw new Error(`Error al eliminar barbero: ${error.message}`);
    }
};

/**
 * Obtener agenda/turnos de un barbero
 * @param {string} barbero_id - UUID del barbero
 * @param {string} fecha - Fecha específica (opcional)
 * @returns {Promise<Array>} Turnos del barbero
 */
const obtenerAgendaBarbero = async (barbero_id, fecha = null) => {
    try {
        const barbero = await Barbero.findByPk(barbero_id);

        if (!barbero) {
            throw new Error('Barbero no encontrado');
        }

        const { Turno } = require('../../Models/index');
        const where = { barbero_id: barbero_id };

        if (fecha) {
            where.fecha_turno = fecha;
        }

        const turnos = await Turno.findAll({
            where,
            include: ['cliente', 'servicio'],
            order: [['fecha_turno', 'ASC'], ['hora_inicio', 'ASC']]
        });

        return turnos;
    } catch (error) {
        throw new Error(`Error al obtener agenda: ${error.message}`);
    }
};

module.exports = {
    obtenerTodosLosBarberos,
    obtenerBarberosActivos,
    obtenerBarberoPorId,
    buscarBarberos,
    crearBarbero,
    actualizarBarbero,
    cambiarEstadoBarbero,
    eliminarBarbero,
    obtenerAgendaBarbero
};
