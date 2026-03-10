import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Clock, User, Scissors, Mail, Phone, MapPin } from "lucide-react";

/**
 * Componente de alerta para confirmación de turno reservado
 * @param {Object} turnoData - Datos del turno creado
 * @param {Function} onClose - Callback para cerrar la alerta
 */
export default function TurnoReservadoAlert({ turnoData, onClose }) {
    const {
        fecha_turno,
        hora_inicio,
        barbero,
        servicio,
        cliente,
        precio_final
    } = turnoData;

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(precio);
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha + 'T00:00:00');
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-zinc-900/95 rounded-lg shadow-2xl shadow-black/50 border border-zinc-700/80 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header simple */}
                <div className="bg-zinc-950/95 p-6 text-center border-b border-zinc-800">
                    <div className="flex justify-center mb-4">
                        <div className="bg-emerald-600/20 rounded-full p-3 ring-2 ring-emerald-600/30">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={2} />
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-100 mb-2">
                        Turno Reservado
                    </h2>
                    <p className="text-zinc-400 text-sm">
                        Tu reserva ha sido confirmada
                    </p>
                </div>

                {/* Contenido con detalles del turno */}
                <div className="p-6 space-y-6">
                    {/* Información del turno */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Fecha */}
                        <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                            <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center ring-1 ring-cyan-500/30 shrink-0">
                                <Calendar className="h-5 w-5 text-cyan-500" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 mb-1">Fecha</p>
                                <p className="text-sm font-medium text-zinc-100 capitalize">
                                    {formatearFecha(fecha_turno)}
                                </p>
                            </div>
                        </div>

                        {/* Hora */}
                        <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                            <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center ring-1 ring-cyan-500/30 shrink-0">
                                <Clock className="h-5 w-5 text-cyan-500" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 mb-1">Horario</p>
                                <p className="text-sm font-medium text-zinc-100">
                                    {hora_inicio} hs
                                </p>
                            </div>
                        </div>

                        {/* Barbero */}
                        <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                            <div className="h-10 w-10 rounded-full bg-zinc-700/50 flex items-center justify-center ring-1 ring-zinc-600/30 shrink-0">
                                <User className="h-5 w-5 text-zinc-300" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 mb-1">Barbero</p>
                                <p className="text-sm font-medium text-zinc-100">
                                    {barbero?.nombre_completo || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Servicio */}
                        <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                            <div className="h-10 w-10 rounded-full bg-zinc-700/50 flex items-center justify-center ring-1 ring-zinc-600/30 shrink-0">
                                <Scissors className="h-5 w-5 text-zinc-300" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 mb-1">Servicio</p>
                                <p className="text-sm font-medium text-zinc-100">
                                    {servicio?.nombre_servicio || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información del cliente */}
                    <div className="border-t border-zinc-700/50 pt-4">
                        <h3 className="text-sm font-semibold text-zinc-300 mb-3">Datos de contacto</h3>
                        <div className="space-y-2 text-sm">
                            {cliente?.email && (
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Mail className="h-4 w-4" />
                                    <span>{cliente.email}</span>
                                </div>
                            )}
                            {cliente?.celular && (
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Phone className="h-4 w-4" />
                                    <span>{cliente.celular}</span>
                                </div>
                            )}
                            {cliente?.direccion && (
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <MapPin className="h-4 w-4" />
                                    <span>{cliente.direccion}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Precio total */}
                    <div className="bg-zinc-800/70 rounded-lg p-4 border border-zinc-700/50">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-300 font-medium">Total a abonar:</span>
                            <span className="text-2xl font-bold text-emerald-500">
                                {formatearPrecio(precio_final)}
                            </span>
                        </div>
                    </div>

                    {/* Alert de recordatorio */}
                    <Alert className="bg-zinc-800/30 border-zinc-700/50">
                        <AlertTitle className="text-zinc-100">Recordatorio</AlertTitle>
                        <AlertDescription className="text-zinc-400">
                            Te hemos enviado un email de confirmación. Por favor, llega 5 minutos antes de tu turno.
                        </AlertDescription>
                    </Alert>
                </div>

                {/* Footer con botón */}
                <div className="p-6 pt-0">
                    <Button 
                        onClick={onClose}
                        className="w-full bg-zinc-100 text-zinc-900 hover:bg-white font-medium py-6 text-base"
                    >
                        Volver al inicio
                    </Button>
                </div>
            </div>
        </div>
    );
}
