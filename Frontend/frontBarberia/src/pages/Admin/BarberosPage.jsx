import { useState, useEffect } from 'react';
import { AdminLayout, AgregarBarberoDialog, BarberoCard } from '@/components/Admin';
import { User } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { getBarberos, cambiarEstadoBarbero } from '@/services/barberoService';
import toast from 'react-hot-toast';

/**
 * Página de gestión de barberos
 * Muestra cards con información de cada barbero y toggle para activar/desactivar
 */
export default function BarberosPage() {
    const [barberos, setBarberos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cambiandoEstado, setCambiandoEstado] = useState({});

    useEffect(() => {
        cargarBarberos();
    }, []);

    const cargarBarberos = async () => {
        try {
            setLoading(true);
            const response = await getBarberos();
            setBarberos(response.data || []);
        } catch (error) {
            console.error('Error al cargar barberos:', error);
            toast.error('Error al cargar los barberos');
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarEstado = async (barberoId, estadoActual) => {
        try {
            setCambiandoEstado(prev => ({ ...prev, [barberoId]: true }));

            const nuevoEstado = !estadoActual;
            await cambiarEstadoBarbero(barberoId, nuevoEstado);

            // Actualizar el estado local
            setBarberos(prev => prev.map(barbero =>
                barbero.barbero_id === barberoId
                    ? { ...barbero, activo: nuevoEstado }
                    : barbero
            ));

            toast.success(`Barbero ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            toast.error('Error al cambiar el estado del barbero');
        } finally {
            setCambiandoEstado(prev => ({ ...prev, [barberoId]: false }));
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Gestión de Barberos" subtitle="Administrar barberos del sistema">
                <div className="flex items-center justify-center py-12">
                    <Spinner className="h-8 w-8" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Gestión de Barberos"
            subtitle={`${barberos.length} barbero${barberos.length !== 1 ? 's' : ''} registrado${barberos.length !== 1 ? 's' : ''}`}
        >
            {/* Botón para agregar barbero */}
            <div className="mb-6">
                <AgregarBarberoDialog onBarberoCreado={cargarBarberos} />
            </div>

            {barberos.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                    <User className="h-12 w-12 mx-auto text-zinc-500 mb-4" />
                    <p className="text-zinc-300 text-lg">No hay barberos registrados</p>
                    <p className="text-zinc-400 text-sm mt-2">
                        Comienza agregando el primer barbero
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4">
                    {barberos.map((barbero) => (
                        <BarberoCard
                            key={barbero.barbero_id}
                            barbero={barbero}
                            onCambiarEstado={handleCambiarEstado}
                            cambiandoEstado={cambiandoEstado[barbero.barbero_id]}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
