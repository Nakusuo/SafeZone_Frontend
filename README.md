# SafeZone Frontend

Plataforma integral de apoyo para víctimas de violencia con dashboards especializados.

## 🚀 Stack Tecnológico

- **React 18** + TypeScript
- **Tailwind CSS 3** - Diseño con colores SafeZone
- **Vite 5** - Build ultrarrápido
- **React Router** - SPA routing
- **Lucide React** - Iconografía
- **Axios** - Cliente HTTP

## 📦 Instalación

```bash
npm install
npm run dev
```

Servidor en: **http://localhost:5176**

## 👤 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Víctima | maria@example.com | password123 |
| Psicólogo | patricia@example.com | password123 |
| Defensor Legal | carlos@example.com | password123 |

## 🏗️ Estructura

```
src/
├── components/      # UI components reutilizables
├── pages/
│   ├── auth/        # Login/Register
│   ├── victim/      # Dashboard y flujos de víctima (crear denuncia, ver reportes, perfil)
│   ├── psychologist/# Dashboard de psicólogo
│   └── defender/    # Dashboard de defensor legal
├── services/        # Lógica de autenticación y datos
├── types/           # TypeScript types
├── router/          # Configuración de rutas
└── main.tsx         # Entry point
```

## 📝 Comandos

```bash
npm run dev        # Desarrollo
npm run build      # Producción
npm run preview    # Vista previa de build
npm run lint       # Análisis ESLint
```

## 🎨 Colores SafeZone

- **Primary**: #084C61 (Azul Oscuro)
- **Secondary**: #6A994E (Verde Salvia)
- **Accent**: #BC4749 (Rojo Suave)

## 📌 Características

✅ Autenticación por rol (Víctima, Psicólogo, Defensor)  
✅ Dashboards personalizados por rol  
✅ Creación y visualización de denuncias  
✅ Sistema de datos local (localStorage)  
✅ Interfaz responsiva con Tailwind CSS
