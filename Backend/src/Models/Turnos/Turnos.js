const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../Config/db');

class Turno extends Model { }

Turno.init({
    turno_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    cliente_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'clientes',
            key: 'cliente_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'ID del cliente que reservó el turno'
    },
    barbero_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'barberos',
            key: 'barbero_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'ID del barbero asignado al turno'
    },
    servicio_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'servicios',
            key: 'servicio_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'ID del servicio a realizar'
    },
    fecha_turno: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La fecha del turno es obligatoria'
            },
            isDate: {
                msg: 'Debe proporcionar una fecha válida'
            },
            isFutureOrToday(value) {
                // Obtener fecha de hoy en formato YYYY-MM-DD (zona horaria local)
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                const todayStr = `${year}-${month}-${day}`;
                
                // Comparar como strings (formato YYYY-MM-DD es lexicográficamente ordenable)
                if (value < todayStr) {
                    throw new Error('No se pueden reservar turnos en fechas pasadas');
                }
            }
        }
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La hora de inicio es obligatoria'
            },
            isValidTime(value) {
                const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
                if (!timeRegex.test(value)) {
                    throw new Error('El formato de hora debe ser HH:MM:SS');
                }
            }
        }
    },
    precio_final: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El precio final es obligatorio'
            },
            isDecimal: {
                msg: 'El precio debe ser un número válido'
            },
            min: {
                args: [0],
                msg: 'El precio debe ser mayor o igual a 0'
            }
        },
        comment: 'Precio final del servicio (puede incluir descuentos o recargos)'
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'confirmado', 'finalizado', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendiente',
        validate: {
            isIn: {
                args: [['pendiente', 'confirmado', 'finalizado', 'cancelado']],
                msg: 'El estado debe ser: pendiente, confirmado, finalizado o cancelado'
            }
        }
    }
}, {
    sequelize,
    modelName: 'Turno',
    tableName: 'turnos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['fecha_turno', 'barbero_id'],
            name: 'idx_fecha_barbero'
        },
        {
            fields: ['cliente_id'],
            name: 'idx_cliente'
        },
        {
            fields: ['estado'],
            name: 'idx_estado'
        },
        {
            fields: ['barbero_id', 'fecha_turno', 'hora_inicio', 'estado'],
            name: 'idx_barbero_fecha_hora_estado',
            comment: 'Índice para búsquedas de disponibilidad'
        }
    ]
});

module.exports = Turno;
