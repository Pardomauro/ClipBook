import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { getEstadisticasUltimos7Dias } from '@/services/clienteService';
import { getTurnosPorDia } from '@/services/turnoService';

/**
 * Componente de gráfico que muestra clientes nuevos o turnos de los últimos 7 días
 * @param {string|null} barbero_id - UUID del barbero (opcional). Si se proporciona, muestra turnos del barbero
 * Puede ser reutilizado en Dashboard y página de Estadísticas
 */
export default function ClientsChart({ barbero_id = null }) {
    const [estadisticas, setEstadisticas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar estadísticas de clientes o turnos
    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                setLoading(true);
                
                // Si hay barbero_id, mostrar turnos del barbero
                // Si no, mostrar clientes nuevos globales
                const response = barbero_id 
                    ? await getTurnosPorDia(barbero_id)
                    : await getEstadisticasUltimos7Dias();
                
                // Transformar las fechas para mostrar solo día y mes
                const datosFormateados = response.data.map(item => ({
                    fecha: new Date(item.fecha).toLocaleDateString('es-AR', { 
                        day: '2-digit', 
                        month: 'short' 
                    }),
                    cantidad: item.cantidad
                }));
                
                setEstadisticas(datosFormateados);
            } catch (error) {
                console.error('Error al cargar estadísticas:', error);
                setEstadisticas([]);
            } finally {
                setLoading(false);
            }
        };

        cargarEstadisticas();
    }, [barbero_id]);

    // Configuración del gráfico con colores de alto contraste
    const chartConfig = {
        cantidad: {
            label: barbero_id ? "Turnos" : "Clientes Nuevos",
            color: "oklch(56% 0.021 213.5)" //"hsl(176, 68%, 55%)" // Cyan vibrante para contraste en fondo oscuro
        }
    };

    // Calcular total de clientes/turnos de la semana
    const total = estadisticas.reduce((sum, item) => sum + item.cantidad, 0);

    return (
        <Card className="border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
            <CardHeader>
                <CardTitle className="text-zinc-100">
                    {barbero_id ? 'Turnos - Últimos 7 Días' : 'Clientes Nuevos - Últimos 7 Días'}
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    {barbero_id 
                        ? `Cantidad de turnos que tuviste en la última semana`
                        : 'Cantidad de clientes que se registraron en la última semana'
                    }
                    {!loading && ` • Total: ${total} ${barbero_id ? 'turnos' : 'clientes'}`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex h-75 items-center justify-center">
                        <p className="text-zinc-400">Cargando estadísticas...</p>
                    </div>
                ) : estadisticas.length === 0 ? (
                    <div className="flex h-75 items-center justify-center">
                        <p className="text-zinc-400">No hay datos disponibles</p>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-75 w-full">
                        <BarChart data={estadisticas}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(240, 4%, 35%)" opacity={0.3} />
                            <XAxis 
                                dataKey="fecha" 
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tick={{ fill: 'hsl(240, 5%, 65%)' }}
                            />
                            <YAxis 
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                allowDecimals={false}
                                tick={{ fill: 'hsl(240, 5%, 65%)' }}
                            />
                            <ChartTooltip 
                                content={<ChartTooltipContent className="bg-zinc-900 border-zinc-700 text-zinc-100" />} 
                                cursor={{ fill: 'hsl(240, 4%, 25%)', opacity: 0.3 }}
                            />
                            <Bar 
                                dataKey="cantidad" 
                                fill="var(--color-cantidad)" 
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
