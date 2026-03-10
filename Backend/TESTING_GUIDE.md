# 🧪 GUÍA DE PRUEBAS - API BARBERÍA
## Servidor: http://localhost:3000

---

## 📍 PASO 1: HEALTH CHECK (Verificar que la API responde)

### GET Health Check
```
GET http://localhost:3000/api/v1/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "API de Barbería funcionando correctamente",
  "timestamp": "2026-02-20T...",
  "endpoints": {
    "clientes": "/api/v1/clientes",
    "barberos": "/api/v1/barberos",
    "servicios": "/api/v1/servicios",
    "turnos": "/api/v1/turnos"
  }
}
```

---

## 🔧 PASO 2: CREAR SERVICIOS (Primero, porque los turnos los necesitan)

### POST - Crear Servicio: Corte
```
POST http://localhost:3000/api/v1/servicios
Content-Type: application/json

{
  "nombre_servicio": "corte",
  "descripcion": "Corte de cabello clásico",
  "precio_base": 5000.00,
  "duracion": 30,
  "activo": true
}
```

### POST - Crear Servicio: Corte + Barba
```
POST http://localhost:3000/api/v1/servicios
Content-Type: application/json

{
  "nombre_servicio": "corte + barba",
  "descripcion": "Corte de cabello más arreglo de barba",
  "precio_base": 8000.00,
  "duracion": 45,
  "activo": true
}
```

### POST - Crear Servicio: Tintura
```
POST http://localhost:3000/api/v1/servicios
Content-Type: application/json

{
  "nombre_servicio": "tintura",
  "descripcion": "Tintura completa de cabello",
  "precio_base": 12000.00,
  "duracion": 60,
  "activo": true
}
```

### GET - Obtener Todos los Servicios
```
GET http://localhost:3000/api/v1/servicios
```

### GET - Obtener Servicios Activos
```
GET http://localhost:3000/api/v1/servicios?activo=true
```

---

## 💈 PASO 3: CREAR BARBEROS

### POST - Crear Barbero 1
```
POST http://localhost:3000/api/v1/barberos
Content-Type: application/json

{
  "nombre_completo": "Carlos Rodríguez",
  "email": "carlos@barberia.com",
  "celular": "3512345678",
  "direccion": "Av. Colón 123, Córdoba",
  "imagen_url": "https://i.ibb.co/example1.jpg",
  "activo": true
}
```

### POST - Crear Barbero 2
```
POST http://localhost:3000/api/v1/barberos
Content-Type: application/json

{
  "nombre_completo": "Martín González",
  "email": "martin@barberia.com",
  "celular": "3519876543",
  "direccion": "Bv. San Juan 456, Córdoba",
  "activo": true
}
```

### GET - Obtener Todos los Barberos
```
GET http://localhost:3000/api/v1/barberos
```

### GET - Obtener Barberos Activos
```
GET http://localhost:3000/api/v1/barberos?activo=true
```

### GET - Buscar Barbero
```
GET http://localhost:3000/api/v1/barberos?buscar=Carlos
```

---

## 👤 PASO 4: CREAR CLIENTES

### POST - Crear Cliente 1
```
POST http://localhost:3000/api/v1/clientes
Content-Type: application/json

{
  "nombre_completo": "Juan Pérez",
  "email": "juan.perez@gmail.com",
  "celular": "3515551234",
  "direccion": "Av. Vélez Sarsfield 789"
}
```

### POST - Crear Cliente 2
```
POST http://localhost:3000/api/v1/clientes
Content-Type: application/json

{
  "nombre_completo": "María López",
  "email": "maria.lopez@gmail.com",
  "celular": "3515559876"
}
```

### POST - Crear Cliente 3
```
POST http://localhost:3000/api/v1/clientes
Content-Type: application/json

{
  "nombre_completo": "Pedro Fernández",
  "email": "pedro.fernandez@hotmail.com",
  "celular": "3515554567",
  "direccion": "Calle Belgrano 321"
}
```

### GET - Obtener Todos los Clientes
```
GET http://localhost:3000/api/v1/clientes
```

### GET - Buscar Cliente
```
GET http://localhost:3000/api/v1/clientes?buscar=juan
```

---

## 📅 PASO 5: CONSULTAR HORARIOS DISPONIBLES (¡IMPORTANTE!)

### GET - Horarios Disponibles (reemplaza los IDs con los reales)
```
GET http://localhost:3000/api/v1/turnos/disponibles?barbero_id=BARBERO_UUID&fecha=2026-02-21&servicio_id=SERVICIO_UUID
```

**Ejemplo con UUIDs reales (cópialos de las respuestas anteriores):**
```
GET http://localhost:3000/api/v1/turnos/disponibles?barbero_id=abc123-...&fecha=2026-02-21&servicio_id=xyz789-...
```

**Respuesta esperada:** Array de horarios disponibles
```json
{
  "ok": true,
  "fecha": "2026-02-21",
  "barbero_id": "...",
  "cantidad": 15,
  "horarios": [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"
  ]
}
```

---

## 🎯 PASO 6: CREAR TURNOS

> **💡 NUEVO:** Ahora puedes crear turnos de **DOS FORMAS**:
> - **Opción A (Cliente Pre-Registrado):** Usar `cliente_id` de un cliente ya existente
> - **Opción B (Reserva Directa):** Enviar datos del cliente en el objeto `cliente` (se crea o reutiliza automáticamente)

---

### OPCIÓN A: Crear Turno con Cliente Pre-Registrado (reemplaza los UUIDs)
```
POST http://localhost:3000/api/v1/turnos
Content-Type: application/json

{
  "cliente_id": "CLIENTE_UUID",
  "barbero_id": "BARBERO_UUID",
  "servicio_id": "SERVICIO_UUID",
  "fecha_turno": "2026-02-21",
  "hora_inicio": "10:00"
}
```

---

### OPCIÓN B: Crear Turno SIN Cliente Pre-Registrado (Reserva Directa) 🆕

Esta opción es ideal para **formularios públicos de reserva** donde el cliente ingresa sus datos directamente.

**Si el email ya existe:** Reutiliza el cliente existente  
**Si el email es nuevo:** Crea el cliente automáticamente

```
POST http://localhost:3000/api/v1/turnos
Content-Type: application/json

{
  "cliente": {
    "nombre_completo": "Ana García",
    "email": "ana.garcia@gmail.com",
    "celular": "3517778899",
    "direccion": "Av. Hipólito Yrigoyen 500"
  },
  "barbero_id": "BARBERO_UUID",
  "servicio_id": "SERVICIO_UUID",
  "fecha_turno": "2026-02-21",
  "hora_inicio": "11:00"
}
```

### POST - Crear Segundo Turno con el MISMO Email (debería reutilizar cliente)
```
POST http://localhost:3000/api/v1/turnos
Content-Type: application/json

{
  "cliente": {
    "nombre_completo": "Ana García",
    "email": "ana.garcia@gmail.com",
    "celular": "3517778899"
  },
  "barbero_id": "BARBERO_UUID",
  "servicio_id": "OTRO_SERVICIO_UUID",
  "fecha_turno": "2026-02-25",
  "hora_inicio": "16:00"
}
```
**Nota:** Como el email `ana.garcia@gmail.com` ya existe, se reutilizará el cliente creado anteriormente.

### POST - Crear Segundo Turno (para probar validación de solapamiento)
```
POST http://localhost:3000/api/v1/turnos
Content-Type: application/json

{
  "cliente_id": "OTRO_CLIENTE_UUID",
  "barbero_id": "MISMO_BARBERO_UUID",
  "servicio_id": "SERVICIO_UUID",
  "fecha_turno": "2026-02-21",
  "hora_inicio": "10:30"
}
```

### GET - Obtener Turnos de un Cliente (reemplaza UUID)
```
GET http://localhost:3000/api/v1/turnos/cliente/CLIENTE_UUID
```

### GET - Obtener Turnos de un Barbero (reemplaza UUID)
```
GET http://localhost:3000/api/v1/turnos/barbero/BARBERO_UUID
```

### GET - Obtener Turnos de una Fecha
```
GET http://localhost:3000/api/v1/turnos/fecha?fecha=2026-02-21
```

### PATCH - Confirmar Turno (reemplaza UUID)
```
PATCH http://localhost:3000/api/v1/turnos/TURNO_UUID/estado
Content-Type: application/json

{
  "estado": "confirmado"
}
```

### PATCH - Cancelar Turno (reemplaza UUID)
```
PATCH http://localhost:3000/api/v1/turnos/TURNO_UUID/cancelar
```

---

## ❌ PASO 7: PROBAR VALIDACIONES (Errores esperados)

### ❌ Crear Turno SIN cliente_id NI cliente (ambos faltantes)
```
POST http://localhost:3000/api/v1/turnos
Content-Type: application/json

{
  "barbero_id": "BARBERO_UUID",
  "servicio_id": "SERVICIO_UUID",
  "fecha_turno": "2026-02-21",
  "hora_inicio": "10:00"
}
```
**Error esperado:** "Debe proporcionar cliente_id o cliente (pero no ambos)"

### ❌ Crear Turno con cliente_id Y cliente (ambos presentes)
```
POST http://localhost:3000/api/v1/turnos
Content-Type: application/json

{
  "cliente_id": "CLIENTE_UUID",
  "cliente": {
    "nombre_completo": "Test Usuario",
    "email": "test@example.com",
    "celular": "3515551234"
  },
  "barbero_id": "BARBERO_UUID",
  "servicio_id": "SERVICIO_UUID",
  "fecha_turno": "2026-02-21",
  "hora_inicio": "10:00"
}
```
**Error esperado:** "Debe proporcionar cliente_id o cliente (pero no ambos)"

### ❌ Crear Turno con Email Inválido en Cliente
```
POST http://localhost:3000/api/v1/turnos
Content-Type: application/json

{
  "cliente": {
    "nombre_completo": "Test Usuario",
    "email": "email-invalido",
    "celular": "3515551234"
  },
  "barbero_id": "BARBERO_UUID",
  "servicio_id": "SERVICIO_UUID",
  "fecha_turno": "2026-02-21",
  "hora_inicio": "10:00"
}
```
**Error esperado:** "El email del cliente debe ser válido"

### ❌ Crear Turno con Email Inválido
```
POST http://localhost:3000/api/v1/clientes
Content-Type: application/json

{
  "nombre_completo": "Test Usuario",
  "email": "email-invalido",
  "celular": "3515551234"
}
```
**Error esperado:** "Debe ser un email válido"

### ❌ Crear Servicio con Precio Negativo
```
POST http://localhost:3000/api/v1/servicios
Content-Type: application/json

{
  "nombre_servicio": "corte",
  "precio_base": -100,
  "duracion": 30
}
```
**Error esperado:** "El precio debe ser mayor a 0"

### ❌ Crear Turno en Domingo (día no laboral)
```
POST http://localhost:3000/api/v1/turnos
Content-Type: application/json

{
  "cliente_id": "CLIENTE_UUID",
  "barbero_id": "BARBERO_UUID",
  "servicio_id": "SERVICIO_UUID",
  "fecha_turno": "2026-02-22",
  "hora_inicio": "10:00"
}
```
**Error esperado:** "No se pueden agendar turnos en días no laborales (domingos)"

### ❌ Crear Turno con Menos de 1 Hora de Anticipación
```
POST http://localhost:3000/api/v1/turnos
Content-Type: application/json

{
  "cliente_id": "CLIENTE_UUID",
  "barbero_id": "BARBERO_UUID",
  "servicio_id": "SERVICIO_UUID",
  "fecha_turno": "2026-02-20",
  "hora_inicio": "14:00"
}
```
**Error esperado:** "Los turnos deben agendarse con al menos 1 hora(s) de anticipación"

### ❌ Crear Turno Fuera del Horario Laboral
```
POST http://localhost:3000/api/v1/turnos
Content-Type: application/json

{
  "cliente_id": "CLIENTE_UUID",
  "barbero_id": "BARBERO_UUID",
  "servicio_id": "SERVICIO_UUID",
  "fecha_turno": "2026-02-21",
  "hora_inicio": "23:00"
}
```
**Error esperado:** "La hora seleccionada no está dentro del horario laboral"

---

## 🔄 PASO 8: ACTUALIZAR Y ELIMINAR

### PUT - Actualizar Cliente (reemplaza UUID)
```
PUT http://localhost:3000/api/v1/clientes/CLIENTE_UUID
Content-Type: application/json

{
  "celular": "3519999999",
  "direccion": "Nueva Dirección 123"
}
```

### PATCH - Cambiar Estado Barbero (reemplaza UUID)
```
PATCH http://localhost:3000/api/v1/barberos/BARBERO_UUID/estado
Content-Type: application/json

{
  "activo": false
}
```

### DELETE - Intentar Eliminar Cliente con Turnos (debería fallar)
```
DELETE http://localhost:3000/api/v1/clientes/CLIENTE_UUID
```
**Error esperado:** "No se puede eliminar el cliente porque tiene turnos activos"

---

## 📊 CHECKLIST DE PRUEBAS

### Básicas
- [ ] Health check funciona
- [ ] Crear 3 servicios (corte, corte+barba, tintura)
- [ ] Crear 2 barberos
- [ ] Crear 3 clientes
- [ ] Consultar horarios disponibles

### Crear Turnos (Ambas Formas)
- [ ] Crear turno con cliente_id (cliente pre-registrado)
- [ ] Crear turno con objeto cliente (nuevo cliente)
- [ ] Crear segundo turno con mismo email (debería reutilizar cliente)
- [ ] Verificar que no se pueden solapar turnos

### Gestión de Turnos
- [ ] Confirmar un turno (cambiar estado)
- [ ] Cancelar un turno
- [ ] Ver turnos de un cliente
- [ ] Ver turnos de un barbero
- [ ] Ver turnos por fecha

### Validaciones Nuevas (Turnos sin Cliente Pre-Registrado)
- [ ] Error al enviar cliente_id Y cliente juntos
- [ ] Error al no enviar cliente_id NI cliente
- [ ] Error con email inválido en objeto cliente
- [ ] Error con celular inválido en objeto cliente

### Validaciones Existentes
- [ ] Probar validación de email inválido (clientes)
- [ ] Probar validación de domingo
- [ ] Probar validación de anticipación mínima
- [ ] Probar validación de horario laboral
- [ ] Actualizar datos de un cliente
- [ ] Desactivar un barbero
- [ ] Intentar eliminar cliente con turnos

---

## 🎯 PRÓXIMAS PRUEBAS AVANZADAS

1. Crear múltiples turnos el mismo día para diferentes barberos
2. Verificar agenda completa de un barbero
3. Verificar historial de turnos de un cliente
4. Probar búsqueda de clientes/barberos
5. Probar filtros de turnos por fecha y estado
6. Intentar crear turno con barbero inactivo
7. Probar límite de 15 días de anticipación

---

## 💡 TIPS

- Guarda los UUIDs de los registros creados para usarlos en otras peticiones
- Usa variables en Thunder Client/Postman para almacenar IDs
- Verifica primero los endpoints GET antes de crear datos
- Prueba casos de error para validar las validaciones
- Revisa la consola del servidor para ver logs SQL (en modo development)
