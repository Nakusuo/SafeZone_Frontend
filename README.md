# SafeZone Frontend

Plataforma integral de apoyo para víctimas de violencia con dashboards especializados.

## 🚀 Stack Tecnológico

- **React 18** + TypeScript
- **Tailwind CSS 3** - Diseño con colores SafeZone
- **Vite 5** - Build ultrarrápido
- **React Router** - SPA routing
- **Lucide React** - Iconografía
- **Axios** - Cliente HTTP

## 📦 Instalación y Configuración

```bash
npm install
npm run dev
```

Servidor de desarrollo local en: **http://localhost:5173**

### Configuración del Entorno (`.env`)

```env
# URL del backend (Spring Boot)
VITE_API_URL=http://localhost:8080/api

# MOCK MODE: true para usar datos locales sin backend, false para conectar al backend real
VITE_USE_MOCK=true
```

## 👤 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@example.com | admin123 |
| Víctima | maria@example.com | password123 |
| Psicólogo | patricia@example.com | password123 |
| Defensor Legal | carlos@example.com | password123 |

## 🏗️ Nueva Arquitectura (Feature-Based)

```text
src/
├── core/            # Configuración principal (AuthContext, apiClient, router)
├── features/        # Módulos separados por dominio de negocio
│   ├── admin/       # Dashboard y triaje de administrador
│   ├── auth/        # Login y registro
│   ├── defender/    # Dashboard legal y audiencias
│   ├── psychologist/# Dashboard clínico y casos
│   ├── victim/      # Dashboard, denuncias y botón de pánico
│   └── shared-features/ # Chat, Notificaciones, Alertas de emergencia (uso cruzado)
├── shared/          # Código compartido (componentes UI, tipos, utilidades)
└── data/            # mockData.json (datos iniciales para el modo local)
```

## 📌 Características Clave

✅ **Autenticación por rol**: Administrador, Víctima, Psicólogo, Defensor Legal.  
✅ **Dashboards personalizados**: Adaptados a las necesidades de cada perfil.  
✅ **Gestión de Denuncias**: Creación de reportes de violencia física, psicológica, sexual, etc.  
✅ **RF-03 Botón de Pánico (NUEVO)**: Botón de emergencia SOS flotante para víctimas.
  - Captura automática de **geolocalización GPS** en tiempo real.
  - Alternativa de dirección manual en caso de bloqueo GPS.
  - Countdown de 10 segundos para auto-envío.
✅ **Panel de Alertas en Tiempo Real**: Panel para que profesionales (Psicólogos, Defensores, Admins) vean alertas activas e interactúen marcándolas como atendidas o resueltas.  
✅ **Modo Mock / Backend Real**: Sistema robusto con `VITE_USE_MOCK` para alternar entre `sessionStorage` (sin backend) y llamadas RESTful a Spring Boot.

## 🔗 Integración con Backend (Spring Boot + Cosmos DB)

El frontend está listo para comunicarse con la API. Los endpoints implementados para la función RF-03 (Botón de Pánico) son:

| Método | Endpoint | Acción |
|---|---|---|
| `POST` | `/api/emergency/alerts` | Crea una alerta de pánico (GPS/Manual) |
| `GET` | `/api/emergency/alerts?status=ACTIVE` | Lista las alertas activas para el panel |
| `PATCH`| `/api/emergency/alerts/{id}/attend` | Un profesional atiende la alerta |
| `PATCH`| `/api/emergency/alerts/{id}/resolve` | Cierre del caso de la alerta |

## 📝 Comandos

```bash
npm run dev        # Desarrollo (HMR)
npm run build      # Construir producción
npm run preview    # Vista previa del build
npm run lint       # Análisis ESLint
tsc --noEmit       # Verificación estricta de TypeScript
```

## 🎨 Colores SafeZone

- **Primary**: `#084C61` (Azul Oscuro)
- **Secondary**: `#6A994E` (Verde Salvia)
- **Accent**: `#BC4749` (Rojo Suave)
