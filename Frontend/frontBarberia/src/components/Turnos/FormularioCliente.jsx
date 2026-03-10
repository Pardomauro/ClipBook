import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * Componente formulario para datos del cliente
 * @param {Object} datosCliente - Datos actuales del formulario
 * @param {Function} onChange - Callback cuando cambia algún campo
 * @param {string} titulo - Título del card (opcional)
 */
export default function FormularioCliente({ 
    datosCliente = {
        nombre_completo: '',
        email: '',
        celular: '',
        direccion: ''
    },
    onChange,
    titulo = "4. Tus datos"
}) {
    return (
        <Card className="mb-6 border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
            <CardHeader>
                <CardTitle className="text-zinc-100">{titulo}</CardTitle>
                <CardDescription className="text-zinc-400">
                    Completa tus datos para confirmar la reserva
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-300">
                            Nombre completo *
                        </label>
                        <Input
                            name="nombre_completo"
                            value={datosCliente.nombre_completo}
                            onChange={onChange}
                            placeholder="Juan Pérez"
                            required
                            className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-300">
                            Email *
                        </label>
                        <Input
                            name="email"
                            type="email"
                            value={datosCliente.email}
                            onChange={onChange}
                            placeholder="juan@ejemplo.com"
                            required
                            className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-300">
                            Celular *
                        </label>
                        <Input
                            name="celular"
                            type="tel"
                            value={datosCliente.celular}
                            onChange={onChange}
                            placeholder="1234567890"
                            required
                            className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-300">
                            Dirección (opcional)
                        </label>
                        <Input
                            name="direccion"
                            value={datosCliente.direccion}
                            onChange={onChange}
                            placeholder="Calle 123, Ciudad"
                            className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
