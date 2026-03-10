import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpinnerButton } from "@/components/Common/Spinner";

/**
 * Componente para mostrar y seleccionar horarios disponibles
 * @param {Array} horarios - Lista de horarios disponibles (strings en formato HH:mm)
 * @param {string} horarioSeleccionado - Horario actualmente seleccionado
 * @param {Function} onHorarioChange - Callback cuando se selecciona un horario
 * @param {boolean} loading - Indica si se están cargando los horarios
 * @param {string} descripcion - Descripción adicional (opcional)
 * @param {string} titulo - Título del card (opcional)
 */
export default function HorariosDisponibles({ 
    horarios = [], 
    horarioSeleccionado, 
    onHorarioChange,
    loading = false,
    descripcion,
    titulo = "3. Selecciona un horario"
}) {
    return (
        <Card className="mb-6 border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
            <CardHeader>
                <CardTitle className="text-zinc-100">{titulo}</CardTitle>
                {descripcion && (
                    <CardDescription className="text-zinc-400">{descripcion}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center py-8">
                        <SpinnerButton />
                    </div>
                ) : horarios.length === 0 ? (
                    <p className="text-center text-zinc-400 py-8">
                        No hay horarios disponibles para esta fecha
                    </p>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {horarios.map((horario) => (
                            <Button
                                key={horario}
                                variant={horarioSeleccionado === horario ? "default" : "outline"}
                                onClick={() => onHorarioChange(horario)}
                                className={horarioSeleccionado === horario ? "w-full bg-zinc-100 text-zinc-900 hover:bg-white" : "w-full border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"}
                            >
                                {horario}
                            </Button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
