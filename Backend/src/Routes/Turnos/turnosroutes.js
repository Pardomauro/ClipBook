const router = require('express').Router();
const turnosController = require('../../Controllers/Turnos/turnosController');
const { handleValidationErrors } = require('../../Middlewares/validationMiddleware');
const { 
    crearTurnoValidator, 
    actualizarEstadoTurnoValidator, 
    cancelarTurnoValidator,
    turnoIdValidator,
    horariosDisponiblesValidator,
    turnosPorFechaValidator,
    turnosPorClienteValidator,
    turnosPorBarberoValidator
} = require('../../Middlewares/Validators/turnosValidator');

/**
 * Rutas de Turnos
 * Base: /api/v1/turnos
 */

// GET /api/v1/turnos/estadisticas/ingresos-mes - Obtener estadísticas de ingresos del mes
router.get('/estadisticas/ingresos-mes', 
    turnosController.obtenerEstadisticasIngresosMes
);

// GET /api/v1/turnos/estadisticas/semana - Obtener estadísticas de la última semana
router.get('/estadisticas/semana', 
    turnosController.obtenerEstadisticasSemana
);

// GET /api/v1/turnos/estadisticas/turnos-por-dia - Turnos por día últimos 7 días
router.get('/estadisticas/turnos-por-dia', 
    turnosController.obtenerTurnosPorDia
);

// GET /api/v1/turnos/estadisticas/clientes-barbero/:barbero_id - Clientes únicos del barbero últimos 7 días
router.get('/estadisticas/clientes-barbero/:barbero_id', 
    turnosController.obtenerClientesUnicosBarbero
);

// POST /api/v1/turnos/finalizar-pasados - Finalizar automáticamente turnos que ya pasaron
router.post('/finalizar-pasados', 
    turnosController.finalizarTurnosPasados
);

// GET /api/v1/turnos/disponibles - Obtener horarios disponibles de un barbero en una fecha
router.get('/disponibles', 
    horariosDisponiblesValidator, 
    handleValidationErrors, 
    turnosController.obtenerHorariosDisponibles
);

// GET /api/v1/turnos/fecha - Obtener todos los turnos de una fecha específica
router.get('/fecha', 
    turnosPorFechaValidator, 
    handleValidationErrors, 
    turnosController.obtenerTurnosPorFecha
);

// GET /api/v1/turnos/cliente/:cliente_id - Obtener turnos de un cliente
router.get('/cliente/:cliente_id', 
    turnosPorClienteValidator, 
    handleValidationErrors, 
    turnosController.obtenerTurnosPorCliente
);

// GET /api/v1/turnos/barbero/:barbero_id - Obtener turnos de un barbero (con filtros opcionales)
router.get('/barbero/:barbero_id', 
    turnosPorBarberoValidator, 
    handleValidationErrors, 
    turnosController.obtenerTurnosPorBarbero
);

// GET /api/v1/turnos/:turno_id - Obtener un turno específico
router.get('/:turno_id', 
    turnoIdValidator, 
    handleValidationErrors, 
    turnosController.obtenerTurnoPorId
);

// POST /api/v1/turnos - Crear un nuevo turno
router.post('/', 
    crearTurnoValidator, 
    handleValidationErrors, 
    turnosController.crearTurno
);

// PATCH /api/v1/turnos/:turno_id/estado - Actualizar estado de un turno
router.patch('/:turno_id/estado', 
    actualizarEstadoTurnoValidator, 
    handleValidationErrors, 
    turnosController.actualizarEstadoTurno
);

// PATCH /api/v1/turnos/:turno_id/cancelar - Cancelar un turno
router.patch('/:turno_id/cancelar', 
    cancelarTurnoValidator, 
    handleValidationErrors, 
    turnosController.cancelarTurno
);

module.exports = router;