# 💈 AppBarberia

Sistema de gestión de turnos para barbería con panel de administración.

## 📋 Requisitos Previos

- Node.js 18+ 
- MySQL 8.0+
- npm o yarn

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd AppBarberia
```

### 2. Configurar Backend

```bash
cd Backend
npm install
```

**Configurar variables de entorno:**

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
# - Configura tu base de datos MySQL
# - Genera un JWT_SECRET seguro
# - Agrega tu RESEND_API_KEY para emails
```

### 3. Configurar Frontend

```bash
cd Frontend/frontBarberia
npm install
```

### 4. Crear la base de datos

```sql
CREATE DATABASE barberia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Las tablas se crearán automáticamente al iniciar el backend (Sequelize sync).

## 🎯 Ejecutar el proyecto

### Opción 1: Todo junto (recomendado)

Desde el directorio del frontend:

```bash
cd Frontend/frontBarberia
npm start
```

Esto ejecutará simultáneamente:
- **Backend** en `http://localhost:3000`
- **Frontend** en `http://localhost:5173`

### Opción 2: Por separado

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Frontend/frontBarberia
npm run dev
```

## 📁 Estructura del Proyecto

```
AppBarberia/
├── Backend/
│   ├── src/
│   │   ├── Controllers/    # Controladores de las rutas
│   │   ├── Services/       # Lógica de negocio
│   │   ├── Models/         # Modelos de Sequelize
│   │   ├── Routes/         # Definición de rutas
│   │   ├── Middlewares/    # Middlewares (validación, auth)
│   │   ├── Config/         # Configuración (DB, etc)
│   │   └── Utils/          # Utilidades
│   ├── .env.example        # Plantilla de variables de entorno
│   └── package.json
│
└── Frontend/
    └── frontBarberia/
        ├── src/
        │   ├── pages/      # Páginas de la aplicación
        │   ├── components/ # Componentes reutilizables
        │   ├── services/   # Servicios API
        │   └── context/    # Context API (Auth)
        └── package.json
```

## 🔐 Seguridad

- ⚠️ **NUNCA** subas el archivo `.env` a Git
- ✅ Usa `.env.example` como plantilla (sin credenciales reales)
- ✅ Genera un `JWT_SECRET` fuerte en producción
- ✅ Cambia las credenciales por defecto de MySQL

## 📧 Configuración de Emails

El sistema usa [Resend](https://resend.com) para enviar emails:

1. Crea una cuenta en https://resend.com
2. Obtén tu API key
3. Agrégala al archivo `.env`:
   ```env
   RESEND_API_KEY=re_tu_api_key_aqui
   FROM_EMAIL=tu-email@dominio.com
   ```

## 🛠️ Tecnologías

**Backend:**
- Node.js + Express
- Sequelize (ORM)
- MySQL
- JWT (autenticación)
- Resend (emails)

**Frontend:**
- React 19
- Vite
- TailwindCSS + shadcn/ui
- React Router
- date-fns
- Recharts

## 📝 Licencia

Este proyecto es privado.

## 👤 Autor

Mauro Pardo
