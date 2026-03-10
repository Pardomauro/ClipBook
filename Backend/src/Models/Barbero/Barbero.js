const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../Config/db');
const bcrypt = require('bcryptjs');

class Barbero extends Model {
    /**
     * Método para comparar contraseña ingresada con la hasheada
     * @param {String} passwordIngresado - Contraseña en texto plano
     * @returns {Promise<Boolean>} True si coincide, false si no
     */
    async compararPassword(passwordIngresado) {
        return await bcrypt.compare(passwordIngresado, this.password);
    }
}

Barbero.init({
    barbero_id: {
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
    direccion: {
        type: DataTypes.STRING(200),
        allowNull: true,
        validate: {
            len: {
                args: [5, 200],
                msg: 'La dirección debe tener entre 5 y 200 caracteres'
            }
        }
    },
    imagen_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'https://via.placeholder.com/300x300.png?text=Barbero',
        validate: {
            isValidImage(value) {
                if (value && value.trim()) {
                    // Permitir URLs normales o base64
                    const isUrl = /^https?:\/\/.+/.test(value);
                    const isBase64 = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(value);
                    
                    if (!isUrl && !isBase64) {
                        throw new Error('Debe proporcionar una URL válida o una imagen en base64');
                    }
                }
            }
        },
        comment: 'URL o base64 de la imagen del barbero para mostrar en el frontend'
    },
    activo: { 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Indica si el barbero está activo y disponible para turnos'
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña es obligatoria'
            },
            len: {
                args: [6, 255],
                msg: 'La contraseña debe tener al menos 6 caracteres'
            }
        },
        comment: 'Contraseña hasheada del barbero para login'
    }
}, {
    sequelize,
    modelName: 'Barbero',
    tableName: 'barberos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        /**
         * Hook: Hashear contraseña antes de crear un barbero
         */
        beforeCreate: async (barbero) => {
            if (barbero.password) {
                const salt = await bcrypt.genSalt(10);
                barbero.password = await bcrypt.hash(barbero.password, salt);
            }
        },
        /**
         * Hook: Hashear contraseña antes de actualizar si cambió
         */
        beforeUpdate: async (barbero) => {
            if (barbero.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                barbero.password = await bcrypt.hash(barbero.password, salt);
            }
        }
    }
});

module.exports = Barbero;
