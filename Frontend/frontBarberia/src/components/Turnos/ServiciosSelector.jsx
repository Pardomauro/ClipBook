import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Componente selector de servicios
 * @param {Array} servicios - Lista de servicios disponibles
 * @param {Object} servicioSeleccionado - Servicio actualmente seleccionado
 * @param {Function} onServicioChange - Callback cuando se selecciona un servicio
 * @param {string} titulo - Título del card (opcional)
 */
export default function ServiciosSelector({ 
    servicios = [], 
    servicioSeleccionado, 
    onServicioChange,
    titulo = "2. Selecciona un servicio"
}) {
    return (
        <Card className="border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
            <CardHeader>
                <CardTitle className="text-zinc-100">{titulo}</CardTitle>
            </CardHeader>
            <CardContent>
                {servicios.length === 0 ? (
                    <p className="text-center text-zinc-400 py-4">
                        No hay servicios disponibles
                    </p>
                ) : (
                    <div className="space-y-3">
                        {servicios.map(servicio => (
                            <div
                                key={servicio.servicio_id}
                                onClick={() => onServicioChange(servicio)}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    servicioSeleccionado?.servicio_id === servicio.servicio_id
                                        ? 'border-zinc-400 bg-zinc-800/70 shadow-md shadow-zinc-600/20'
                                        : 'border-zinc-700 hover:border-zinc-600 bg-zinc-950/40'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold capitalize text-zinc-100">
                                            {servicio.nombre_servicio}
                                        </p>
                                        <p className="text-sm text-zinc-400">
                                            {servicio.duracion} minutos
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="bg-zinc-700 text-zinc-100 border-zinc-600">
                                        ${servicio.precio_base}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
