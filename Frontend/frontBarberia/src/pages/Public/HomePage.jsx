import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarberoCard } from "@/components/Usuario";
import { getBarberos } from "@/services/barberoService";
import { SpinnerButton } from "@/components/Common";
import { useAuth } from "@/context/AuthContext";


export default function HomePage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [barberos, setBarberos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBarberos = async () => {
            try {
                setLoading(true);
                // Obtener solo barberos activos
                const response = await getBarberos({ activo: 'true' });

                // El backend devuelve los datos en response.data
                setBarberos(response.data || []);
                setError(null);
            } catch (err) {
                console.error('Error al cargar barberos:', err);
                setError(err.message);
                // Si falla, establecer loading en false para mostrar el error
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchBarberos();
    }, []);

    // Handler para cuando se hace clic en "Reservar turno"
    const handleReservar = (barbero) => {
        navigate(`/reservar/${barbero.barbero_id}`);
    };

    /**
     * Manejar acceso a panel de administradores
     * - Si está autenticado → ir al dashboard
     * - Si no está autenticado → ir al login
     * No muestra información sensible en página pública
     */
    const handleAccesoAdmin = () => {
        if (isAuthenticated) {
            navigate('/admin/dashboard');
        } else {
            navigate('/admin/login');
        }
    };

    // Estado de carga
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
                <SpinnerButton />
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
                <div className="text-center bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 shadow-xl shadow-black/40">
                    <p className="text-lg text-red-300 mb-4">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-white transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Sin barberos disponibles
    if (barberos.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
                <p className="text-lg text-zinc-300">No hay barberos disponibles en este momento.</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            {/* Gradientes de fondo */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,212,216,0.12),transparent_55%)]" />
            <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-zinc-700/10 blur-3xl" />
            
            {/* Logos de marca de agua - distribuidos en la página */}
            <div className="pointer-events-none absolute top-20 left-10 opacity-[0.03] blur-[2px] grayscale">
                <img src="/ferpa-logo.jpeg" alt="" className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 object-contain rotate-[-15deg]" />
            </div>
            <div className="pointer-events-none absolute top-32 right-4 sm:right-16 opacity-[0.04] blur-[1px] grayscale">
                <img src="/ferpa-logo.jpeg" alt="" className="w-24 h-24 sm:w-36 sm:h-36 xl:w-48 xl:h-48 object-contain rotate-[12deg]" />
            </div>
            <div className="pointer-events-none absolute bottom-32 left-4 sm:left-20 opacity-[0.03] blur-[2px] grayscale">
                <img src="/ferpa-logo.jpeg" alt="" className="w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 object-contain rotate-[8deg]" />
            </div>
            <div className="pointer-events-none absolute bottom-48 right-8 sm:right-12 opacity-[0.04] blur-[1px] grayscale hidden sm:block">
                <img src="/ferpa-logo.jpeg" alt="" className="w-28 h-28 sm:w-32 sm:h-32 xl:w-40 xl:h-40 object-contain rotate-[-20deg]" />
            </div>
            <div className="pointer-events-none absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 opacity-[0.02] blur-[3px] grayscale">
                <img src="/ferpa-logo.jpeg" alt="" className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <img
                            src="/ferpa-logo.jpeg"
                            alt="Ferpa Barbershop Logo"
                            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain rounded-2xl shadow-2xl shadow-black/50 ring-2 ring-zinc-800/50 transition-transform hover:scale-105 duration-300"
                        />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-100 mb-4">
                        Bienvenido al sistema de Turnos de <br />
                        <span className="block bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">Ferpa - Barbershop</span>

                    </h1>
                    <p className="text-xl font-light text-zinc-300 max-w-2xl mx-auto">
                        <br />Elige con qué barbero deseas reservar tu turno
                    </p>
                </div>

                {/* Grid de barberos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-8 gap-x-8">
                    {barberos.map(barbero => (
                        <BarberoCard
                            key={barbero.barbero_id}
                            barbero={barbero}
                            onReservar={handleReservar}
                        />
                    ))}
                </div>

                {/* Footer con enlace al admin */}
                <footer className="mt-16 pt-8 border-t border-zinc-800/90">
                    <div className="text-center text-sm text-zinc-400">
                        <p className="mb-2">© 2026 Barbería. Todos los derechos reservados.</p>
                        <button
                            onClick={handleAccesoAdmin}
                            className="text-zinc-500 hover:text-zinc-200 transition-colors underline underline-offset-2"
                        >
                            Acceso Administradores
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}