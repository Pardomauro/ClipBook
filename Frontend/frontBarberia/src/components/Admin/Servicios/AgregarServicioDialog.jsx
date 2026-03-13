import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from 'lucide-react';
import { createServicio } from '@/services/servicioService';
import toast from 'react-hot-toast';

export default function AgregarServicioDialog({ onServicioGuardado }) {
    const [open, setOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [formData, setFormData] = useState({
        nombre_servicio: '',
        precio_base: '',
        duracion: '',
        activo: true
    });

    const resetForm = () => {
        setFormData({
            nombre_servicio: '',
            precio_base: '',
            duracion: '',
            activo: true
        });
        setGuardando(false);
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
            resetForm();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setGuardando(true);
        try {
            await createServicio(formData);
            toast.success('Servicio creado correctamente');
            setOpen(false);
            resetForm();
            if (onServicioGuardado) {
                await onServicioGuardado();
            }
        } catch (error) {
            console.error('Error al crear servicio:', error);
            toast.error('Error al crear el servicio');
        } finally {
            setGuardando(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border-zinc-700/80 h-9 px-3"
                >
                    <Plus className="h-4 w-4 md:h-3 md:w-3 mr-0" />
                    Agregar Servicio
                </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto border-zinc-700/80 bg-zinc-900/95">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100">Agregar Nuevo Servicio</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Completa los datos del nuevo servicio. Todos los campos son obligatorios.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nombre_servicio" className="text-zinc-300">Nombre del Servicio *</Label>
                            <Input
                                id="nombre_servicio"
                                name="nombre_servicio"
                                value={formData.nombre_servicio}
                                onChange={handleInputChange}
                                placeholder="Ej: Corte de Cabello"
                                required
                                className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="precio_base" className="text-zinc-300">Precio Base *</Label>
                                <Input
                                    id="precio_base"
                                    name="precio_base"
                                    type="number"
                                    step="0.01"
                                    value={formData.precio_base}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    required
                                    min="0"
                                    className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="duracion" className="text-zinc-300">Duración (min) *</Label>
                                <Input
                                    id="duracion"
                                    name="duracion"
                                    type="number"
                                    value={formData.duracion}
                                    onChange={handleInputChange}
                                    placeholder="30"
                                    required
                                    min="1"
                                    className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-zinc-950/30 border border-zinc-700/50 rounded-md">
                            <Label htmlFor="activo" className="text-zinc-300 cursor-pointer">
                                Servicio Activo
                            </Label>
                            <Switch
                                id="activo"
                                checked={formData.activo}
                                onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                                className="data-[state=checked]:bg-blue-600"
                            />
                        </div>
                    </div>

                    <DialogFooter className="border-t border-zinc-800 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                            disabled={guardando}
                            className="bg-gray-400/70 border-zinc-900 text-zinc-800 hover:bg-gray-600 hover:text-zinc-100"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={guardando}
                            className="bg-gray-400/70 text-zinc-900 hover:bg-gray-600 hover:text-zinc-100 disabled:opacity-50"
                        >
                            {guardando ? 'Guardando...' : 'Crear Servicio'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
