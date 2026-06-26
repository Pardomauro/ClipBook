// Cargar dotenv PRIMERO antes de cualquier cosa
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { v2: cloudinary } = require('cloudinary');

// Validar que las variables de entorno existan
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Error: Variables de Cloudinary no configuradas en .env');
    console.log('Verifica que existan:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'FALTA',
        api_key: process.env.CLOUDINARY_API_KEY || 'FALTA',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'EXISTE' : 'FALTA'
    });
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ,
    secure: true
}); 

module.exports = cloudinary;
