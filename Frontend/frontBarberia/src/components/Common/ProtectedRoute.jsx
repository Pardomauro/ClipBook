import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SpinnerButton } from '@/components/Common';

/**
 * Componente para proteger rutas que requieren autenticación
 * Si el usuario no está autenticado, redirige a /admin/login
 * Si está autenticado, renderiza las rutas hijas (Outlet)
 */
export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();

    // Mostrar spinner mientras verifica la sesión
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <SpinnerButton />
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // Si está autenticado, renderizar las rutas hijas
    return <Outlet />;
}
