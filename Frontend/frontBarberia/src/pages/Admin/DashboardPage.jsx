import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, Scissors, Calendar } from 'lucide-react';
import { AdminLayout } from '@/components/Admin';
import { StatCard } from '@/components/Common';
import { ClientsChart } from '@/components/Charts';
import { getTurnosPorDia } from '@/services/turnoService';
import { getBarbero } from '@/services/authService';
import toast from 'react-hot-toast';

/**
 * Página principal del panel de administración
 * Dashboard con estadísticas y acceso rápido a secciones
 */
export default function DashboardPage() {
    const navigate = useNavigate();
    const [estadisticas, setEstadisticas] = useState([]);
    const [barberoId, setBarberoId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar estadísticas de turnos del barbero
    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                setLoading(true);
                
                // Obtener barbero autenticado
                const barberoActual = getBarbero();
                if (!barberoActual || !barberoActual.barbero_id) {
                    toast.error('No se pudo identificar el barbero');
                    return;
                }
                
                // Guardar barbero_id en el estado
                setBarberoId(barberoActual.barbero_id);
                
                // Obtener turnos por día del barbero
                const response = await getTurnosPorDia(barberoActual.barbero_id);
                setEstadisticas(response.data);
            } catch (error) {
                console.error('Error al cargar estadísticas:', error);
                setEstadisticas([]);
            } finally {
                setLoading(false);
            }
        };

        cargarEstadisticas();
    }, []);

    // Calcular total de turnos de la semana
    const totalTurnosSemana = estadisticas.reduce((sum, item) => sum + item.cantidad, 0);

    return (
        <AdminLayout 
            title="Dashboard" 
            subtitle="Bienvenido al panel de administración"
        >
            <div className="space-y-6">
                {/* Gráfico de turnos últimos 7 días */}
                <ClientsChart barbero_id={barberoId} />

                {/* Cards de resumen y acceso rápido */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Turnos Semana"
                        value={loading ? '...' : totalTurnosSemana}
                        description="Últimos 7 días"
                        icon={Calendar}
                    />

                    <StatCard
                        title="Gestionar Barberos"
                        description="Ver y administrar barberos"
                        icon={Users}
                        onClick={() => navigate('/admin/barberos')}
                    />

                    <StatCard
                        title="Gestionar Servicios"
                        description="Ver y administrar servicios"
                        icon={Scissors}
                        onClick={() => navigate('/admin/servicios')}
                    />

                    <StatCard
                        title="Ver Agenda"
                        description="Gestionar turnos y reservas"
                        icon={Calendar}
                        onClick={() => navigate('/admin/turnos')}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

