import { useState, useEffect } from "react";
import { AdminLayout } from '@/components/Admin';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from '@/components/ui/spinner';
import { Scissors, Calendar, Clock, User, DollarSign, CheckCircle2 } from 'lucide-react';
import { getBarberos } from '@/services/barberoService';
import { getServicios } from '@/services/servicioService';
import { createTurno } from '@/services/turnoService';
import toast from 'react-hot-toast';

/**
 * Página para registrar cortes realizados por orden de llegada
 * Permite al administrador registrar servicios ya realizados sin turno previo
 */
export default function AgregarCorte() {
    const [barberos, setBarberos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    
    const [formData, setFormData] = useState({
        barbero_id: '',
        servicio_id: '',
        fecha_turno: new Date().toISOString().split('T')[0], // Fecha actual por defecto
        hora_inicio: '',
        nombre_cliente: '', // Opcional para clientes sin registro
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [barberosRes, serviciosRes] = await Promise.all([
                getBarberos({ activo: 'true' }),
                getServicios({ activo: 'true' })
            ]);
            
            setBarberos(barberosRes.data || []);
            setServicios(serviciosRes.data || []);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            toast.error('Error al cargar barberos y servicios');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const resetForm = () => {
        setFormData({
            barbero_id: '',
            servicio_id: '',
            fecha_turno: new Date().toISOString().split('T')[0],
            hora_inicio: '',
            nombre_cliente: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones
        if (!formData.barbero_id) {
            toast.error('Selecciona un barbero');
            return;
        }
        if (!formData.servicio_id) {
            toast.error('Selecciona un servicio');
            return;
        }
        if (!formData.hora_inicio) {
            toast.error('Ingresa la hora del servicio');
            return;
        }

        setGuardando(true);
        try {
            // Preparar datos del turno
            const datosTurno = {
                barbero_id: formData.barbero_id,
                servicio_id: formData.servicio_id,
                fecha_turno: formData.fecha_turno,
                hora_inicio: formData.hora_inicio,
                estado: 'finalizado', // Marcarlo como finalizado porque ya se realizó
                // Siempre crear un cliente temporal (con nombre o anónimo)
                cliente: {
                    nombre_completo: formData.nombre_cliente.trim() || 'Cliente Anonimo',
                    email: `orden_llegada_${Date.now()}@temporal.com`, // Email temporal único
                    celular: '0000000000' // Celular temporal (campo requerido)
                }
            };

            console.log('📤 Datos enviados:', datosTurno);
            await createTurno(datosTurno);
            
            toast.success('Corte registrado correctamente');
            resetForm();
        } catch (error) {
            console.error('Error al registrar corte:', error);
            const mensajeError = error.response?.data?.mensaje || 'Error al registrar el corte';
            toast.error(mensajeError);
        } finally {
            setGuardando(false);
        }
    };

    // Obtener precio del servicio seleccionado
    const servicioSeleccionado = servicios.find(s => s.servicio_id === formData.servicio_id);
    const precioServicio = servicioSeleccionado ? Number(servicioSeleccionado.precio_base) : 0;

    if (loading) {
        return (
            <AdminLayout title="Agregar Corte" subtitle="Registrar servicios por orden de llegada">
                <div className="flex items-center justify-center py-12">
                    <Spinner className="h-8 w-8" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout 
            title="Agregar Corte"
            subtitle="Registrar servicios realizados por orden de llegada"
        >
            <div className="max-w-2xl mx-auto">
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600/10 rounded-lg">
                                <Scissors className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <CardTitle className="text-zinc-100">Registro de Corte</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Completa los datos del servicio realizado
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Barbero */}
                            <div className="grid gap-2">
                                <Label htmlFor="barbero_id" className="text-zinc-300 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Barbero *
                                </Label>
                                <Select 
                                    value={formData.barbero_id} 
                                    onValueChange={(value) => handleSelectChange('barbero_id', value)}
                                >
                                    <SelectTrigger type="button" className="border-zinc-700 bg-zinc-950/50 text-zinc-100">
                                        <SelectValue placeholder="Selecciona un barbero" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                        {barberos.map((barbero) => (
                                            <SelectItem 
                                                key={barbero.barbero_id} 
                                                value={barbero.barbero_id}
                                                className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100"
                                            >
                                                {barbero.nombre_completo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Servicio */}
                            <div className="grid gap-2">
                                <Label htmlFor="servicio_id" className="text-zinc-300 flex items-center gap-2">
                                    <Scissors className="h-4 w-4" />
                                    Servicio *
                                </Label>
                                <Select 
                                    value={formData.servicio_id} 
                                    onValueChange={(value) => handleSelectChange('servicio_id', value)}
                                >
                                    <SelectTrigger type="button" className="border-zinc-700 bg-zinc-950/50 text-zinc-100">
                                        <SelectValue placeholder="Selecciona un servicio" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-700">
                                        {servicios.map((servicio) => (
                                            <SelectItem 
                                                key={servicio.servicio_id} 
                                                value={servicio.servicio_id}
                                                className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100"
                                            >
                                                {servicio.nombre_servicio} - ${servicio.precio_base}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {precioServicio > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                                        <DollarSign className="h-4 w-4" />
                                        Precio: ${precioServicio.toFixed(2)}
                                    </div>
                                )}
                            </div>

                            {/* Fecha y Hora */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="fecha_turno" className="text-zinc-300 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Fecha *
                                    </Label>
                                    <Input
                                        id="fecha_turno"
                                        name="fecha_turno"
                                        type="date"
                                        value={formData.fecha_turno}
                                        onChange={handleInputChange}
                                        max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                                        required
                                        className="border-zinc-700 bg-zinc-950/50 text-zinc-100 w-full block"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="hora_inicio" className="text-zinc-300 flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Hora *
                                    </Label>
                                    <Input
                                        id="hora_inicio"
                                        name="hora_inicio"
                                        type="time"
                                        value={formData.hora_inicio}
                                        onChange={handleInputChange}
                                        required
                                        className="border-zinc-700 bg-zinc-950/50 text-zinc-100 w-full block"
                                    />
                                </div>
                            </div>

                            {/* Cliente (opcional) */}
                            <div className="grid gap-2">
                                <Label htmlFor="nombre_cliente" className="text-zinc-300 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Nombre del Cliente (opcional)
                                </Label>
                                <Input
                                    id="nombre_cliente"
                                    name="nombre_cliente"
                                    value={formData.nombre_cliente}
                                    onChange={handleInputChange}
                                    placeholder="Dejar en blanco si es anónimo"
                                    className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                />
                                <p className="text-xs text-zinc-500">
                                    Para clientes sin registro previo
                                </p>
                            </div>

                            {/* Botones */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-zinc-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                    disabled={guardando}
                                    className="w-full sm:flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                                >
                                    Limpiar Formulario
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={guardando}
                                    className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                                >
                                    {guardando ? (
                                        <>
                                            <Spinner className="h-4 w-4 mr-2" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Registrar Corte
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Información adicional */}
                <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                    <p className="text-sm text-blue-400">
                        <strong>Nota:</strong> Los cortes registrados aquí aparecerán en las estadísticas 
                        con estado "finalizado" automáticamente, ya que son servicios ya realizados.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
