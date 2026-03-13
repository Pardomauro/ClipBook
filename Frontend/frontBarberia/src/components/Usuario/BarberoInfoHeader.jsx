import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/**
 * Componente que muestra la información del barbero seleccionado
 * @param {Object} barbero - Datos del barbero
 * @param {string} barbero.nombre_completo - Nombre completo del barbero
 * @param {string} barbero.imagen_url - URL de la imagen del barbero
 */
export default function BarberoInfoHeader({ barbero }) {
    if (!barbero) return null;

    return (
        <Card className="mb-6 border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <img 
                        src={barbero.imagen_url || '/Barberos/porDefecto.jpeg'}
                        alt={barbero.nombre_completo}
                        className="w-20 h-20 rounded-lg object-cover ring-2 ring-zinc-700"
                    />
                    <div>
                        <CardTitle className="text-2xl text-zinc-100">{barbero.nombre_completo}</CardTitle>
                        <CardDescription className="text-zinc-400">Selecciona fecha, servicio y horario</CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
