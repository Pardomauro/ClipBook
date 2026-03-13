import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/Admin';
import { User, Mail, Phone, Lock, Save, Upload, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { updateBarbero } from '@/services/barberoService';
import { cambiarPassword } from '@/services/authService';
import toast from 'react-hot-toast';

/**
 * Página de perfil del barbero
 * Permite ver y editar información personal y cambiar contraseña
 */
export default function PerfilPage() {
    const { barbero, actualizarBarbero } = useAuth();
    const [guardandoPerfil, setGuardandoPerfil] = useState(false);
    const [guardandoPassword, setGuardandoPassword] = useState(false);
    
    const [formPerfil, setFormPerfil] = useState({
        nombre_completo: '',
        email: '',
        celular: '',
        direccion: '',
        imagen_url: ''
    });

    const [formPassword, setFormPassword] = useState({
        passwordActual: '',
        passwordNuevo: '',
        passwordConfirmacion: ''
    });

    useEffect(() => {
        if (barbero) {
            setFormPerfil({
                nombre_completo: barbero.nombre_completo || '',
                email: barbero.email || '',
                celular: barbero.celular || '',
                direccion: barbero.direccion || '',
                imagen_url: barbero.imagen_url || ''
            });
        }
    }, [barbero]);

    const handleImagenArchivo = (e) => {
        const archivo = e.target.files?.[0];
        if (!archivo) return;

        // Validar que sea una imagen
        if (!archivo.type.startsWith('image/')) {
            toast.error('Por favor selecciona un archivo de imagen válido');
            return;
        }

        // Validar tamaño (máximo 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB en bytes
        if (archivo.size > maxSize) {
            toast.error('La imagen no debe superar los 2MB');
            return;
        }

        // Convertir a base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormPerfil({ ...formPerfil, imagen_url: reader.result });
            toast.success('Imagen cargada correctamente');
        };
        reader.onerror = () => {
            toast.error('Error al leer la imagen');
        };
        reader.readAsDataURL(archivo);
    };

    const handleActualizarPerfil = async (e) => {
        e.preventDefault();
        
        try {
            setGuardandoPerfil(true);
            
            await updateBarbero(barbero.barbero_id, formPerfil);
            
            // Actualizar el contexto con los nuevos datos
            actualizarBarbero(formPerfil);
            
            toast.success('Perfil actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            toast.error(error.response?.data?.mensaje || 'Error al actualizar el perfil');
        } finally {
            setGuardandoPerfil(false);
        }
    };

    const handleCambiarPassword = async (e) => {
        e.preventDefault();
        
        // Validar que las contraseñas coincidan
        if (formPassword.passwordNuevo !== formPassword.passwordConfirmacion) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        // Validar longitud mínima
        if (formPassword.passwordNuevo.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            setGuardandoPassword(true);
            
            await cambiarPassword(
                formPassword.passwordActual,
                formPassword.passwordNuevo,
                formPassword.passwordConfirmacion
            );
            
            // Limpiar formulario
            setFormPassword({
                passwordActual: '',
                passwordNuevo: '',
                passwordConfirmacion: ''
            });
            
            toast.success('Contraseña cambiada correctamente');
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            toast.error(error.response?.data?.mensaje || 'Error al cambiar la contraseña');
        } finally {
            setGuardandoPassword(false);
        }
    };

    const obtenerIniciales = (nombre) => {
        return nombre
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!barbero) {
        return (
            <AdminLayout title="Mi Perfil" subtitle="Gestionar información personal">
                <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
                    <p className="text-zinc-300">Cargando información del perfil...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout 
            title="Mi Perfil"
            subtitle="Gestionar información personal y seguridad"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información del perfil */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Datos personales */}
                    <Card className="border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
                        <form onSubmit={handleActualizarPerfil}>
                            <CardHeader>
                                <CardTitle className="text-zinc-100">Información Personal </CardTitle>
                                <CardDescription className="text-zinc-400 mt-1">
                                    Actualiza tus datos de contacto y perfil
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="nombre_completo" className="text-zinc-300 mt-2">Nombre Completo *</Label>
                                    <Input
                                        id="nombre_completo"
                                        value={formPerfil.nombre_completo}
                                        onChange={(e) => setFormPerfil({...formPerfil, nombre_completo: e.target.value})}
                                        placeholder="Tu nombre completo"
                                        required
                                        className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-zinc-300">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formPerfil.email}
                                            onChange={(e) => setFormPerfil({...formPerfil, email: e.target.value})}
                                            placeholder="tu@email.com"
                                            required
                                            className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="celular" className="text-zinc-300">Celular *</Label>
                                        <Input
                                            id="celular"
                                            value={formPerfil.celular}
                                            onChange={(e) => setFormPerfil({...formPerfil, celular: e.target.value})}
                                            placeholder="Número de celular"
                                            required
                                            className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="direccion" className="text-zinc-300">Dirección</Label>
                                    <Input
                                        id="direccion"
                                        value={formPerfil.direccion}
                                        onChange={(e) => setFormPerfil({...formPerfil, direccion: e.target.value})}
                                        placeholder="Tu dirección"
                                        className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-zinc-300">Imagen de Perfil</Label>
                                    <Tabs defaultValue="url" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 bg-zinc-950/60 border border-zinc-700">
                                            <TabsTrigger value="url" className="text-zinc-100 data-[state=active]:bg-zinc-800">
                                                <LinkIcon className="h-4 w-4 mr-2" />
                                                URL
                                            </TabsTrigger>
                                            <TabsTrigger value="archivo" className="text-zinc-100 data-[state=active]:bg-zinc-800">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Subir Archivo
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="url" className="space-y-2 mt-3">
                                            <Input
                                                id="imagen_url"
                                                value={formPerfil.imagen_url?.startsWith('data:') ? '' : formPerfil.imagen_url}
                                                onChange={(e) => setFormPerfil({...formPerfil, imagen_url: e.target.value})}
                                                placeholder="https://ejemplo.com/imagen.jpg"
                                                className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                            />
                                            <p className="text-xs text-zinc-400">
                                                Pega la URL de una imagen desde internet
                                            </p>
                                        </TabsContent>
                                        <TabsContent value="archivo" className="space-y-2 mt-3">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImagenArchivo}
                                                className="cursor-pointer border-zinc-700 bg-zinc-950/50 text-zinc-100 file:text-zinc-100"
                                            />
                                            <p className="text-xs text-zinc-400">
                                                Sube una imagen desde tu ordenador (máx. 2MB)
                                            </p>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-6 border-t border-zinc-800">
                                <Button type="submit" disabled={guardandoPerfil} className="bg-zinc-100 text-zinc-900 hover:bg-white">
                                    <Save className="h-4 w-4 mr-2" />
                                    {guardandoPerfil ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    {/* Cambiar contraseña */}
                    <Card className="border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
                        <form onSubmit={handleCambiarPassword}>
                            <CardHeader>
                                <CardTitle className="text-zinc-100">Cambiar Contraseña</CardTitle>
                                <CardDescription className="text-zinc-400 mt-1">
                                    Actualiza tu contraseña de acceso
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="passwordActual" className="text-zinc-300 mt-2">Contraseña Actual *</Label>
                                    <Input
                                        id="passwordActual"
                                        type="password"
                                        value={formPassword.passwordActual}
                                        onChange={(e) => setFormPassword({...formPassword, passwordActual: e.target.value})}
                                        placeholder="Tu contraseña actual"
                                        required
                                        className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                    />
                                </div>

                                <Separator className="bg-zinc-800" />

                                <div className="grid gap-2">
                                    <Label htmlFor="passwordNuevo" className="text-zinc-300">Nueva Contraseña *</Label>
                                    <Input
                                        id="passwordNuevo"
                                        type="password"
                                        value={formPassword.passwordNuevo}
                                        onChange={(e) => setFormPassword({...formPassword, passwordNuevo: e.target.value})}
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                        className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="passwordConfirmacion" className="text-zinc-300">Confirmar Nueva Contraseña *</Label>
                                    <Input
                                        id="passwordConfirmacion"
                                        type="password"
                                        value={formPassword.passwordConfirmacion}
                                        onChange={(e) => setFormPassword({...formPassword, passwordConfirmacion: e.target.value})}
                                        placeholder="Repite la nueva contraseña"
                                        required
                                        className="border-zinc-700 bg-zinc-950/50 text-zinc-100 placeholder:text-zinc-500"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="pt-6 border-t border-zinc-800">
                                <Button type="submit" disabled={guardandoPassword} className="bg-zinc-100 text-zinc-900 hover:bg-white">
                                    <Lock className="h-4 w-4 mr-2" />
                                    {guardandoPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>

                {/* Card de vista previa */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6 border-zinc-700/80 bg-zinc-900/95 shadow-xl shadow-black/30">
                        <CardHeader>
                            <CardTitle className="text-zinc-100">Vista Previa</CardTitle>
                            <CardDescription className="text-zinc-400">
                                Así se ve tu perfil
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center text-center space-y-4">
                            <div className="relative h-24 w-24 ring-2 ring-zinc-700 rounded-lg overflow-hidden shrink-0">
                                {formPerfil.imagen_url ? (
                                    <img 
                                        src={formPerfil.imagen_url} 
                                        alt={formPerfil.nombre_completo}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-zinc-100 text-2xl font-semibold">
                                        {obtenerIniciales(formPerfil.nombre_completo || 'BB')}
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg text-zinc-100">{formPerfil.nombre_completo || 'Sin nombre'}</h3>
                            </div>

                            <Separator className="bg-zinc-800" />

                            <div className="w-full space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <Mail className="h-4 w-4 text-zinc-400" />
                                    <span className="truncate">{formPerfil.email || 'Sin email'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <Phone className="h-4 w-4 text-zinc-400" />
                                    <span>{formPerfil.celular || 'Sin celular'}</span>
                                </div>
                                {formPerfil.direccion && (
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <User className="h-4 w-4 text-zinc-400" />
                                        <span className="truncate">{formPerfil.direccion}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
