# Datos Locales - SafeZone Frontend

## 🗂️ Estructura de Datos

El proyecto utiliza datos JSON locales almacenados en `src/data/mockData.json` para simular una API REST durante el desarrollo.

### Archivos principales:
- `src/data/mockData.json` - Base de datos local con datos de prueba
- `src/services/localStorage.ts` - Servicio que simula llamadas a API
- `src/services/auth.ts` - Autenticación con datos locales
- `src/services/reports.ts` - Gestión de reportes/denuncias
- `src/services/users.ts` - Gestión de usuarios

## 👥 Usuarios de Prueba

Usa estas credenciales para probar los diferentes roles:

### Víctima
- **Email:** maria@example.com
- **Contraseña:** password123
- **Rol:** VICTIM

### Psicólogo
- **Email:** patricia@example.com
- **Contraseña:** password123
- **Rol:** PSYCHOLOGIST

### Defensor Legal
- **Email:** carlos@example.com
- **Contraseña:** password123
- **Rol:** DEFENDER

## 📊 Datos Disponibles

### Usuarios (users)
```json
{
  "id": "user1",
  "name": "María García",
  "email": "maria@example.com",
  "password": "password123",
  "role": "VICTIM",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Denuncias/Reportes (reports)
```json
{
  "id": "report1",
  "victimId": "user1",
  "title": "Violencia física",
  "description": "Incidente ocurrido...",
  "type": "PHYSICAL_VIOLENCE",
  "status": "UNDER_EVALUATION",
  "priority": "HIGH",
  "createdAt": "2024-04-06T14:30:00Z",
  "psychologistId": "user2",
  "defenderId": "user3"
}
```

### Estados de Reporte
- `PENDING` - Pendiente de evaluación
- `UNDER_EVALUATION` - En evaluación psicológica
- `IN_FOLLOW_UP` - En seguimiento
- `RESOLVED` - Caso resuelto

### Tipos de Violencia
- `PHYSICAL_VIOLENCE` - Violencia física
- `PSYCHOLOGICAL_ABUSE` - Abuso psicológico
- `OTHER` - Otro

### Prioridades
- `LOW` - Baja
- `MEDIUM` - Media
- `HIGH` - Alta/Urgente

## 💾 Persistencia de Datos Durante la Sesión

### Cómo Funciona

Todos los cambios que hagas durante la sesión se guardan automáticamente en el **localStorage del navegador**:

1. **Creas un dato** (nueva denuncia, usuario, evaluación) → Se guarda en localStorage
2. **Modificas un dato** → Se actualiza en localStorage
3. **Cierras/Refrescas el navegador** → Los datos se olvidan y vuelven al estado inicial

### Ejemplo de Flujo

```
┌─────────────────────────────────────────────────────────┐
│ Inicio (datos de mockData.json en memoria)              │
├─────────────────────────────────────────────────────────┤
│ • Creo una nueva denuncia                               │
│   → Se guarda en localStorage del navegador ✓           │
├─────────────────────────────────────────────────────────┤
│ • Recargo la página                                      │
│   → Se recuperan datos de localStorage ✓                │
├─────────────────────────────────────────────────────────┤
│ • Cierro el navegador / Cambio de pestaña               │
│   → localStorage se mantiene ✓                          │
├─────────────────────────────────────────────────────────┤
│ • Limpiar cache del navegador (Ctrl+Shift+Del)          │
│   → localStorage se elimina                            │
│   → Próximo inicio carga datos iniciales de mockData    │
└─────────────────────────────────────────────────────────┘
```

Cuando el backend (Spring Boot + Azure Cosmos DB) esté listo, cambiar es fácil:

### Opción 1: Usar Axios (recomendado)
Descomentar el servicio `api.ts` y usar:
```typescript
import apiClient from './api'

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  },
  // ...
}
```

### Opción 2: Crear adapter
```typescript
// services/adapter.ts
const USE_LOCAL_DATA = import.meta.env.VITE_USE_LOCAL === 'true'

export const apiAdapter = USE_LOCAL_DATA 
  ? localStorageService 
  : apiClient
```

## 🛠️ Funciones Útiles

### Resetear Datos a Estado Inicial

Si quieres volver a los datos iniciales de desarrollo:

**Opción 1: Desde la consola del navegador**
```javascript
// En DevTools Console (F12)
localStorage.removeItem('safezone_appdata')
// Luego recarga la página: Ctrl+F5
```

**Opción 2: Limpiar cache del navegador**
- Chrome: Ctrl+Shift+Del → Selecciona "Cookies y otros datos de sitios" → Borra
- Firefox: Ctrl+Shift+Del → "Cookies" y "Cache" → Borra

**Opción 3: Usar función de reseteo**
```typescript
import { resetData } from './services/localStorage'
resetData()  // Vuelve a datos iniciales de mockData.json
```

### Estructura de localStorage

En el navegador, SafeZone guarda todo bajo la clave `safezone_appdata`:

```javascript
// Contenido de localStorage['safezone_appdata']
{
  "users": [...],
  "reports": [...],
  "evaluations": [...],
  "legalUpdates": [...]
}
```

Ver en DevTools: F12 → Application → Local Storage → http://localhost:5174

### Velocidad

Sin localStorage:
- Cada cambio se guardaba solo en memoria
- Al refrescar: perdía los cambios

Con localStorage:
- Cada cambio se persiste automáticamente (~5ms)
- Al refrescar: se recuperan los datos ✓
- Sin conexión: los datos siguen disponibles ✓

### Obtener todos los datos
```typescript
import { localStorageService } from './services/localStorage'

const allData = localStorageService.getAllData()
console.log(allData) // Ver estructura completa
```

## 🚀 Próximos Pasos

1. **Backend:** Implementar API REST con Spring Boot
2. **Database:** Configurar Azure Cosmos DB
3. **Variables de entorno:** Cambiar `VITE_API_URL`
4. **Testing:** Verificar que los servicios funcionan con API real
5. **Deployment:** Desplegar con Azure App Service

## 📝 Notas

- Los datos se guardan en memoria durante la sesión
- Al recargar la página, vuelven a los valores iniciales
- Para persistencia real, usar el backend
- Los delays en `localStorage.ts` simulan latencia de red

## 🔐 Seguridad

⚠️ **Para desarrollo solo:**
- Las contraseñas están en texto plano en mockData.json
- No usar en producción
- El token es un string temporal (no JWT)
