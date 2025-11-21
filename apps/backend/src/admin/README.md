# Admin Module - Endpoints de Administración y Gestión de Roles

Este módulo proporciona endpoints para que los administradores gestionen usuarios, roles y permisos en la aplicación.

## Descripción General

El módulo de administración implementa funcionalidades para:

- Listar y filtrar usuarios
- Gestionar roles de usuarios (CUSTOMER, SELLER, ADMIN)
- Activar/desactivar usuarios
- Crear nuevos administradores
- Obtener estadísticas de usuarios
- Buscar usuarios por email o nombre

## Rutas y Endpoints

### Autenticación

Todos los endpoints requieren autenticación JWT con rol de ADMIN.

**Headers requeridos:**

```
Authorization: Bearer <jwt_token>
```

### 1. Obtener todos los usuarios (con paginación)

**GET** `/admin/users`

**Parámetros de query:**

- `page` (opcional): número de página (default: 1)
- `limit` (opcional): usuarios por página (default: 10)
- `role` (opcional): filtrar por rol (CUSTOMER, SELLER, ADMIN)

**Ejemplo de request:**

```
GET /admin/users?page=1&limit=10&role=CUSTOMER
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "user123",
      "email": "user@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "CUSTOMER",
      "isActive": true,
      "lastLogin": "2025-11-21T10:30:00Z",
      "createdAt": "2025-11-20T15:45:00Z",
      "updatedAt": "2025-11-21T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### 2. Obtener un usuario por ID

**GET** `/admin/users/:id`

**Parámetros de ruta:**

- `id`: ID del usuario

**Response (200 OK):**

```json
{
  "id": "user123",
  "email": "user@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "CUSTOMER",
  "isActive": true,
  "lastLogin": "2025-11-21T10:30:00Z",
  "createdAt": "2025-11-20T15:45:00Z",
  "updatedAt": "2025-11-21T10:30:00Z",
  "products": [
    {
      "id": "prod123",
      "name": "Producto ecológico",
      "price": "99.99",
      "isActive": true
    }
  ]
}
```

**Respuestas posibles:**

- `404 Not Found`: Usuario no encontrado

---

### 3. Obtener usuarios por rol

**GET** `/admin/users-by-role/:role`

**Parámetros de ruta:**

- `role`: Rol a filtrar (CUSTOMER, SELLER, ADMIN)

**Response (200 OK):**

```json
[
  {
    "id": "user123",
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "SELLER",
    "isActive": true,
    "createdAt": "2025-11-20T15:45:00Z"
  }
]
```

---

### 4. Buscar usuarios

**GET** `/admin/search?q=<query>`

**Parámetros de query:**

- `q`: Término de búsqueda (email, nombre o apellido)

**Ejemplo:**

```
GET /admin/search?q=juan
```

**Response (200 OK):**

```json
[
  {
    "id": "user123",
    "email": "juan@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "CUSTOMER",
    "isActive": true,
    "createdAt": "2025-11-20T15:45:00Z"
  }
]
```

---

### 5. Obtener estadísticas de usuarios

**GET** `/admin/statistics`

**Response (200 OK):**

```json
{
  "totalUsers": 150,
  "activeUsers": 145,
  "inactiveUsers": 5,
  "roleStats": {
    "CUSTOMER": 120,
    "SELLER": 20,
    "ADMIN": 10
  },
  "sellerCount": 20,
  "adminCount": 10,
  "customerCount": 120
}
```

---

### 6. Actualizar rol de un usuario

**PATCH** `/admin/users/:id/role`

**Parámetros de ruta:**

- `id`: ID del usuario

**Body (JSON):**

```json
{
  "newRole": "SELLER"
}
```

**Response (200 OK):**

```json
{
  "message": "Rol de usuario actualizado a SELLER",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "SELLER",
    "isActive": true,
    "updatedAt": "2025-11-21T11:00:00Z"
  }
}
```

**Respuestas posibles:**

- `400 Bad Request`: El usuario ya tiene ese rol
- `404 Not Found`: Usuario no encontrado

---

### 7. Cambiar estado de un usuario (activar/desactivar)

**PATCH** `/admin/users/:id/status`

**Parámetros de ruta:**

- `id`: ID del usuario

**Body (JSON):**

```json
{
  "isActive": false
}
```

**Response (200 OK):**

```json
{
  "message": "Usuario desactivado exitosamente",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "CUSTOMER",
    "isActive": false,
    "updatedAt": "2025-11-21T11:05:00Z"
  }
}
```

**Respuestas posibles:**

- `400 Bad Request`: El usuario ya está en ese estado
- `404 Not Found`: Usuario no encontrado

---

### 8. Crear un nuevo usuario administrador

**POST** `/admin/users/create-admin`

**Body (JSON):**

```json
{
  "email": "newadmin@example.com",
  "password": "SecurePassword123",
  "firstName": "Admin",
  "lastName": "Usuario"
}
```

**Response (201 Created):**

```json
{
  "message": "Usuario administrador creado exitosamente",
  "user": {
    "id": "newadmin123",
    "email": "newadmin@example.com",
    "firstName": "Admin",
    "lastName": "Usuario",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2025-11-21T11:10:00Z"
  }
}
```

**Respuestas posibles:**

- `409 Conflict`: Email ya registrado
- `400 Bad Request`: Datos inválidos (contraseña < 8 caracteres)

---

### 9. Eliminar un usuario (soft delete)

**DELETE** `/admin/users/:id`

**Parámetros de ruta:**

- `id`: ID del usuario

**Response (200 OK):**

```json
{
  "message": "Usuario desactivado exitosamente",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

**Respuestas posibles:**

- `404 Not Found`: Usuario no encontrado

---

## Protección de Endpoints

Todos los endpoints están protegidos por:

1. **JwtAuthGuard**: Requiere un JWT válido
2. **RolesGuard**: Requiere que el usuario tenga el rol ADMIN

Si el usuario no está autenticado o no tiene el rol requerido, recibe:

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

## Códigos de Estado HTTP

| Código | Descripción                                |
| ------ | ------------------------------------------ |
| 200    | OK - Operación exitosa                     |
| 201    | Created - Recurso creado                   |
| 400    | Bad Request - Datos inválidos              |
| 403    | Forbidden - No autorizado                  |
| 404    | Not Found - Recurso no encontrado          |
| 409    | Conflict - Conflicto (ej: email duplicado) |

## Ejemplos con cURL

```bash
# Obtener todos los usuarios
curl -X GET http://localhost:3000/admin/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"

# Actualizar rol de usuario
curl -X PATCH http://localhost:3000/admin/users/user123/role \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"newRole": "SELLER"}'

# Desactivar usuario
curl -X PATCH http://localhost:3000/admin/users/user123/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'

# Crear nuevo admin
curl -X POST http://localhost:3000/admin/users/create-admin \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "password": "SecurePassword123",
    "firstName": "Admin",
    "lastName": "Usuario"
  }'
```

## Notas de Seguridad

- Solo usuarios con rol ADMIN pueden acceder a estos endpoints
- Las contraseñas se hashean usando bcrypt (10 saltos)
- Los emails deben ser únicos en la base de datos
- El soft delete (desactivación) preserva el registro en la base de datos
- El sistema valida todos los datos de entrada antes de procesarlos
