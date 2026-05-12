require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { syncDatabase } = require('./Models/index');
const sequelize = require('./Config/db');

// Importar rutas
const clienteRoutes = require('./Routes/Cliente/clienteRoutes');
const barberoRoutes = require('./Routes/Barbero/barberoRoutes');
const servicioRoutes = require('./Routes/Servicio/servicioRoutes');
const turnosRoutes = require('./Routes/Turnos/turnosroutes');
const authRoutes = require('./Routes/Auth/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARES
// ============================================================
// Configuración de CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Aumentar límite para permitir imágenes en base64 (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// RUTAS
// ============================================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clientes', clienteRoutes);
app.use('/api/v1/barberos', barberoRoutes);
app.use('/api/v1/servicios', servicioRoutes);
app.use('/api/v1/turnos', turnosRoutes);

// Ruta de prueba
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API de Barbería funcionando correctamente',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: '/api/v1/auth',
            clientes: '/api/v1/clientes',
            barberos: '/api/v1/barberos',
            servicios: '/api/v1/servicios',
            turnos: '/api/v1/turnos'
        }
    });
});



// ENDPOINT TEMPORAL PARA MIGRACIÓN DE IMAGEN_URL
app.get('/api/v1/admin/fix-imagen-column', async (req, res) => {
    try {
        console.log('🔧 Ejecutando migración de columna imagen_url...');

        // Ejecutar ALTER TABLE para cambiar el tipo de columna
        await sequelize.query(`
            ALTER TABLE barberos 
            MODIFY COLUMN imagen_url LONGTEXT
        `);

        console.log('✅ Columna imagen_url actualizada a LONGTEXT');

        res.status(200).json({
            success: true,
            message: 'Migración ejecutada exitosamente',
            detalle: 'La columna imagen_url ahora soporta imágenes grandes (LONGTEXT)',
            nota: '⚠️ ELIMINA ESTE ENDPOINT después de usarlo (archivo app.js)'
        });

    } catch (error) {
        console.error('❌ Error en migración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al ejecutar migración',
            error: error.message
        });
    }
});
// ============================================================

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// ============================================================
// INICIALIZACIÓN DEL SERVIDOR
// ============================================================
const startServer = async () => {
    try {
        // Sincronizar base de datos
        // Opciones disponibles:
        // {} - Solo crea tablas si NO existen (no modifica existentes)
        // { alter: true } - Modifica tablas existentes para que coincidan con modelos
        // { force: true } - ELIMINA y recrea todas las tablas (¡CUIDADO!)
        // { checkFirst: true } - Verifica si existen antes de sincronizar (no hace nada si ya existen)
        
        await syncDatabase({ checkFirst: true });
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`\n🚀 Servidor corriendo en el puerto ${PORT}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`🏥 Health check: http://localhost:${PORT}/api/v1/health`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
