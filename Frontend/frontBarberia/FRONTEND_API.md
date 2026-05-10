# 🚀 Configuración de API para Frontend (Versión Simple)

## ¿Qué es esto?

Tu frontend necesita saber dónde está el backend (la API). Esto se configura con una variable de entorno.

---

## 📁 Archivos

### `.env` (Tu archivo de configuración)
Este archivo contiene la URL de tu backend:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

**⚠️ IMPORTANTE:** Este archivo **NO se sube a GitHub** (está en `.gitignore`)

### `.env.example` (Template de ejemplo)
Este archivo SÍ se sube a GitHub. Es solo una plantilla para que otros sepan qué variables necesitan.

---

## 🛠️ Configuración paso a paso

### Para Desarrollo Local (tu computadora)

**Ya está listo!** El archivo `.env` ya tiene configurado:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

Esto apunta a tu backend local corriendo en el puerto 3000.

---

### Para Producción (Vercel/Netlify)

Cuando despliegues tu frontend en Vercel o Netlify, necesitas decirle dónde está tu backend de Railway.

#### **Vercel:**

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Click en **Settings** → **Environment Variables**
3. Agrega una nueva variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://tu-backend.up.railway.app/api/v1` *(la URL de tu backend en Railway)*
   - **Environment:** Selecciona **Production**
4. Click en **Save**
5. Redeploy tu proyecto

#### **Netlify:**

1. Ve a tu sitio en [netlify.com](https://netlify.com)
2. Click en **Site settings** → **Environment variables**
3. Click en **Add a variable**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://tu-backend.up.railway.app/api/v1`
4. Click en **Save**
5. Redeploy tu sitio

---

## 🔗 ¿Cómo obtener la URL de Railway?

1. Despliega tu backend en Railway (sigue la guía `RAILWAY_DEPLOY.md` del Backend)
2. Una vez desplegado, Railway te da una URL como:
   ```
   https://clipbook-backend-production.up.railway.app
   ```
3. Agrégale `/api/v1` al final:
   ```
   https://clipbook-backend-production.up.railway.app/api/v1
   ```
4. Esta es la URL que usarás en Vercel/Netlify

---

## ✅ Verificar que funciona

**En desarrollo local:**
```bash
npm run dev
```
Abre la consola del navegador (F12) y escribe:
```javascript
console.log(import.meta.env.VITE_API_URL)
```
Debe mostrar: `http://localhost:3000/api/v1`

**En producción:**
Abre tu sitio desplegado, abre la consola (F12) y escribe lo mismo:
```javascript
console.log(import.meta.env.VITE_API_URL)
```
Debe mostrar la URL de Railway.

---

## 🔄 CORS en el Backend

Para que tu frontend se pueda comunicar con el backend, configura en Railway (en las variables del **Backend**):

```env
FRONTEND_URL=https://tu-frontend.vercel.app
```

Esto permite que tu frontend haga peticiones al backend sin errores de CORS.

---

## 📝 Resumen Simple

1. **Desarrollo:** Ya está configurado en `.env`
2. **Producción:** Agrega `VITE_API_URL` en Vercel/Netlify con la URL de Railway
3. **Backend:** Agrega `FRONTEND_URL` en Railway con la URL de tu frontend

¡Listo! 🎉
