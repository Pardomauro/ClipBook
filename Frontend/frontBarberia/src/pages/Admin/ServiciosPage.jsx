import { useState, useEffect } from 'react';
import { AdminLayout, ServicioCard, AgregarServicioDialog } from '@/components/Admin';
import { Scissors } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { getServicios, cambiarEstadoServicio } from '@/services/servicioService';
import toast from 'react-hot-toast';

/**
 * Página de gestión de servicios
 * Muestra cards de servicios con opción de editar precios y agregar nuevos
 */
export default function ServiciosPage() {
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cambiandoEstado, setCambiandoEstado] = useState({});

    useEffect(() => {
        cargarServicios();
    }, []);

    const cargarServicios = async () => {
        try {
            setLoading(true);
            const response = await getServicios();
            setServicios(response.data || []);
        } catch (error) {
            console.error('Error al cargar servicios:', error);
            toast.error('Error al cargar los servicios');
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarEstado = async (servicioId, estadoActual) => {
        try {
            setCambiandoEstado(prev => ({ ...prev, [servicioId]: true }));
            
            const nuevoEstado = !estadoActual;
            await cambiarEstadoServicio(servicioId, nuevoEstado);
            
            setServicios(prev => prev.map(servicio => 
                servicio.servicio_id === servicioId 
                    ? { ...servicio, activo: nuevoEstado }
                    : servicio
            ));
            
            toast.success(`Servicio ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            toast.error('Error al cambiar el estado del servicio');
        } finally {
            setCambiandoEstado(prev => ({ ...prev, [servicioId]: false }));
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Gestión de Servicios" subtitle="Administrar servicios ofrecidos">
                <div className="flex items-center justify-center py-12">
                    <Spinner className="h-8 w-8" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout 
            title="Gestión de Servicios"
            subtitle={`${servicios.length} servicio${servicios.length !== 1 ? 's' : ''} registrado${servicios.length !== 1 ? 's' : ''}`}
        >
            {/* Botón para agregar servicio */}
            <div className="mb-6">
                <AgregarServicioDialog onServicioGuardado={cargarServicios} />
            </div>

            {servicios.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                    <Scissors className="h-12 w-12 mx-auto text-zinc-500 mb-4" />
                    <p className="text-zinc-300 text-lg">No hay servicios registrados</p>
                    <p className="text-zinc-400 text-sm mt-2">
                        Comienza agregando el primer servicio
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servicios.map((servicio) => (
                        <ServicioCard
                            key={servicio.servicio_id}
                            servicio={servicio}
                            onCambiarEstado={handleCambiarEstado}
                            cambiandoEstado={cambiandoEstado[servicio.servicio_id]}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
