import { useState, useEffect } from 'react';
import { AdminLayout, ClientsChart, StatCard } from '@/components/Admin';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SpinnerButton } from '@/components/Common';
import { Badge } from '@/components/ui/badge';
import { getEstadisticasIngresosMes, getEstadisticasSemana, getClientesUnicosBarbero } from '@/services/turnoService';
import { getBarbero } from '@/services/authService';
import toast from 'react-hot-toast';

/**
 * Página de estadísticas avanzadas
 * Muestra ingresos semanales, horarios populares y resumen financiero mensual
 */
export default function EstadisticasPage() {
    const [estadisticasIngresos, setEstadisticasIngresos] = useState(null);
    const [estadisticasSemana, setEstadisticasSemana] = useState(null);
    const [clientesUnicos, setClientesUnicos] = useState(0);
    const [barberoId, setBarberoId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            setLoading(true);
            
            // Obtener barbero autenticado
            const barberoActual = getBarbero();
            if (!barberoActual || !barberoActual.barbero_id) {
                toast.error('No se pudo identificar el barbero');
                return;
            }
            
            // Guardar barbero_id en el estado
            setBarberoId(barberoActual.barbero_id);
            
            // Cargar todas las estadísticas en paralelo (filtradas por barbero)
            const [ingresosResponse, semanaResponse, clientesResponse] = await Promise.all([
                getEstadisticasIngresosMes(barberoActual.barbero_id),
                getEstadisticasSemana(barberoActual.barbero_id),
                getClientesUnicosBarbero(barberoActual.barbero_id)
            ]);
            
            setEstadisticasIngresos(ingresosResponse.estadisticas || null);
            setEstadisticasSemana(semanaResponse.estadisticas || null);
            setClientesUnicos(clientesResponse.cantidad || 0);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            toast.error('Error al cargar las estadísticas');
        } finally {
            setLoading(false);
        }
    };

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(precio);
    };

    if (loading) {
        return (
            <AdminLayout title="Estadísticas" subtitle="Análisis y métricas del negocio">
                <div className="flex items-center justify-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                    <SpinnerButton />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout 
            title="Estadísticas"
            subtitle="Análisis y métricas del negocio"
        >
            <div className="space-y-6">


                {/* Resumen Semanal - Últimos 7 días */}
                {estadisticasSemana && (
                    <>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-zinc-100">
                                Resumen Semanal - Últimos 7 Días
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <StatCard
                                    title="Ingresos Totales"
                                    value={formatearPrecio(estadisticasSemana.ultimaSemana.ingresoTotal)}
                                    description={
                                        <span className={`flex items-center gap-1 ${
                                            estadisticasSemana.comparacion.cambioIngresos >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {estadisticasSemana.comparacion.cambioIngresos >= 0 ? (
                                                <TrendingUp className="h-3 w-3" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3" />
                                            )}
                                            {estadisticasSemana.comparacion.porcentajeCambioIngresos}% vs semana anterior
                                        </span>
                                    }
                                    icon={DollarSign}
                                />

                                {/* Horarios Más Populares */}
                                <Card className="border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
                                    <CardHeader>
                                        <CardTitle className="text-zinc-100">Horarios Más Populares</CardTitle>
                                        <CardDescription className="text-zinc-400">
                                            Top 5 horarios más solicitados
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {estadisticasSemana.ultimaSemana.horariosPopulares.length === 0 ? (
                                            <p className="text-sm text-zinc-400 text-center py-4">
                                                No hay datos disponibles
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {estadisticasSemana.ultimaSemana.horariosPopulares.map((horario, index) => (
                                                    <div key={horario.hora} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800">
                                                                <span className="text-sm font-semibold text-zinc-100">
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-cyan-500" />
                                                                <span className="font-medium text-zinc-100">{horario.hora}</span>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                                                            {horario.cantidad} turnos
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                )}

                {/* Resumen financiero del mes */}
                {estadisticasIngresos && (
                    <>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-zinc-100">
                                Resumen Financiero - {estadisticasIngresos.mes}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard
                                    title="Ingresos del Mes"
                                    value={formatearPrecio(estadisticasIngresos.ingresoTotal)}
                                    description="Total de turnos finalizados"
                                    icon={DollarSign}
                                />
                                <StatCard
                                    title="Turnos Completados"
                                    value={estadisticasIngresos.cantidadTurnos}
                                    description="Servicios finalizados"
                                    icon={CheckCircle}
                                />
                                <StatCard
                                    title="Ingreso Promedio"
                                    value={formatearPrecio(estadisticasIngresos.promedioIngreso)}
                                    description="Por turno finalizado"
                                    icon={TrendingUp}
                                />
                                <StatCard
                                    title="Total Clientes"
                                    value={clientesUnicos}
                                    description="Clientes únicos que han reservado"
                                    icon={Users}
                                />
                            </div>
                        </div>

                        {/* Ingresos por barbero */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
                                <CardHeader>
                                    <CardTitle className="text-zinc-100">Ingresos por Barbero</CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        Distribución de ingresos del mes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {Object.keys(estadisticasIngresos.ingresosPorBarbero).length === 0 ? (
                                        <p className="text-sm text-zinc-400 text-center py-4">
                                            No hay datos disponibles
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {Object.entries(estadisticasIngresos.ingresosPorBarbero)
                                                .sort(([, a], [, b]) => b - a)
                                                .map(([barbero, ingreso]) => (
                                                    <div key={barbero} className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm text-zinc-100">{barbero}</p>
                                                            <div className="w-full bg-zinc-800/70 rounded-full h-2 mt-1">
                                                                <div 
                                                                    className="bg-cyan-500 rounded-full h-2 transition-all"
                                                                    style={{ 
                                                                        width: `${(ingreso / estadisticasIngresos.ingresoTotal * 100)}%` 
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4 text-right">
                                                            <p className="font-semibold text-sm text-zinc-100">
                                                                {formatearPrecio(ingreso)}
                                                            </p>
                                                            <p className="text-xs text-zinc-400">
                                                                {((ingreso / estadisticasIngresos.ingresoTotal) * 100).toFixed(1)}%
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Ingresos por servicio */}
                            <Card className="border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
                                <CardHeader>
                                    <CardTitle className="text-zinc-100">Ingresos por Servicio</CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        Servicios más rentables
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {Object.keys(estadisticasIngresos.ingresosPorServicio).length === 0 ? (
                                        <p className="text-sm text-zinc-400 text-center py-4">
                                            No hay datos disponibles
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {Object.entries(estadisticasIngresos.ingresosPorServicio)
                                                .sort(([, a], [, b]) => b - a)
                                                .map(([servicio, ingreso]) => (
                                                    <div key={servicio} className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm text-zinc-100">{servicio}</p>
                                                            <div className="w-full bg-zinc-800/70 rounded-full h-2 mt-1">
                                                                <div 
                                                                    className="bg-emerald-500 rounded-full h-2 transition-all"
                                                                    style={{ 
                                                                        width: `${(ingreso / estadisticasIngresos.ingresoTotal * 100)}%` 
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4 text-right">
                                                            <p className="font-semibold text-sm text-zinc-100">
                                                                {formatearPrecio(ingreso)}
                                                            </p>
                                                            <p className="text-xs text-zinc-400">
                                                                {((ingreso / estadisticasIngresos.ingresoTotal) * 100).toFixed(1)}%
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                {/* Gráfico de turnos últimos 7 días */}
                <ClientsChart barbero_id={barberoId} />
            </div>
        </AdminLayout>
    );
}
