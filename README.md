# e4-api-management

API RESTful para la gestión de tickets, usuarios y permisos. Construido con Express, TypeScript, Sequelize y PostgreSQL.

## 📋 Descripción

e4-api-management es un servidor backend que proporciona una API completa para gestionar:

- **Tickets**: Crear, actualizar, eliminar y transicionar tickets a través de diferentes estados
- **Usuarios**: Gestión de usuarios y sus permisos dentro del sistema
- **Catálogos**: Roles, permisos, estados de tickets y transiciones permitidas
- **Autenticación**: Sistema JWT para autenticación y autorización
- **Comentarios**: Asociar comentarios a tickets para mejorar la colaboración

## 🏗️ Estructura del Proyecto

```
src/
├── app.ts                    # Configuración principal de Express
├── server.ts                 # Punto de entrada de la aplicación
├── config/
│   ├── dependencies.ts       # Inyección de dependencias
│   ├── index.ts             # Configuración de variables de entorno
│   └── sequelize.ts         # Configuración de base de datos
├── controllers/              # Controladores de rutas
│   ├── authController.ts
│   ├── catalogsController.ts
│   ├── healthController.ts
│   ├── meController.ts
│   ├── ticketsController.ts
│   └── usersController.ts
├── middleware/               # Middlewares de Express
│   ├── errorHandler.ts
│   ├── logger.ts
│   ├── ticketValidators.ts
│   ├── validateRequest.ts
│   └── permissions/
│       ├── auth.ts           # Autenticación JWT
│       └── canInteractWithTicket.ts
├── models/
│   ├── domain/               # Modelos de dominio (tipos TypeScript)
│   ├── dto/                  # Data Transfer Objects
│   ├── envelope/             # Envoltorios de respuesta
│   ├── request/              # Modelos de solicitud
│   ├── response/             # Modelos de respuesta
│   └── sequelize/            # Modelos ORM de Sequelize
├── repositories/             # Patrón Repository
│   ├── impl/                 # Implementaciones concretas
│   └── interfaces/           # Interfaces de repositorio
├── routes/                   # Rutas de la API
│   ├── auth.ts
│   ├── catalogs.ts
│   ├── health.ts
│   ├── index.ts
│   ├── me.ts
│   ├── tickets.ts
│   └── users.ts
├── services/                 # Lógica de negocio
│   ├── impl/                 # Implementaciones concretas
│   └── interfaces/           # Interfaces de servicios
└── utils/                    # Utilidades
    ├── AppMessages.ts        # Mensajes de la aplicación
    ├── AppTypes.ts           # Tipos globales
    └── metadataHelper.ts     # Ayudantes para metadatos
```

## 🚀 Instalación

### Requisitos previos

- Node.js 16+
- npm o yarn
- PostgreSQL 12+

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Ort-26/e4-api-management.git
   cd e4-api-management
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus valores:
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/e4_db
   JWT_SECRET=your_jwt_secret_key
   API_PREFIX=/api
   ```

4. **Ejecutar migraciones y seeds**
   ```bash
   npm run build
   npm start
   ```

## 📦 Scripts Disponibles

- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en modo desarrollo con hot-reload
- `npm run typecheck` - Verifica tipos TypeScript sin compilar
- `npm test` - Ejecuta pruebas unitarias

## 🔗 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Tickets
- `GET /api/tickets` - Obtener todos los tickets
- `GET /api/tickets/:id` - Obtener detalle de ticket
- `POST /api/tickets` - Crear nuevo ticket
- `PUT /api/tickets/:id` - Actualizar ticket
- `POST /api/tickets/:id/comments` - Agregar comentario
- `POST /api/tickets/:id/assign` - Asignar ticket
- `POST /api/tickets/:id/transition` - Cambiar estado del ticket

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `GET /api/me` - Obtener perfil del usuario actual

### Catálogos
- `GET /api/catalogs/roles` - Obtener roles disponibles
- `GET /api/catalogs/permissions` - Obtener permisos
- `GET /api/catalogs/ticket-statuses` - Obtener estados de tickets

### Health Check
- `GET /api/health` - Estado de la aplicación

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación. Incluye el token en el header:

```
Authorization: Bearer <your_jwt_token>
```

## 🗄️ Base de Datos

El proyecto utiliza **Sequelize** como ORM con PostgreSQL. Los modelos incluyen:

- **Tablas Maestras**: Usuarios, Tickets, Comentarios
- **Tablas Catálogo**: Roles, Permisos, Estados de Tickets
- **Tablas Control**: Transiciones de estado, Permisos-Roles
- **Tablas Históricas**: Cambios de asignación, Cambios de estado

## 🐳 Docker

Para ejecutar con Docker:

```bash
docker-compose -f docker-compose.yml up
```

## 📝 Licencia

ISC

## 👥 Autor

Creado por Ort-26
