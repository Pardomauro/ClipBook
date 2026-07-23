const { Turno, Cliente, Barbero, Servicio } = require('../../Models');
const { Op } = require('sequelize');
const {
    esDiaLaboral,
    estaEnHorarioLaboral,
    generarSlotsDisponibles,
    calcularHoraFin,
    haySolapamiento,
    convertirHoraAMinutos,
    ANTICIPACION_MINIMA_HORAS,
    DIAS_MAXIMOS_ADELANTE
} = require('../../Utils/horariosLaborales');
const { enviarEmailConfirmacionTurno, enviarEmailCancelacionTurno, enviarEmailNuevoTurnoAdmin } = require('../Email/emailService');

/**
 * Crear un nuevo turno con todas las validaciones de negocio
 * Acepta dos formas de identificar al cliente:
 * 1. cliente_id - Cliente ya registrado
 * 2. cliente - Objeto con datos del cliente (se busca/crea automáticamente)
 * 
 * @param {Object} datosTurno - Datos del turno
 * @returns {Promise<Object>} Turno creado
 */
const crearTurno = async (datosTurno) => {
    try {
        const { cliente_id, cliente, barbero_id, servicio_id, fecha_turno, hora_inicio, precio_final, estado } = datosTurno;
        
        // Determinar si es un registro de corte ya realizado (estado finalizado)
        const esCorteRealizado = estado === 'finalizado';
        
        // 1. OBTENER O CREAR CLIENTE
        let clienteId;
        let clienteRegistrado;
        
        if (cliente_id) {
            // Caso A: Se proporcionó cliente_id (uso interno/admin)
            clienteRegistrado = await Cliente.findByPk(cliente_id);
            if (!clienteRegistrado) {
                throw new Error('Cliente no encontrado');
            }
            clienteId = cliente_id;
        } else if (cliente) {
            // Caso B: Se proporcionaron datos del cliente (reserva pública)
            // Buscar si existe un cliente con ese email
            clienteRegistrado = await Cliente.findOne({
                where: { email: cliente.email.toLowerCase() }
            });
            
            if (clienteRegistrado) {
                // Cliente ya existe, reutilizarlo
                clienteId = clienteRegistrado.cliente_id;
                console.log(`✅ Cliente existente encontrado: ${clienteRegistrado.nombre_completo} (${clienteRegistrado.email})`);
            } else {
                // Cliente no existe, crearlo automáticamente
                const nuevoCliente = await Cliente.create({
                    nombre_completo: cliente.nombre_completo,
                    email: cliente.email.toLowerCase(),
                    celular: cliente.celular,
                    direccion: cliente.direccion || null
                });
                clienteId = nuevoCliente.cliente_id;
                clienteRegistrado = nuevoCliente;
                console.log(`✨ Nuevo cliente creado: ${nuevoCliente.nombre_completo} (${nuevoCliente.email})`);
            }
        }
        
        // 2. VALIDAR QUE EL BARBERO EXISTA Y ESTÉ ACTIVO
        const barbero = await Barbero.findByPk(barbero_id);
        if (!barbero) {
            throw new Error('Barbero no encontrado');
        }
        if (!barbero.activo) {
            throw new Error('El barbero no está disponible para turnos actualmente');
        }
        
        // 3. VALIDAR QUE EL SERVICIO EXISTA Y ESTÉ ACTIVO
        const servicio = await Servicio.findByPk(servicio_id);
        if (!servicio) {
            throw new Error('Servicio no encontrado');
        }
        if (!servicio.activo) {
            throw new Error('El servicio no está disponible actualmente');
        }
        
        // Si es un corte ya realizado (finalizado), omitir validaciones de fecha/horario/disponibilidad
        if (!esCorteRealizado) {
            // 4. VALIDAR FECHA: No más de X días adelante
            const fechaTurno = new Date(fecha_turno + 'T00:00:00');
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const diferenciaDias = Math.ceil((fechaTurno - hoy) / (1000 * 60 * 60 * 24));
            
            if (diferenciaDias > DIAS_MAXIMOS_ADELANTE) {
                throw new Error(`Solo se pueden agendar turnos con máximo ${DIAS_MAXIMOS_ADELANTE} días de anticipación`);
            }
            
            // 5. VALIDAR DÍA LABORAL (no domingos)
            const diaSemana = fechaTurno.getDay();
            if (!esDiaLaboral(diaSemana)) {
                throw new Error('No se pueden agendar turnos en días no laborales (domingos)');
            }
            
            // 6. VALIDAR ANTICIPACIÓN MÍNIMA (al menos 1 hora)
            const fechaHoraTurno = new Date(`${fecha_turno}T${hora_inicio}:00`);
            const ahora = new Date();
            const diferenciaHoras = (fechaHoraTurno - ahora) / (1000 * 60 * 60);
            
            if (diferenciaHoras < ANTICIPACION_MINIMA_HORAS) {
                throw new Error(`Los turnos deben agendarse con al menos ${ANTICIPACION_MINIMA_HORAS} hora(s) de anticipación`);
            }
            
            // 7. VALIDAR QUE LA HORA ESTÉ EN HORARIO LABORAL
            if (!estaEnHorarioLaboral(diaSemana, hora_inicio)) {
                throw new Error('La hora seleccionada no está dentro del horario laboral');
            }
            
            // 8. VALIDAR QUE EL TURNO NO SE EXTIENDA FUERA DEL HORARIO LABORAL
            const horaFin = calcularHoraFin(hora_inicio, servicio.duracion);
            if (!estaEnHorarioLaboral(diaSemana, horaFin) && convertirHoraAMinutos(horaFin) > convertirHoraAMinutos(hora_inicio)) {
                throw new Error('El turno se extendería fuera del horario laboral. Elija un horario más temprano');
            }
            
            // 9. VALIDAR DISPONIBILIDAD DEL BARBERO (no solapamiento)
            const turnosExistentes = await Turno.findAll({
                where: {
                    barbero_id,
                    fecha_turno,
                    estado: {
                        [Op.in]: ['pendiente', 'confirmado'] // Solo turnos activos
                    }
                },
                include: [{ model: Servicio, as: 'servicio', attributes: ['duracion'] }]
            });
            
            // Verificar solapamiento con cada turno existente
            for (const turnoExistente of turnosExistentes) {
                const horaFinExistente = calcularHoraFin(
                    turnoExistente.hora_inicio, 
                    turnoExistente.servicio.duracion
                );
                
                if (haySolapamiento(hora_inicio, horaFin, turnoExistente.hora_inicio, horaFinExistente)) {
                    throw new Error(
                        `El barbero ya tiene un turno agendado que se solapa con el horario seleccionado (${turnoExistente.hora_inicio})`
                    );
                }
            }
        }
        
        // 10. CALCULAR PRECIO FINAL (si no se proporciona, usar el del servicio)
        const precioFinal = precio_final !== undefined ? precio_final : servicio.precio_base;
        
        // 11. CREAR EL TURNO
        const nuevoTurno = await Turno.create({
            cliente_id: clienteId,
            barbero_id,
            servicio_id,
            fecha_turno,
            hora_inicio: hora_inicio + ':00', // Agregar segundos si no están
            precio_final: precioFinal,
            estado: estado || 'pendiente' // Usar estado enviado o por defecto "pendiente"
        });
        
        // 12. DEVOLVER TURNO CON RELACIONES
        const turnoCreado = await Turno.findByPk(nuevoTurno.turno_id, {
            include: [
                { model: Cliente, as: 'cliente', attributes: ['cliente_id', 'nombre_completo', 'email', 'celular'] },
                { model: Barbero, as: 'barbero', attributes: ['barbero_id', 'nombre_completo'] },
                { model: Servicio, as: 'servicio', attributes: ['servicio_id', 'nombre_servicio', 'duracion', 'precio_base'] }
            ]
        });
        
        // 13. ENVIAR EMAILS solo si es un turno pendiente (no para cortes ya realizados)
        if (!esCorteRealizado) {
            // Email de confirmación al cliente
            enviarEmailConfirmacionTurno(turnoCreado)
                .catch(error => console.error('⚠️  Error al enviar email de confirmación:', error.message));
            
            // Email de notificación al administrador
            enviarEmailNuevoTurnoAdmin(turnoCreado)
                .catch(error => console.error('⚠️  Error al enviar email al administrador:', error.message));
        }
        
        return turnoCreado;
    } catch (error) {
        throw new Error(`Error al crear turno: ${error.message}`);
    }
};

/**
 * Obtener horarios disponibles de un barbero en una fecha específica
 * Esta es una de las funciones más importantes del sistema
 * @param {string} barbero_id - UUID del barbero
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} servicio_id - UUID del servicio (para calcular duración)
 * @returns {Promise<Array<string>>} Array de horarios disponibles
 */
const obtenerHorariosDisponibles = async (barbero_id, fecha, servicio_id) => {
    try {
        // 1. VALIDAR QUE EL BARBERO EXISTA Y ESTÉ ACTIVO
        const barbero = await Barbero.findByPk(barbero_id);
        if (!barbero) {
            throw new Error('Barbero no encontrado');
        }
        if (!barbero.activo) {
            throw new Error('El barbero no está disponible');
        }
        
        // 2. VALIDAR QUE EL SERVICIO EXISTA
        const servicio = await Servicio.findByPk(servicio_id);
        if (!servicio) {
            throw new Error('Servicio no encontrado');
        }
        
        // 3. VALIDAR FECHA
        const fechaTurno = new Date(fecha + 'T00:00:00');
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fechaTurno < hoy) {
            throw new Error('No se pueden consultar horarios de fechas pasadas');
        }
        
        const diferenciaDias = Math.ceil((fechaTurno - hoy) / (1000 * 60 * 60 * 24));
        if (diferenciaDias > DIAS_MAXIMOS_ADELANTE) {
            return []; // No hay horarios disponibles tan adelante
        }
        
        // 4. VALIDAR DÍA LABORAL
        const diaSemana = fechaTurno.getDay();
        if (!esDiaLaboral(diaSemana)) {
            return []; // Día no laboral (domingo)
        }
        
        // 5. GENERAR TODOS LOS SLOTS POSIBLES PARA ESE DÍA
        const todosLosSlots = generarSlotsDisponibles(diaSemana);
        
        // 6. OBTENER TURNOS EXISTENTES DEL BARBERO EN ESA FECHA
        const turnosOcupados = await Turno.findAll({
            where: {
                barbero_id,
                fecha_turno: fecha,
                estado: {
                    [Op.in]: ['pendiente', 'confirmado']
                }
            },
            include: [{ model: Servicio, as: 'servicio', attributes: ['duracion'] }]
        });
        
        // 7. FILTRAR SLOTS DISPONIBLES
        const slotsDisponibles = todosLosSlots.filter(slot => {
            const horaFinSlot = calcularHoraFin(slot, servicio.duracion);
            
            // Verificar anticipación mínima
            const fechaHoraSlot = new Date(`${fecha}T${slot}:00`);
            const ahora = new Date();
            const diferenciaHoras = (fechaHoraSlot - ahora) / (1000 * 60 * 60);
            
            if (diferenciaHoras < ANTICIPACION_MINIMA_HORAS) {
                return false; // No cumple anticipación mínima
            }
            
            // Verificar que el turno no se extienda fuera del horario laboral
            if (convertirHoraAMinutos(horaFinSlot) > convertirHoraAMinutos(slot) && 
                !estaEnHorarioLaboral(diaSemana, horaFinSlot)) {
                return false;
            }
            
            // Verificar que no se solape con ningún turno ocupado
            for (const turnoOcupado of turnosOcupados) {
                const horaFinOcupado = calcularHoraFin(
                    turnoOcupado.hora_inicio.substring(0, 5), // Quitar segundos
                    turnoOcupado.servicio.duracion
                );
                
                if (haySolapamiento(
                    slot, 
                    horaFinSlot, 
                    turnoOcupado.hora_inicio.substring(0, 5), 
                    horaFinOcupado
                )) {
                    return false; // Se solapa con un turno existente
                }
            }
            
            return true; // Slot disponible
        });
        
        return slotsDisponibles;
    } catch (error) {
        throw new Error(`Error al obtener horarios disponibles: ${error.message}`);
    }
};

/**
 * Obtener un turno por ID
 * @param {string} turno_id - UUID del turno
 * @returns {Promise<Object>} Turno encontrado
 */
const obtenerTurnoPorId = async (turno_id) => {
    try {
        const turno = await Turno.findByPk(turno_id, {
            include: [
                { model: Cliente, as: 'cliente', attributes: ['cliente_id', 'nombre_completo', 'email', 'celular'] },
                { model: Barbero, as: 'barbero', attributes: ['barbero_id', 'nombre_completo', 'celular'] },
                { model: Servicio, as: 'servicio', attributes: ['servicio_id', 'nombre_servicio', 'duracion', 'precio_base'] }
            ]
        });
        
        if (!turno) {
            throw new Error('Turno no encontrado');
        }
        
        return turno;
    } catch (error) {
        throw new Error(`Error al obtener turno: ${error.message}`);
    }
};

/**
 * Obtener todos los turnos de un cliente
 * @param {string} cliente_id - UUID del cliente
 * @returns {Promise<Array>} Lista de turnos
 */
const obtenerTurnosPorCliente = async (cliente_id) => {
    try {
        const cliente = await Cliente.findByPk(cliente_id);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }
        
        const turnos = await Turno.findAll({
            where: { cliente_id },
            include: [
                { model: Barbero, as: 'barbero', attributes: ['barbero_id', 'nombre_completo'] },
                { model: Servicio, as: 'servicio', attributes: ['servicio_id', 'nombre_servicio', 'duracion', 'precio_base'] }
            ],
            order: [['fecha_turno', 'DESC'], ['hora_inicio', 'DESC']]
        });
        
        return turnos;
    } catch (error) {
        throw new Error(`Error al obtener turnos del cliente: ${error.message}`);
    }
};

/**
 * Obtener todos los turnos de un barbero
 * @param {string} barbero_id - UUID del barbero
 * @param {Object} filtros - Filtros opcionales (fecha, estado)
 * @returns {Promise<Array>} Lista de turnos
 */
const obtenerTurnosPorBarbero = async (barbero_id, filtros = {}) => {
    try {
        const barbero = await Barbero.findByPk(barbero_id);
        if (!barbero) {
            throw new Error('Barbero no encontrado');
        }
        
        const where = { barbero_id };
        
        if (filtros.fecha) {
            where.fecha_turno = filtros.fecha;
        }
        if (filtros.estado) {
            where.estado = filtros.estado;
        }
        
        const turnos = await Turno.findAll({
            where,
            include: [
                { model: Cliente, as: 'cliente', attributes: ['cliente_id', 'nombre_completo', 'celular'] },
                { model: Servicio, as: 'servicio', attributes: ['servicio_id', 'nombre_servicio', 'duracion'] }
            ],
            order: [['fecha_turno', 'ASC'], ['hora_inicio', 'ASC']]
        });
        
        return turnos;
    } catch (error) {
        throw new Error(`Error al obtener turnos del barbero: ${error.message}`);
    }
};

/**
 * Obtener todos los turnos de una fecha específica
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {Promise<Array>} Lista de turnos
 */
const obtenerTurnosPorFecha = async (fecha) => {
    try {
        const turnos = await Turno.findAll({
            where: { fecha_turno: fecha },
            include: [
                { model: Cliente, as: 'cliente', attributes: ['cliente_id', 'nombre_completo', 'celular'] },
                { model: Barbero, as: 'barbero', attributes: ['barbero_id', 'nombre_completo'] },
                { model: Servicio, as: 'servicio', attributes: ['servicio_id', 'nombre_servicio', 'duracion'] }
            ],
            order: [['hora_inicio', 'ASC']]
        });
        
        return turnos;
    } catch (error) {
        throw new Error(`Error al obtener turnos por fecha: ${error.message}`);
    }
};

/**
 * Actualizar el estado de un turno
 * @param {string} turno_id - UUID del turno
 * @param {string} nuevoEstado - Nuevo estado del turno
 * @returns {Promise<Object>} Turno actualizado
 */
const actualizarEstadoTurno = async (turno_id, nuevoEstado) => {
    try {
        const turno = await Turno.findByPk(turno_id);
        
        if (!turno) {
            throw new Error('Turno no encontrado');
        }
        
        // VALIDACIÓN: No se puede cambiar el estado de un turno cancelado o finalizado
        if (turno.estado === 'cancelado') {
            throw new Error('No se puede modificar el estado de un turno cancelado');
        }
        if (turno.estado === 'finalizado') {
            throw new Error('No se puede modificar el estado de un turno finalizado');
        }
        
        await turno.update({ estado: nuevoEstado });
        
        return turno;
    } catch (error) {
        throw new Error(`Error al actualizar estado del turno: ${error.message}`);
    }
};

/**
 * Cancelar un turno (solo si está pendiente o confirmado)
 * @param {string} turno_id - UUID del turno
 * @returns {Promise<Object>} Turno cancelado
 */
const cancelarTurno = async (turno_id) => {
    try {
        const turno = await Turno.findByPk(turno_id);
        
        if (!turno) {
            throw new Error('Turno no encontrado');
        }
        
        // VALIDACIÓN DE NEGOCIO: Solo se pueden cancelar turnos pendientes o confirmados
        if (turno.estado !== 'pendiente' && turno.estado !== 'confirmado') {
            throw new Error('Solo se pueden cancelar turnos en estado pendiente o confirmado');
        }
        
        await turno.update({ estado: 'cancelado' });
        
        // Obtener turno con relaciones para el email
        const turnoCompleto = await Turno.findByPk(turno_id, {
            include: [
                { model: Cliente, as: 'cliente', attributes: ['cliente_id', 'nombre_completo', 'email', 'celular'] },
                { model: Barbero, as: 'barbero', attributes: ['barbero_id', 'nombre_completo'] },
                { model: Servicio, as: 'servicio', attributes: ['servicio_id', 'nombre_servicio', 'duracion', 'precio_base'] }
            ]
        });
        
        // ENVIAR EMAIL DE CANCELACIÓN (no bloquea la respuesta)
        enviarEmailCancelacionTurno(turnoCompleto)
            .catch(error => console.error('⚠️  Error al enviar email de cancelación:', error.message));
        
        return turno;
    } catch (error) {
        throw new Error(`Error al cancelar turno: ${error.message}`);
    }
};

/**
 * Finalizar automáticamente turnos que ya pasaron
 * Actualiza turnos con estado 'pendiente' o 'confirmado' cuya fecha y hora ya transcurrieron
 * @returns {Promise<number>} Cantidad de turnos actualizados
 */
const finalizarTurnosPasados = async () => {
    try {
        const ahora = new Date();
        const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        
        // Obtener turnos pendientes o confirmados de fechas pasadas o de hoy
        const turnosPendientes = await Turno.findAll({
            where: {
                estado: {
                    [Op.in]: ['pendiente', 'confirmado']
                },
                fecha_turno: {
                    [Op.lte]: hoy
                }
            },
            include: [
                { model: Servicio, as: 'servicio', attributes: ['duracion'] }
            ]
        });
        
        let turnosFinalizados = 0;
        
        // Verificar cada turno si ya pasó su hora
        for (const turno of turnosPendientes) {
            // Construir la fecha y hora completa del turno
            const fechaTurno = new Date(turno.fecha_turno + 'T00:00:00');
            const [horas, minutos] = turno.hora_inicio.split(':').map(Number);
            fechaTurno.setHours(horas, minutos, 0);
            
            // Sumar la duración del servicio para obtener la hora de finalización
            const duracionMs = (turno.servicio?.duracion || 30) * 60 * 1000;
            const horaFinTurno = new Date(fechaTurno.getTime() + duracionMs);
            
            // Si la hora de finalización ya pasó, marcar como finalizado
            if (horaFinTurno <= ahora) {
                await turno.update({ estado: 'finalizado' });
                turnosFinalizados++;
                console.log(`✅ Turno ${turno.turno_id} finalizado automáticamente (fecha: ${turno.fecha_turno}, hora: ${turno.hora_inicio})`);
            }
        }
        
        if (turnosFinalizados > 0) {
            console.log(`📊 ${turnosFinalizados} turno(s) finalizado(s) automáticamente`);
        }
        
        return turnosFinalizados;
    } catch (error) {
        console.error('❌ Error al finalizar turnos pasados:', error.message);
        throw new Error(`Error al finalizar turnos pasados: ${error.message}`);
    }
};

/**
 * Obtener estadísticas de ingresos del mes actual
 * @returns {Promise<Object>} Estadísticas de ingresos
 */
const obtenerEstadisticasIngresosMes = async (barbero_id = null) => {
    try {
        // Finalizar turnos pasados antes de calcular estadísticas
        await finalizarTurnosPasados();
        
        const hoy = new Date();
        const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        
        // Construir condiciones WHERE con filtro opcional de barbero
        const whereConditions = {
            estado: 'finalizado',
            fecha_turno: {
                [Op.between]: [primerDiaMes, ultimoDiaMes]
            }
        };
        
        if (barbero_id) {
            whereConditions.barbero_id = barbero_id;
        }
        
        // Obtener todos los turnos finalizados del mes
        const turnosFinalizados = await Turno.findAll({
            where: whereConditions,
            include: [
                { model: Servicio, as: 'servicio', attributes: ['nombre_servicio'] },
                { model: Barbero, as: 'barbero', attributes: ['nombre_completo'] },
                { model: Cliente, as: 'cliente', attributes: ['email'] }
            ]
        });
        
        // Calcular totales
        const ingresoTotal = turnosFinalizados.reduce((sum, turno) => sum + parseFloat(turno.precio_final || 0), 0);
        const cantidadTurnos = turnosFinalizados.length;
        const promedioIngreso = cantidadTurnos > 0 ? ingresoTotal / cantidadTurnos : 0;
        
        // Contar turnos por orden de llegada (clientes con email temporal)
        const turnosOrdenLlegada = turnosFinalizados.filter(turno => {
            const email = turno.cliente?.email || '';
            return email.includes('orden_llegada_') && email.includes('@temporal.com');
        }).length;
        
        // Ingresos por barbero
        const ingresosPorBarbero = turnosFinalizados.reduce((acc, turno) => {
            const nombreBarbero = turno.barbero?.nombre_completo || 'Sin asignar';
            if (!acc[nombreBarbero]) {
                acc[nombreBarbero] = 0;
            }
            acc[nombreBarbero] += parseFloat(turno.precio_final || 0);
            return acc;
        }, {});
        
        // Ingresos por servicio
        const ingresosPorServicio = turnosFinalizados.reduce((acc, turno) => {
            const nombreServicio = turno.servicio?.nombre_servicio || 'Sin servicio';
            if (!acc[nombreServicio]) {
                acc[nombreServicio] = 0;
            }
            acc[nombreServicio] += parseFloat(turno.precio_final || 0);
            return acc;
        }, {});
        
        return {
            mes: hoy.toLocaleString('es-AR', { month: 'long', year: 'numeric' }),
            ingresoTotal,
            cantidadTurnos,
            promedioIngreso,
            turnosOrdenLlegada,
            ingresosPorBarbero,
            ingresosPorServicio
        };
    } catch (error) {
        throw new Error(`Error al obtener estadísticas de ingresos: ${error.message}`);
    }
};

/**
 * Obtener estadísticas de la última semana (últimos 7 días)
 * @param {string|null} barbero_id - UUID del barbero (opcional, filtra por barbero)
 * @returns {Promise<Object>} Estadísticas semanales
 */
const obtenerEstadisticasSemana = async (barbero_id = null) => {
    try {
        // Finalizar turnos pasados antes de calcular estadísticas
        await finalizarTurnosPasados();
        
        const hoy = new Date();
        hoy.setHours(23, 59, 59, 999);
        
        const hace7Dias = new Date(hoy);
        hace7Dias.setDate(hace7Dias.getDate() - 6);
        hace7Dias.setHours(0, 0, 0, 0);
        
        const hace14Dias = new Date(hoy);
        hace14Dias.setDate(hace14Dias.getDate() - 13);
        hace14Dias.setHours(0, 0, 0, 0);
        
        // Construir condiciones WHERE con filtro opcional de barbero
        const whereConditionsSemana = {
            fecha_turno: {
                [Op.between]: [hace7Dias, hoy]
            }
        };
        
        const whereConditionsSemanaAnterior = {
            fecha_turno: {
                [Op.between]: [hace14Dias, hace7Dias]
            }
        };
        
        if (barbero_id) {
            whereConditionsSemana.barbero_id = barbero_id;
            whereConditionsSemanaAnterior.barbero_id = barbero_id;
        }
        
        // Turnos de la última semana
        const turnosUltimaSemana = await Turno.findAll({
            where: whereConditionsSemana,
            include: [
                { model: Servicio, as: 'servicio', attributes: ['nombre_servicio'] },
                { model: Barbero, as: 'barbero', attributes: ['nombre_completo'] }
            ]
        });
        
        // Turnos de la semana anterior (para comparación)
        const turnosSemanaAnterior = await Turno.findAll({
            where: whereConditionsSemanaAnterior
        });
        
        // Estadísticas de la última semana
        const turnosFinalizados = turnosUltimaSemana.filter(t => t.estado === 'finalizado');
        const turnosCancelados = turnosUltimaSemana.filter(t => t.estado === 'cancelado');
        const ingresoTotal = turnosFinalizados.reduce((sum, turno) => sum + parseFloat(turno.precio_final || 0), 0);
        
        // Estadísticas por estado
        const turnosPorEstado = {
            pendiente: turnosUltimaSemana.filter(t => t.estado === 'pendiente').length,
            confirmado: turnosUltimaSemana.filter(t => t.estado === 'confirmado').length,
            finalizado: turnosFinalizados.length,
            cancelado: turnosCancelados.length
        };
        
        // Tasa de cancelación
        const tasaCancelacion = turnosUltimaSemana.length > 0 
            ? ((turnosCancelados.length / turnosUltimaSemana.length) * 100).toFixed(1)
            : 0;
        
        // Horarios más populares
        const horariosFrecuencia = turnosUltimaSemana.reduce((acc, turno) => {
            const hora = turno.hora_inicio.substring(0, 5); // HH:MM
            if (!acc[hora]) {
                acc[hora] = 0;
            }
            acc[hora]++;
            return acc;
        }, {});
        
        const horariosPopulares = Object.entries(horariosFrecuencia)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([hora, cantidad]) => ({ hora, cantidad }));
        
        // Comparación con semana anterior
        const turnosFinalizadosSemanaAnterior = turnosSemanaAnterior.filter(t => t.estado === 'finalizado');
        const ingresoSemanaAnterior = turnosFinalizadosSemanaAnterior.reduce((sum, turno) => sum + parseFloat(turno.precio_final || 0), 0);
        
        const cambioTurnos = turnosUltimaSemana.length - turnosSemanaAnterior.length;
        const cambioIngresos = ingresoTotal - ingresoSemanaAnterior;
        const porcentajeCambioTurnos = turnosSemanaAnterior.length > 0 
            ? ((cambioTurnos / turnosSemanaAnterior.length) * 100).toFixed(1)
            : 0;
        const porcentajeCambioIngresos = ingresoSemanaAnterior > 0 
            ? ((cambioIngresos / ingresoSemanaAnterior) * 100).toFixed(1)
            : 0;
        
        return {
            ultimaSemana: {
                totalTurnos: turnosUltimaSemana.length,
                ingresoTotal,
                turnosPorEstado,
                tasaCancelacion,
                horariosPopulares
            },
            comparacion: {
                cambioTurnos,
                cambioIngresos,
                porcentajeCambioTurnos,
                porcentajeCambioIngresos,
                turnosSemanaAnterior: turnosSemanaAnterior.length,
                ingresoSemanaAnterior
            }
        };
    } catch (error) {
        throw new Error(`Error al obtener estadísticas semanales: ${error.message}`);
    }
};

/**
 * Obtener total de clientes únicos que alguna vez reservaron con un barbero
 * @param {string} barbero_id - UUID del barbero
 * @returns {Promise<number>} Cantidad de clientes únicos (histórico completo)
 */
const obtenerClientesUnicosBarbero = async (barbero_id) => {
    try {
        // Obtener TODOS los turnos del barbero (sin filtro de fecha)
        const turnos = await Turno.findAll({
            where: {
                barbero_id
            },
            attributes: ['cliente_id'],
            include: [
                { model: Cliente, as: 'cliente', attributes: ['cliente_id', 'nombre_completo'] }
            ]
        });

        // Contar clientes únicos
        const clientesUnicos = new Set(turnos.map(turno => turno.cliente_id));
        
        return clientesUnicos.size;
    } catch (error) {
        throw new Error(`Error al obtener clientes únicos: ${error.message}`);
    }
};

/**
 * Obtener turnos del barbero agrupados por día en los últimos 7 días
 * @param {string} barbero_id - UUID del barbero
 * @returns {Promise<Array>} Array con fecha y cantidad de turnos por día
 */
const obtenerTurnosPorDia = async (barbero_id) => {
    try {
        const { sequelize } = require('../../Models/index');
        
        // Calcular la fecha de hace 7 días
        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);
        hace7Dias.setHours(0, 0, 0, 0);

        // Construir condiciones WHERE con filtro de barbero
        const whereConditions = {
            fecha_turno: {
                [Op.gte]: hace7Dias
            }
        };
        
        if (barbero_id) {
            whereConditions.barbero_id = barbero_id;
        }

        // Query para contar turnos agrupados por fecha
        const estadisticas = await Turno.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('fecha_turno')), 'fecha'],
                [sequelize.fn('COUNT', sequelize.col('turno_id')), 'cantidad']
            ],
            where: whereConditions,
            group: [sequelize.fn('DATE', sequelize.col('fecha_turno'))],
            order: [[sequelize.fn('DATE', sequelize.col('fecha_turno')), 'ASC']],
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
        throw new Error(`Error al obtener turnos por día: ${error.message}`);
    }
};

module.exports = {
    crearTurno,
    obtenerHorariosDisponibles,
    obtenerTurnoPorId,
    obtenerTurnosPorCliente,
    obtenerTurnosPorBarbero,
    obtenerTurnosPorFecha,
    actualizarEstadoTurno,
    cancelarTurno,
    finalizarTurnosPasados,
    obtenerEstadisticasIngresosMes,
    obtenerEstadisticasSemana,
    obtenerClientesUnicosBarbero,
    obtenerTurnosPorDia
};
