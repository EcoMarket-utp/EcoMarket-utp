# Guía Rápida de Admin Endpoints

## Estructura del Módulo

```
src/admin/
├── admin.module.ts         # Módulo principal
├── admin.controller.ts     # Controlador con endpoints
├── admin.service.ts        # Lógica de negocio
├── admin.controller.spec.ts
├── admin.service.spec.ts
├── dto/
│   ├── index.ts
│   ├── update-user-role.dto.ts
│   ├── update-user-status.dto.ts
│   └── create-admin-user.dto.ts
└── README.md
```

## Roles Disponibles

- **CUSTOMER**: Usuario cliente/comprador
- **SELLER**: Usuario vendedor
- **ADMIN**: Administrador del sistema

## Características Principales

### 1. Gestión de Usuarios

- Listar usuarios con paginación
- Buscar usuarios por email o nombre
- Obtener detalles de un usuario específico
- Ver productos de un vendedor

### 2. Gestión de Roles

- Cambiar el rol de un usuario a CUSTOMER, SELLER o ADMIN
- Validar que no se asigne el mismo rol que ya tiene
- Auditar cambios de rol

### 3. Gestión de Estado

- Activar/desactivar usuarios
- Usar soft delete (los registros se mantienen en BD)
- Historial de cambios con timestamps

### 4. Estadísticas

- Total de usuarios
- Usuarios activos/inactivos
- Desglose por rol
- Conteo de vendedores y admins

### 5. Administración de Admins

- Crear nuevos administradores con email y contraseña
- Validar contraseñas seguras (mínimo 8 caracteres)
- Hash de contraseñas con bcrypt

## Flujo de Uso Típico

### 1. Autenticarse como Admin

```bash
POST /auth/login
Body: { "email": "admin@ecomarket.com", "password": "password123" }
Response: { token: "jwt_token" }
```

### 2. Usar el Token en Requests

```bash
GET /admin/users
Headers: Authorization: Bearer jwt_token
```

### 3. Operaciones Comunes

**Promover usuario a SELLER:**

```bash
PATCH /admin/users/{userId}/role
Body: { "newRole": "SELLER" }
```

**Desactivar usuario fraudulento:**

```bash
PATCH /admin/users/{userId}/status
Body: { "isActive": false }
```

**Ver estadísticas:**

```bash
GET /admin/statistics
```

## Validaciones

### Email

- Debe ser único en el sistema
- Formato válido de email
- Se valida al crear usuarios

### Rol

- Solo acepta: CUSTOMER, SELLER, ADMIN
- No permite asignar el rol actual

### Contraseña

- Mínimo 8 caracteres para nuevos admins
- Se hashea automáticamente con bcrypt(10)

### Estado

- Booleano (true = activo, false = inactivo)
- No puede asignar el estado actual

## Respuestas de Error

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "El usuario ya tiene el rol CUSTOMER",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Usuario con ID abc123 no encontrado",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Email ya registrado",
  "error": "Conflict"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

## Integración con la BD

El módulo usa Prisma ORM con las siguientes operaciones:

- `prisma.user.findMany()` - Listar usuarios
- `prisma.user.findUnique()` - Obtener usuario por ID
- `prisma.user.update()` - Actualizar usuario
- `prisma.user.count()` - Contar usuarios
- `prisma.user.groupBy()` - Agrupar estadísticas
- `prisma.user.create()` - Crear nuevo usuario

## Seguridad

✅ JWT Authentication
✅ Role-based access control (ADMIN only)
✅ Password hashing con bcrypt
✅ Soft delete para historial
✅ Input validation con class-validator
✅ SQL injection prevention (Prisma)
✅ Timestamps de auditoría

## Testing

Ejecutar pruebas:

```bash
npm run test -- admin.controller
npm run test -- admin.service
```

## Ejemplos Prácticos

### Crear Nuevo Admin

```bash
curl -X POST http://localhost:3000/admin/users/create-admin \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin2@ecomarket.com",
    "password": "SecurePassword123",
    "firstName": "Juan",
    "lastName": "Admin"
  }'
```

### Buscar Vendedores

```bash
curl -X GET "http://localhost:3000/admin/users-by-role/SELLER" \
  -H "Authorization: Bearer $TOKEN"
```

### Obtener Estadísticas

```bash
curl -X GET http://localhost:3000/admin/statistics \
  -H "Authorization: Bearer $TOKEN"
```

### Filtrar Usuarios Activos

```bash
curl -X GET "http://localhost:3000/admin/users?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

## Futuros Mejoras

- [ ] Endpoint para cambiar contraseña de usuarios
- [ ] Endpoint para exportar datos de usuarios
- [ ] Endpoint para auditoría de cambios
- [ ] Endpoint para suspensión temporal vs eliminación
- [ ] Endpoint para gestionar permisos específicos
- [ ] Rate limiting en endpoints de admin
- [ ] Webhook para eventos de admin
