
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import { obtenerEstiloActivo } from '@/utils/formatters';
import { IMAGEN_BARBERO_DEFAULT } from '@/utils/constants';

/**
 * Componente de tarjeta para mostrar información de un barbero
 * @param {object} barbero - Datos del barbero
 * @param {function} onReservar - Callback cuando se hace clic en "Reservar turno"
 */
export function BarberoCard({ barbero, onReservar }) {
  
  // Normalizar la imagen del barbero (corregir rutas incorrectas del backend)
  const normalizarImagenUrl = (url) => {
    if (!url) return IMAGEN_BARBERO_DEFAULT;
    
    // Si la URL tiene ./public/ o /public/, corregirla
    if (url.includes('./public/')) {
      return url.replace('./public/', '/');
    }
    if (url.includes('/public/')) {
      return url.replace('/public/', '/');
    }
    if (url.startsWith('public/')) {
      return '/' + url.replace('public/', '');
    }
    
    return url;
  };
  
  // Manejar imagen por defecto si no tiene
  const imagenBarbero = normalizarImagenUrl(barbero?.imagen_url) || IMAGEN_BARBERO_DEFAULT;
  
  // Obtener estilo del badge según estado activo/inactivo
  const { className: badgeClassName, texto: badgeTexto } = obtenerEstiloActivo(barbero?.activo);

  // Handler para el click del botón
  const handleReservar = () => {
    if (onReservar) {
      onReservar(barbero);
    }
  };

  return (
    <Card className="relative mx-auto w-full max-w-sm overflow-hidden border-zinc-700/80 bg-zinc-900/95 text-zinc-100 pt-0 shadow-xl shadow-black/35 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 hover:shadow-2xl hover:shadow-black/50">
      {/* Contenedor de imagen centrado */}
      <div className="flex items-center justify-center p-4 bg-zinc-950/50">
        <div className="relative w-50 h-50 overflow-hidden rounded-lg">
          {/* Overlay oscuro sobre la imagen */}
          <div className="absolute inset-0 z-30 bg-black/25" />
          
          {/* Imagen del barbero */}
          <img
            src={imagenBarbero}
            alt={`Foto de ${barbero?.nombre_completo || 'Barbero'}`}
            className="relative z-20 w-full h-full object-cover brightness-75 grayscale-35"
            onError={(e) => {
              // Evitar loop infinito: solo intentar una vez
              if (e.target.src !== IMAGEN_BARBERO_DEFAULT) {
                e.target.src = IMAGEN_BARBERO_DEFAULT;
              } else {
                // Si la imagen por defecto también falla, usar placeholder de data URI
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="18"%3EBarbero%3C/text%3E%3C/svg%3E';
              }
            }}
          />
        </div>
      </div>
      
      {/* Header con nombre y badge de estado */}
      <CardHeader className="gap-3">
        <CardAction>
          <Badge variant="secondary" className={`${badgeClassName} border-zinc-600/70`}>
            {badgeTexto}
          </Badge>
        </CardAction>
        <CardTitle className="text-xl text-zinc-100">{barbero?.nombre_completo || 'Sin nombre'}</CardTitle>
      </CardHeader>
      
      {/* Footer con botón de acción */}
      <CardFooter>
        <Button 
          className="w-full bg-zinc-100 text-zinc-900 hover:bg-white" 
          onClick={handleReservar}
          disabled={!barbero?.activo}
        >
          {barbero?.activo ? 'Reservar Turno' : 'No disponible'}
        </Button>
      </CardFooter>
    </Card>
  )
}
