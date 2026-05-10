require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const path = require('path');
const { Resend } = require('resend');
const { format } = require('date-fns');
const { es } = require('date-fns/locale');

// Debug: Verificar que la API key se cargó correctamente
if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  WARNING: RESEND_API_KEY no está configurada en .env');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración del remitente
// IMPORTANTE: Con cuenta gratuita de Resend, usar 'onboarding@resend.dev'
// Para usar tu email, verifica tu dominio en https://resend.com/domains
const FROM_EMAIL = 'onboarding@resend.dev';
const BARBERIA_NOMBRE = 'BarberShop';
const BARBERIA_DIRECCION = 'Av. Principal 123, Ciudad';
const BARBERIA_TELEFONO = '+54 9 11 1234-5678';

console.log('📧 Servicio de Email inicializado con FROM_EMAIL:', FROM_EMAIL);

/**
 * Enviar email de confirmación de turno al cliente
 * @param {Object} turno - Turno con todas sus relaciones (cliente, barbero, servicio)
 * @returns {Promise<Object>} Resultado del envío
 */
const enviarEmailConfirmacionTurno = async (turno) => {
    try {
        // Formatear fecha y hora
        const fechaFormateada = format(new Date(turno.fecha_turno + 'T00:00:00'), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
        const horaInicio = turno.hora_inicio.substring(0, 5); // HH:MM
        
        // Calcular hora de fin
        const duracionMinutos = turno.servicio.duracion;
        const [horas, minutos] = horaInicio.split(':').map(Number);
        const totalMinutos = horas * 60 + minutos + duracionMinutos;
        const horaFin = `${String(Math.floor(totalMinutos / 60)).padStart(2, '0')}:${String(totalMinutos % 60).padStart(2, '0')}`;

        const emailHTML = `
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
        `;

        console.log(`📤 Intentando enviar email de confirmación a: ${turno.cliente.email}`);
        console.log(`📤 Remitente: ${FROM_EMAIL}`);
        
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to: turno.cliente.email,
            subject: `Turno Confirmado - ${BARBERIA_NOMBRE}`,
            html: emailHTML
        });

        if (!result || !result.data) {
            console.error('⚠️  Respuesta inesperada de Resend:', result);
            throw new Error('Respuesta inválida del servicio de email');
        }

        console.log(`✅ Email de confirmación enviado exitosamente`);
        console.log(`   → Destinatario: ${turno.cliente.email}`);
        console.log(`   → ID: ${result.data.id}`);
        
        return result;
    } catch (error) {
        console.error('❌ Error al enviar email de confirmación:', error.message);
        if (error.response) {
            console.error('   → Respuesta del servidor:', error.response.data);
        }
        throw error;
    }
};

/**
 * Enviar email de cancelación de turno al cliente
 * @param {Object} turno - Turno cancelado con todas sus relaciones
 * @returns {Promise<Object>} Resultado del envío
 */
const enviarEmailCancelacionTurno = async (turno) => {
    try {
        const fechaFormateada = format(new Date(turno.fecha_turno + 'T00:00:00'), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
        const horaInicio = turno.hora_inicio.substring(0, 5);

        const emailHTML = `
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
        `;

        console.log(`📤 Intentando enviar email de cancelación a: ${turno.cliente.email}`);
        
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to: turno.cliente.email,
            subject: `Turno Cancelado - ${BARBERIA_NOMBRE}`,
            html: emailHTML
        });

        if (!result || !result.data) {
            console.error('⚠️  Respuesta inesperada de Resend:', result);
            throw new Error('Respuesta inválida del servicio de email');
        }

        console.log(`✅ Email de cancelación enviado exitosamente`);
        console.log(`   → Destinatario: ${turno.cliente.email}`);
        console.log(`   → ID: ${result.data.id}`);
        
        return result;
    } catch (error) {
        console.error('❌ Error al enviar email de cancelación:', error.message);
        if (error.response) {
            console.error('   → Respuesta del servidor:', error.response.data);
        }
        throw error;
    }
};

module.exports = {
    enviarEmailConfirmacionTurno,
    enviarEmailCancelacionTurno
};