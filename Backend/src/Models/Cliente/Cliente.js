const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../Config/db');

class Cliente extends Model { }

Cliente.init({
    cliente_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nombre_completo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre completo es obligatorio'
            },
            len: {
                args: [3, 100],
                msg: 'El nombre debe tener entre 3 y 100 caracteres'
            }
        }
    },
    celular: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El celular es obligatorio'
            },
            is: {
                args: /^[0-9+\s()-]+$/,
                msg: 'El celular debe contener solo números y caracteres válidos'
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            args: true,
            msg: 'Este email ya está registrado'
        },
        validate: {
            isEmail: {
                msg: 'Debe proporcionar un email válido'
            },
            notEmpty: {
                msg: 'El email es obligatorio'
            }
        }
    }
}, {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Cliente;
