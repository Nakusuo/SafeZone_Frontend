# SafeZone Frontend

Frontend de SafeZone: Plataforma de Protección Integral

## Tecnologías

- **React 18** - Biblioteca principal de UI
- **TypeScript** - Tipado estático
- **Vite** - Bundler y servidor de desarrollo ultrarrápido
- **React Router DOM** - Enrutamiento declarativo
- **Tailwind CSS** - Estilos utilitarios
- **Axios** - Cliente HTTP para API REST

## Estructura del Proyecto

```
src/
├── assets/            # Imágenes, íconos y recursos estáticos
├── components/        # Componentes reutilizables
├── pages/             # Vistas por rol
│   ├── auth/          # Login y registro
│   ├── victim/        # Dashboard de víctima
│   ├── psychologist/  # Dashboard de psicólogo
│   └── defender/      # Dashboard de defensor legal
├── services/          # Capa de servicios Axios
├── router/            # Configuración de React Router
├── types/             # Definiciones de tipos TypeScript
└── main.tsx           # Punto de entrada
```

## Primeros Pasos

### Instalación de dependencias

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080/api
```

## Arquitectura

### Capa de Servicios
Los servicios en `src/services/` manejan todas las comunicaciones con la API REST Spring Boot usando Axios.

### Protección de Rutas
El componente `ProtectedRoute` verifica autenticación y autorización por rol antes de acceder a vistas protegidas.

### Tipado TypeScript
Todos los tipos se centralizan en `src/types/` para mantener coherencia en toda la aplicación.
