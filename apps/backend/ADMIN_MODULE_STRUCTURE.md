# Estructura del Módulo Admin - Visualización

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN MODULE - NestJS                     │
└─────────────────────────────────────────────────────────────┘

apps/backend/src/admin/
│
├── 📄 admin.module.ts
│   └─ Configura: AdminController, AdminService, PrismaModule
│
├── 🎮 admin.controller.ts (9 endpoints)
│   ├─ GET    /admin/users                    → getAllUsers
│   ├─ GET    /admin/users/:id                → getUserById
│   ├─ GET    /admin/users-by-role/:role      → getUsersByRole
│   ├─ GET    /admin/search?q=query           → searchUsers
│   ├─ GET    /admin/statistics               → getStatistics
│   ├─ PATCH  /admin/users/:id/role           → updateUserRole
│   ├─ PATCH  /admin/users/:id/status         → updateUserStatus
│   ├─ POST   /admin/users/create-admin       → createAdminUser
│   └─ DELETE /admin/users/:id                → deleteUser
│
├── ⚙️  admin.service.ts (9 métodos)
│   ├─ getAllUsers()
│   ├─ getUserById()
│   ├─ getUsersByRole()
│   ├─ updateUserRole()
│   ├─ updateUserStatus()
│   ├─ getUserStatistics()
│   ├─ searchUsers()
│   ├─ createAdminUser()
│   └─ deleteUser()
│
├── 📦 dto/
│   ├─ index.ts
│   ├─ update-user-role.dto.ts       → { newRole: string }
│   ├─ update-user-status.dto.ts     → { isActive: boolean }
│   └─ create-admin-user.dto.ts      → { email, password, firstName, lastName }
│
├── 🧪 admin.controller.spec.ts
├── 🧪 admin.service.spec.ts
│
├── 📖 README.md                      (Documentación completa de endpoints)
├── 📖 GUIDE.md                       (Guía de uso y características)
└── 📁 (Este archivo)

┌─────────────────────────────────────────────────────────────┐
│                   PROTECCIÓN DE ENDPOINTS                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  @UseGuards(JwtAuthGuard, RolesGuard)                        │
│  @Roles('ADMIN')                                             │
│                                                               │
│  ✓ Requiere JWT válido                                       │
│  ✓ Solo usuarios con rol ADMIN                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   FLUJO DE AUTENTICACIÓN                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. POST /auth/login                                         │
│     → Genera JWT token                                       │
│                                                               │
│  2. GET /admin/users                                         │
│     + Headers: Authorization: Bearer <token>                │
│     → JwtAuthGuard valida token                              │
│     → RolesGuard verifica rol = ADMIN                        │
│     → AdminController procesa request                        │
│     → AdminService consulta Prisma                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   OPERACIONES POR ENDPOINT                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 LECTURA (GET)                                             │
│  ├─ Listar todos → Paginación + Filtros                    │
│  ├─ Por ID → Detalles + Productos                          │
│  ├─ Por Rol → Filtrado                                      │
│  ├─ Búsqueda → Por email/nombre                             │
│  └─ Estadísticas → Totales y gráficos                       │
│                                                               │
│  ✏️  ACTUALIZACIÓN (PATCH)                                    │
│  ├─ Cambiar rol → CUSTOMER/SELLER/ADMIN                    │
│  └─ Cambiar estado → Activo/Inactivo                       │
│                                                               │
│  ➕ CREACIÓN (POST)                                           │
│  └─ Nuevo admin → Email + Contraseña                       │
│                                                               │
│  🗑️  ELIMINACIÓN (DELETE - Soft)                             │
│  └─ Desactivar usuario → Preserva datos                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   VALIDACIONES IMPLEMENTADAS                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ✓ Email único y formato válido                             │
│  ✓ Rol en enum (CUSTOMER, SELLER, ADMIN)                  │
│  ✓ Contraseña mínimo 8 caracteres                          │
│  ✓ Estado booleano (true/false)                            │
│  ✓ Usuario existe antes de actualizar                       │
│  ✓ No asignar mismo rol actual                              │
│  ✓ No asignar mismo estado actual                           │
│  ✓ Hash de contraseña con bcrypt(10)                       │
│  ✓ Prevent SQL injection (Prisma ORM)                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   RESPUESTAS HTTP ESPERADAS                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  200 OK            → Operación exitosa (GET, PATCH, DELETE) │
│  201 Created       → Recurso creado (POST)                  │
│  400 Bad Request   → Validación falla / Lógica inválida    │
│  403 Forbidden     → No es ADMIN o JWT inválido             │
│  404 Not Found     → Usuario no existe                      │
│  409 Conflict      → Email duplicado                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   INTEGRACIÓN CON BD (Prisma)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Model User                                                  │
│  ├─ id: String (CUID)                                       │
│  ├─ email: String (UNIQUE)                                  │
│  ├─ firstName: String                                       │
│  ├─ lastName: String                                        │
│  ├─ password: String (hashed)                               │
│  ├─ role: Role (enum)                                       │
│  ├─ isActive: Boolean                                       │
│  ├─ lastLogin: DateTime                                     │
│  ├─ createdAt: DateTime                                     │
│  └─ updatedAt: DateTime                                     │
│                                                               │
│  Operaciones Prisma:                                         │
│  ├─ findMany() → Listar con where/skip/take                │
│  ├─ findUnique() → Por ID                                  │
│  ├─ update() → Cambiar rol/estado                          │
│  ├─ count() → Totales                                      │
│  ├─ groupBy() → Estadísticas                               │
│  └─ create() → Nuevo admin                                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘

```

## Características Clave

### 1️⃣ Seguridad Robusta

- Autenticación JWT obligatoria
- Validación de roles en cada endpoint
- Contraseñas hashadas con bcrypt
- Validación de datos con class-validator

### 2️⃣ CRUD Completo

- Create: Crear nuevos admins
- Read: Listar, filtrar, buscar usuarios
- Update: Cambiar roles y estado
- Delete: Soft delete preservando datos

### 3️⃣ Estadísticas

- Totales de usuarios
- Desglose por rol
- Conteo de activos/inactivos
- Métricas de vendedores y admins

### 4️⃣ Flexibilidad de Filtros

- Paginación configurable
- Filtro por rol
- Búsqueda por email/nombre
- Búsqueda case-insensitive

### 5️⃣ Auditoría

- Timestamps de creación y actualización
- Soft delete (no borra, desactiva)
- lastLogin para seguimiento
- Historial de roles preservado

## Próximas Mejoras Sugeridas

1. **Auditoría Completa**: Tabla de cambios de roles y estados
2. **Permisos Granulares**: Más allá de solo ADMIN
3. **Exportar Datos**: Endpoint para descargar reportes
4. **Webhooks**: Notificar cambios importantes
5. **Rate Limiting**: Proteger endpoints contra abuso
6. **Caché**: Redis para estadísticas frecuentes
7. **Búsqueda Avanzada**: Filtros complejos por fecha, estado, etc.

---

**Módulo creado**: 2025-11-21
**Rama**: EC-12-endpoints-de-administracion-y-gestion-de-roles
**Status**: ✅ Completo y funcionando
