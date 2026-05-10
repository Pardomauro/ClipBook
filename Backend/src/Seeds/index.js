const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const seedBarberos = require('./seedBarberos');
const sequelize = require('../Config/db');

/**
 * Script maestro para ejecutar todos los seeds de la base de datos
 * Ejecuta los seeds en el orden correcto respetando las dependencias
 */
async function runAllSeeds() {
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║                                                    ║');
    console.log('║      🌱 INICIALIZACIÓN DE BASE DE DATOS 🌱        ║');
    console.log('║                                                    ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    try {
        // Verificar conexión a la base de datos
        console.log('🔍 Verificando conexión a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida correctamente\n');

        // Verificar que las tablas existen
        console.log('🔍 Verificando tablas de la base de datos...');
        try {
            const [tables] = await sequelize.query("SHOW TABLES");
            if (tables.length === 0) {
                console.error('❌ Error: No se encontraron tablas en la base de datos');
                console.log('💡 Sugerencia: Ejecuta primero la sincronización de la base de datos');
                console.log('   Puedes hacerlo iniciando la aplicación o usando sequelize.sync()\n');
                process.exit(1);
            }
            console.log(`✅ Se encontraron ${tables.length} tabla(s)\n`);
        } catch (error) {
            console.warn('⚠️  No se pudo verificar las tablas, continuando...\n');
        }

        // Array de seeds a ejecutar en orden
        const seeds = [
            {
                name: 'Barberos',
                fn: seedBarberos,
                description: 'Crea barberos iniciales con imágenes'
            }
            // Aquí se pueden agregar más seeds en el futuro:
            // { name: 'Servicios', fn: seedServicios, description: '...' },
            // { name: 'Clientes', fn: seedClientes, description: '...' },
        ];

        console.log('📋 Seeds a ejecutar:\n');
        seeds.forEach((seed, index) => {
            console.log(`   ${index + 1}. ${seed.name} - ${seed.description}`);
        });
        console.log('\n' + '─'.repeat(52) + '\n');

        // Ejecutar cada seed
        let completados = 0;
        let fallidos = 0;

        for (const seed of seeds) {
            try {
                console.log(`▶️  Ejecutando seed: ${seed.name}...`);
                await seed.fn();
                console.log(`✅ Seed ${seed.name} completado\n`);
                completados++;
            } catch (error) {
                console.error(`❌ Error en seed ${seed.name}:`, error.message);
                fallidos++;
            }
        }

        // Resumen final
        console.log('\n' + '═'.repeat(52));
        console.log('📊 RESUMEN GENERAL');
        console.log('═'.repeat(52));
        console.log(`✅ Seeds completados: ${completados}/${seeds.length}`);
        console.log(`❌ Seeds fallidos: ${fallidos}/${seeds.length}`);
        console.log('═'.repeat(52) + '\n');

        if (fallidos === 0) {
            console.log('🎉 ¡Todos los seeds se ejecutaron exitosamente!');
            console.log('💡 Tu base de datos está lista para usar\n');
        } else {
            console.log('⚠️  Algunos seeds fallaron. Revisa los errores arriba.\n');
        }

    } catch (error) {
        console.error('❌ Error fatal durante la inicialización:', error.message);
        process.exit(1);
    } finally {
        // Cerrar conexión (si no fue cerrada por los seeds individuales)
        if (sequelize) {
            try {
                await sequelize.close();
                console.log('🔌 Conexión a la base de datos cerrada');
            } catch (error) {
                // Ignorar errores al cerrar si ya estaba cerrada
            }
        }
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    runAllSeeds()
        .then(() => {
            console.log('\n✨ Proceso de inicialización finalizado\n');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Error fatal:', error);
            process.exit(1);
        });
}

module.exports = runAllSeeds;