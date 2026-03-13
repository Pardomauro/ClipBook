import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/Admin';
import { Spinner } from '@/components/ui/spinner';

/**
 * Página de Login para Barberos (Administradores)
 * Ruta: /admin/login
 */
export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Si ya está autenticado (y terminó de verificar), redirigir al dashboard
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [isAuthenticated, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validaciones
        if (!email.trim()) {
            setError('Por favor ingresa tu email');
            return;
        }
        
        if (!password.trim()) {
            setError('Por favor ingresa tu contraseña');
            return;
        }

        try {
            setLoading(true);
            await login(email, password);
            
            // Redirigir al dashboard tras login exitoso
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            console.error('Error en login:', err);
            setError(err.message || 'Email o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    // Mostrar spinner mientras verifica la sesión
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 p-4">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,212,216,0.12),transparent_60%)]" />
            <div className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-zinc-700/10 blur-3xl" />
            
            <LoginForm
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleSubmit}
                error={error}
                loading={loading}
                onBackClick={() => navigate('/')}
            />
        </div>
    );
}

