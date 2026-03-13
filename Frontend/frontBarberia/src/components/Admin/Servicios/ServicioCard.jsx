import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Clock, Scissors, Edit } from "lucide-react";

/**
 * Card individual de servicio con información y acciones
 * @param {Object} servicio - Datos del servicio
 * @param {Function} onEditar - Callback para editar el servicio
 * @param {Function} onCambiarEstado - Callback para cambiar el estado activo/inactivo
 * @param {Boolean} cambiandoEstado - Flag para deshabilitar el switch mientras cambia el estado
 */
export default function ServicioCard({ 
    servicio, 
    onEditar,
    onCambiarEstado, 
    cambiandoEstado = false 
}) {
    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(precio);
    };

    return (
        <Card className="overflow-hidden border-zinc-700/80 bg-zinc-900/95 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transition-all">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2 text-zinc-100">
                            <Scissors className="h-5 w-5 text-cyan-500" />
                            {servicio.nombre_servicio}
                        </CardTitle>
                    </div>
                    <Badge 
                        variant={servicio.activo ? "default" : "secondary"} 
                        className={servicio.activo 
                            ? "bg-green-700 hover:bg-green-700 border-green-500" 
                            : "bg-zinc-700 text-zinc-300 border-zinc-600"
                        }
                    >
                        {servicio.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                </div>
            </CardHeader>
            
            <CardContent className="space-y-3 pb-4">
                <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2 text-emerald-500" />
                    <span className="font-semibold text-lg text-zinc-100">
                        {formatearPrecio(servicio.precio_base)}
                    </span>
                </div>
                <div className="flex items-center text-sm text-zinc-300">
                    <Clock className="h-4 w-4 mr-2 text-zinc-400" />
                    <span>{servicio.duracion} minutos</span>
                </div>
            </CardContent>

            <CardFooter className="bg-zinc-950/50 border-t border-zinc-800 flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={servicio.activo}
                        onCheckedChange={() => onCambiarEstado(servicio.servicio_id, servicio.activo)}
                        disabled={cambiandoEstado}
                        className="data-[state=checked]:bg-emerald-600"
                    />
                    <span className="text-sm text-zinc-400">
                        {servicio.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEditar(servicio)}
                    className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
                >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                </Button>
            </CardFooter>
        </Card>
    );
}
