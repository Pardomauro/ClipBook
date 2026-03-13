import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBarberoById } from "@/services/barberoService";
import { getServicios } from "@/services/servicioService";
import { getHorariosDisponibles, createTurno } from "@/services/turnoService";
import { SpinnerButton } from "@/components/Common";
import { Button } from "@/components/ui/button";
import { formatearFecha, esDiaLaboral, formatearFechaISO } from "@/utils/dateHelpers";

// Componentes
import { BarberoInfoHeader } from "@/components/Usuario";
import {
    CalendarioSelector,
    ServiciosSelector,
    HorariosDisponibles,
    FormularioCliente,
    TurnoReservadoAlert
} from "@/components/Turnos";

export default function ReservarTurnoPage() {
    const { barberoId } = useParams();
    const navigate = useNavigate();
    
    // Estados de datos
    const [barbero, setBarbero] = useState(null);
    const [servicios, setServicios] = useState([]);
    const [horarios, setHorarios] = useState([]);
    
    // Estados de selección
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
    
    // Estados de formulario de cliente
    const [datosCliente, setDatosCliente] = useState({
        nombre_completo: '',
        email: '',
        celular: '',
        direccion: ''
    });
    
    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [loadingHorarios, setLoadingHorarios] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [turnoCreado, setTurnoCreado] = useState(null);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    // Cargar barbero y servicios al montar
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Cargar barbero y servicios en paralelo
                const [barberoResponse, serviciosResponse] = await Promise.all([
                    getBarberoById(barberoId),
                    getServicios({ activo: 'true' })
                ]);
                
                setBarbero(barberoResponse.data || barberoResponse.barbero);
                setServicios(serviciosResponse.data || serviciosResponse.servicios || []);
            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError(err.message || 'Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };
        
        if (barberoId) {
            fetchData();
        }
    }, [barberoId]);

    // Cargar horarios disponibles cuando cambie fecha o servicio
    useEffect(() => {
        const fetchHorarios = async () => {
            if (!fechaSeleccionada || !servicioSeleccionado) {
                setHorarios([]);
                return;
            }
            
            try {
                setLoadingHorarios(true);
                const fechaISO = formatearFechaISO(fechaSeleccionada);
                const response = await getHorariosDisponibles(
                    barberoId,
                    fechaISO,
                    servicioSeleccionado.servicio_id
                );
                
                setHorarios(response.data?.horarios || response.horarios || []);
                setHorarioSeleccionado(null); // Reset horario cuando cambien los disponibles
            } catch (err) {
                console.error('Error al cargar horarios:', err);
                setHorarios([]);
            } finally {
                setLoadingHorarios(false);
            }
        };
        
        fetchHorarios();
    }, [fechaSeleccionada, servicioSeleccionado, barberoId]);

    // Handler para cambiar datos del cliente
    const handleClienteChange = (e) => {
        const { name, value } = e.target;
        setDatosCliente(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handler para confirmar reserva
    const handleConfirmarReserva = async () => {
        // Validaciones
        if (!datosCliente.nombre_completo.trim()) {
            alert('Por favor ingresa tu nombre completo');
            return;
        }
        if (!datosCliente.email.trim()) {
            alert('Por favor ingresa tu email');
            return;
        }
        if (!datosCliente.celular.trim()) {
            alert('Por favor ingresa tu celular');
            return;
        }
        
        try {
            setSubmitting(true);
            
            const datosTurno = {
                barbero_id: barberoId,
                servicio_id: servicioSeleccionado.servicio_id,
                fecha_turno: formatearFechaISO(fechaSeleccionada),
                hora_inicio: horarioSeleccionado,
                precio_final: servicioSeleccionado.precio_base,
                cliente: {
                    nombre_completo: datosCliente.nombre_completo.trim(),
                    email: datosCliente.email.trim().toLowerCase(),
                    celular: datosCliente.celular.trim(),
                    direccion: datosCliente.direccion.trim() || null
                }
            };
            
            const response = await createTurno(datosTurno);
            
            // Preparar datos para la alerta con toda la información
            const turnoConDetalles = {
                ...response.data || response.turno,
                fecha_turno: formatearFechaISO(fechaSeleccionada),
                hora_inicio: horarioSeleccionado,
                barbero: barbero,
                servicio: servicioSeleccionado,
                cliente: datosCliente,
                precio_final: servicioSeleccionado.precio_base
            };
            
            setTurnoCreado(turnoConDetalles);
            setMostrarAlerta(true);
            
        } catch (err) {
            console.error('Error al crear turno:', err);
            alert(err.message || 'Error al reservar el turno');
        } finally {
            setSubmitting(false);
        }
    };

    // Handler para cerrar alerta y volver al inicio
    const handleCerrarAlerta = () => {
        setMostrarAlerta(false);
        navigate('/');
    };

    // Deshabilitar días no laborales en el calendario
    const disabledDays = (date) => {
        return !esDiaLaboral(date);
    };

    // Estados de carga
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <SpinnerButton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
                <div className="text-center bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 shadow-xl shadow-black/40">
                    <p className="text-lg text-red-300 mb-4">Error: {error}</p>
                    <Button onClick={() => navigate('/')} className="bg-zinc-100 text-zinc-900 hover:bg-white">
                        Volver al inicio
                    </Button>
                </div>
            </div>
        );
    }

    if (!barbero) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
                <p className="text-lg text-zinc-300">Barbero no encontrado</p>
            </div>
        );
    }

    const puedeConfirmar = fechaSeleccionada && servicioSeleccionado && horarioSeleccionado && 
                          datosCliente.nombre_completo && datosCliente.email && datosCliente.celular;

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,212,216,0.08),transparent_50%)]" />
            <div className="relative max-w-4xl mx-auto">
                {/* Header con info del barbero */}
                <BarberoInfoHeader barbero={barbero} />

                {/* Grid con calendario y servicios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <CalendarioSelector
                        fechaSeleccionada={fechaSeleccionada}
                        onFechaChange={setFechaSeleccionada}
                        disabledDays={disabledDays}
                    />

                    <ServiciosSelector
                        servicios={servicios}
                        servicioSeleccionado={servicioSeleccionado}
                        onServicioChange={setServicioSeleccionado}
                    />
                </div>

                {/* Horarios disponibles */}
                {fechaSeleccionada && servicioSeleccionado && (
                    <HorariosDisponibles
                        horarios={horarios}
                        horarioSeleccionado={horarioSeleccionado}
                        onHorarioChange={setHorarioSeleccionado}
                        loading={loadingHorarios}
                        descripcion={`${formatearFecha(fechaSeleccionada)} - ${servicioSeleccionado.nombre_servicio}`}
                    />
                )}

                {/* Formulario de datos del cliente */}
                {horarioSeleccionado && (
                    <FormularioCliente
                        datosCliente={datosCliente}
                        onChange={handleClienteChange}
                    />
                )}

                {/* Botones de acción */}
                <div className="flex justify-between">
                    <Button variant="outline" onClick={() => navigate('/')} className="bg-gray-400/70 border-zinc-900 text-zinc-800 hover:bg-gray-600 hover:text-zinc-100">
                        Cancelar
                    </Button>
                    
                    {submitting ? (
                        <SpinnerButton />
                    ) : (
                        <Button
                            onClick={handleConfirmarReserva}
                            disabled={!puedeConfirmar}
                            size="lg"
                            className="bg-zinc-100 text-zinc-900 hover:bg-white disabled:opacity-50"
                        >
                            Confirmar Reserva
                        </Button>
                    )}
                </div>
            </div>

            {/* Alerta de turno reservado exitosamente */}
            {mostrarAlerta && turnoCreado && (
                <TurnoReservadoAlert
                    turnoData={turnoCreado}
                    onClose={handleCerrarAlerta}
                />
            )}
        </div>
    );
}