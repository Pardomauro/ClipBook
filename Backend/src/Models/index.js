const sequelize = require('../Config/db');

// Importar todos los modelos
const Cliente = require('./Cliente/Cliente');
const Barbero = require('./Barbero/Barbero');
const Servicio = require('./Servicio/Servicio');
const Turno = require('./Turnos/Turnos');

// ============================================================
// DEFINICIÓN DE ASOCIACIONES / RELACIONES
// ============================================================

// Relación: Cliente -> Turnos (1:N)
// Un cliente puede tener muchos turnos
Cliente.hasMany(Turno, {
    foreignKey: 'cliente_id',
    as: 'turnos',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Turno.belongsTo(Cliente, {
    foreignKey: 'cliente_id',
    as: 'cliente',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

// Relación: Barbero -> Turnos (1:N)
// Un barbero puede tener muchos turnos
Barbero.hasMany(Turno, {
    foreignKey: 'barbero_id',
    as: 'turnos',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Turno.belongsTo(Barbero, {
    foreignKey: 'barbero_id',
    as: 'barbero',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

// Relación: Servicio -> Turnos (1:N)
// Un servicio puede estar en muchos turnos
Servicio.hasMany(Turno, {
    foreignKey: 'servicio_id',
    as: 'turnos',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Turno.belongsTo(Servicio, {
    foreignKey: 'servicio_id',
    as: 'servicio',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

// ============================================================
// SINCRONIZACIÓN DE BASE DE DATOS
// ============================================================

/**
 * Sincroniza todos los modelos con la base de datos
 * @param {Object} options - Opciones de sincronización
 * @param {boolean} options.force - Si es true, elimina y recrea todas las tablas (¡CUIDADO en producción!)
 * @param {boolean} options.alter - Si es true, modifica las tablas existentes para que coincidan con los modelos
 * @param {boolean} options.checkFirst - Si es true, verifica si las tablas existen antes de sincronizar
 */
const syncDatabase = async (options = {}) => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente');

        // Si checkFirst está activado, verifica si las tablas ya existen
        if (options.checkFirst) {
            const [results] = await sequelize.query("SHOW TABLES LIKE 'clientes'");
            
            if (results.length > 0) {
                console.log('Las tablas ya existen, no se realizará sincronización');
                return;
            } else {
                console.log('Las tablas no existen, creándolas...');
            }
        }

        await sequelize.sync(options);
        
        if (options.force) {
            console.log('⚠️  Base de datos sincronizada con FORCE (tablas recreadas)');
        } else if (options.alter) {
            console.log('✅ Base de datos sincronizada con ALTER (tablas modificadas)');
        } else {
            console.log('✅ Base de datos sincronizada exitosamente');
        }
    } catch (error) {
        console.error('❌ Error al sincronizar la base de datos:', error);
        throw error;
    }
};

// ============================================================
// EXPORTACIONES
// ============================================================

module.exports = {
    sequelize,
    Cliente,
    Barbero,
    Servicio,
    Turno,
    syncDatabase
};
