# 🚀 Configuración de API para Frontend

## Variables de Entorno (Vite)

Este proyecto usa **Vite**, que requiere el prefijo `VITE_` para exponer variables al cliente.

---

## 📁 Archivos de Entorno

### `.env.development` (Desarrollo Local)
Usado automáticamente cuando ejecutas `npm run dev`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### `.env.production` (Producción)
Usado cuando haces `npm run build`:

```env
VITE_API_URL=https://tu-backend.up.railway.app/api/v1
```

---

## 🔧 Configuración para Deploy

### Vercel (Recomendado)

**Opción 1: Variables de Entorno en Vercel**

1. Ve a tu proyecto en Vercel → Settings → Environment Variables
2. Agrega:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://tu-backend.up.railway.app/api/v1`
   - **Environment:** Production

**Opción 2: Archivo `.env.production`**

Antes de hacer deploy:
1. Edita `.env.production` con la URL real de Railway
2. Commit y push (este archivo SÍ debe estar en el repo)

---

### Netlify

1. Ve a Site settings → Build & deploy → Environment
2. Agrega variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://tu-backend.up.railway.app/api/v1`

---

### Railway (Frontend también en Railway)

1. Agrega servicio de Frontend en Railway
2. En Variables, configura:
```env
VITE_API_URL=https://tu-backend.up.railway.app/api/v1
```

---

## ✅ Verificación

**Durante desarrollo:**
```bash
npm run dev
# Debe usar: http://localhost:3000/api/v1
```

**En producción:**
Abre la consola del navegador y ejecuta:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Debe mostrar la URL de tu backend en Railway.

---

## 🔗 Obtener la URL de Railway

Después de desplegar el Backend en Railway:

1. Ve a tu proyecto en Railway
2. Selecciona el servicio Backend
3. En la pestaña "Settings"
4. Busca "Domains" → "Generate Domain"
5. Copia la URL: `https://tu-proyecto-production.up.railway.app`
6. Agrégale el sufijo: `/api/v1`

**URL final:** `https://tu-proyecto-production.up.railway.app/api/v1`

---

## ⚠️ Importante

- **NO** agregues `.env.development` o `.env.production` al `.gitignore` (estos SÍ deben estar en el repo)
- **SÍ** agrega `.env.local` al `.gitignore` (este NO debe estar en el repo)
- Las variables `VITE_*` son públicas (accesibles en el navegador)
- Nunca pongas secretos o API keys privadas con el prefijo `VITE_`

---

## 🔄 CORS en el Backend

Asegúrate de que el Backend tenga configurado el CORS para aceptar peticiones desde tu frontend:

En Railway, configura la variable en el Backend:
```env
FRONTEND_URL=https://tu-frontend.vercel.app
```

Esto permite que tu frontend en Vercel/Netlify se comunique con el backend en Railway.
