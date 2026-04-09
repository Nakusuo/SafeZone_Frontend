# SafeZone — Frontend

> Plataforma digital integrada para la gestión de denuncias y apoyo en casos de violencia familiar.

---

## 📌 Descripción del Proyecto

**SafeZone** es un sistema web que centraliza y protege la información de víctimas de violencia familiar, coordinando de forma segura a tres actores principales: **Víctimas**, **Psicólogos** y **Defensores legales**. Este repositorio contiene el frontend de la aplicación, desarrollado con tecnologías modernas de React.

El sistema permite:
- Registro de denuncias de forma **discreta y segura**.
- Seguimiento **multidisciplinario** de cada caso (psicológico y legal).
- Control de acceso basado en **roles** para proteger los datos sensibles.
- Coordinación en tiempo real entre profesionales que atienden el caso.

---

## 🚀 Tecnologías Utilizadas

| Tecnología | Propósito |
|---|---|
| **React 18** | Biblioteca principal de UI |
| **TypeScript** | Tipado estático para mayor robustez |
| **Vite** | Bundler y servidor de desarrollo ultrarrápido |
| **React Router DOM** | Enrutamiento declarativo entre vistas |
| **Tailwind CSS** | Estilos utilitarios y diseño responsivo |
| **Axios** | Cliente HTTP para comunicación con la API REST (Spring Boot) |

---

## 👥 Roles del Sistema

El frontend implementa un sistema de **autenticación basado en roles**, restringiendo el acceso a las vistas según el perfil del usuario:

### 🧑‍🦱 Víctima
- Registro e inicio de sesión discreto.
- Creación y visualización de sus propias denuncias e incidentes.
- Subida de evidencias (texto, archivos).

### 🧑‍⚕️ Psicólogo
- Panel de casos asignados.
- Registro de bitácoras psicológicas y diagnósticos de seguimiento.
- Visualización del historial de cada víctima.

### ⚖️ Defensor Legal
- Panel de casos asignados.
- Registro de notas y avances legales.
- Coordinación con el psicólogo sobre el estado del caso.

---

## 🗂️ Estructura del Proyecto

```
src/
├── assets/            # Imágenes, íconos y recursos estáticos
├── components/        # Componentes reutilizables (Header, Sidebar, ProtectedRoute…)
├── pages/             # Vistas por rol (Login, Register, dashboards)
│   ├── auth/          # Login y registro
│   ├── victim/        # Dashboard y módulos de la víctima
│   ├── psychologist/  # Dashboard del psicólogo
│   └── defender/      # Dashboard del defensor legal
├── services/          # Capa de servicios Axios (llamadas a la API)
├── router/            # Configuración de React Router DOM
├── types/             # Definiciones de tipos TypeScript
└── main.tsx           # Punto de entrada de la aplicación
```

---

## ⚙️ Instalación y Ejecución Local

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Nakusuo/SafeZone_Frontend.git
cd SafeZone_Frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend (Spring Boot)

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción |

---

## 🔗 Conexión con el Backend

Este frontend consume la **API REST** del backend SafeZone, desarrollado con **Spring Boot** y desplegado en **Azure App Service**. Los datos (denuncias, evidencias, bitácoras) se almacenan en **Azure Cosmos DB**.

Configura la URL base del backend en el archivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🔐 Seguridad y Privacidad

- Las rutas privadas están protegidas mediante un componente `ProtectedRoute` que valida el rol del usuario.
- Los tokens de autenticación se gestionan de forma segura (sin exposición en la URL).
- La interfaz está diseñada para ser **discreta**, minimizando la visibilidad de contenido sensible en pantalla.

---

## 📋 Justificación

Las víctimas de violencia familiar enfrentan barreras críticas para buscar ayuda. SafeZone surge como respuesta a la fragmentación de los sistemas tradicionales, donde la información psicológica, legal y de denuncia se gestiona de forma aislada, causando revictimización y lentitud en la coordinación. Esta plataforma centraliza y protege esa información bajo estrictos controles de acceso.

---

## 📄 Licencia

Este proyecto es de carácter académico y social. Todos los derechos reservados © SafeZone.
