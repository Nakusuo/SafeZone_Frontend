# 🚀 SafeZone Frontend - Guía de Inicio

## Requisitos Previos

✅ Node.js 18+ instalado  
✅ npm instalado  
✅ VS Code (opcional pero recomendado)

## 🔧 Instalación

```bash
# 1. Navega a la carpeta del proyecto
cd SafeZone_Frontend

# 2. Instala las dependencias (ya completado)
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

El servidor estará disponible en: **http://localhost:5173**

## 👤 Credenciales de Prueba

### Víctima (Panel de Denuncias)
- **Email:** maria@example.com
- **Contraseña:** password123

### Psicólogo (Panel de Evaluación)
- **Email:** patricia@example.com
- **Contraseña:** password123

### Defensor Legal (Panel Legal)
- **Email:** carlos@example.com
- **Contraseña:** password123

## 📱 Características Implementadas

### ✅ Autenticación
- Login con validación
- Registro de nuevos usuarios
- Gestión de roles (Víctima, Psicólogo, Defensor)

### ✅ Dashboards por Rol
- **Dashboard Víctima:** Ver denuncias, equipo profesional, recursos
- **Dashboard Psicólogo:** Gestionar casos, pacientes, evaluaciones
- **Dashboard Defensor:** Casos legales, audiencias, colaboración

### ✅ Datos Locales
- Base de datos JSON integrada
- Sin necesidad de backend para desarrollo
- Fácil migración a API real

### ✅ Diseño
- Interfaz moderna y responsiva
- Paleta de colores discreta y segura
- Accesible en móvil, tablet y desktop

## 📂 Estructura de Carpetas

```
src/
├── assets/          # Imágenes e íconos
├── components/      # Componentes reutilizables
│   ├── Header
│   ├── Sidebar
│   ├── Layout
│   ├── Card
│   ├── Button
│   └── FormFields
├── pages/           # Vistas por rol
│   ├── auth/        # Login, Register
│   ├── victim/      # Dashboard víctima
│   ├── psychologist/# Dashboard psicólogo
│   └── defender/    # Dashboard defensor
├── services/        # Lógica de negocio
│   ├── api.ts       # Cliente HTTP
│   ├── auth.ts      # Autenticación
│   ├── localStorage.ts  # Datos locales
│   ├── reports.ts   # Reportes
│   └── users.ts     # Usuarios
├── router/          # React Router
├── types/           # TypeScript interfaces
├── config/          # Configuración global
├── data/            # Datos JSON
└── main.tsx         # Punto de entrada
```

## 🔄 Ciclo de Desarrollo

### 1. Editar Componentes
Los cambios se guardan automáticamente gracias a Vite HMR (Hot Module Reload).

### 2. Probar Funcionalidades
- Navega entre dashboards según el rol
- Verifica que los datos se carguen correctamente
- Prueba el logout y vuelve a autenticarte

### 3. Agregar Funcionalidades Nuevas
- Usa los componentes base (Card, Button, Input, etc.)
- Sigue el patrón de servicios existentes
- Verifica tipos TypeScript antes de guardar

## � Persistencia de Datos

### Lo que sucede cuando usas SafeZone:

✅ **Crear datos** (denuncias, usuarios, evaluaciones)
- Se guardan en localStorage del navegador
- Persisten aunque refresques la página
- Se mantienen mientras no limpies el navegador

❌ **Cerrar y limpiar navegador**
- Se pierden todos los datos locales
- La próxima vez que abras, cargan datos iniciales

### Ejemplo:
1. Creas nueva denuncia → Se guarda automáticamente ✓
2. Refrescas página (F5) → La denuncia está ahí ✓
3. Limpias cache (Ctrl+Shift+Del) → Se olvida ✓
4. Próxima sesión → Datos iniciales nuevamente

### Resetear Datos Manualmente

```javascript
// En DevTools (F12 → Console)
localStorage.removeItem('safezone_appdata')
// Luego recarga: Ctrl+F5
```

```bash
# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Lint del código
npm run lint

# Preview de producción
npm run preview
```

## 📝 Próximas Tareas

- [ ] Crear formulario de nueva denuncia
- [ ] Implementar creación de evaluaciones
- [ ] Agregar búsqueda y filtrado
- [ ] Conectar con backend Spring Boot
- [ ] Implementar notificaciones en tiempo real
- [ ] Agregar exportación de reportes PDF

## 🔗 Conectar Backend

Cuando el backend esté listo:

```typescript
// en src/config/index.ts
export const config = {
  USE_LOCAL_DATA: false,  // Cambiar a false
  API_URL: 'http://localhost:8080/api',
}

// o usar variable de entorno
// VITE_API_URL=http://tuapi.com/api npm run dev
```

## 🐛 Troubleshooting

### El servidor no inicia
```bash
# Limpia node_modules
rm -rf node_modules
npm install
npm run dev
```

### Error: "Cannot find module"
```bash
# Reinstala dependencias
npm install
```

### TypeScript errors
```bash
# Compila tipos
npm run build
```

## 📚 Documentación Adicional

- [LOCAL_DATA.md](./LOCAL_DATA.md) - Guía completa de datos locales
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

## 💡 Tips

1. Usa React DevTools para debuggear componentes
2. Abre la consola del navegador para ver logs
3. Los datos se resetean al refrescar la página
4. Los cambios en TypeScript se validan al guardar

## 📞 Soporte

Para reportar errores o sugerencias, documenta:
- Pasos para reproducir
- Navegador y versión
- Screenshot si aplica

---

**¡Feliz coding! 🎉**
