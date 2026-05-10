const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Barbero = require('../Models/Barbero/Barbero');
const sequelize = require('../Config/db');

/**
 * Convierte una imagen a base64
 * @param {string} imagePath - Ruta de la imagen
 * @returns {string} - Imagen en formato base64
 */
function imageToBase64(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const ext = path.extname(imagePath).slice(1).toLowerCase();
        const mimeType = ext === 'jpg' ? 'jpeg' : ext;
        return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
        console.error('❌ Error al convertir imagen a base64:', error.message);
        return null;
    }
}

/**
 * Datos de barberos iniciales para poblar la base de datos
 */
const barberosIniciales = [
    {
        nombre_completo: 'Carlos Martínez',
        email: 'carlos.martinez@barberia.com',
        celular: '+54 9 11 1234-5678',
        direccion: 'Av. Corrientes 1234, Buenos Aires',
        password: 'barbero123', // Será hasheada automáticamente por el hook
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

/**
 * Función principal para poblar la base de datos con barberos
 */
async function seedBarberos() {
    try {
        console.log('🚀 Iniciando seed de barberos...\n');

        // Verificar conexión a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida\n');

        // Ruta a la carpeta de imágenes de barberos en el frontend
        const imagenesPath = path.join(__dirname, '..', '..', '..', 'Frontend', 'frontBarberia', 'public', 'Barberos');
        
        // Verificar que la carpeta de imágenes existe
        if (!fs.existsSync(imagenesPath)) {
            console.warn('⚠️  La carpeta de imágenes no existe:', imagenesPath);
            console.log('Se usarán imágenes por defecto\n');
        }

        // Verificar si ya existen barberos
        const barberosExistentes = await Barbero.count();
        
        if (barberosExistentes > 0) {
            console.log(`ℹ️  Ya existen ${barberosExistentes} barbero(s) en la base de datos`);
            console.log('¿Desea continuar y agregar más barberos? (Este script no elimina los existentes)\n');
        }

        // Crear barberos
        let barberosCreados = 0;
        let barberosOmitidos = 0;

        for (const barberoData of barberosIniciales) {
            try {
                // Verificar si el barbero ya existe por email
                const barberoExistente = await Barbero.findOne({
                    where: { email: barberoData.email }
                });

                if (barberoExistente) {
                    console.log(`⏭️  Barbero omitido (ya existe): ${barberoData.nombre_completo} (${barberoData.email})`);
                    barberosOmitidos++;
                    continue;
                }

                // Preparar datos del barbero
                const datosBarbero = {
                    nombre_completo: barberoData.nombre_completo,
                    email: barberoData.email,
                    celular: barberoData.celular,
                    direccion: barberoData.direccion,
                    password: barberoData.password,
                    activo: barberoData.activo
                };

                // Intentar cargar y convertir la imagen a base64
                if (barberoData.imagenFile) {
                    const imagePath = path.join(imagenesPath, barberoData.imagenFile);
                    
                    if (fs.existsSync(imagePath)) {
                        const imagenBase64 = imageToBase64(imagePath);
                        if (imagenBase64) {
                            datosBarbero.imagen_url = imagenBase64;
                            console.log(`📷 Imagen cargada: ${barberoData.imagenFile}`);
                        }
                    } else {
                        console.log(`⚠️  Imagen no encontrada: ${barberoData.imagenFile} - Se usará imagen por defecto`);
                    }
                }

                // Crear el barbero
                const nuevoBarbero = await Barbero.create(datosBarbero);
                
                console.log(`✅ Barbero creado exitosamente:`);
                console.log(`   - ID: ${nuevoBarbero.barbero_id}`);
                console.log(`   - Nombre: ${nuevoBarbero.nombre_completo}`);
                console.log(`   - Email: ${nuevoBarbero.email}`);
                console.log(`   - Activo: ${nuevoBarbero.activo ? 'Sí' : 'No'}`);
                console.log(`   - Imagen: ${nuevoBarbero.imagen_url ? 'Cargada ✓' : 'Por defecto'}\n`);
                
                barberosCreados++;
            } catch (error) {
                console.error(`❌ Error al crear barbero ${barberoData.nombre_completo}:`, error.message);
                if (error.errors) {
                    error.errors.forEach(err => console.error(`   - ${err.message}`));
                }
                console.log('');
            }
        }

        // Resumen final
        console.log('═══════════════════════════════════════════════════');
        console.log('📊 RESUMEN DEL SEED');
        console.log('═══════════════════════════════════════════════════');
        console.log(`✅ Barberos creados: ${barberosCreados}`);
        console.log(`⏭️  Barberos omitidos (ya existían): ${barberosOmitidos}`);
        console.log(`📊 Total en base de datos: ${await Barbero.count()}`);
        console.log('═══════════════════════════════════════════════════\n');

        if (barberosCreados > 0) {
            console.log('💡 CREDENCIALES DE ACCESO:');
            console.log('   Email: carlos.martinez@barberia.com');
            console.log('   Password: barbero123\n');
        }

        console.log('✨ Seed completado exitosamente');
        
    } catch (error) {
        console.error('❌ Error fatal durante el seed:', error);
        throw error;
    } finally {
        // Cerrar conexión
        await sequelize.close();
        console.log('🔌 Conexión a la base de datos cerrada');
    }
}

// Ejecutar el seed si el script se ejecuta directamente
if (require.main === module) {
    seedBarberos()
        .then(() => {
            console.log('\n🎉 Proceso finalizado correctamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 El proceso finalizó con errores:', error);
            process.exit(1);
        });
}

module.exports = seedBarberos;
