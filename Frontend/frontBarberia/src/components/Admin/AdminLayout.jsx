import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from './AdminSidebar';

/**
 * Layout reutilizable para todas las páginas de administración
 * Incluye el Sidebar y maneja el contenido principal
 * 
 * @param {Object} props
 * @param {string} props.title - Título de la página
 * @param {string} props.subtitle - Subtítulo opcional
 * @param {React.ReactNode} props.children - Contenido de la página
 * @param {React.ReactNode} props.headerActions - Acciones opcionales en el header (ej: botones)
 */
export default function AdminLayout({ title, subtitle, children, headerActions }) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-800 bg-zinc-950/95 px-4">
                    <SidebarTrigger className="text-zinc-300 hover:text-zinc-100" />
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-zinc-100">{title}</h1>
                        {subtitle && (
                            <p className="text-sm text-zinc-400">{subtitle}</p>
                        )}
                    </div>
                    {headerActions && (
                        <div className="flex items-center gap-2">
                            {headerActions}
                        </div>
                    )}
                </header>

                <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 md:p-6">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
