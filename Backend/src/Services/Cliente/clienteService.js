const { Cliente } = require('../../Models/index');
const { Op } = require('sequelize');

/**
 * Servicio de Clientes
 * Contiene toda la lógica de negocio relacionada con clientes
 */

/**
 * Obtener todos los clientes
 * @returns {Promise<Array>} Lista de clientes
 */
const obtenerTodosLosClientes = async () => {
    try {
        const clientes = await Cliente.findAll({
            order: [['created_at', 'DESC']],
            attributes: { exclude: ['updatedAt'] } // Excluir campos que no necesita el frontend
        });
        return clientes;
    } catch (error) {
        throw new Error(`Error al obtener clientes: ${error.message}`);
    }
};

/**
 * Obtener un cliente por ID
 * @param {string} cliente_id - UUID del cliente
 * @returns {Promise<Object>} Cliente encontrado
 */
const obtenerClientePorId = async (cliente_id) => {
    try {
        const cliente = await Cliente.findByPk(cliente_id, {
            include: [
                {
                    association: 'turnos',
                    include: ['barbero', 'servicio']
                }
            ]
        });

        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        return cliente;
    } catch (error) {
        throw new Error(`Error al obtener cliente: ${error.message}`);
    }
};

/**
 * Buscar clientes por nombre o email
 * @param {string} termino - Término de búsqueda
 * @returns {Promise<Array>} Clientes encontrados
 */
const buscarClientes = async (termino) => {
    try {
        const clientes = await Cliente.findAll({
            where: {
                [Op.or]: [
                    { nombre_completo: { [Op.like]: `%${termino}%` } },
                    { email: { [Op.like]: `%${termino}%` } },
                    { celular: { [Op.like]: `%${termino}%` } }
                ]
            },
            order: [['nombre_completo', 'ASC']]
        });
        return clientes;
    } catch (error) {
        throw new Error(`Error al buscar clientes: ${error.message}`);
    }
};

/**
 * Crear un nuevo cliente
 * @param {Object} datosCliente - Datos del cliente a crear
 * @returns {Promise<Object>} Cliente creado
 */
const crearCliente = async (datosCliente) => {
    try {
        // VALIDACIÓN: Verificar que el email no exista
        const emailExistente = await Cliente.findOne({
            where: { email: datosCliente.email.toLowerCase() }
        });

        if (emailExistente) {
            throw new Error('El email ya está registrado en el sistema');
        }

        // VALIDACIÓN: Verificar que el celular no exista (opcional, según tu lógica)
        const celularExistente = await Cliente.findOne({
            where: { celular: datosCliente.celular }
        });

        if (celularExistente) {
            throw new Error('El celular ya está registrado en el sistema');
        }

        // NORMALIZACIÓN: Limpiar y formatear datos
        const datosNormalizados = {
            nombre_completo: datosCliente.nombre_completo.trim(),
            email: datosCliente.email.trim().toLowerCase(),
            celular: datosCliente.celular.trim()
        };

        // Crear el cliente en la base de datos
        const nuevoCliente = await Cliente.create(datosNormalizados);

        return nuevoCliente;
    } catch (error) {
        throw new Error(`Error al crear cliente: ${error.message}`);
    }
};

/**
 * Actualizar un cliente existente
 * @param {string} cliente_id - UUID del cliente
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {Promise<Object>} Cliente actualizado
 */
const actualizarCliente = async (cliente_id, datosActualizados) => {
    try {
        // Verificar que el cliente exista
        const cliente = await Cliente.findByPk(cliente_id);

        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        // Si se actualiza el email, verificar que no esté en uso por otro cliente
        if (datosActualizados.email && datosActualizados.email !== cliente.email) {
            const emailExistente = await Cliente.findOne({
                where: { 
                    email: datosActualizados.email.toLowerCase(),
                    cliente_id: { [Op.ne]: cliente_id } // Excluir el cliente actual
                }
            });

            if (emailExistente) {
                throw new Error('El email ya está en uso por otro cliente');
            }
        }

        // Si se actualiza el celular, verificar que no esté en uso
        if (datosActualizados.celular && datosActualizados.celular !== cliente.celular) {
            const celularExistente = await Cliente.findOne({
                where: { 
                    celular: datosActualizados.celular,
                    cliente_id: { [Op.ne]: cliente_id }
                }
            });

            if (celularExistente) {
                throw new Error('El celular ya está en uso por otro cliente');
            }
        }

        // Normalizar datos si están presentes
        if (datosActualizados.nombre_completo) {
            datosActualizados.nombre_completo = datosActualizados.nombre_completo.trim();
        }
        if (datosActualizados.email) {
            datosActualizados.email = datosActualizados.email.trim().toLowerCase();
        }
        if (datosActualizados.celular) {
            datosActualizados.celular = datosActualizados.celular.trim();
        }

        // Actualizar el cliente
        await cliente.update(datosActualizados);

        return cliente;
    } catch (error) {
        throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
};

/**
 * Eliminar un cliente
 * @param {string} cliente_id - UUID del cliente
 * @returns {Promise<Object>} Resultado de la eliminación
 */
const eliminarCliente = async (cliente_id) => {
    try {
        const cliente = await Cliente.findByPk(cliente_id, {
            include: ['turnos']
        });

        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        // VALIDACIÓN DE NEGOCIO: No permitir eliminar si tiene turnos activos
        const turnosActivos = cliente.turnos?.filter(
            turno => turno.estado === 'pendiente' || turno.estado === 'confirmado'
        );

        if (turnosActivos && turnosActivos.length > 0) {
            throw new Error(
                `No se puede eliminar el cliente porque tiene ${turnosActivos.length} turno(s) activo(s). Cancélelos primero.`
            );
        }

        await cliente.destroy();

        return { 
            message: 'Cliente eliminado exitosamente',
            cliente_id: cliente_id 
        };
    } catch (error) {
        throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
};

/**
 * Obtener historial de turnos de un cliente
 * @param {string} cliente_id - UUID del cliente
 * @returns {Promise<Array>} Turnos del cliente
 */
const obtenerHistorialTurnos = async (cliente_id) => {
    try {
        const cliente = await Cliente.findByPk(cliente_id, {
            include: [
                {
                    association: 'turnos',
                    include: ['barbero', 'servicio'],
                    order: [['fecha_turno', 'DESC'], ['hora_inicio', 'DESC']]
                }
            ]
        });

        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        return cliente.turnos;
    } catch (error) {
        throw new Error(`Error al obtener historial: ${error.message}`);
    }
};

/**
 * Obtener estadísticas de clientes de los últimos 7 días
 * Retorna la cantidad de clientes nuevos por cada día
 * @returns {Promise<Array>} Array con fecha y cantidad por día
 */
const obtenerEstadisticasUltimos7Dias = async () => {
    try {
        const { sequelize } = require('../../Models/index');
        
        // Calcular la fecha de hace 7 días
        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);
        hace7Dias.setHours(0, 0, 0, 0);

        // Query para contar clientes agrupados por fecha
        const estadisticas = await Cliente.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'fecha'],
                [sequelize.fn('COUNT', sequelize.col('cliente_id')), 'cantidad']
            ],
            where: {
                created_at: {
                    [Op.gte]: hace7Dias
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
            raw: true
        });

        // Generar array con todos los últimos 7 días (incluso sin registros)
        const resultado = [];
        for (let i = 6; i >= 0; i--) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - i);
            const fechaStr = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD

            // Buscar si hay datos para esta fecha
            const estadistica = estadisticas.find(e => e.fecha === fechaStr);
            
            resultado.push({
                fecha: fechaStr,
                cantidad: estadistica ? parseInt(estadistica.cantidad) : 0
            });
        }

        return resultado;
    } catch (error) {
        throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
};

module.exports = {
    obtenerTodosLosClientes,
    obtenerClientePorId,
    buscarClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerHistorialTurnos,
    obtenerEstadisticasUltimos7Dias
};
