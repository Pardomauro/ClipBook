import { useState, useEffect } from 'react';
import { AdminLayout, AgregarBarberoDialog } from '@/components/Admin';
import { Mail, Phone, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { SpinnerButton } from '@/components/Common/Spinner';
import { getBarberos, cambiarEstadoBarbero } from '@/services/barberoService';
import { obtenerEstiloActivo } from '@/utils/formatters';
import toast from 'react-hot-toast';

/**
 * Página de gestión de barberos
 * Muestra cards con información de cada barbero y toggle para activar/desactivar
 * NO está relacionado con el componente barberoCard usado en el proceso de reserva, es un componente específico para administración.
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

    const obtenerIniciales = (nombre) => {
        return nombre
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <AdminLayout title="Gestión de Barberos" subtitle="Administrar barberos del sistema">
                <div className="flex items-center justify-center py-12">
                    <SpinnerButton />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Gestión de Barberos"
            subtitle={`${barberos.length} barbero${barberos.length !== 1 ? 's' : ''} registrado${barberos.length !== 1 ? 's' : ''}`}
            headerActions={
                <AgregarBarberoDialog onBarberoCreado={cargarBarberos} />
            }
        >
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
                    {barberos.map((barbero) => {
                        // Obtener estilos del badge según estado
                        const { className: badgeClassName, texto: badgeTexto, variant: badgeVariant } = obtenerEstiloActivo(barbero.activo, 'dark');
                        
                        return (
                            <Card key={barbero.barbero_id} className="overflow-hidden border-zinc-700/80 bg-zinc-900/95 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transition-all">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative h-12 w-12 ring-2 ring-zinc-700/50 rounded-lg overflow-hidden shrink-0">
                                                {barbero.imagen_url ? (
                                                    <img 
                                                        src={barbero.imagen_url} 
                                                        alt={barbero.nombre_completo}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-zinc-100 text-sm font-semibold">
                                                        {obtenerIniciales(barbero.nombre_completo)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg text-zinc-100">{barbero.nombre_completo}</CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-2">
                                                    <Badge variant={badgeVariant} className={badgeClassName}>
                                                        {badgeTexto}
                                                    </Badge>
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                            <CardContent className="space-y-3 pb-4">
                                <div className="flex items-center text-sm text-zinc-300">
                                    <Mail className="h-4 w-4 mr-2 shrink-0 text-zinc-400" />
                                    <span className="truncate">{barbero.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-zinc-300">
                                    <Phone className="h-4 w-4 mr-2 shrink-0 text-zinc-400" />
                                    <span>{barbero.celular}</span>
                                </div>
                            </CardContent>

                            <CardFooter className="bg-zinc-950/50 border-t border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={barbero.activo}
                                        onCheckedChange={() => handleCambiarEstado(barbero.barbero_id, barbero.activo)}
                                        disabled={cambiandoEstado[barbero.barbero_id]}
                                        className="data-[state=checked]:bg-emerald-600"

                                    />
                                    <span className="text-sm text-zinc-400">
                                        {barbero.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>

                            </CardFooter>
                        </Card>
                        );
                    })}
                </div>
            )}
        </AdminLayout>
    );
}
