# 🚂 Guía de Deploy en Railway

## Pasos para desplegar el Backend

### 1️⃣ Crear cuenta y proyecto en Railway

1. Ve a [railway.app](https://railway.app) y crea una cuenta
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio

### 2️⃣ Agregar MySQL

1. En tu proyecto, haz clic en "+ New"
2. Selecciona "Database" → "Add MySQL"
3. Railway creará automáticamente la base de datos

### 3️⃣ Configurar Variables de Entorno

1. Selecciona tu servicio Backend
2. Ve a la pestaña "Variables"
3. Haz clic en "RAW Editor" y pega:

```env
NODE_ENV=production
DATABASE_URL=${MySQL.MYSQL_URL}
JWT_SECRET=TU_JWT_SECRET_AQUI
JWT_EXPIRES_IN=7d
# Para emails por SMTP: configurar EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
# Para proveedor por API: configurar `BREVO_API_KEY`
FROM_EMAIL=tu@email.com
FRONTEND_URL=https://tu-frontend.vercel.app
```

**⚠️ IMPORTANTE:** Genera un JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4️⃣ Configurar Root Directory (si usas monorepo)

Si tu Backend está en una subcarpeta:

1. Ve a "Settings" de tu servicio
2. En "Build & Deploy"
3. Establece "Root Directory" como `Backend`

### 5️⃣ Deploy

Railway desplegará automáticamente. Verifica:
- Los logs en la pestaña "Deployments"
- Tu endpoint de salud: `https://tu-app.railway.app/api/v1/health`

### 6️⃣ Ejecutar Seeds (Opcional)

Después del primer deploy, ejecuta los seeds manualmente:

1. Ve a tu servicio en Railway
2. Abre la terminal (botón "Terminal" o tres puntos → "View Logs")
3. Ejecuta:
```bash
npm run seed
```

## ✅ Verificación

Tu API debería estar funcionando en:
```
https://tu-proyecto.up.railway.app/api/v1/health
```

Deberías ver una respuesta JSON con información de la API.

## 🔧 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que `DATABASE_URL` esté configurada como `${MySQL.MYSQL_URL}`
- Asegúrate de que el servicio MySQL esté corriendo

### Error de variables de entorno
- Verifica que todas las variables necesarias estén configuradas
- Railway redespliega automáticamente al cambiar variables

### Logs
- Ve a "Deployments" → Click en el último deploy → "View Logs"
- Busca errores específicos

## 📚 Referencias

- [Documentación de Railway](https://docs.railway.app/)
- [Railway MySQL](https://docs.railway.app/databases/mysql)
