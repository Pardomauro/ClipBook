const { body, param, query } = require('express-validator');

/**
 * VALIDACIONES PARA CREAR TURNO
 * Acepta dos formas:
 * 1. Con cliente_id (cliente ya registrado)
 * 2. Con cliente (objeto con datos - se crea/busca automáticamente)
 */
const crearTurnoValidator = [
    // Validar que venga cliente_id O cliente (no ambos, no ninguno)
    body()
        .custom((value, { req }) => {
            const tieneClienteId = req.body.cliente_id;
            const tieneCliente = req.body.cliente;
            
            if (!tieneClienteId && !tieneCliente) {
                throw new Error('Debe proporcionar cliente_id o los datos del cliente');
            }
            
            if (tieneClienteId && tieneCliente) {
                throw new Error('No puede enviar cliente_id y cliente al mismo tiempo');
            }
            
            return true;
        }),
    
    // Si viene cliente_id, validarlo
    body('cliente_id')
        .optional()
        .isUUID().withMessage('El ID del cliente debe ser un UUID válido'),
    
    // Si viene cliente (objeto), validar sus campos
    body('cliente.nombre_completo')
        .if(body('cliente').exists())
        .notEmpty().withMessage('El nombre completo del cliente es requerido')
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage('El nombre debe tener entre 3 y 150 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    
    body('cliente.email')
        .if(body('cliente').exists())
        .notEmpty().withMessage('El email del cliente es requerido')
        .trim()
        .toLowerCase()
        .isEmail().withMessage('Debe ser un email válido')
        .isLength({ max: 100 })
        .withMessage('El email no puede superar los 100 caracteres'),
    
    body('cliente.celular')
        .if(body('cliente').exists())
        .notEmpty().withMessage('El celular del cliente es requerido')
        .trim()
        .matches(/^[0-9]{10,15}$/)
        .withMessage('El celular debe tener entre 10 y 15 dígitos numéricos'),
    
    body('cliente.direccion')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('La dirección no puede superar los 255 caracteres'),
    
    body('barbero_id')
        .notEmpty().withMessage('El ID del barbero es requerido')
        .isUUID().withMessage('El ID del barbero debe ser un UUID válido'),
    
    body('servicio_id')
        .notEmpty().withMessage('El ID del servicio es requerido')
        .isUUID().withMessage('El ID del servicio debe ser un UUID válido'),
    
    body('fecha_turno')
        .notEmpty().withMessage('La fecha del turno es requerida')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('La fecha debe estar en formato YYYY-MM-DD')
        .custom((value, { req }) => {
            const fecha = new Date(value + 'T00:00:00');
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            // Si el estado es 'finalizado', permitir fechas pasadas (para registrar cortes ya realizados)
            if (req.body.estado === 'finalizado') {
                return true;
            }
            
            if (fecha < hoy) {
                throw new Error('No se pueden reservar turnos en fechas pasadas');
            }
            
            return true;
        }),
    
    body('hora_inicio')
        .notEmpty().withMessage('La hora de inicio es requerida')
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('La hora debe estar en formato HH:MM (24 horas)'),
    
    body('precio_final')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser mayor o igual a 0'),
    
    // Estado opcional (para registrar cortes ya realizados)
    body('estado')
        .optional()
        .isIn(['pendiente', 'confirmado', 'finalizado', 'cancelado'])
        .withMessage('El estado debe ser: pendiente, confirmado, finalizado o cancelado')
];

/**
 * VALIDACIONES PARA ACTUALIZAR ESTADO DE TURNO
 */
const actualizarEstadoTurnoValidator = [
    param('turno_id')
        .isUUID().withMessage('El ID del turno debe ser un UUID válido'),
    
    body('estado')
        .notEmpty().withMessage('El estado es requerido')
        .isIn(['pendiente', 'confirmado', 'finalizado', 'cancelado'])
        .withMessage('El estado debe ser: pendiente, confirmado, finalizado o cancelado')
];

/**
 * VALIDACIÓN PARA CANCELAR TURNO
 */
const cancelarTurnoValidator = [
    param('turno_id')
        .isUUID().withMessage('El ID del turno debe ser un UUID válido')
];

/**
 * VALIDACIÓN PARA OPERACIONES POR ID
 */
const turnoIdValidator = [
    param('turno_id')
        .isUUID().withMessage('El ID del turno debe ser un UUID válido')
];

/**
 * VALIDACIONES PARA OBTENER HORARIOS DISPONIBLES
 */
const horariosDisponiblesValidator = [
    query('barbero_id')
        .notEmpty().withMessage('El ID del barbero es requerido')
        .isUUID().withMessage('El ID del barbero debe ser un UUID válido'),
    
    query('fecha')
        .notEmpty().withMessage('La fecha es requerida')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('La fecha debe estar en formato YYYY-MM-DD'),
    
    query('servicio_id')
        .notEmpty().withMessage('El ID del servicio es requerido')
        .isUUID().withMessage('El ID del servicio debe ser un UUID válido')
];

/**
 * VALIDACIONES PARA FILTRAR TURNOS POR FECHA
 */
const turnosPorFechaValidator = [
    query('fecha')
        .notEmpty().withMessage('La fecha es requerida')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('La fecha debe estar en formato YYYY-MM-DD')
];

/**
 * VALIDACIONES PARA TURNOS DE UN CLIENTE
 */
const turnosPorClienteValidator = [
    param('cliente_id')
        .isUUID().withMessage('El ID del cliente debe ser un UUID válido')
];

/**
 * VALIDACIONES PARA TURNOS DE UN BARBERO
 */
const turnosPorBarberoValidator = [
    param('barbero_id')
        .isUUID().withMessage('El ID del barbero debe ser un UUID válido')
];

module.exports = {
    crearTurnoValidator,
    actualizarEstadoTurnoValidator,
    cancelarTurnoValidator,
    turnoIdValidator,
    horariosDisponiblesValidator,
    turnosPorFechaValidator,
    turnosPorClienteValidator,
    turnosPorBarberoValidator
};
