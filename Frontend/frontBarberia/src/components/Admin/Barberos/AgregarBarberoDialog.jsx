import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Link as LinkIcon } from 'lucide-react';
import { createBarbero } from '@/services/barberoService';
import toast from 'react-hot-toast';

/**
 * Componente de diálogo para agregar un nuevo barbero
 * @param {Function} onBarberoCreado - Callback que se ejecuta después de crear el barbero exitosamente
 */
export default function AgregarBarberoDialog({ onBarberoCreado }) {
    const [open, setOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [previsualizacionImagen, setPrevisualizacionImagen] = useState('');
    
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        celular: '',
        password: '',
        direccion: '',
        imagen_url: '',
        activo: true
    });

    const resetForm = () => {
        setFormData({
            nombre_completo: '',
            email: '',
            celular: '',
            password: '',
            direccion: '',
            imagen_url: '',
            activo: true
        });
        setPrevisualizacionImagen('');
    };

    const handleImagenArchivo = (e) => {
        const archivo = e.target.files?.[0];
        
        if (!archivo) return;
        
        // Validar que sea una imagen
        if (!archivo.type.startsWith('image/')) {
            toast.error('Por favor selecciona un archivo de imagen válido');
            return;
        }
        
        // Validar tamaño (máximo 2MB)
        if (archivo.size > 2 * 1024 * 1024) {
            toast.error('La imagen no debe superar los 2MB');
            return;
        }
        
        // Convertir a base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setFormData({...formData, imagen_url: base64String});
            setPrevisualizacionImagen(base64String);
            toast.success('Imagen cargada correctamente');
        };
        reader.onerror = () => {
            toast.error('Error al cargar la imagen');
        };
        reader.readAsDataURL(archivo);
    };

    const handleImagenURL = (url) => {
        setFormData({...formData, imagen_url: url});
        if (url.trim()) {
            setPrevisualizacionImagen(url);
        } else {
            setPrevisualizacionImagen('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setGuardando(true);
            
            // Limpiar datos antes de enviar
            const datosLimpios = {
                nombre_completo: formData.nombre_completo.trim(),
                email: formData.email.trim().toLowerCase(),
                celular: formData.celular.trim(),
                password: formData.password,
                activo: formData.activo
            };
            
            // Solo agregar campos opcionales si tienen valor
            if (formData.direccion.trim()) {
                datosLimpios.direccion = formData.direccion.trim();
            }
            
            if (formData.imagen_url.trim()) {
                datosLimpios.imagen_url = formData.imagen_url.trim();
            }
            
            await createBarbero(datosLimpios);
            
            toast.success('Barbero creado correctamente');
            
            // Resetear formulario y cerrar diálogo
            resetForm();
            setOpen(false);
            
            // Llamar al callback para recargar la lista
            if (onBarberoCreado) {
                onBarberoCreado();
            }
        } catch (error) {
            console.error('Error al crear barbero:', error);
            const mensaje = error.response?.data?.mensaje || error.message || 'Error al crear el barbero';
            toast.error(mensaje);
        } finally {
            setGuardando(false);
        }
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
            resetForm();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border-zinc-700/80 h-9 px-3"
                >
                    <Plus className="h-4 w-4 md:h-3 md:w-3 mr-0" />
                    Agregar Barbero
                </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto border-zinc-700/80 bg-zinc-900/95">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100">Agregar Nuevo Barbero</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Completa los datos del nuevo barbero. Los campos marcados con * son obligatorios.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nombre_completo" className="text-zinc-300">Nombre Completo *</Label>
                            <Input
                                id="nombre_completo"
                                value={formData.nombre_completo}
                                onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
                                placeholder="Ej: Juan Pérez"
                                required
                                className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-zinc-300">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="juan@ejemplo.com"
                                    required
                                    className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="celular" className="text-zinc-300">Celular *</Label>
                                <Input
                                    id="celular"
                                    type="tel"
                                    value={formData.celular}
                                    onChange={(e) => setFormData({...formData, celular: e.target.value})}
                                    placeholder="Ej: +54 11 1234-5678"
                                    required
                                    className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-zinc-300">Contraseña *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="Mínimo 6 caracteres"
                                required
                                minLength={6}
                                className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                            />
                            <p className="text-xs text-zinc-400">
                                La contraseña debe tener al menos 6 caracteres
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="direccion" className="text-zinc-300">Dirección</Label>
                            <Input
                                id="direccion"
                                value={formData.direccion}
                                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                                placeholder="Calle 123, Ciudad"
                                className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="imagen" className="text-zinc-300">Imagen del Barbero</Label>
                            <Tabs defaultValue="url" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-zinc-950/60 border border-zinc-700">
                                    <TabsTrigger value="url" className="text-zinc-100 data-[state=active]:bg-zinc-800">
                                        <LinkIcon className="h-4 w-4 mr-2" />
                                        URL
                                    </TabsTrigger>
                                    <TabsTrigger value="upload" className="text-zinc-100 data-[state=active]:bg-zinc-800">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Subir Archivo
                                    </TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="url" className="space-y-2 mt-3">
                                    <Input
                                        type="url"
                                        value={formData.imagen_url.startsWith('data:') ? '' : formData.imagen_url}
                                        onChange={(e) => handleImagenURL(e.target.value)}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                    />
                                    <p className="text-xs text-zinc-400">
                                        Ingresa la URL de una imagen desde internet
                                    </p>
                                </TabsContent>
                                
                                <TabsContent value="upload" className="space-y-2 mt-3">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImagenArchivo}
                                        className="cursor-pointer border-zinc-700 bg-zinc-950/50 text-zinc-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-100 hover:file:bg-zinc-700"
                                    />
                                    <p className="text-xs text-zinc-400">
                                        Selecciona una imagen desde tu dispositivo (máx. 2MB)
                                    </p>
                                </TabsContent>
                            </Tabs>
                            
                            {/* Vista previa de la imagen */}
                            {previsualizacionImagen && (
                                <div className="mt-2 flex justify-center">
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-zinc-700">
                                        <img 
                                            src={previsualizacionImagen} 
                                            alt="Vista previa" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="activo"
                                checked={formData.activo}
                                onCheckedChange={(checked) => setFormData({...formData, activo: checked})}
                                className="data-[state=checked]:bg-emerald-600"
                            />
                            <Label htmlFor="activo" className="cursor-pointer text-zinc-300">
                                Barbero activo
                            </Label>
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
                            {guardando ? 'Creando...' : 'Crear Barbero'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
