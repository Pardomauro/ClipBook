import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

/**
 * Formulario de login para administradores
 * Componente presentacional que muestra el card con inputs y manejo visual del estado
 */
export default function LoginForm({
    email,
    password,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    error,
    loading = false,
    onBackClick
}) {
    return (
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
                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-zinc-300">
                            Email
                        </label>
                        <Input
                            type="email"
                            placeholder="barbero@ejemplo.com"
                            value={email}
                            onChange={(e) => onEmailChange(e.target.value)}
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
                            onChange={(e) => onPasswordChange(e.target.value)}
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
                        <div className="flex justify-center py-3">
                            <Spinner className="h-6 w-6" />
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
                            onClick={onBackClick}
                            className="text-sm text-zinc-500 hover:text-zinc-200 underline underline-offset-2 transition-colors"
                        >
                            ← Volver al inicio
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
