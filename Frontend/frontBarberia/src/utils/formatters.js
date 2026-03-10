/**
 * =============================================================
 * FORMATTERS - FUNCIONES DE FORMATO
 * =============================================================
 * Funciones para formatear datos de forma consistente en toda la aplicación
 */

/**
 * =============================================================
 * FORMATEO DE PRECIOS
 * =============================================================
 */

/**
 * Formatea un precio a formato de moneda argentina
 * @param {number} precio - Precio a formatear
 * @param {boolean} mostrarSigno - Si debe mostrar el signo $
 * @returns {string} - Precio formateado (ej: "$5.000,00")
 * @example
 * formatearPrecio(5000) // "$5.000,00"
 * formatearPrecio(1500.5) // "$1.500,50"
 * formatearPrecio(500, false) // "500,00"
 */
export const formatearPrecio = (precio, mostrarSigno = true) => {
    if (precio === null || precio === undefined || isNaN(precio)) {
        return mostrarSigno ? '$0,00' : '0,00';
    }

    const precioNum = Number(precio);
    
    // Formatear con separadores de miles y decimales
    const partes = precioNum.toFixed(2).split('.');
    const entero = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const decimal = partes[1];
    
    const precioFormateado = `${entero},${decimal}`;
    
    return mostrarSigno ? `$${precioFormateado}` : precioFormateado;
};

/**
 * Formatea un precio de forma simplificada (sin decimales si son .00)
 * @param {number} precio - Precio a formatear
 * @returns {string} - Precio formateado (ej: "$5.000" o "$1.500,50")
 */
export const formatearPrecioSimple = (precio) => {
    if (precio === null || precio === undefined || isNaN(precio)) {
        return '$0';
    }

    const precioNum = Number(precio);
    
    // Si tiene decimales significativos, mostrarlos
    if (precioNum % 1 !== 0) {
        return formatearPrecio(precioNum);
    }
    
    // Si es entero, no mostrar decimales
    const entero = precioNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$${entero}`;
};

/**
 * =============================================================
 * FORMATEO DE NÚMEROS DE TELÉFONO
 * =============================================================
 */

/**
 * Formatea un número de celular argentino
 * @param {string} celular - Número de celular sin formato
 * @returns {string} - Celular formateado
 * @example
 * formatearCelular('1234567890') // "(123) 456-7890"
 * formatearCelular('+541234567890') // "+54 (123) 456-7890"
 */
export const formatearCelular = (celular) => {
    if (!celular) return '';
    
    // Remover todos los caracteres no numéricos excepto el +
    const limpio = celular.toString().replace(/[^\d+]/g, '');
    
    // Si empieza con +54 (código Argentina)
    if (limpio.startsWith('+54')) {
        const numero = limpio.substring(3);
        if (numero.length === 10) {
            return `+54 ${numero.substring(0, 3)} ${numero.substring(3, 7)}-${numero.substring(7)}`;
        }
        return limpio;
    }
    
    // Si es un número local de 10 dígitos
    if (limpio.length === 10) {
        return `(${limpio.substring(0, 3)}) ${limpio.substring(3, 7)}-${limpio.substring(7)}`;
    }
    
    // Si no coincide con ningún patrón, devolver como está
    return celular;
};

/**
 * Limpia un número de celular dejando solo dígitos
 * @param {string} celular - Número con formato
 * @returns {string} - Solo números
 */
export const limpiarCelular = (celular) => {
    if (!celular) return '';
    return celular.toString().replace(/\D/g, '');
};

/**
 * =============================================================
 * FORMATEO DE TEXTO
 * =============================================================
 */

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} texto - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 * @example
 * capitalizarTexto('juan pérez') // "Juan Pérez"
 */
export const capitalizarTexto = (texto) => {
    if (!texto) return '';
    
    return texto
        .toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
};

/**
 * Capitaliza solo la primera letra del texto
 * @param {string} texto - Texto a capitalizar
 * @returns {string} - Texto con primera letra mayúscula
 */
export const capitalizarPrimeraLetra = (texto) => {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Normaliza un nombre (capitaliza y quita espacios extra)
 * @param {string} nombre - Nombre a normalizar
 * @returns {string} - Nombre normalizado
 * @example
 * normalizarNombre('  JUAN   pérez  ') // "Juan Pérez"
 */
export const normalizarNombre = (nombre) => {
    if (!nombre) return '';
    
    // Quitar espacios al inicio/fin y múltiples espacios
    const limpio = nombre.trim().replace(/\s+/g, ' ');
    
    return capitalizarTexto(limpio);
};

/**
 * Trunca un texto si excede cierta longitud
 * @param {string} texto - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} sufijo - Sufijo a agregar (default: '...')
 * @returns {string} - Texto truncado
 */
export const truncarTexto = (texto, maxLength, sufijo = '...') => {
    if (!texto) return '';
    if (texto.length <= maxLength) return texto;
    
    return texto.substring(0, maxLength - sufijo.length) + sufijo;
};

/**
 * =============================================================
 * FORMATEO DE EMAIL
 * =============================================================
 */

/**
 * Normaliza un email (lowercase y trim)
 * @param {string} email - Email a normalizar
 * @returns {string} - Email normalizado
 */
export const normalizarEmail = (email) => {
    if (!email) return '';
    return email.trim().toLowerCase();
};

/**
 * Oculta parte del email para privacidad
 * @param {string} email - Email a ocultar
 * @returns {string} - Email parcialmente oculto (ej: "ju***@email.com")
 */
export const ocultarEmail = (email) => {
    if (!email) return '';
    
    const [usuario, dominio] = email.split('@');
    if (!usuario || !dominio) return email;
    
    const usuarioVisible = usuario.substring(0, 2);
    const usuarioOculto = '*'.repeat(Math.min(usuario.length - 2, 3));
    
    return `${usuarioVisible}${usuarioOculto}@${dominio}`;
};

/**
 * =============================================================
 * FORMATEO DE ESTADOS
 * =============================================================
 */

/**
 * Obtiene el estilo de badge según el estado del turno
 * @param {string} estado - Estado del turno
 * @returns {object} - Objeto con className y color
 */
export const obtenerEstiloBadge = (estado) => {
    const estilos = {
        pendiente: {
            className: 'bg-yellow-100 text-yellow-800',
            color: 'yellow'
        },
        confirmado: {
            className: 'bg-blue-100 text-blue-800',
            color: 'blue'
        },
        finalizado: {
            className: 'bg-green-100 text-green-800',
            color: 'green'
        },
        cancelado: {
            className: 'bg-red-100 text-red-800',
            color: 'red'
        }
    };
    
    return estilos[estado] || estilos.pendiente;
};

/**
 * Obtiene el color para un barbero activo/inactivo
 * @param {boolean} activo - Estado activo del barbero
 * @param {string} variant - Variante de estilo ('light' o 'dark')
 * @returns {object} - Objeto con className, texto y variant (opcional para Badge)
 */
export const obtenerEstiloActivo = (activo, variant = 'light') => {
    // Normalizar el valor a boolean (maneja strings, números, null, undefined)
    const esActivo = activo === true || activo === 1 || activo === '1' || activo === 'true';
    
    if (variant === 'dark') {
        return esActivo
            ? { 
                className: 'bg-green-700 hover:bg-green-700 border-green-500',
                texto: 'Activo',
                variant: 'default'
            }
            : { 
                className: 'bg-zinc-700 text-zinc-300 border-zinc-600',
                texto: 'Inactivo',
                variant: 'secondary'
            };
    }
    
    // Variante light (por defecto, mantiene compatibilidad)
    return esActivo 
        ? { className: 'bg-green-100 text-green-800', texto: 'Activo' }
        : { className: 'bg-gray-100 text-gray-800', texto: 'Inactivo' };
};

/**
 * =============================================================
 * FORMATEO DE DURACIONES
 * =============================================================
 */

/**
 * Formatea minutos a formato legible
 * @param {number} minutos - Cantidad de minutos
 * @returns {string} - Duración formateada
 * @example
 * formatearDuracion(30) // "30 min"
 * formatearDuracion(90) // "1h 30min"
 * formatearDuracion(120) // "2 horas"
 */
export const formatearDuracion = (minutos) => {
    if (!minutos || minutos === 0) return '0 min';
    
    if (minutos < 60) {
        return `${minutos} min`;
    }
    
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    
    if (mins === 0) {
        return horas === 1 ? '1 hora' : `${horas} horas`;
    }
    
    return `${horas}h ${mins}min`;
};

/**
 * =============================================================
 * FORMATEO DE DIRECCIONES
 * =============================================================
 */

/**
 * Normaliza una dirección
 * @param {string} direccion - Dirección a normalizar
 * @returns {string} - Dirección normalizada
 */
export const normalizarDireccion = (direccion) => {
    if (!direccion) return '';
    
    // Quitar espacios extra y capitalizar cada palabra
    return direccion
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(palabra => {
            // No capitalizar preposiciones pequeñas
            if (['de', 'del', 'la', 'el', 'y'].includes(palabra.toLowerCase())) {
                return palabra.toLowerCase();
            }
            return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
        })
        .join(' ');
};

/**
 * =============================================================
 * VALIDACIÓN Y LIMPIEZA
 * =============================================================
 */

/**
 * Valida y limpia un campo de entrada
 * @param {string} valor - Valor a limpiar
 * @param {string} tipo - Tipo de campo ('text', 'number', 'email', etc.)
 * @returns {string} - Valor limpio
 */
export const limpiarCampo = (valor, tipo = 'text') => {
    if (!valor) return '';
    
    switch (tipo) {
        case 'email':
            return normalizarEmail(valor);
        case 'nombre':
            return normalizarNombre(valor);
        case 'celular':
            return limpiarCelular(valor);
        case 'direccion':
            return normalizarDireccion(valor);
        case 'number':
            return valor.toString().replace(/\D/g, '');
        default:
            return valor.trim();
    }
};
