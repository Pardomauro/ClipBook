const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '../../../.env')
});

const dns = require('dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');


const { format } = require('date-fns');
const { es } = require('date-fns/locale');

// Función para verificar la conexión del transportador de Nodemailer
const verificarConexion = async () => {
    try {
        await transporter.verify();
        console.log('✅ Servicio de email configurado correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error al verificar el servicio de email:', error.message);
        return false;
    }
};



// Configuración del transportador de Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'false', // true para 465, false para otros puertos
    family: 4, // <-- Le prohíbe explícitamente tocar IPv6
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    },
    connectionTimeout: 30000, // 30 segundos (aumentado)
    greetingTimeout: 30000,   // 30 segundos (aumentado)
    socketTimeout: 30000,     // 30 segundos (aumentado)
    pool: true,               // Usar pool de conexiones
    maxConnections: 5,        // Máximo 5 conexiones simultáneas
    maxMessages: 100          // Máximo 100 mensajes por conexión
});

// Función para enviar correos electrónicos con reintentos
const enviarCorreo = async ({ destinatario, asunto, contenidoHTML }, intentos = 3) => {
    for (let i = 0; i < intentos; i++) {
        try {
            const opcionesCorreo = {
                from: `"El Rey Barber" <${process.env.EMAIL_USER}>`,
                to: destinatario,
                subject: asunto,
                html: contenidoHTML
            };

            const info = await transporter.sendMail(opcionesCorreo);
            console.log(`✅ Email enviado a ${destinatario} (Intento ${i + 1})`);
            return info;
        } catch (error) {
            console.error(`❌ Error al enviar email a ${destinatario} (Intento ${i + 1}):`, error.message);
            if (i === intentos - 1) {
                throw new Error(`Error al enviar email a ${destinatario} después de ${intentos} intentos: ${error.message}`);
            }

            // Esperar 2 segundos antes de reintentar
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

// Configuración del remitente
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ponce.ap.332@gmail.com';
const BARBERIA_NOMBRE = process.env.BARBERIA_NOMBRE || 'El Rey Barber';
const BARBERIA_DIRECCION = process.env.BARBERIA_DIRECCION || 'Av. Bulnes 2676';
const BARBERIA_TELEFONO = process.env.BARBERIA_TELEFONO || '351 740-4322';




/**
 * Enviar email de confirmación de turno al cliente
 * @param {Object} turno - Turno con todas sus relaciones (cliente, barbero, servicio)
 * @returns {Promise<Object>} Resultado del envío
 */
const enviarEmailConfirmacionTurno = async (turno) => {

    // Formatear fecha y hora
    const fechaFormateada = format(new Date(turno.fecha_turno + 'T00:00:00'), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
    const horaInicio = turno.hora_inicio.substring(0, 5); // HH:MM

    // Calcular hora de fin
    const duracionMinutos = turno.servicio.duracion;
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + duracionMinutos;
    const horaFin = `${String(Math.floor(totalMinutos / 60)).padStart(2, '0')}:${String(totalMinutos % 60).padStart(2, '0')}`;

    try {
        await enviarCorreo({
            destinatario: turno.cliente.email,
            asunto: `Turno Confirmado - ${BARBERIA_NOMBRE}`,
            contenidoHTML:
                `
            <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f9fafb;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
        }
        .header {
            background-color: #18181b;
            color: #ffffff;
            padding: 24px;
            text-align: center;
            border-bottom: 1px solid #27272a;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 32px 24px;
        }
        .content p {
            margin: 0 0 16px 0;
            color: #374151;
        }
        .info-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 16px;
            margin: 24px 0;
        }
        .info-row {
            padding: 8px 0;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            color: #6b7280;
            font-size: 14px;
        }
        .info-value {
            color: #1f2937;
            font-weight: 500;
            font-size: 14px;
            text-align: right;
        }
        .footer {
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${BARBERIA_NOMBRE}</h1>
        </div>
        
        <div class="content">
            <p>Hola <strong>${turno.cliente.nombre_completo}</strong>,</p>
            <p>Tu turno ha sido confirmado.</p>
            
            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Fecha: </span>
                    <span class="info-value"> ${fechaFormateada}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Hora: </span>
                    <span class="info-value"> ${horaInicio} hs</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Servicio: </span>
                    <span class="info-value"> ${turno.servicio.nombre_servicio}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Profesional: </span>
                    <span class="info-value"> ${turno.barbero.nombre_completo}</span>
                </div>
            </div>
            
        </div>
        
        <div class="footer">
            <p style="margin: 0;">${BARBERIA_NOMBRE} • ${BARBERIA_TELEFONO}</p>
        </div>
    </div>
</body>
</html>
        `,
        });
        return true;
    } catch (error) {
        console.error('Error al enviar correo de confirmación:', error);
        return false;
    }
};




/** 
 * Enviar email al administrador cuando se crea un nuevo turno
 * @param {Object} turno - Turno con todas sus relaciones (cliente, barbero, servicio)
 * @returns {Promise<Object>} Resultado del envío
*/
const enviarEmailNuevoTurnoAdmin = async (turno) => {
    // Formatear fecha y hora
    const fechaFormateada = format(new Date(turno.fecha_turno + 'T00:00:00'), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
    const horaInicio = turno.hora_inicio.substring(0, 5); // HH:MM

    // Calcular hora de fin
    const duracionMinutos = turno.servicio.duracion;
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + duracionMinutos;
    const horaFin = `${String(Math.floor(totalMinutos / 60)).padStart(2, '0')}:${String(totalMinutos % 60).padStart(2, '0')}`;

    try {
        await enviarCorreo({
            destinatario: ADMIN_EMAIL,
            asunto: `Nuevo Turno - ${BARBERIA_NOMBRE}`,
            contenidoHTML:
                `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f9fafb;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
        }
        .header {
            background-color: #18181b;
            color: #ffffff;
            padding: 24px;
            text-align: center;
            border-bottom: 1px solid #27272a;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.5px;
        }
        .badge {
            display: inline-block;
            background-color: #10b981;
            color: #ffffff;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            margin-top: 8px;
        }
        .content {
            padding: 32px 24px;
        }
        .content p {
            margin: 0 0 16px 0;
            color: #374151;
        }
        .info-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 16px;
            margin: 24px 0;
        }
        .info-row {
            padding: 8px 0;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            color: #6b7280;
            font-size: 14px;
        }
        .info-value {
            color: #1f2937;
            font-weight: 500;
            font-size: 14px;
            text-align: right;
        }
        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
            margin: 20px 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .footer {
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${BARBERIA_NOMBRE}</h1>
            <div class="badge">NUEVO TURNO</div>
        </div>
        
        <div class="content">
            <p>Hola Administrador,</p>
            <p>Se ha registrado un nuevo turno en el sistema.</p>
            
            <div class="section-title">Información del Turno</div>
            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Fecha: </span>
                    <span class="info-value"> ${fechaFormateada}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Hora: </span>
                    <span class="info-value"> ${horaInicio} - ${horaFin} hs</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Servicio: </span>
                    <span class="info-value"> ${turno.servicio.nombre_servicio}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Profesional: </span>
                    <span class="info-value"> ${turno.barbero.nombre_completo}</span>
                </div>
            </div>
            
            <div class="section-title">Información del Cliente</div>
            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Nombre: </span>
                    <span class="info-value"> ${turno.cliente.nombre_completo}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email: </span>
                    <span class="info-value"> ${turno.cliente.email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Teléfono: </span>
                    <span class="info-value"> ${turno.cliente.telefono || 'No registrado'}</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p style="margin: 0;">Sistema de Gestión - ${BARBERIA_NOMBRE}</p>
        </div>
    </div>
</body>
</html>
        `,
        })
        return true;
    } catch (error) {
        console.error('Error al enviar correo de confirmación:', error);
        return false;
    }
};



/**
 * Enviar email de cancelación de turno al cliente
 * @param {Object} turno - Turno cancelado con todas sus relaciones
 * @returns {Promise<Object>} Resultado del envío
 */
const enviarEmailCancelacionTurno = async (turno) => {
    const fechaFormateada = format(new Date(turno.fecha_turno + 'T00:00:00'), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
    const horaInicio = turno.hora_inicio.substring(0, 5);

    try {
        await enviarCorreo({
            destinatario: turno.cliente.email,
            asunto: `Turno Cancelado - ${BARBERIA_NOMBRE}`,
            contenidoHTML:
                `

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f9fafb;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
        }
        .header {
            background-color: #18181b;
            color: #ffffff;
            padding: 24px;
            text-align: center;
            border-bottom: 1px solid #27272a;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 32px 24px;
        }
        .content p {
            margin: 0 0 16px 0;
            color: #374151;
        }
        .info-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 16px;
            margin: 24px 0;
        }
        .info-row {
            padding: 8px 0;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            color: #6b7280;
            font-size: 14px;
        }
        .info-value {
            color: #1f2937;
            font-weight: 500;
            font-size: 14px;
            text-align: right;
        }
        .footer {
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${BARBERIA_NOMBRE}</h1>
        </div>
        
        <div class="content">
            <p>Hola <strong>${turno.cliente.nombre_completo}</strong>,</p>
            <p>Tu turno ha sido cancelado.</p>
            
            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Fecha: </span>
                    <span class="info-value"> ${fechaFormateada}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Hora: </span>
                    <span class="info-value"> ${horaInicio} hs</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Servicio: </span>
                    <span class="info-value"> ${turno.servicio.nombre_servicio}</span>
                </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">Puedes agendar un nuevo turno cuando lo desees.</p>
        </div>
        
        <div class="footer">
            <p style="margin: 0;">${BARBERIA_NOMBRE} • ${BARBERIA_TELEFONO}</p>
        </div>
    </div>
</body>
</html>
        `,
    })

        return true;
    } catch (error) {
        console.error('Error al enviar correo de confirmación:', error);
        return false;
    }
};


// Verificar la conexión al iniciar el servicio
verificarConexion().catch(err => {
    console.warn('⚠️  El servicio de email no está disponible. Los correos no se enviarán.');
});

module.exports = {
    enviarEmailConfirmacionTurno,
    enviarEmailCancelacionTurno,
    enviarEmailNuevoTurnoAdmin,

};