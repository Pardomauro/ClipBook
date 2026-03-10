/**
 * =============================================================
 * CONSTANTES GLOBALES DE LA APLICACIÓN
 * =============================================================
 * Valores sincronizados con el backend para mantener consistencia
 * Backend: AppBarberia/Backend/src/Utils/horariosLaborales.js
 */

/**
 * =============================================================
 * ESTADOS DE TURNOS
 * =============================================================
 * Sincronizado con: Backend/src/Models/Turnos/Turnos.js
 */
export const ESTADOS_TURNO = {
    PENDIENTE: 'pendiente',
    CONFIRMADO: 'confirmado',
    FINALIZADO: 'finalizado',
    CANCELADO: 'cancelado'
};

export const ESTADOS_TURNO_ARRAY = Object.values(ESTADOS_TURNO);

export const ESTADOS_TURNO_LABELS = {
    [ESTADOS_TURNO.PENDIENTE]: 'Pendiente',
    [ESTADOS_TURNO.CONFIRMADO]: 'Confirmado',
    [ESTADOS_TURNO.FINALIZADO]: 'Finalizado',
    [ESTADOS_TURNO.CANCELADO]: 'Cancelado'
};

/**
 * =============================================================
 * SERVICIOS DE LA BARBERÍA
 * =============================================================
 * Sincronizado con: Backend/src/Models/Servicio/Servicio.js
 */
export const SERVICIOS = {
    CORTE: 'corte',
    CORTE_BARBA: 'corte + barba',
    TINTURA: 'tintura'
};

export const SERVICIOS_ARRAY = Object.values(SERVICIOS);

export const SERVICIOS_LABELS = {
    [SERVICIOS.CORTE]: 'Corte',
    [SERVICIOS.CORTE_BARBA]: 'Corte + Barba',
    [SERVICIOS.TINTURA]: 'Tintura'
};

/**
 * =============================================================
 * HORARIOS LABORALES
 * =============================================================
 * Sincronizado con: Backend/src/Utils/horariosLaborales.js
 */

// Días de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)
export const DIAS_SEMANA = {
    DOMINGO: 0,
    LUNES: 1,
    MARTES: 2,
    MIERCOLES: 3,
    JUEVES: 4,
    VIERNES: 5,
    SABADO: 6
};

// Horarios de atención por día
export const HORARIOS_LABORALES = {
    // Lunes a Viernes: Mañana y tarde
    [DIAS_SEMANA.LUNES]: { 
        rangos: [
            { inicio: '09:00', fin: '13:00' }, 
            { inicio: '16:00', fin: '22:00' }
        ], 
        activo: true 
    },
    [DIAS_SEMANA.MARTES]: { 
        rangos: [
            { inicio: '09:00', fin: '13:00' }, 
            { inicio: '16:00', fin: '22:00' }
        ], 
        activo: true 
    },
    [DIAS_SEMANA.MIERCOLES]: { 
        rangos: [
            { inicio: '09:00', fin: '13:00' }, 
            { inicio: '16:00', fin: '22:00' }
        ], 
        activo: true 
    },
    [DIAS_SEMANA.JUEVES]: { 
        rangos: [
            { inicio: '09:00', fin: '13:00' }, 
            { inicio: '16:00', fin: '22:00' }
        ], 
        activo: true 
    },
    [DIAS_SEMANA.VIERNES]: { 
        rangos: [
            { inicio: '09:00', fin: '13:00' }, 
            { inicio: '16:00', fin: '22:00' }
        ], 
        activo: true 
    },
    // Sábado: Corrido
    [DIAS_SEMANA.SABADO]: { 
        rangos: [
            { inicio: '09:00', fin: '20:00' }
        ], 
        activo: true 
    },
    // Domingo: Cerrado
    [DIAS_SEMANA.DOMINGO]: { 
        rangos: [], 
        activo: false 
    }
};

// Nombres de días en español
export const NOMBRES_DIAS = {
    [DIAS_SEMANA.DOMINGO]: 'Domingo',
    [DIAS_SEMANA.LUNES]: 'Lunes',
    [DIAS_SEMANA.MARTES]: 'Martes',
    [DIAS_SEMANA.MIERCOLES]: 'Miércoles',
    [DIAS_SEMANA.JUEVES]: 'Jueves',
    [DIAS_SEMANA.VIERNES]: 'Viernes',
    [DIAS_SEMANA.SABADO]: 'Sábado'
};

/**
 * =============================================================
 * CONFIGURACIÓN DE TURNOS
 * =============================================================
 * Sincronizado con: Backend/src/Utils/horariosLaborales.js
 */

// Intervalo de tiempo entre turnos (en minutos)
export const INTERVALO_TURNOS = 30;

// Anticipación mínima para agendar un turno (en horas)
export const ANTICIPACION_MINIMA_HORAS = 1;

// Días máximos hacia adelante para agendar
export const DIAS_MAXIMOS_ADELANTE = 15;

/**
 * =============================================================
 * DURACIONES DE SERVICIOS
 * =============================================================
 * Rangos permitidos según el backend
 */
export const DURACION_MINIMA = 15; // minutos
export const DURACION_MAXIMA = 240; // minutos (4 horas)

/**
 * =============================================================
 * MENSAJES DE ERROR COMUNES
 * =============================================================
 */
export const MENSAJES_ERROR = {
    CONEXION: 'No se pudo conectar con el servidor. Intenta nuevamente.',
    CAMPOS_REQUERIDOS: 'Por favor completa todos los campos requeridos.',
    EMAIL_INVALIDO: 'El email ingresado no es válido.',
    CELULAR_INVALIDO: 'El número de celular no es válido.',
    FECHA_INVALIDA: 'La fecha seleccionada no es válida.',
    DIA_NO_LABORAL: 'No se pueden agendar turnos en domingos.',
    FUERA_DE_RANGO: `Solo se pueden agendar turnos con máximo ${DIAS_MAXIMOS_ADELANTE} días de anticipación.`,
    ANTICIPACION_MINIMA: `Debes reservar con al menos ${ANTICIPACION_MINIMA_HORAS} hora de anticipación.`,
    HORARIO_NO_DISPONIBLE: 'El horario seleccionado no está disponible.',
    BARBERO_INACTIVO: 'El barbero seleccionado no está disponible actualmente.',
    SERVICIO_INACTIVO: 'El servicio seleccionado no está disponible actualmente.'
};

/**
 * =============================================================
 * MENSAJES DE ÉXITO
 * =============================================================
 */
export const MENSAJES_EXITO = {
    TURNO_CREADO: 'Turno reservado exitosamente.',
    TURNO_ACTUALIZADO: 'Turno actualizado correctamente.',
    TURNO_CANCELADO: 'Turno cancelado exitosamente.',
    BARBERO_CREADO: 'Barbero creado exitosamente.',
    BARBERO_ACTUALIZADO: 'Barbero actualizado correctamente.',
    SERVICIO_CREADO: 'Servicio creado exitosamente.',
    SERVICIO_ACTUALIZADO: 'Servicio actualizado correctamente.'
};

/**
 * =============================================================
 * CONFIGURACIÓN GENERAL
 * =============================================================
 */

// URL de imagen por defecto para barberos sin foto
// Los archivos en public/ se sirven desde la raíz (/)
export const IMAGEN_BARBERO_DEFAULT = 'https://imagenes2.eltiempo.com/files/image_600_455/files/fp/uploads/2025/04/01/67ec4ef31f2ce.r_d.866-866-3464.jpeg';

// Formato de fecha para display
export const FORMATO_FECHA_DISPLAY = 'DD/MM/YYYY';
export const FORMATO_HORA_DISPLAY = 'HH:mm';

// Límites de caracteres para campos
export const LIMITES_CARACTERES = {
    NOMBRE_MIN: 3,
    NOMBRE_MAX: 100,
    DIRECCION_MIN: 5,
    DIRECCION_MAX: 200,
    CELULAR_MIN: 8,
    CELULAR_MAX: 20
};

/**
 * =============================================================
 * ROLES DE USUARIO (para cuando se implemente autenticación)
 * =============================================================
 */
export const ROLES = {
    ADMIN: 'admin',
    BARBERO: 'barbero',
    CLIENTE: 'cliente'
};
