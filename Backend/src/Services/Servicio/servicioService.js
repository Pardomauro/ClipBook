const { Servicio } = require('../../Models/index');

/**
 * Servicio de Servicios (catálogo de servicios de la barbería)
 * Contiene toda la lógica de negocio relacionada con servicios
 */

/**
 * Obtener todos los servicios
 * @param {boolean} soloActivos - Filtrar solo servicios activos
 * @returns {Promise<Array>} Lista de servicios
 */
const obtenerTodosLosServicios = async (soloActivos = false) => {
    try {
        const where = {};

        if (soloActivos) {
            where.activo = true;
        }

        const servicios = await Servicio.findAll({
            where,
            order: [['precio_base', 'ASC']]
        });

        return servicios;
    } catch (error) {
        throw new Error(`Error al obtener servicios: ${error.message}`);
    }
};

/**
 * Obtener un servicio por ID
 * @param {string} servicio_id - UUID del servicio
 * @returns {Promise<Object>} Servicio encontrado
 */
const obtenerServicioPorId = async (servicio_id) => {
    try {
        const servicio = await Servicio.findByPk(servicio_id);

        if (!servicio) {
            throw new Error('Servicio no encontrado');
        }

        return servicio;
    } catch (error) {
        throw new Error(`Error al obtener servicio: ${error.message}`);
    }
};

/**
 * Obtener un servicio por nombre
 * @param {string} nombreServicio - Nombre del servicio ('corte', 'corte + barba', 'tintura')
 * @returns {Promise<Object>} Servicio encontrado
 */
const obtenerServicioPorNombre = async (nombreServicio) => {
    try {
        const servicio = await Servicio.findOne({
            where: { nombre_servicio: nombreServicio }
        });

        if (!servicio) {
            throw new Error(`Servicio "${nombreServicio}" no encontrado`);
        }

        return servicio;
    } catch (error) {
        throw new Error(`Error al obtener servicio: ${error.message}`);
    }
};

/**
 * Crear un nuevo servicio
 * @param {Object} datosServicio - Datos del servicio a crear
 * @returns {Promise<Object>} Servicio creado
 */
const crearServicio = async (datosServicio) => {
    try {
        // VALIDACIÓN DE NEGOCIO: Verificar que el nombre del servicio no exista
        const servicioExistente = await Servicio.findOne({
            where: { nombre_servicio: datosServicio.nombre_servicio }
        });

        if (servicioExistente) {
            throw new Error(`El servicio "${datosServicio.nombre_servicio}" ya existe`);
        }

        // Crear el servicio (validaciones de formato ya pasaron en middleware)
        const nuevoServicio = await Servicio.create({
            nombre_servicio: datosServicio.nombre_servicio,
            precio_base: datosServicio.precio_base,
            duracion: datosServicio.duracion,
            descripcion: datosServicio.descripcion || null,
            activo: datosServicio.activo !== undefined ? datosServicio.activo : true
        });

        return nuevoServicio;
    } catch (error) {
        throw new Error(`Error al crear servicio: ${error.message}`);
    }
};

/**
 * Actualizar un servicio existente
 * @param {string} servicio_id - UUID del servicio
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {Promise<Object>} Servicio actualizado
 */
const actualizarServicio = async (servicio_id, datosActualizados) => {
    try {
        const servicio = await Servicio.findByPk(servicio_id);

        if (!servicio) {
            throw new Error('Servicio no encontrado');
        }

        // VALIDACIÓN DE NEGOCIO: Si se cambia el nombre, verificar que no exista
        if (datosActualizados.nombre_servicio && 
            datosActualizados.nombre_servicio !== servicio.nombre_servicio) {
            const servicioExistente = await Servicio.findOne({
                where: { nombre_servicio: datosActualizados.nombre_servicio }
            });

            if (servicioExistente) {
                throw new Error(`El servicio "${datosActualizados.nombre_servicio}" ya existe`);
            }
        }

        // Actualizar servicio (validaciones de formato ya pasaron en middleware)
        await servicio.update(datosActualizados);

        return servicio;
    } catch (error) {
        throw new Error(`Error al actualizar servicio: ${error.message}`);
    }
};

/**
 * Cambiar estado activo/inactivo de un servicio
 * @param {string} servicio_id - UUID del servicio
 * @param {boolean} activo - Nuevo estado
 * @returns {Promise<Object>} Servicio actualizado
 */
const cambiarEstadoServicio = async (servicio_id, activo) => {
    try {
        const servicio = await Servicio.findByPk(servicio_id);

        if (!servicio) {
            throw new Error('Servicio no encontrado');
        }

        await servicio.update({ activo });

        return servicio;
    } catch (error) {
        throw new Error(`Error al cambiar estado del servicio: ${error.message}`);
    }
};

/**
 * Eliminar un servicio
 * @param {string} servicio_id - UUID del servicio
 * @returns {Promise<Object>} Resultado de la eliminación
 */
const eliminarServicio = async (servicio_id) => {
    try {
        const servicio = await Servicio.findByPk(servicio_id, {
            include: ['turnos']
        });

        if (!servicio) {
            throw new Error('Servicio no encontrado');
        }

        // VALIDACIÓN: No permitir eliminar si tiene turnos asociados
        if (servicio.turnos && servicio.turnos.length > 0) {
            throw new Error(
                `No se puede eliminar el servicio porque tiene ${servicio.turnos.length} turno(s) asociado(s)`
            );
        }

        await servicio.destroy();

        return {
            message: 'Servicio eliminado exitosamente',
            servicio_id: servicio_id
        };
    } catch (error) {
        throw new Error(`Error al eliminar servicio: ${error.message}`);
    }
};

/**
 * Calcular precio final de un servicio (por si hay descuentos o recargos en el futuro)
 * @param {string} servicio_id - UUID del servicio
 * @param {Object} opciones - Opciones de cálculo (descuentos, etc.)
 * @returns {Promise<number>} Precio final calculado
 */
const calcularPrecioFinal = async (servicio_id, opciones = {}) => {
    try {
        const servicio = await obtenerServicioPorId(servicio_id);

        let precioFinal = parseFloat(servicio.precio_base);

        // Aquí podrías agregar lógica de descuentos/recargos en el futuro
        // Por ejemplo:
        // if (opciones.descuento) {
        //     precioFinal = precioFinal * (1 - opciones.descuento / 100);
        // }

        return precioFinal;
    } catch (error) {
        throw new Error(`Error al calcular precio: ${error.message}`);
    }
};

module.exports = {
    obtenerTodosLosServicios,
    obtenerServicioPorId,
    obtenerServicioPorNombre,
    crearServicio,
    actualizarServicio,
    cambiarEstadoServicio,
    eliminarServicio,
    calcularPrecioFinal
};
