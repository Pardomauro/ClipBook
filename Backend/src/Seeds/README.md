# Scripts de Inicialización (Seeds)

Este directorio contiene scripts para poblar la base de datos con datos iniciales necesarios para el funcionamiento del sistema.

## 📋 Scripts Disponibles

### seedBarberos.js

Script para inicializar la base de datos con barberos por defecto.

#### Características

- ✅ Crea al menos 3 barberos con datos de ejemplo
- 📷 Utiliza imágenes de la carpeta `Frontend/frontBarberia/public/Barberos`
- 🔐 Hashea automáticamente las contraseñas
- 🔄 Verifica si los barberos ya existen (no duplica)
- 📊 Muestra resumen detallado del proceso
- 🖼️ Convierte imágenes a formato base64 para almacenamiento

#### Uso

**Opción 1: Usando npm script (recomendado)**
```bash
cd Backend
npm run seed:barberos
```

**Opción 2: Ejecución directa**
```bash
cd Backend
node src/Seeds/seedBarberos.js
```

#### Barberos Creados

El script crea los siguientes barberos por defecto:

| Nombre | Email | Celular | Imagen |
|--------|-------|---------|--------|
| Carlos Martínez | carlos.martinez@barberia.com | +54 9 11 1234-5678 | martin.jpg |
| Juan Pérez | juan.perez@barberia.com | +54 9 11 2345-6789 | Jover.jpg |
| Roberto Pardo | roberto.pardo@barberia.com | +54 9 11 3456-7890 | 1949_pardo.jpg |

**Contraseña para todos:** `barbero123`

#### Requisitos Previos

1. Base de datos MySQL configurada y corriendo
2. Variables de entorno configuradas en `.env`:
   ```env
   DB_NAME=nombre_db
   DB_USER=usuario
   DB_PASSWORD=contraseña
   DB_HOST=localhost
   DB_PORT=3306
   ```
3. Tablas de la base de datos creadas (ejecutar migración/sync primero)
4. Imágenes disponibles en `Frontend/frontBarberia/public/Barberos/`

#### Comportamiento

- ✅ Si un barbero **no existe** (por email): Lo crea
- ⏭️ Si un barbero **ya existe**: Lo omite y continúa
- 📷 Si una imagen **no se encuentra**: Usa imagen por defecto del modelo
- ❌ Si hay un error de validación: Muestra el error y continúa con el siguiente

#### Salida Esperada

```
🚀 Iniciando seed de barberos...

✅ Conexión a la base de datos establecida

📷 Imagen cargada: martin.jpg
✅ Barbero creado exitosamente:
   - ID: abc-123-def-456
   - Nombre: Carlos Martínez
   - Email: carlos.martinez@barberia.com
   - Activo: Sí
   - Imagen: Cargada ✓

...

═══════════════════════════════════════════════════
📊 RESUMEN DEL SEED
═══════════════════════════════════════════════════
✅ Barberos creados: 3
⏭️  Barberos omitidos (ya existían): 0
📊 Total en base de datos: 3
═══════════════════════════════════════════════════

💡 CREDENCIALES DE ACCESO:
   Email: carlos.martinez@barberia.com
   Password: barbero123

✨ Seed completado exitosamente
🔌 Conexión a la base de datos cerrada

🎉 Proceso finalizado correctamente
```

## 🔧 Personalización

Para agregar más barberos o modificar los existentes, edita el array `barberosIniciales` en `seedBarberos.js`:

```javascript
const barberosIniciales = [
    {
        nombre_completo: 'Nombre del Barbero',
        email: 'email@barberia.com',
        celular: '+54 9 11 XXXX-XXXX',
        direccion: 'Dirección completa',
        password: 'contraseña', // Se hasheará automáticamente
        activo: true,
        imagenFile: 'nombre_imagen.jpg' // Debe existir en public/Barberos
    },
    // ... más barberos
];
```

## ⚠️ Notas Importantes

- El script **NO elimina** barberos existentes
- Las contraseñas se hashean automáticamente usando bcrypt
- Las imágenes se convierten a base64 para almacenamiento en la BD
- Si falta la carpeta de imágenes, el script continúa con imágenes por defecto
- El script cierra la conexión a la BD automáticamente al finalizar

## 🐛 Solución de Problemas

### Error: Cannot find module '../Models/Barbero/Barbero'
- Verifica que estés en el directorio correcto (Backend/)
- Verifica que el modelo Barbero existe

### Error: ECONNREFUSED connecting to MySQL
- Verifica que MySQL esté corriendo
- Verifica las credenciales en el archivo `.env`

### Error: Table 'barberos' doesn't exist
- Ejecuta primero la sincronización de la base de datos
- Desde `app.js` o ejecuta las migraciones correspondientes

### Imágenes no se cargan
- Verifica que la carpeta `Frontend/frontBarberia/public/Barberos` existe
- Verifica que las imágenes especificadas en `imagenFile` existen
- El script continuará con imágenes por defecto si no las encuentra

## 📝 Licencia

Este proyecto es parte de AppBarberia - Sistema de Gestión de Barbería
