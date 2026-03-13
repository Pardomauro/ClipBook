import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Mail, Phone } from "lucide-react";
import { obtenerEstiloActivo } from "@/utils/formatters";

/**
 * Card individual de barbero con información y acciones
 * @param {Object} barbero - Datos del barbero
 * @param {Function} onCambiarEstado - Callback para cambiar el estado activo/inactivo
 * @param {Boolean} cambiandoEstado - Flag para deshabilitar el switch mientras cambia el estado
 */
export default function BarberoCard({ 
    barbero, 
    onCambiarEstado, 
    cambiandoEstado = false 
}) {
    const obtenerIniciales = (nombre) => {
        return nombre
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Obtener estilos del badge según estado
    const { className: badgeClassName, texto: badgeTexto, variant: badgeVariant } = obtenerEstiloActivo(barbero.activo, 'dark');

    return (
        <Card className="overflow-hidden border-zinc-700/80 bg-zinc-900/95 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transition-all">
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
                            <CardTitle className="text-lg text-zinc-100">
                                {barbero.nombre_completo}
                            </CardTitle>
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

            <CardFooter className="bg-zinc-950/50 border-t border-zinc-800 flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={barbero.activo}
                        onCheckedChange={() => onCambiarEstado(barbero.barbero_id, barbero.activo)}
                        disabled={cambiandoEstado}
                        className="data-[state=checked]:bg-emerald-600"
                    />
                    <span className="text-sm text-zinc-400">
                        {barbero.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}
