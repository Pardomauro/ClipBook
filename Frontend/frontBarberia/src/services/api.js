
// Configuración de la URL base de la API
// En desarrollo: usa el archivo .env.development
// En producción: usa el archivo .env.production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

/**
 * Función wrapper para hacer peticiones con fetch
 * Maneja headers, autenticación y errores de forma centralizada
 * 
 * @param {string} endpoint - Ruta del endpoint (ej: '/barberos', '/turnos')
 * @param {object} options - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise<object>} - Respuesta parseada como JSON
 * @throws {Error} - Error con mensaje del backend o genérico
 */

export const fetchAPI = async (endpoint, options = {}) => {
    try {
        // Configurar headers por defecto
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Si hay token de autenticación, agregarlo (para admin)
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Realizar petición
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Parsear respuesta
        const data = await response.json();

        // Verificar si la petición fue exitosa
        if (!response.ok) {
            // El backend puede retornar 'mensaje' o 'message'
            const errorMessage = data.mensaje || data.message || `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }
        return data;
    } catch (error) {
        // Si es un error de red o parseo
        if (error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
        }
        
        // Re-lanzar el error original
        throw error;
    }
};

/**
 * =============================================================
 * MÉTODOS HTTP HELPERS
 * =============================================================
 */

/**
 * GET - Obtener datos
 * @param {string} endpoint - Ruta del endpoint
 * @param {object} params - Query params (opcional)
 * @returns {Promise<object>}
 */
export const get = async (endpoint, params = {}) => {
    // Construir query string si hay parámetros
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return fetchAPI(url, {
        method: 'GET',
    });
};

/**
 * POST - Crear recurso
 * @param {string} endpoint - Ruta del endpoint
 * @param {object} body - Datos a enviar
 * @returns {Promise<object>}
 */
export const post = async (endpoint, body = {}) => {
    return fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    });
};

/**
 * PUT - Actualizar recurso completo
 * @param {string} endpoint - Ruta del endpoint
 * @param {object} body - Datos a actualizar
 * @returns {Promise<object>}
 */
export const put = async (endpoint, body = {}) => {
    return fetchAPI(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
};

/**
 * PATCH - Actualizar recurso parcial
 * @param {string} endpoint - Ruta del endpoint
 * @param {object} body - Datos a actualizar parcialmente
 * @returns {Promise<object>}
 */
export const patch = async (endpoint, body = {}) => {
    return fetchAPI(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
};

/**
 * DELETE - Eliminar recurso
 * @param {string} endpoint - Ruta del endpoint
 * @returns {Promise<object>}
 */
export const del = async (endpoint) => {
    return fetchAPI(endpoint, {
        method: 'DELETE',
    });
};

/**
 * =============================================================
 * UTILIDADES
 * =============================================================
 */

/**
 * Verificar si el backend está disponible
 * @returns {Promise<boolean>}
 */
export const healthCheck = async () => {
    try {
        const response = await get('/health');
        return response.success === true;
    } catch (error) {
        console.error('Health check falló:', error.message);
        return false;
    }
};

/**
 * Guardar token de autenticación (para admin)
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
};

/**
 * Eliminar token de autenticación (logout)
 */
export const removeAuthToken = () => {
    localStorage.removeItem('token');
};

/**
 * Obtener token de autenticación
 * @returns {string|null}
 */
export const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Exportar URL base por si se necesita en otros lugares
export const API_URL = API_BASE_URL;


