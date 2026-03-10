const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../Config/db');

class Servicio extends Model { }

Servicio.init({
    servicio_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nombre_servicio: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            args: true,
            msg: 'Este servicio ya existe'
        },
        validate: {
            notEmpty: {
                msg: 'El nombre del servicio es obligatorio'
            },
            len: {
                args: [3, 100],
                msg: 'El nombre del servicio debe tener entre 3 y 100 caracteres'
            }
        }
    },
    precio_base: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El precio base es obligatorio'
            },
            isDecimal: {
                msg: 'El precio debe ser un número válido'
            },
            min: {
                args: [0],
                msg: 'El precio debe ser mayor o igual a 0'
            }
        }
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Duración del servicio en minutos',
        validate: {
            notEmpty: {
                msg: 'La duración es obligatoria'
            },
            isInt: {
                msg: 'La duración debe ser un número entero'
            },
            min: {
                args: [15],
                msg: 'La duración mínima es 15 minutos'
            },
            max: {
                args: [240],
                msg: 'La duración máxima es 240 minutos (4 horas)'
            }
        }
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Indica si el servicio está disponible para ser seleccionado'
    }
}, {
    sequelize,
    modelName: 'Servicio',
    tableName: 'servicios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Servicio;
