import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/Admin';
import { Plus, Edit, DollarSign, Clock, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { SpinnerButton } from '@/components/Common/Spinner';
import { getServicios, createServicio, updateServicio, cambiarEstadoServicio } from '@/services/servicioService';
import toast from 'react-hot-toast';

/**
 * Página de gestión de servicios
 * Muestra cards de servicios con opción de editar precios y agregar nuevos
 */
export default function ServiciosPage() {
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [servicioActual, setServicioActual] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [cambiandoEstado, setCambiandoEstado] = useState({});
    
    const [formData, setFormData] = useState({
        nombre_servicio: '',
        precio_base: '',
        duracion: '',
        activo: true
    });

    useEffect(() => {
        cargarServicios();
    }, []);

    const cargarServicios = async () => {
        try {
            setLoading(true);
            const response = await getServicios();
            setServicios(response.data || []);
        } catch (error) {
            console.error('Error al cargar servicios:', error);
            toast.error('Error al cargar los servicios');
        } finally {
            setLoading(false);
        }
    };

    const handleAbrirDialogo = (servicio = null) => {
        if (servicio) {
            setModoEdicion(true);
            setServicioActual(servicio);
            setFormData({
                nombre_servicio: servicio.nombre_servicio,
                precio_base: servicio.precio_base,
                duracion: servicio.duracion,
                activo: servicio.activo
            });
        } else {
            setModoEdicion(false);
            setServicioActual(null);
            setFormData({
                nombre_servicio: '',
                precio_base: '',
                duracion: '',
                activo: true
            });
        }
        setOpenDialog(true);
    };

    const handleCerrarDialogo = () => {
        setOpenDialog(false);
        setModoEdicion(false);
        setServicioActual(null);
        setFormData({
            nombre_servicio: '',
            precio_base: '',
            duracion: '',
            activo: true
        });
    };

    const handleGuardarServicio = async (e) => {
        e.preventDefault();
        
        try {
            setGuardando(true);
            
            // Solo enviar los campos necesarios (sin tipo_servicio ni descripcion)
            const datos = {
                nombre_servicio: formData.nombre_servicio.trim(),
                precio_base: parseFloat(formData.precio_base),
                duracion: parseInt(formData.duracion),
                activo: formData.activo
            };

            if (modoEdicion && servicioActual) {
                await updateServicio(servicioActual.servicio_id, datos);
                toast.success('Servicio actualizado correctamente');
            } else {
                await createServicio(datos);
                toast.success('Servicio creado correctamente');
            }
            
            await cargarServicios();
            handleCerrarDialogo();
        } catch (error) {
            console.error('Error al guardar servicio:', error);
            const mensaje = error.message || 'Error al guardar el servicio';
            toast.error(mensaje);
        } finally {
            setGuardando(false);
        }
    };

    const handleCambiarEstado = async (servicioId, estadoActual) => {
        try {
            setCambiandoEstado(prev => ({ ...prev, [servicioId]: true }));
            
            const nuevoEstado = !estadoActual;
            await cambiarEstadoServicio(servicioId, nuevoEstado);
            
            setServicios(prev => prev.map(servicio => 
                servicio.servicio_id === servicioId 
                    ? { ...servicio, activo: nuevoEstado }
                    : servicio
            ));
            
            toast.success(`Servicio ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            toast.error('Error al cambiar el estado del servicio');
        } finally {
            setCambiandoEstado(prev => ({ ...prev, [servicioId]: false }));
        }
    };

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(precio);
    };

    if (loading) {
        return (
            <AdminLayout title="Gestión de Servicios" subtitle="Administrar servicios ofrecidos">
                <div className="flex items-center justify-center py-12">
                    <SpinnerButton />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout 
            title="Gestión de Servicios"
            subtitle={`${servicios.length} servicio${servicios.length !== 1 ? 's' : ''} registrado${servicios.length !== 1 ? 's' : ''}`}
            headerActions={
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleAbrirDialogo()} className="bg-gray-400/80 text-gray-900 hover:bg-gray-500 ">
                            <Plus className="h-4 w-4 md:h-3 md:w-3 mr-0" />
                            Agregar Servicio
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] border-zinc-700 bg-zinc-900">
                        <form onSubmit={handleGuardarServicio}>
                            <DialogHeader>
                                <DialogTitle className="text-zinc-100">
                                    {modoEdicion ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
                                </DialogTitle>
                                <DialogDescription className="text-zinc-400">
                                    {modoEdicion 
                                        ? 'Modifica los datos del servicio' 
                                        : 'Completa los datos del nuevo servicio'}
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="nombre_servicio" className="text-zinc-300">Nombre del Servicio *</Label>
                                    <Input
                                        id="nombre_servicio"
                                        value={formData.nombre_servicio}
                                        onChange={(e) => setFormData({...formData, nombre_servicio: e.target.value})}
                                        placeholder="Ej: Corte de cabello"
                                        required
                                        className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="precio_base" className="text-zinc-300">Precio *</Label>
                                        <Input
                                            id="precio_base"
                                            type="number"
                                            step="0.01"
                                            value={formData.precio_base}
                                            onChange={(e) => setFormData({...formData, precio_base: e.target.value})}
                                            placeholder="0.00"
                                            required
                                            className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                        />
                                    </div>
                                    
                                    <div className="grid gap-2">
                                        <Label htmlFor="duracion" className="text-zinc-300">Duración (min) *</Label>
                                        <Input
                                            id="duracion"
                                            type="number"
                                            value={formData.duracion}
                                            onChange={(e) => setFormData({...formData, duracion: e.target.value})}
                                            placeholder="30"
                                            required
                                            className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="activo"
                                        checked={formData.activo}
                                        onCheckedChange={(checked) => setFormData({...formData, activo: checked})}
                                        className="data-[state=checked]:bg-emerald-600"
                                    />
                                    <Label htmlFor="activo" className="text-zinc-300">Servicio activo</Label>
                                </div>
                            </div>
                            
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={handleCerrarDialogo} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={guardando} className="bg-zinc-100 text-zinc-900 hover:bg-white">
                                    {guardando ? 'Guardando...' : modoEdicion ? 'Actualizar' : 'Crear'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            }
        >
            {servicios.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                    <Scissors className="h-12 w-12 mx-auto text-zinc-500 mb-4" />
                    <p className="text-zinc-300 text-lg">No hay servicios registrados</p>
                    <p className="text-zinc-400 text-sm mt-2">
                        Comienza agregando el primer servicio
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servicios.map((servicio) => (
                        <Card key={servicio.servicio_id} className="overflow-hidden border-zinc-700/80 bg-zinc-900/95 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transition-all">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg flex items-center gap-2 text-zinc-100">
                                            <Scissors className="h-5 w-5 text-cyan-500" />
                                            {servicio.nombre_servicio}
                                        </CardTitle>
                                    </div>
                                    <Badge variant={servicio.activo ? "default" : "secondary"} className={servicio.activo ? "bg-green-700 hover:bg-green-700 border-green-500" : "bg-zinc-700 text-zinc-300 border-zinc-600"}>
                                        {servicio.activo ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-3 pb-4">
                                <div className="flex items-center text-sm">
                                    <DollarSign className="h-4 w-4 mr-2 text-emerald-500" />
                                    <span className="font-semibold text-lg text-zinc-100">{formatearPrecio(servicio.precio_base)}</span>
                                </div>
                                <div className="flex items-center text-sm text-zinc-300">
                                    <Clock className="h-4 w-4 mr-2 text-zinc-400" />
                                    <span>{servicio.duracion} minutos</span>
                                </div>
                            </CardContent>

                            <CardFooter className="bg-zinc-950/50 border-t border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={servicio.activo}
                                        onCheckedChange={() => handleCambiarEstado(servicio.servicio_id, servicio.activo)}
                                        disabled={cambiandoEstado[servicio.servicio_id]}
                                        className="data-[state=checked]:bg-emerald-600"
                                    />
                                    <span className="text-sm text-zinc-400">
                                        {servicio.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleAbrirDialogo(servicio)}
                                    className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
