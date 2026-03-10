import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '@/services/authService';

/**
 * Context de Autenticación
 * Maneja el estado global de autenticación de barberos (administradores)
 */

const AuthContext = createContext();

/**
 * Hook para usar el contexto de autenticación
 * @returns {object} - { barbero, isAuthenticated, loading, login, logout, verificarSesion }
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

/**
 * Provider de Autenticación
 * Envuelve la aplicación para proveer estado de autenticación
 */
export const AuthProvider = ({ children }) => {
    const [barbero, setBarbero] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    /**
     * Verificar sesión al cargar la aplicación
     * Valida el token con el backend
     */
    useEffect(() => {
        verificarSesion();
    }, []);

    /**
     * Verificar si hay una sesión válida
     */
    const verificarSesion = async () => {
        try {
            setLoading(true);
            
            // Verificar si hay token en localStorage
            const token = authService.getToken();
            const barberoLocal = authService.getBarbero();
            
            if (!token || !barberoLocal) {
                setIsAuthenticated(false);
                setBarbero(null);
                setLoading(false);
                return;
            }

            // Verificar token con el backend
            const response = await authService.verificarToken();
            
            if (response.success) {
                setIsAuthenticated(true);
                setBarbero(barberoLocal);
            } else {
                // Token inválido, limpiar localStorage
                authService.logout();
                setIsAuthenticated(false);
                setBarbero(null);
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            // Si falla la verificación, limpiar todo
            authService.logout();
            setIsAuthenticated(false);
            setBarbero(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Login de barbero
     * @param {string} email - Email del barbero
     * @param {string} password - Contraseña
     * @returns {Promise<object>} - Respuesta del login
     */
    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            
            if (response.success && response.data) {
                setIsAuthenticated(true);
                setBarbero(response.data.barbero);
                return response;
            }
            
            throw new Error(response.message || 'Error al iniciar sesión');
        } catch (error) {
            setIsAuthenticated(false);
            setBarbero(null);
            throw error;
        }
    };

    /**
     * Logout - Cerrar sesión
     */
    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setBarbero(null);
    };

    /**
     * Actualizar datos del barbero en el contexto
     * @param {object} nuevosDatos - Nuevos datos del barbero
     */
    const actualizarBarbero = (nuevosDatos) => {
        const barberoActualizado = { ...barbero, ...nuevosDatos };
        setBarbero(barberoActualizado);
        localStorage.setItem('barbero', JSON.stringify(barberoActualizado));
    };

    const value = {
        barbero,
        isAuthenticated,
        loading,
        login,
        logout,
        verificarSesion,
        actualizarBarbero
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
