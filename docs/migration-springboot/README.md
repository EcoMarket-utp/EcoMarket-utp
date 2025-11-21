spring:
jwt:

# Stack y migración backend EcoMarket (NestJS)

Este documento describe el stack y las buenas prácticas para el backend de EcoMarket usando **NestJS** (Node.js), manteniendo los objetivos funcionales: API REST segura con JWT, conexión a PostgreSQL (AWS RDS), subida de imágenes a S3, documentación Swagger/OpenAPI y CI/CD.

> Estado actual del proyecto: Monorepo con frontend (Angular + Tailwind) y backend (NestJS). Esta guía consolida el stack y la estructura recomendada para el backend.

## 1. Stack objetivo (Node/NestJS)

- Node.js 18+
- NestJS (TypeScript)
- Prisma ORM
- PostgreSQL (AWS RDS)
- JWT (autenticación y roles)
- Validación con `class-validator`
- Swagger (OpenAPI)
- AWS SDK v3 (S3)
- Testing: Jest, Supertest
- Build: npm, pnpm o yarn

## 2. Dependencias recomendadas

En `package.json`:

```json
"dependencies": {
  "@nestjs/common": "^10.x",
  "@nestjs/core": "^10.x",
  "@nestjs/jwt": "^10.x",
  "@nestjs/passport": "^10.x",
  "@nestjs/swagger": "^7.x",
  "@prisma/client": "^5.x",
  "passport": "^0.6.x",
  "passport-jwt": "^4.x",
  "bcryptjs": "^2.x",
  "class-validator": "^0.14.x",
  "class-transformer": "^0.5.x",
  "aws-sdk": "^2.x" // o "@aws-sdk/client-s3": "^3.x"
},
"devDependencies": {
  "jest": "^29.x",
  "supertest": "^6.x",
  "ts-jest": "^29.x",
  "prisma": "^5.x"
}
```

## 3. Estructura de carpetas sugerida

```
apps/backend/
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  ├─ auth/         # Módulo de autenticación y roles
│  ├─ users/        # Usuarios y roles
│  ├─ products/     # Productos y lógica de S3
│  ├─ prisma/       # Servicio de Prisma
│  └─ ...           # Otros módulos
├─ prisma/
│  └─ schema.prisma
├─ .env
├─ package.json
├─ README.md
```

## 4. Configuración (.env ejemplo)

```
DATABASE_URL=postgresql://usuario:password@host:puerto/ecomarket
JWT_SECRET=tu-secreto
AWS_REGION=us-east-1
AWS_S3_BUCKET=ecomarket-bucket
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
```

## 5. Seguridad (JWT y roles)

- Usa `@nestjs/jwt` y `@nestjs/passport` para autenticación.
- Implementa guards y decoradores para roles (`RolesGuard`, `@Roles()`).
- Protege rutas según rol (comprador, vendedor, admin).

## 6. Datos y migraciones

- Modela entidades en `prisma/schema.prisma` (User, Role, Product, etc.).
- Ejecuta migraciones con Prisma (`npx prisma migrate dev`).

## 7. AWS S3

- Usa `@aws-sdk/client-s3` para subir y gestionar imágenes.
- Configura credenciales en `.env` y usa servicios inyectables en NestJS.

## 8. Swagger/OpenAPI

- Usa `@nestjs/swagger` para documentar la API.
- Accede a la documentación en `/api` o `/swagger`.

## 9. Testing

- Pruebas unitarias y de integración con Jest y Supertest.
- Mock de servicios externos (S3, Prisma) para tests.

## 10. Docker y CI/CD

- Dockerfile para backend y `docker-compose` para base de datos local.
- GitHub Actions o CircleCI para build, test y despliegue.

## 11. Guía rápida de ejecución

```bash
# Instalar dependencias
npm install

# Migrar base de datos
npx prisma migrate dev

# Ejecutar en desarrollo
npm run start:dev

# Ejecutar pruebas
npm run test
```

## 12. Mapeo de módulos

- Controllers → `@Controller` + rutas.
- Services → `@Injectable` (inyección de dependencias).
- Prisma → Servicio y cliente para acceso a datos.
- Guards/Roles → Guards personalizados y decoradores.
- DTOs → Clases con `class-validator`.
- Swagger → Decoradores de NestJS Swagger.
- S3 → Servicio con AWS SDK.

## 13. Buenas prácticas

- No subir `.env`, `node_modules`, ni archivos sensibles al repositorio.
- Documentar endpoints y flujo de trabajo en el README.
- Usar migraciones y validaciones en Prisma.
- Mantener la estructura modular y el código limpio.

---

¿Necesitas ejemplos de código, scripts de inicio o plantillas para los módulos principales? Puedo generarlos y agregarlos al proyecto en la estructura actual.