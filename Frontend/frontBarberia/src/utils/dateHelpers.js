import { 
    HORARIOS_LABORALES, 
    NOMBRES_DIAS, 
    DIAS_MAXIMOS_ADELANTE, 
    ANTICIPACION_MINIMA_HORAS,
    INTERVALO_TURNOS
} from './constants';

/** 
 * =============================================================
 * DATE HELPERS DE LA APLICACIÓN
 * =============================================================
 * Funciones para manejar fechas, horarios y validaciones relacionadas con turnos y agendas.
 * Sincronizado con: Backend/src/Utils/horariosLaborales.js
 */

/**
 * =============================================================
 * FORMATEO DE FECHAS Y HORAS
 * =============================================================
 */

/**
 * Formatea una fecha a formato legible en español
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} - Fecha formateada (ej: "24 de febrero de 2026")
 */
export const formatearFecha = (fecha) => {
    const date = typeof fecha === 'string' ? new Date(fecha + 'T00:00:00') : new Date(fecha);
    
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const anio = date.getFullYear();
    
    return `${dia} de ${mes} de ${anio}`;
};

/**
 * Formatea una fecha con día de la semana
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} - Fecha formateada (ej: "Lunes 24 de febrero")
 */
export const formatearFechaConDia = (fecha) => {
    const date = typeof fecha === 'string' ? new Date(fecha + 'T00:00:00') : new Date(fecha);
    const diaSemana = NOMBRES_DIAS[date.getDay()];
    const fechaFormateada = formatearFecha(fecha);
    
    return `${diaSemana} ${fechaFormateada}`;
};

/**
 * Formatea una hora de HH:MM:SS a HH:MM
 * @param {string} hora - Hora en formato HH:MM:SS o HH:MM
 * @returns {string} - Hora formateada (ej: "14:30")
 */
export const formatearHora = (hora) => {
    if (!hora) return '';
    return hora.substring(0, 5); // Obtiene HH:MM de HH:MM:SS
};

/**
 * Formatea una fecha a formato ISO (YYYY-MM-DD)
 * @param {Date} fecha - Objeto Date
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
export const formatearFechaISO = (fecha) => {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

/**
 * =============================================================
 * OBTENCIÓN DE FECHAS Y HORAS
 * =============================================================
 */

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns {string} - Fecha actual
 */
export const obtenerFechaHoy = () => {
    return formatearFechaISO(new Date());
};

/**
 * Obtiene el día de la semana de una fecha (0=Domingo, 6=Sábado)
 * @param {string|Date} fecha - Fecha a evaluar
 * @returns {number} - Día de la semana (0-6)
 */
export const obtenerDiaSemana = (fecha) => {
    const date = typeof fecha === 'string' ? new Date(fecha + 'T00:00:00') : new Date(fecha);
    return date.getDay();
};

/**
 * Obtiene la hora actual en formato HH:MM
 * @returns {string} - Hora actual
 */
export const obtenerHoraActual = () => {
    const now = new Date();
    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
};

/**
 * =============================================================
 * OPERACIONES CON FECHAS
 * =============================================================
 */

/**
 * Suma o resta días a una fecha
 * @param {string|Date} fecha - Fecha base
 * @param {number} dias - Cantidad de días a sumar (positivo) o restar (negativo)
 * @returns {string} - Nueva fecha en formato YYYY-MM-DD
 */
export const agregarDias = (fecha, dias) => {
    const date = typeof fecha === 'string' ? new Date(fecha + 'T00:00:00') : new Date(fecha);
    date.setDate(date.getDate() + dias);
    return formatearFechaISO(date);
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {string|Date} fecha1 - Primera fecha
 * @param {string|Date} fecha2 - Segunda fecha
 * @returns {number} - Diferencia en días
 */
export const diferenciaDias = (fecha1, fecha2) => {
    const date1 = typeof fecha1 === 'string' ? new Date(fecha1 + 'T00:00:00') : new Date(fecha1);
    const date2 = typeof fecha2 === 'string' ? new Date(fecha2 + 'T00:00:00') : new Date(fecha2);
    
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
};

/**
 * Compara si una fecha es anterior a otra
 * @param {string|Date} fecha1 - Primera fecha
 * @param {string|Date} fecha2 - Segunda fecha
 * @returns {boolean} - true si fecha1 es anterior a fecha2
 */
export const esAnterior = (fecha1, fecha2) => {
    const date1 = typeof fecha1 === 'string' ? new Date(fecha1 + 'T00:00:00') : new Date(fecha1);
    const date2 = typeof fecha2 === 'string' ? new Date(fecha2 + 'T00:00:00') : new Date(fecha2);
    
    return date1 < date2;
};

/**
 * Genera un array de fechas entre dos fechas
 * @param {string|Date} fechaInicio - Fecha inicial
 * @param {string|Date} fechaFin - Fecha final
 * @returns {Array<string>} - Array de fechas en formato YYYY-MM-DD
 */
export const generarRangoFechas = (fechaInicio, fechaFin) => {
    const fechas = [];
    let fechaActual = typeof fechaInicio === 'string' ? new Date(fechaInicio + 'T00:00:00') : new Date(fechaInicio);
    const fechaFinal = typeof fechaFin === 'string' ? new Date(fechaFin + 'T00:00:00') : new Date(fechaFin);
    
    while (fechaActual <= fechaFinal) {
        fechas.push(formatearFechaISO(fechaActual));
        fechaActual.setDate(fechaActual.getDate() + 1);
    }
    
    return fechas;
};

/**
 * =============================================================
 * VALIDACIONES DE FECHAS Y HORARIOS
 * =============================================================
 */

/**
 * Verifica si un día está activo para turnos (no domingo)
 * @param {string|Date} fecha - Fecha a validar
 * @returns {boolean} - true si es día laboral
 */
export const esDiaLaboral = (fecha) => {
    const diaSemana = obtenerDiaSemana(fecha);
    return HORARIOS_LABORALES[diaSemana]?.activo || false;
};

/**
 * Verifica si una fecha está dentro del rango permitido para reservar
 * @param {string|Date} fecha - Fecha a validar
 * @returns {boolean} - true si está dentro del rango
 */
export const validarRangoFechas = (fecha) => {
    const fechaSeleccionada = typeof fecha === 'string' ? new Date(fecha + 'T00:00:00') : new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // No puede ser en el pasado
    if (fechaSeleccionada < hoy) {
        return false;
    }
    
    // No puede ser más allá del límite permitido
    const dias = diferenciaDias(hoy, fechaSeleccionada);
    if (dias > DIAS_MAXIMOS_ADELANTE) {
        return false;
    }
    
    return true;
};

/**
 * Verifica si una hora está dentro de los horarios laborales
 * @param {string|Date} fecha - Fecha del turno
 * @param {string} hora - Hora en formato HH:MM
 * @returns {boolean} - true si está en horario laboral
 */
export const estaEnHorarioLaboral = (fecha, hora) => {
    const diaSemana = obtenerDiaSemana(fecha);
    
    if (!esDiaLaboral(fecha)) {
        return false;
    }
    
    const rangos = HORARIOS_LABORALES[diaSemana].rangos;
    const horaMinutos = convertirHoraAMinutos(hora);
    
    return rangos.some(rango => {
        const inicioMinutos = convertirHoraAMinutos(rango.inicio);
        const finMinutos = convertirHoraAMinutos(rango.fin);
        return horaMinutos >= inicioMinutos && horaMinutos < finMinutos;
    });
};

/**
 * Verifica si hay anticipación mínima para un turno
 * @param {string} fecha - Fecha del turno en formato YYYY-MM-DD
 * @param {string} hora - Hora del turno en formato HH:MM
 * @returns {boolean} - true si cumple con la anticipación mínima
 */
export const validarAnticipacionMinima = (fecha, hora) => {
    const fechaHoraTurno = new Date(`${fecha}T${hora}:00`);
    const ahora = new Date();
    
    const diferenciaHoras = (fechaHoraTurno - ahora) / (1000 * 60 * 60);
    
    return diferenciaHoras >= ANTICIPACION_MINIMA_HORAS;
};

/**
 * =============================================================
 * UTILIDADES DE HORARIOS
 * =============================================================
 */

/**
 * Convierte hora HH:MM a minutos desde medianoche
 * @param {string} hora - Hora en formato HH:MM
 * @returns {number} - Minutos desde medianoche
 */
export const convertirHoraAMinutos = (hora) => {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
};

/**
 * Convierte minutos a hora HH:MM
 * @param {number} minutos - Minutos desde medianoche
 * @returns {string} - Hora en formato HH:MM
 */
export const convertirMinutosAHora = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Genera slots de tiempo disponibles para un día
 * @param {string|Date} fecha - Fecha para generar slots
 * @returns {Array<string>} - Array de horarios en formato HH:MM
 */
export const generarSlotsDisponibles = (fecha) => {
    const diaSemana = obtenerDiaSemana(fecha);
    
    if (!esDiaLaboral(fecha)) {
        return [];
    }
    
    const slots = [];
    const rangos = HORARIOS_LABORALES[diaSemana].rangos;
    
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
 * Calcula la hora de fin según duración del servicio
 * @param {string} horaInicio - Hora de inicio HH:MM
 * @param {number} duracionMinutos - Duración del servicio en minutos
 * @returns {string} - Hora de fin HH:MM
 */
export const calcularHoraFin = (horaInicio, duracionMinutos) => {
    const inicioMinutos = convertirHoraAMinutos(horaInicio);
    const finMinutos = inicioMinutos + duracionMinutos;
    return convertirMinutosAHora(finMinutos);
};

/**
 * Obtiene los rangos horarios de un día específico
 * @param {string|Date} fecha - Fecha a consultar
 * @returns {Array<object>} - Array de objetos con {inicio, fin}
 */
export const obtenerRangosHorarios = (fecha) => {
    const diaSemana = obtenerDiaSemana(fecha);
    return HORARIOS_LABORALES[diaSemana]?.rangos || [];
};