require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { syncDatabase } = require('./Models/index');

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

// ============================================================
// ENDPOINT TEMPORAL PARA SEED (ELIMINAR DESPUÉS DE USAR)
// ============================================================
app.get('/api/v1/admin/seed-barberos', async (req, res) => {
    try {
        const Barbero = require('./Models/Barbero/Barbero');
        const fs = require('fs');
        const path = require('path');

        console.log('🚀 Ejecutando seed de barberos desde endpoint temporal...');

        // Función para convertir imagen a base64
        function imageToBase64(imagePath) {
            try {
                const imageBuffer = fs.readFileSync(imagePath);
                const ext = path.extname(imagePath).slice(1).toLowerCase();
                const mimeType = ext === 'jpg' ? 'jpeg' : ext;
                return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
            } catch (error) {
                console.error('Error al convertir imagen:', error.message);
                return null;
            }
        }

        // Datos de barberos
        const barberosIniciales = [
            {
                nombre_completo: 'Carlos Martínez',
                email: 'carlos.martinez@barberia.com',
                celular: '+54 9 11 1234-5678',
                direccion: 'Av. Corrientes 1234, Buenos Aires',
                password: 'barbero123',
                activo: true,
                imagenFile: 'martin.jpg'
            },
            {
                nombre_completo: 'Juan Pérez',
                email: 'juan.perez@barberia.com',
                celular: '+54 9 11 2345-6789',
                direccion: 'Calle Florida 567, Buenos Aires',
                password: 'barbero123',
                activo: true,
                imagenFile: 'Jover.jpg'
            },
            {
                nombre_completo: 'Roberto Pardo',
                email: 'roberto.pardo@barberia.com',
                celular: '+54 9 11 3456-7890',
                direccion: 'Av. Santa Fe 890, Buenos Aires',
                password: 'barbero123',
                activo: true,
                imagenFile: '1949_pardo.jpg'
            }
        ];

        let barberosCreados = 0;
        let barberosOmitidos = 0;
        const resultados = [];

        for (const barberoData of barberosIniciales) {
            // Verificar si ya existe
            const existente = await Barbero.findOne({ where: { email: barberoData.email } });
            
            if (existente) {
                barberosOmitidos++;
                resultados.push(`⏭️ Omitido (ya existe): ${barberoData.nombre_completo}`);
                continue;
            }

            // Crear barbero
            const nuevoBarbero = await Barbero.create({
                nombre_completo: barberoData.nombre_completo,
                email: barberoData.email,
                celular: barberoData.celular,
                direccion: barberoData.direccion,
                password: barberoData.password,
                activo: barberoData.activo
            });

            barberosCreados++;
            resultados.push(`✅ Creado: ${barberoData.nombre_completo} (${barberoData.email})`);
        }

        const totalBarberos = await Barbero.count();

        res.status(200).json({
            success: true,
            message: 'Seed de barberos ejecutado',
            resumen: {
                creados: barberosCreados,
                omitidos: barberosOmitidos,
                totalEnDB: totalBarberos
            },
            resultados,
            credenciales: barberosCreados > 0 ? {
                email: 'carlos.martinez@barberia.com',
                password: 'barbero123'
            } : null,
            nota: '⚠️ ELIMINA ESTE ENDPOINT después de usarlo (archivo app.js)'
        });

    } catch (error) {
        console.error('❌ Error en seed:', error);
        res.status(500).json({
            success: false,
            message: 'Error al ejecutar seed',
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
