import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { 
    Home, 
    Users, 
    Scissors, 
    Calendar, 
    UserCircle, 
    BarChart3, 
    LogOut,
    ClipboardPlus
} from 'lucide-react';

/**
 * Sidebar de administración reutilizable
 * Se usa en todas las páginas del panel admin
 */
export default function AdminSidebar() {
    const { barbero, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    // Items del menú lateral
    const menuItems = [
        { 
            icon: Home, 
            label: 'Dashboard', 
            path: '/admin/dashboard'
        },
        { 
            icon: Users, 
            label: 'Barberos', 
            path: '/admin/barberos' 
        },
        { 
            icon: Scissors, 
            label: 'Servicios', 
            path: '/admin/servicios' 
        },
        { 
            icon: Calendar, 
            label: 'Turnos', 
            path: '/admin/turnos' 
        },
        { 
            icon: ClipboardPlus, 
            label: 'Agregar Corte', 
            path: '/admin/agregar-corte' 
        },
        { 
            icon: UserCircle, 
            label: 'Mi Perfil', 
            path: '/admin/perfil' 
        },
        { 
            icon: BarChart3, 
            label: 'Estadísticas', 
            path: '/admin/estadisticas' 
        }
    ];

    return (
        <Sidebar className="bg-zinc-950 border-zinc-800">
            <SidebarHeader className="border-b border-zinc-800 bg-zinc-950/95 px-4 py-3">
                <div className="flex items-center gap-2">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-100">Barbería</h2>
                        <p className="text-xs text-zinc-400">Panel Admin</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-zinc-950">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-zinc-400 text-xs uppercase tracking-wider">
                        Navegación
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.path}>
                                    <SidebarMenuButton
                                        onClick={() => navigate(item.path)}
                                        isActive={location.pathname === item.path}
                                        tooltip={item.label}
                                        className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/60 data-[active=true]:bg-zinc-800 data-[active=true]:text-zinc-100"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-zinc-400 text-xs uppercase tracking-wider">
                        Usuario
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="px-3 py-2 text-sm rounded-md bg-zinc-900/40 border border-zinc-800/60">
                            <p className="font-medium text-zinc-100">{barbero?.nombre_completo}</p>
                            <p className="text-xs text-zinc-400">{barbero?.email}</p>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-zinc-800 bg-zinc-950">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            onClick={handleLogout} 
                            tooltip="Cerrar Sesión"
                            className="text-zinc-300 hover:text-red-400 hover:bg-zinc-900/60 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Cerrar Sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
