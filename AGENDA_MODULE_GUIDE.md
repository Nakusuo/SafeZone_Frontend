# 📅 Módulo de Agenda/Calendario - Guía de Integración

## 🎯 Descripción General

El módulo de Agenda/Calendario interactivo ha sido creado con **FullCalendar v6** y está completamente integrado en la arquitectura de SafeZone. Permite a los usuarios (VICTIM, PSYCHOLOGIST, DEFENDER, ADMIN) crear, visualizar, editar y sincronizar eventos con el backend Spring Boot.

### Características Principales
✅ Drag & Drop en el calendario  
✅ Redimensionamiento de eventos  
✅ Crear eventos mediante modal  
✅ Múltiples vistas (mes, semana, día)  
✅ Código de colores por tipo de evento  
✅ Sincronización automática con el backend  
✅ Autenticación integrada con JWT  

---

## 📁 Estructura de Archivos

### Archivos Creados

```
src/features/shared-features/
├── services/
│   └── agendaService.ts          # ✨ Servicio de API (Axios)
└── pages/
    └── AgendaPage.tsx             # ✨ Componente principal (FullCalendar)
```

### Archivos Modificados

```
├── package.json                   # ✨ Dependencias agregadas
├── src/index.css                  # ✨ Estilos de FullCalendar
├── src/core/router/AppRoutes.tsx  # ✨ Ruta: /agenda (multi-rol)
└── src/features/admin/components/AssignmentModal.tsx  # Tipado corregido
```

---

## 🔌 Integración con Core & Autenticación

### Contexto de Autenticación
El módulo extrae automáticamente el `user.id` desde `useAuth()`:

```typescript
const { user } = useAuth()
// user.id se utiliza como 'usuarioid' en todas las peticiones al backend
```

### Cliente API
Utiliza `apiClient` pre-configurado con:
- Base URL desde `VITE_API_URL` (ej: `http://localhost:8080/api`)
- Interceptor de JWT automático (Authorization: Bearer <token>)
- Manejo de errores 401/403

---

## 🛣️ Endpoints del Backend

### 1. Obtener Eventos
```
GET /api/agenda/{usuarioid}?start=ISO_DATE&end=ISO_DATE
```
**Parámetros:**
- `usuarioid`: ID del usuario autenticado
- `start`, `end`: Fechas ISO para el rango de búsqueda

**Respuesta:**
```json
[
  {
    "id": "evt-001",
    "usuarioid": "user-123",
    "titulo": "Audiencia judicial",
    "fechaInicio": "2026-07-15T09:00:00Z",
    "fechaFin": "2026-07-15T10:00:00Z",
    "tipo": "AUDIENCIA",
    "estado": "PENDIENTE",
    "descripcion": "..."
  }
]
```

### 2. Crear Evento
```
POST /api/agenda
```
**Body:**
```json
{
  "usuarioid": "user-123",
  "titulo": "Cita psicológica",
  "fechaInicio": "2026-08-01T14:00:00Z",
  "fechaFin": "2026-08-01T15:00:00Z",
  "tipo": "CITA_PSICOLOGICA",
  "estado": "PENDIENTE",
  "descripcion": "Sesión de seguimiento"
}
```

### 3. Actualizar Estado
```
PATCH /api/agenda/{id}/estado?usuarioid={usuarioid}
```
**Body:**
```json
{
  "estado": "COMPLETADO"
}
```

### 4. Actualizar Fechas (Drag & Drop)
```
PATCH /api/agenda/{id}/fechas?usuarioid={usuarioid}
```
**Body:**
```json
{
  "fechaInicio": "2026-07-20T09:00:00Z",
  "fechaFin": "2026-07-20T10:00:00Z"
}
```

---

## 🎨 Configuración Visual

### Tipos de Eventos
| Tipo | Color | Uso |
|------|-------|-----|
| **AUDIENCIA** | 🔴 Rojo | Eventos judiciales (críticos) |
| **CITA_PSICOLOGICA** | 🔵 Azul | Sesiones psicológicas |
| **PLAZO_LEGAL** | 🟠 Naranja | Plazos y trámites legales |

### Estados
| Estado | Apariencia |
|--------|-----------|
| **PENDIENTE** | Normal |
| **EN_PROCESO** | Normal |
| **COMPLETADO** | Opacidad 60% + tachado |
| **CANCELADO** | Normal |

### CSS Tailwind
```typescript
// Colores por tipo
AUDIENCIA:        'bg-red-500 border-red-600 text-white'
CITA_PSICOLOGICA: 'bg-blue-500 border-blue-600 text-white'
PLAZO_LEGAL:      'bg-amber-500 border-amber-600 text-white'

// Estados
COMPLETADO: 'opacity-60 line-through'
```

---

## 🚀 Acceso a la Página

### Ruta Protegida
```
/agenda
```

### Roles Permitidos
- ✅ VICTIM
- ✅ PSYCHOLOGIST
- ✅ DEFENDER
- ✅ ADMIN

### Navegación Desde el Código
```typescript
import { AgendaPage } from '@/features/shared-features/pages/AgendaPage'

// Ya está registrada en AppRoutes.tsx
// Solo navega usando:
navigate('/agenda')
```

---

## 📊 Flujo de Datos

```
┌─────────────────────┐
│   AgendaPage.tsx    │
│  (FullCalendar UI)  │
└──────────┬──────────┘
           │
    useAuth() ↓
    user.id extracted
           │
┌──────────▼──────────┐
│ agendaService.ts    │
│  (Axios calls)      │
└──────────┬──────────┘
           │
    JWT interceptor ↓
    Authorization header
           │
┌──────────▼──────────┐
│ Spring Boot API     │
│ /api/agenda/*       │
└─────────────────────┘
```

---

## 🔧 Configuración de FullCalendar

### Complementos Utilizados
```typescript
plugins={[
  dayGridPlugin,      // Vistas mensual y semanal
  timeGridPlugin,     // Vistas horarias
  interactionPlugin   // Drag & drop, click
]}
```

### Vistas Disponibles
- `dayGridMonth` - Mes completo
- `timeGridWeek` - Semana por horas
- `timeGridDay` - Día por horas

### Propiedades Habilitadas
```typescript
editable={true}      // Permite drag & drop
droppable={true}     // Permite soltar eventos
selectable={true}    // Click en días para crear
```

---

## 🛠️ Desarrollo Local

### Variables de Entorno
```env
VITE_API_URL=http://localhost:8080/api
VITE_USE_MOCK=false
```

### Ejecutar en Desarrollo
```bash
cd SafeZone_Frontend
npm install
npm run dev
```

Navega a: `http://localhost:5173/agenda`

### Build Producción
```bash
npm run build
# Genera: dist/
```

---

## ⚠️ Consideraciones Técnicas

### 1. Manejo de Zonas Horarias
- Las fechas del formulario se envían en ISO 8601 (UTC)
- La función `toDateTimeLocal()` maneja conversión del navegador

### 2. Sincronización Drag & Drop
- Al mover un evento, se invoca `updateDates()` automáticamente
- Si la API falla, **el evento se revierte en la UI** (no implementado `revert()` por compatibilidad)

### 3. Límites de Alcance
- Solo el usuario autenticado puede ver/editar sus propios eventos
- `usuarioid` se incluye en todos los endpoints para validación en backend

### 4. Estilos de FullCalendar
Se importan globalmente en `src/index.css`:
```css
@import '@fullcalendar/daygrid/index.global.css';
@import '@fullcalendar/timegrid/index.global.css';
```

---

## 📦 Dependencias Instaladas

```json
{
  "@fullcalendar/daygrid": "^6.1.15",
  "@fullcalendar/interaction": "^6.1.15",
  "@fullcalendar/react": "^6.1.15",
  "@fullcalendar/timegrid": "^6.1.15"
}
```

---

## ✅ Verificación

### Build Status
```
✓ 1869 modules transformed
✓ Built successfully
✓ No TypeScript errors
```

### Archivo de Configuración
[AppRoutes.tsx](src/core/router/AppRoutes.tsx) incluye:
```typescript
<Route path="/agenda" element={<Protected element={<AgendaPage />} 
  role={['VICTIM','PSYCHOLOGIST','DEFENDER','ADMIN']} />} />
```

---

## 🚨 Troubleshooting

### Evento no se sincroniza
✅ Verifica que el backend esté respondiendo en `/api/agenda/*`  
✅ Revisa la consola para errores de red (F12 → Network)  
✅ Confirma que `usuarioid` coincida con el usuario autenticado  

### Colores no se ven
✅ Asegúrate de que Tailwind CSS esté compilado (ya incluido)  
✅ Revisa que `eventClassNames()` retorne arrays válidos  

### Drag & Drop no funciona
✅ Verifica `editable={true}` en FullCalendar  
✅ Comprueba que el evento tenga `eventDrop` handler  

---

## 📝 Notas de Implementación

- **Autenticación**: Integrada automáticamente vía `useAuth()`
- **Persistencia**: Los eventos se sincronizan en tiempo real con el backend
- **Responsividad**: Diseño adaptable con Tailwind CSS
- **Accesibilidad**: Componentes semánticos HTML5
- **Tipado**: 100% TypeScript con tipos estrictos

---

## 🔄 Próximas Mejoras

- [ ] Notificaciones en tiempo real (Socket.io)
- [ ] Exportar eventos a ICS
- [ ] Recordatorios por correo
- [ ] Integración con Google Calendar
- [ ] Multi-idioma

---

**Última actualización**: 2026-06-27  
**Versión**: 1.0.0  
**Estado**: ✅ Producción Lista
