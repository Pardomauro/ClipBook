import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Card reutilizable para mostrar estadísticas
 * 
 * @param {Object} props
 * @param {string} props.title - Título de la estadística
 * @param {string|number} props.value - Valor principal a mostrar
 * @param {string} props.description - Descripción o subtítulo
 * @param {React.ReactNode} props.icon - Icono a mostrar (componente de Lucide)
 * @param {Function} props.onClick - Función opcional al hacer click
 * @param {string} props.className - Clases adicionales de Tailwind
 */
export default function StatCard({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    onClick,
    className = ''
}) {
    return (
        <Card 
            className={`border-zinc-700/80 bg-zinc-900/95 shadow-lg shadow-black/30 ${onClick ? 'hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 transition-all cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-100">
                    {title}
                </CardTitle>
                {Icon && (
                    <Icon className="h-4 w-4 text-zinc-400" />
                )}
            </CardHeader>
            <CardContent>
                {value !== undefined && (
                    <div className="text-2xl font-bold text-zinc-100">
                        {value}
                    </div>
                )}
                {description && (
                    <p className="text-xs text-zinc-400">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
