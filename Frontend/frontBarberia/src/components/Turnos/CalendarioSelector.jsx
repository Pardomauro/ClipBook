import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";

/**
 * Componente selector de fecha con calendario
 * @param {Date} fechaSeleccionada - Fecha seleccionada actualmente
 * @param {Function} onFechaChange - Callback cuando se selecciona una fecha
 * @param {Function} disabledDays - Función que determina qué días deshabilitar
 * @param {string} titulo - Título del card (opcional)
 */
export default function CalendarioSelector({ 
    fechaSeleccionada, 
    onFechaChange, 
    disabledDays,
    titulo = "1. Selecciona una fecha"
}) {
    const handleFechaChange = (nuevaFecha) => {
        // Solo propagar la fecha si es válida
        if (nuevaFecha && nuevaFecha instanceof Date && !isNaN(nuevaFecha.getTime())) {
            onFechaChange(nuevaFecha);
        }
    };

    return (
        <Card className="border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
            <CardHeader>
                <CardTitle className="text-zinc-100">{titulo}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={fechaSeleccionada}
                    onSelect={handleFechaChange}
                    disabled={disabledDays}
                    fromDate={new Date()}
                    locale={es}
                    className="rounded-md border border-zinc-700 bg-zinc-900/50 text-zinc-100"
                />
            </CardContent>
        </Card>
    );
}
