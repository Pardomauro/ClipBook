import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/Admin';
import { CalendarioSelector } from '@/components/Turnos';
import { Calendar as CalendarIcon, User, Clock, DollarSign, Phone, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { getTurnosByBarbero, cancelarTurno } from '@/services/turnoService';
import { getBarbero } from '@/services/authService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Página de gestión de turnos
 * Muestra un calendario para seleccionar fechas y ver turnos del día
 */
export default function TurnosPage() {
    const [fecha, setFecha] = useState(new Date());
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cancelando, setCancelando] = useState({});

    useEffect(() => {
        if (fecha && fecha instanceof Date && !isNaN(fecha.getTime())) {
            cargarTurnosPorFecha(fecha);
        }
    }, [fecha]);

    const cargarTurnosPorFecha = async (fechaSeleccionada) => {
        try {
            setLoading(true);
            
            // Validar fecha
            if (!fechaSeleccionada || !(fechaSeleccionada instanceof Date) || isNaN(fechaSeleccionada.getTime())) {
                console.error('Fecha inválida:', fechaSeleccionada);
                setTurnos([]);
                setLoading(false);
                return;
            }
            
            // Obtener el barbero autenticado
            const barberoActual = getBarbero();
            if (!barberoActual || !barberoActual.barbero_id) {
                toast.error('No se pudo identificar el barbero');
                setTurnos([]);
                return;
            }

            const fechaFormateada = format(fechaSeleccionada, 'yyyy-MM-dd');
            const response = await getTurnosByBarbero(barberoActual.barbero_id, { fecha: fechaFormateada });
            setTurnos(response.turnos || []);
        } catch (error) {
            console.error('Error al cargar turnos:', error);
            toast.error('Error al cargar los turnos');
            setTurnos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarTurno = async (turnoId) => {
        try {
            setCancelando(prev => ({ ...prev, [turnoId]: true }));
            
            await cancelarTurno(turnoId);
            
            toast.success('Turno cancelado correctamente');
            
            // Recargar los turnos de la fecha actual
            await cargarTurnosPorFecha(fecha);
        } catch (error) {
            console.error('Error al cancelar turno:', error);
            toast.error(error.message || 'Error al cancelar el turno');
        } finally {
            setCancelando(prev => ({ ...prev, [turnoId]: false }));
        }
    };

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(precio);
    };

    const turnosOrdenados = [...turnos].sort((a, b) => {
        return a.hora_inicio.localeCompare(b.hora_inicio);
    });

    // Deshabilitar fechas pasadas en el calendario
    const deshabilitarFechasPasadas = (fecha) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return fecha < hoy;
    };

    return (
        <AdminLayout 
            title="Gestión de Turnos"
            subtitle="Calendario de turnos y citas"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendario */}
                <CalendarioSelector
                    fechaSeleccionada={fecha}
                    onFechaChange={setFecha}
                    disabledDays={deshabilitarFechasPasadas}
                    titulo="Seleccionar Fecha"
                />

                {/* Lista de turnos */}
                <div className="lg:col-span-2">
                    <Card className="border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
                        <CardHeader>
                            <CardTitle className="text-zinc-100">
                                Turnos del {fecha && fecha instanceof Date && !isNaN(fecha.getTime()) 
                                    ? format(fecha, "d 'de' MMMM 'de' yyyy", { locale: es })
                                    : 'fecha no válida'}
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                {turnos.length} turno{turnos.length !== 1 ? 's' : ''} programado{turnos.length !== 1 ? 's' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Spinner className="h-8 w-8" />
                                </div>
                            ) : turnos.length === 0 ? (
                                <div className="text-center py-12 bg-zinc-950/50 rounded-xl border border-zinc-800">
                                    <CalendarIcon className="h-12 w-12 mx-auto text-zinc-500 mb-4" />
                                    <p className="text-zinc-300">
                                        No hay turnos programados para esta fecha
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {turnosOrdenados.map((turno) => (
                                        <Card key={turno.turno_id} className="overflow-hidden border-zinc-700/60 bg-zinc-950/60 shadow-md shadow-black/20">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center ring-1 ring-cyan-500/30">
                                                            <Clock className="h-5 w-5 text-cyan-500" />
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-base text-zinc-100">
                                                                {turno.hora_inicio} - {turno.hora_fin}
                                                            </CardTitle>
                                                            <CardDescription className="text-zinc-400">
                                                                {turno.servicio?.nombre_servicio || 'Sin servicio'}
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                    {turno.estado === 'cancelado' && (
                                                        <Badge 
                                                            variant="outline" 
                                                            className="bg-red-900/40 text-red-300 border-red-700/60"
                                                        >
                                                            Cancelado
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                    {/* Cliente */}
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <User className="h-4 w-4 shrink-0" />
                                                        <div>
                                                            <p className="font-medium text-zinc-100">
                                                                {turno.cliente?.nombre_completo || 'Sin cliente'}
                                                            </p>
                                                            {turno.cliente?.email && (
                                                                <p className="text-xs flex items-center gap-1 mt-0.5 text-zinc-400">
                                                                    <Mail className="h-3 w-3" />
                                                                    {turno.cliente.email}
                                                                </p>
                                                            )}
                                                            {turno.cliente?.celular && (
                                                                <p className="text-xs flex items-center gap-1 mt-0.5 text-zinc-400">
                                                                    <Phone className="h-3 w-3" />
                                                                    {turno.cliente.celular}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Servicio */}
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <div>
                                                            <p className="text-xs">Servicio:</p>
                                                            <p className="font-medium text-zinc-100">
                                                                {turno.servicio?.nombre_servicio || 'Sin especificar'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Precio */}
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <DollarSign className="h-4 w-4 shrink-0 text-emerald-500" />
                                                        <div>
                                                            <p className="text-xs">Precio:</p>
                                                            <p className="font-semibold text-zinc-100">
                                                                {formatearPrecio(turno.precio_final)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Botón Cancelar - Solo si no está cancelado */}
                                                    {turno.estado !== 'cancelado' && (
                                                        <div className="flex items-end justify-end md:col-span-1">
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleCancelarTurno(turno.turno_id)}
                                                                disabled={cancelando[turno.turno_id]}
                                                                className="gap-2 bg-gray-500 hover:bg-gray-600 text-black"
                                                            >
                                                                {cancelando[turno.turno_id] ? (
                                                                    <>
                                                                        <Spinner className="h-4 w-4" />
                                                                        Cancelando...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <X className="h-4 w-4" />
                                                                        Cancelar Turno
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
