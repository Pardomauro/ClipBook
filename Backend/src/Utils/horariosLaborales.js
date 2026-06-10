/**
 * CONFIGURACIÓN DE HORARIOS LABORALES DE LA BARBERÍA
 * Define los horarios de atención por día de la semana
 */

const HORARIOS_LABORALES = {
    // Lunes (1) a Jueves (4): Mañana y tarde
    1: { rangos: [{ inicio: '10:30', fin: '16:30' }, { inicio: '17:00', fin: '22:30' }], activo: true },
    2: { rangos: [{ inicio: '10:30', fin: '16:30' }, { inicio: '17:00', fin: '22:30' }], activo: true },
    3: { rangos: [{ inicio: '10:30', fin: '16:30' }, { inicio: '17:00', fin: '22:30' }], activo: true },
    4: { rangos: [{ inicio: '10:30', fin: '16:30' }, { inicio: '17:00', fin: '22:30' }], activo: true },
    
    // Viernes (5) y Sábado (6): Corrido
    5: { rangos: [{ inicio: '10:00', fin: '22:30' }], activo: true },
    6: { rangos: [{ inicio: '10:00', fin: '22:30' }], activo: true },
    
    // Domingo (0): Cerrado
    0: { rangos: [], activo: false }
};

// Intervalo de tiempo entre turnos (en minutos)
const INTERVALO_TURNOS = 30;

// Anticipación mínima para agendar un turno (en horas)
const ANTICIPACION_MINIMA_HORAS = 1;

// Días máximos hacia adelante para agendar
const DIAS_MAXIMOS_ADELANTE = 15;

/**
 * Verificar si un día está activo para turnos
 * @param {number} diaSemana - Día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)
 * @returns {boolean}
 */
const esDiaLaboral = (diaSemana) => {
    return HORARIOS_LABORALES[diaSemana]?.activo || false;
};

/**
 * Obtener los rangos horarios de un día específico
 * @param {number} diaSemana - Día de la semana (0-6)
 * @returns {Array} Array de objetos con {inicio, fin}
 */
const obtenerRangosHorarios = (diaSemana) => {
    return HORARIOS_LABORALES[diaSemana]?.rangos || [];
};

/**
 * Verificar si una hora está dentro de los horarios laborales
 * @param {number} diaSemana - Día de la semana (0-6)
 * @param {string} hora - Hora en formato HH:MM
 * @returns {boolean}
 */
const estaEnHorarioLaboral = (diaSemana, hora) => {
    if (!esDiaLaboral(diaSemana)) return false;
    
    const rangos = obtenerRangosHorarios(diaSemana);
    const horaMinutos = convertirHoraAMinutos(hora);
    
    return rangos.some(rango => {
        const inicioMinutos = convertirHoraAMinutos(rango.inicio);
        const finMinutos = convertirHoraAMinutos(rango.fin);
        return horaMinutos >= inicioMinutos && horaMinutos < finMinutos;
    });
};

/**
 * Convertir hora HH:MM a minutos desde medianoche
 * @param {string} hora - Hora en formato HH:MM
 * @returns {number} Minutos desde medianoche
 */
const convertirHoraAMinutos = (hora) => {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
};

/**
 * Convertir minutos a hora HH:MM
 * @param {number} minutos - Minutos desde medianoche
 * @returns {string} Hora en formato HH:MM
 */
const convertirMinutosAHora = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Generar todos los slots de tiempo disponibles para un día
 * @param {number} diaSemana - Día de la semana (0-6)
 * @returns {Array<string>} Array de horarios en formato HH:MM
 */
const generarSlotsDisponibles = (diaSemana) => {
    if (!esDiaLaboral(diaSemana)) return [];
    
    const slots = [];
    const rangos = obtenerRangosHorarios(diaSemana);
    
    rangos.forEach(rango => {
        let inicioMinutos = convertirHoraAMinutos(rango.inicio);
        const finMinutos = convertirHoraAMinutos(rango.fin);
        
        while (inicioMinutos < finMinutos) {
            slots.push(convertirMinutosAHora(inicioMinutos));
            inicioMinutos += INTERVALO_TURNOS;
        }
    });
    
    return slots;
};

/**
 * Calcular la hora de fin del turno según la duración del servicio
 * @param {string} horaInicio - Hora de inicio HH:MM
 * @param {number} duracionMinutos - Duración del servicio en minutos
 * @returns {string} Hora de fin HH:MM
 */
const calcularHoraFin = (horaInicio, duracionMinutos) => {
    const inicioMinutos = convertirHoraAMinutos(horaInicio);
    const finMinutos = inicioMinutos + duracionMinutos;
    return convertirMinutosAHora(finMinutos);
};

/**
 * Verificar si hay solapamiento entre dos rangos horarios
 * @param {string} hora1Inicio - HH:MM
 * @param {string} hora1Fin - HH:MM
 * @param {string} hora2Inicio - HH:MM
 * @param {string} hora2Fin - HH:MM
 * @returns {boolean}
 */
const haySolapamiento = (hora1Inicio, hora1Fin, hora2Inicio, hora2Fin) => {
    const inicio1 = convertirHoraAMinutos(hora1Inicio);
    const fin1 = convertirHoraAMinutos(hora1Fin);
    const inicio2 = convertirHoraAMinutos(hora2Inicio);
    const fin2 = convertirHoraAMinutos(hora2Fin);
    
    return inicio1 < fin2 && inicio2 < fin1;
};

module.exports = {
    HORARIOS_LABORALES,
    INTERVALO_TURNOS,
    ANTICIPACION_MINIMA_HORAS,
    DIAS_MAXIMOS_ADELANTE,
    esDiaLaboral,
    obtenerRangosHorarios,
    estaEnHorarioLaboral,
    convertirHoraAMinutos,
    convertirMinutosAHora,
    generarSlotsDisponibles,
    calcularHoraFin,
    haySolapamiento
};
