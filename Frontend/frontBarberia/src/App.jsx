import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// =============================================
// IMPORTS DE PÁGINAS PÚBLICAS
// =============================================
import HomePage from '@/pages/Public/HomePage'
import ReservarTurnoPage from '@/pages/Public/ReservarTurnoPage'
// import ConfirmacionPage from '@/pages/Public/ConfirmacionPage'

// =============================================
// IMPORTS DE PÁGINAS ADMIN
// =============================================
import LoginPage from '@/pages/Admin/LoginPage'
import DashboardPage from '@/pages/Admin/DashboardPage'
import BarberosPage from '@/pages/Admin/BarberosPage'
import ServiciosPage from '@/pages/Admin/ServiciosPage'
import TurnosPage from '@/pages/Admin/TurnosPage'
import PerfilPage from '@/pages/Admin/PerfilPage'
import EstadisticasPage from '@/pages/Admin/EstadisticasPage'
import AgregarCorte from '@/pages/Admin/AgregarCorte'

// =============================================
// COMPONENTE DE PROTECCIÓN DE RUTAS
// =============================================
import ProtectedRoute from '@/components/Common/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* ===================================== */}
        {/* RUTAS PÚBLICAS (Sin autenticación)    */}
        {/* ===================================== */}
        
        {/* Página principal - Lista de barberos */}
        <Route path="/" element={<HomePage />} />
        
        {/* Página de reservar turno con un barbero específico */}
        <Route path="/reservar/:barberoId" element={<ReservarTurnoPage />} />
        
        {/* Página de confirmación después de reservar */}
        {/* <Route path="/confirmacion/:turnoId" element={<ConfirmacionPage />} /> */}

        {/* ===================================== */}
        {/* RUTAS ADMIN (Con autenticación)       */}
        {/* ===================================== */}
        
        {/* Login de administrador (público para que puedan entrar) */}
        <Route path="/admin/login" element={<LoginPage />} />
        
        {/* Rutas protegidas - Solo accesibles con autenticación */}
        <Route element={<ProtectedRoute />}>
          {/* Panel de administrador */}
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          
          {/* Gestión de barberos */}
          <Route path="/admin/barberos" element={<BarberosPage />} />
          
          {/* Gestión de servicios */}
          <Route path="/admin/servicios" element={<ServiciosPage />} />
          
          {/* Gestión de turnos */}
          <Route path="/admin/turnos" element={<TurnosPage />} />

          {/* Agregar corte por orden de llegada */}
          <Route path="/admin/agregar-corte" element={<AgregarCorte />} />

          {/* Mi perfil */}
          <Route path="/admin/perfil" element={<PerfilPage />} />

          {/* Estadísticas */}
          <Route path="/admin/estadisticas" element={<EstadisticasPage />} />
        </Route>

        {/* Redirigir /admin a /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* ===================================== */}
        {/* RUTA 404 - No encontrada              */}
        {/* ===================================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
