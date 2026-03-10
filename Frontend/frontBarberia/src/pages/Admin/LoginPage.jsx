import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SpinnerButton } from '@/components/Common/Spinner';

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
                <SpinnerButton />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 p-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,212,216,0.12),transparent_60%)]" />
            <div className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-zinc-700/10 blur-3xl" />
            
            <Card className="relative w-full max-w-md border-zinc-700/80 bg-zinc-900/95 shadow-2xl shadow-black/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-4xl font-serif text-zinc-100">
                         Barbería Admin
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Ingresa tus credenciales para acceder al panel
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-300">
                                Email
                            </label>
                            <Input
                                type="email"
                                placeholder="barbero@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="w-full border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-300">
                                Contraseña
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="w-full border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-950/50 border border-red-800/70 text-red-300 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Botón Submit */}
                        {loading ? (
                            <div className="flex justify-center">
                                <SpinnerButton />
                            </div>
                        ) : (
                            <Button 
                                type="submit" 
                                className="w-full bg-zinc-100 text-zinc-900 hover:bg-white"
                                size="lg"
                            >
                                Ingresar
                            </Button>
                        )}

                        {/* Link volver al inicio */}
                        <div className="text-center pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="text-sm text-zinc-500 hover:text-zinc-200 underline underline-offset-2 transition-colors"
                            >
                                ← Volver al inicio
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

