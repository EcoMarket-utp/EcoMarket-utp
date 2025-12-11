# Estructura de Carpetas - EcoMarket Backend

Esta arquitectura sigue las mejores prácticas de NestJS y está organizada por responsabilidades y funcionalidades.

## Estructura General

```
src/
├── config/                    # Configuraciones centralizadas
│   ├── database.config.ts     # Configuración de base de datos
│   ├── jwt.config.ts          # Configuración de JWT
│   └── storage.config.ts      # Configuración de almacenamiento
├── common/                    # Módulos compartidos de toda la app
│   ├── constants/             # Constantes globales
│   │   ├── app.constants.ts   # Constantes de la app
│   │   └── validation.constants.ts  # Reglas de validación
│   ├── decorators/            # Decoradores globales
│   ├── filters/               # Exception filters globales
│   │   └── http-exception.filter.ts
│   ├── guards/                # Guards globales
│   │   ├── jwt-auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/          # Interceptores globales
│   ├── pipes/                 # Pipes de validación
│   │   ├── validation.pipe.ts
│   │   └── parse-int.pipe.ts
│   ├── services/              # Servicios compartidos
│   │   └── upload.service.ts
│   ├── upload/                # Módulo de carga de archivos
│   │   ├── upload.controller.ts
│   │   ├── upload.module.ts
│   │   └── upload.service.ts
│   └── utils/                 # Funciones de utilidad
│       └── helpers.ts
├── modules/                   # Módulos de negocio (features)
│   ├── auth/                  # Autenticación y autorización
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── decorators/        # Decoradores específicos
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── guards/            # Guards específicos
│   │   ├── interfaces/        # Interfaces/tipos
│   │   ├── strategies/        # Estrategias de Passport
│   │   ├── auth.controller.spec.ts
│   │   └── auth.service.spec.ts
│   ├── users/                 # Gestión de usuarios
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.spec.ts
│   │   └── users.service.spec.ts
│   ├── products/              # Gestión de productos
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── products.module.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── products.controller.spec.ts
│   │   └── products.service.spec.ts
│   ├── categories/            # Gestión de categorías
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   ├── categories.module.ts
│   │   ├── dto/
│   │   ├── categories.controller.spec.ts
│   │   └── categories.service.spec.ts
│   ├── admin/                 # Funciones administrativas
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   ├── admin.module.ts
│   │   ├── dto/
│   │   ├── admin.controller.spec.ts
│   │   └── admin.service.spec.ts
├── prisma/                    # ORM Prisma
│   ├── schema.prisma          # Esquema de la base de datos
│   ├── migrations/            # Migraciones de la BD
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── app.module.ts              # Módulo raíz
├── app.controller.ts          # Controlador raíz
├── app.service.ts             # Servicio raíz
└── main.ts                    # Punto de entrada
```

## Convenciones de Nombres

### Archivos
- `*.controller.ts` - Controladores
- `*.service.ts` - Servicios de lógica de negocio
- `*.module.ts` - Módulos
- `*.spec.ts` - Tests unitarios
- `*.filter.ts` - Exception filters
- `*.guard.ts` - Guards
- `*.pipe.ts` - Pipes de validación
- `*.interceptor.ts` - Interceptores

### Clases
- `CreateUserDto` - DTO para crear recurso
- `UpdateUserDto` - DTO para actualizar recurso
- `UserEntity` - Entidad/modelo
- `JwtAuthGuard` - Guard
- `ValidationPipe` - Pipe

## Responsabilidades por Carpeta

### `/config`
Centralizamos todas las configuraciones de la aplicación usando ConfigModule de NestJS. Permite cargar variables de entorno y exponerlas de forma tipada.

**Archivos:**
- `database.config.ts` - Configuración de conexión a BD
- `jwt.config.ts` - Configuración de JWT
- `storage.config.ts` - Configuración de almacenamiento

### `/common/constants`
Valores constantes que se reutilizan en toda la aplicación: mensajes de error, validaciones, códigos HTTP, etc.

**Archivos:**
- `app.constants.ts` - Constantes generales
- `validation.constants.ts` - Reglas de validación y mensajes de error

### `/common/filters`
Exception filters globales para manejo de errores HTTP.

**Archivos:**
- `http-exception.filter.ts` - Manejo centralizado de excepciones HTTP

### `/common/guards`
Guards globales reutilizables.

**Archivos:**
- `jwt-auth.guard.ts` - Guard de autenticación JWT
- `role.guard.ts` - Guard de validación de roles

### `/common/pipes`
Pipes de validación y transformación globales.

**Archivos:**
- `validation.pipe.ts` - Validación de DTOs
- `parse-int.pipe.ts` - Conversión de parámetros a números

### `/common/utils`
Funciones auxiliares reutilizables (helpers, formatters, validadores).

**Archivos:**
- `helpers.ts` - Funciones de utilidad general

### `/modules/{feature}`
Cada módulo de negocio contiene toda su lógica encapsulada:
- `*.controller.ts` - Manejo de rutas HTTP
- `*.service.ts` - Lógica de negocio
- `*.module.ts` - Configuración del módulo
- `dto/` - Data Transfer Objects para validación
- `entities/` - Modelos/tipos de datos
- `*.spec.ts` - Tests unitarios

## Importaciones Recomendadas

### En Controladores
```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { MyService } from './my.service';
import { CreateMyDto } from './dto/create-my.dto';
```

### En Servicios
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VALIDATION_RULES } from 'src/common/constants/validation.constants';
```

### Usando Guards
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile() { }
```

## Agregar Nuevo Feature

1. Crear carpeta en `/modules/{feature-name}`
2. Generar archivos base:
   ```bash
   nest g module modules/feature-name
   nest g controller modules/feature-name
   nest g service modules/feature-name
   ```
3. Crear DTOs en `dto/`
4. Crear entidades en `entities/`
5. Crear archivos `.spec.ts` para tests
6. Registrar módulo en `app.module.ts`

## Testing

Cada módulo debe tener archivos de test:
- `*.controller.spec.ts` - Tests del controlador
- `*.service.spec.ts` - Tests del servicio

Los tests proporcionan mocks de `PrismaService` y otras dependencias.

```bash
npm run test
npm run test:watch
npm run test:cov
```
