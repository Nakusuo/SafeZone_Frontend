# ✅ Backend Integration Checklist - Agenda Module

## Resumen
Este documento es una guía de requisitos para el equipo backend de SafeZone. Describe exactamente qué endpoints y estructuras de datos se necesitan para que el módulo de Agenda del frontend funcione correctamente.

---

## 📋 Endpoints Requeridos

### 1️⃣ GET /api/agenda/{usuarioid}

**Obtener eventos para un rango de fechas**

#### Request
```http
GET /api/agenda/user-123?start=2026-07-01T00:00:00Z&end=2026-07-31T23:59:59Z
Authorization: Bearer <JWT_TOKEN>
```

#### Query Parameters
- `start` (string, ISO 8601): Fecha/hora de inicio del rango
- `end` (string, ISO 8601): Fecha/hora de fin del rango
- `usuarioid` (path param): ID del usuario autenticado

#### Response 200 OK
```json
[
  {
    "id": "evt-f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "usuarioid": "user-123",
    "titulo": "Audiencia judicial",
    "fechaInicio": "2026-07-15T09:00:00Z",
    "fechaFin": "2026-07-15T10:00:00Z",
    "tipo": "AUDIENCIA",
    "estado": "PENDIENTE",
    "descripcion": "Audiencia ante el juzgado de familia"
  },
  {
    "id": "evt-b47ac10b-58cc-4372-a567-0e02b2c3d480",
    "usuarioid": "user-123",
    "titulo": "Cita psicológica",
    "fechaInicio": "2026-07-20T14:00:00Z",
    "fechaFin": "2026-07-20T15:00:00Z",
    "tipo": "CITA_PSICOLOGICA",
    "estado": "EN_PROCESO",
    "descripcion": null
  }
]
```

#### Response 401 Unauthorized
```json
{
  "error": "No authentication token provided"
}
```

#### Response 403 Forbidden
```json
{
  "error": "Cannot view another user's events"
}
```

#### Validaciones Backend
- ✅ Verificar que `usuarioid` en la URL coincida con el usuario del JWT token
- ✅ Validar formato ISO 8601 para `start` y `end`
- ✅ Retornar solo eventos del usuario autenticado
- ✅ Ordenar por `fechaInicio` ascendente

---

### 2️⃣ POST /api/agenda

**Crear un nuevo evento**

#### Request
```http
POST /api/agenda
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

#### Body
```json
{
  "usuarioid": "user-123",
  "titulo": "Plazo de entrega de documentos",
  "fechaInicio": "2026-08-01T08:00:00Z",
  "fechaFin": "2026-08-01T17:00:00Z",
  "tipo": "PLAZO_LEGAL",
  "estado": "PENDIENTE",
  "descripcion": "Entregar documentación legal antes de las 5 PM"
}
```

#### Field Validation
| Campo | Tipo | Obligatorio | Constraints |
|-------|------|-------------|-------------|
| `usuarioid` | string | ✅ | Debe coincidir con JWT token |
| `titulo` | string | ✅ | Min: 3 chars, Max: 255 chars, no vacío |
| `fechaInicio` | string | ✅ | ISO 8601, debe ser ≤ `fechaFin` |
| `fechaFin` | string | ✅ | ISO 8601, debe ser ≥ `fechaInicio` |
| `tipo` | string | ✅ | Enum: `AUDIENCIA`, `CITA_PSICOLOGICA`, `PLAZO_LEGAL` |
| `estado` | string | ✅ | Enum: `PENDIENTE`, `EN_PROCESO`, `COMPLETADO`, `CANCELADO` |
| `descripcion` | string | ❌ | Max: 1000 chars, puede ser null |

#### Response 201 Created
```json
{
  "id": "evt-c47ac10b-58cc-4372-a567-0e02b2c3d481",
  "usuarioid": "user-123",
  "titulo": "Plazo de entrega de documentos",
  "fechaInicio": "2026-08-01T08:00:00Z",
  "fechaFin": "2026-08-01T17:00:00Z",
  "tipo": "PLAZO_LEGAL",
  "estado": "PENDIENTE",
  "descripcion": "Entregar documentación legal antes de las 5 PM"
}
```

#### Response 400 Bad Request
```json
{
  "error": "Invalid request",
  "details": "titulo must be at least 3 characters long"
}
```

#### Response 401 Unauthorized
```json
{
  "error": "Invalid or missing authentication token"
}
```

---

### 3️⃣ PATCH /api/agenda/{id}/estado

**Actualizar el estado de un evento**

#### Request
```http
PATCH /api/agenda/evt-f47ac10b-58cc-4372-a567-0e02b2c3d479/estado?usuarioid=user-123
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

#### Query Parameters
- `usuarioid` (string): ID del usuario propietario del evento

#### Body
```json
{
  "estado": "COMPLETADO"
}
```

#### State Transitions Allowed
- `PENDIENTE` → `EN_PROCESO`, `COMPLETADO`, `CANCELADO`
- `EN_PROCESO` → `COMPLETADO`, `CANCELADO`
- `COMPLETADO` → No cambios
- `CANCELADO` → No cambios

#### Response 200 OK
```json
{
  "id": "evt-f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "usuarioid": "user-123",
  "titulo": "Audiencia judicial",
  "fechaInicio": "2026-07-15T09:00:00Z",
  "fechaFin": "2026-07-15T10:00:00Z",
  "tipo": "AUDIENCIA",
  "estado": "COMPLETADO",
  "descripcion": "Audiencia ante el juzgado de familia"
}
```

#### Response 403 Forbidden
```json
{
  "error": "Cannot modify another user's event"
}
```

#### Response 404 Not Found
```json
{
  "error": "Event not found"
}
```

---

### 4️⃣ PATCH /api/agenda/{id}/fechas

**Actualizar fechas de un evento (Drag & Drop)**

#### Request
```http
PATCH /api/agenda/evt-f47ac10b-58cc-4372-a567-0e02b2c3d479/fechas?usuarioid=user-123
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

#### Query Parameters
- `usuarioid` (string): ID del usuario propietario del evento

#### Body
```json
{
  "fechaInicio": "2026-07-20T09:00:00Z",
  "fechaFin": "2026-07-20T10:00:00Z"
}
```

#### Validaciones
- ✅ `fechaInicio` debe ser ≤ `fechaFin`
- ✅ Ambos campos deben estar presentes (no opcional)
- ✅ Formato ISO 8601 requerido

#### Response 200 OK
```json
{
  "id": "evt-f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "usuarioid": "user-123",
  "titulo": "Audiencia judicial",
  "fechaInicio": "2026-07-20T09:00:00Z",
  "fechaFin": "2026-07-20T10:00:00Z",
  "tipo": "AUDIENCIA",
  "estado": "PENDIENTE",
  "descripcion": "Audiencia ante el juzgado de familia"
}
```

#### Response 400 Bad Request
```json
{
  "error": "fechaInicio must be before or equal to fechaFin"
}
```

---

## 🗂️ Modelo de Datos (Spring Boot)

### Entity: AgendaEvent
```java
@Entity
@Table(name = "agenda_events")
public class AgendaEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String usuarioid;  // Ref a User.id
    
    @Column(nullable = false, length = 255)
    private String titulo;
    
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaInicio;
    
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaFin;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AgendaEventType tipo;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AgendaEventStatus estado;
    
    @Column(length = 1000)
    private String descripcion;
    
    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}

public enum AgendaEventType {
    AUDIENCIA,
    CITA_PSICOLOGICA,
    PLAZO_LEGAL
}

public enum AgendaEventStatus {
    PENDIENTE,
    EN_PROCESO,
    COMPLETADO,
    CANCELADO
}
```

### DTO: CreateAgendaEventRequest
```java
public class CreateAgendaEventRequest {
    private String usuarioid;
    private String titulo;
    private String fechaInicio;  // ISO 8601
    private String fechaFin;     // ISO 8601
    private AgendaEventType tipo;
    private AgendaEventStatus estado;
    private String descripcion;
    
    // getters/setters
}
```

### DTO: AgendaEventResponse
```java
public class AgendaEventResponse {
    private String id;
    private String usuarioid;
    private String titulo;
    private String fechaInicio;   // ISO 8601
    private String fechaFin;      // ISO 8601
    private AgendaEventType tipo;
    private AgendaEventStatus estado;
    private String descripcion;
    
    // Constructor, getters/setters
}
```

---

## 🔐 Seguridad & Validaciones

### Autenticación
- ✅ Todos los endpoints requieren JWT token válido en header `Authorization: Bearer <token>`
- ✅ Extraer `usuarioid` desde el token JWT
- ✅ Validar que `usuarioid` en URL coincida con el del token
- ✅ Retornar 401 si token inválido/expirado

### Autorización
- ✅ Usuario solo puede ver/editar sus propios eventos
- ✅ Retornar 403 si intenta acceder evento de otro usuario
- ✅ Validar `usuarioid` en todos los PATCH/GET con usuarioid

### Validación de Datos
- ✅ `titulo`: requerido, 3-255 caracteres
- ✅ `fechaInicio` ≤ `fechaFin`: siempre cumplir
- ✅ `tipo`: enum válido
- ✅ `estado`: enum válido
- ✅ `descripcion`: máximo 1000 caracteres (puede ser null)

### Auditoría
- ✅ Guardar `createdAt` (inmutable) en creación
- ✅ Actualizar `updatedAt` en cada modificación
- ✅ (Opcional) Guardar logs de cambios

---

## 🧪 Test Cases Recomendados

### Tests Unitarios
- [ ] Crear evento con datos válidos
- [ ] Rechazar evento con título vacío
- [ ] Rechazar si fechaInicio > fechaFin
- [ ] Rechazar tipo inválido
- [ ] Rechazar estado inválido

### Tests de Integración
- [ ] GET eventos de un usuario (rango válido)
- [ ] GET retorna 403 cuando usuarioid no coincide
- [ ] POST crea evento correctamente
- [ ] PATCH estado solo por propietario
- [ ] PATCH fechas solo por propietario
- [ ] Mover evento a pasado funciona
- [ ] Listar eventos vacío cuando no hay

### Tests de Seguridad
- [ ] 401 sin token JWT
- [ ] 403 cuando usuarioid no coincide
- [ ] No devolver datos de otros usuarios
- [ ] No permitir SQL injection en parámetros

---

## 📊 Índices de Base de Datos Recomendados

```sql
-- Para búsquedas por usuario y fecha
CREATE INDEX idx_agenda_usuarioid_fechaInicio 
  ON agenda_events(usuarioid, fechaInicio);

-- Para búsquedas por rango de fechas
CREATE INDEX idx_agenda_fechas 
  ON agenda_events(fechaInicio, fechaFin);

-- Para estado
CREATE INDEX idx_agenda_estado 
  ON agenda_events(estado);
```

---

## 🚀 Roadmap de Implementación

### Sprint 1 (Base)
- [ ] Crear entity `AgendaEvent`
- [ ] Crear enums `AgendaEventType`, `AgendaEventStatus`
- [ ] Implementar GET `/api/agenda/{usuarioid}`
- [ ] Implementar POST `/api/agenda`
- [ ] Tests unitarios básicos

### Sprint 2 (Actualización)
- [ ] Implementar PATCH `/api/agenda/{id}/estado`
- [ ] Implementar PATCH `/api/agenda/{id}/fechas`
- [ ] Tests de autorización
- [ ] Validaciones completas

### Sprint 3 (Optimización)
- [ ] Índices de BD
- [ ] Paginación (opcional)
- [ ] Soft delete (opcional)
- [ ] Logs de auditoría (opcional)

---

## 📞 Contacto & Soporte

**Frontend Developer**: Fernando  
**API Base URL**: `http://localhost:8080/api`  
**JWT Header**: `Authorization: Bearer {token}`  

---

## ✅ Verificación Final

Antes de dar por completado:

- [ ] Todos los 4 endpoints funcionan
- [ ] Validaciones de entrada correctas
- [ ] Seguridad (JWT, usuarioid) implementada
- [ ] Tests unitarios ≥ 80% cobertura
- [ ] Documentación OpenAPI/Swagger actualizada
- [ ] Base de datos migrada correctamente
- [ ] Logs de errores funcionales

**Estado**: 🟢 Listo para desarrollo  
**Última actualización**: 2026-06-27
