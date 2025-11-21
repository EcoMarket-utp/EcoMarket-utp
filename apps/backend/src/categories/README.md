# Categories Module - Endpoints de Categorías

Este módulo proporciona endpoints para gestionar las categorías de productos en EcoMarket.

## Descripción General

El módulo de categorías implementa funcionalidades para:

- Crear nuevas categorías
- Listar todas las categorías
- Obtener detalle de una categoría
- Actualizar categorías
- Cambiar estado (activa/inactiva)
- Eliminar categorías (soft delete)
- Ver productos de una categoría
- Obtener estadísticas

## Rutas y Endpoints

### Autenticación

Algunos endpoints requieren autenticación JWT con rol ADMIN.

**Headers requeridos (donde aplique):**

```
Authorization: Bearer <jwt_token>
```

### 1. Crear una Categoría

**POST** `/categories`

**Permisos**: ADMIN (requiere JWT)

**Body (JSON):**

```json
{
  "name": "Productos Ecológicos",
  "description": "Productos fabricados de forma ecológica y sostenible"
}
```

**Response (201 Created):**

```json
{
  "id": "cat123",
  "name": "Productos Ecológicos",
  "description": "Productos fabricados de forma ecológica y sostenible",
  "isActive": true,
  "createdAt": "2025-11-21T10:00:00Z",
  "updatedAt": "2025-11-21T10:00:00Z"
}
```

**Respuestas posibles:**

- `409 Conflict`: Categoría ya existe

---

### 2. Obtener Todas las Categorías

**GET** `/categories`

**Parámetros de query:**

- `includeInactive` (opcional): Incluir categorías inactivas (default: false)

**Ejemplo de request:**

```
GET /categories
GET /categories?includeInactive=true
```

**Response (200 OK):**

```json
[
  {
    "id": "cat123",
    "name": "Productos Ecológicos",
    "description": "Productos fabricados de forma ecológica y sostenible",
    "isActive": true,
    "createdAt": "2025-11-21T10:00:00Z",
    "updatedAt": "2025-11-21T10:00:00Z",
    "_count": {
      "products": 15
    }
  }
]
```

---

### 3. Obtener una Categoría por ID

**GET** `/categories/:id`

**Parámetros de ruta:**

- `id`: ID de la categoría

**Response (200 OK):**

```json
{
  "id": "cat123",
  "name": "Productos Ecológicos",
  "description": "Productos fabricados de forma ecológica y sostenible",
  "isActive": true,
  "createdAt": "2025-11-21T10:00:00Z",
  "updatedAt": "2025-11-21T10:00:00Z",
  "products": [
    {
      "id": "prod1",
      "name": "Bolsa Ecológica",
      "price": "29.99",
      "isActive": true
    }
  ],
  "_count": {
    "products": 1
  }
}
```

**Respuestas posibles:**

- `404 Not Found`: Categoría no encontrada

---

### 4. Obtener Categoría con Productos (Paginado)

**GET** `/categories/:id/products`

**Parámetros de ruta:**

- `id`: ID de la categoría

**Parámetros de query:**

- `skip` (opcional): Saltar registros (default: 0)
- `take` (opcional): Cantidad de registros (default: 10)

**Ejemplo:**

```
GET /categories/cat123/products?skip=0&take=10
```

**Response (200 OK):**

```json
{
  "category": {
    "id": "cat123",
    "name": "Productos Ecológicos",
    "description": "...",
    "isActive": true
  },
  "products": [
    {
      "id": "prod1",
      "name": "Bolsa Ecológica",
      "price": "29.99",
      "isActive": true,
      "seller": {
        "id": "user1",
        "email": "seller@example.com",
        "firstName": "Juan",
        "lastName": "Pérez"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "skip": 0,
    "take": 10,
    "pages": 3
  }
}
```

---

### 5. Obtener Estadísticas

**GET** `/categories/stats/general`

**Response (200 OK):**

```json
{
  "totalCategories": 10,
  "activeCategories": 8,
  "inactiveCategories": 2,
  "categoriesWithProducts": [
    {
      "id": "cat123",
      "name": "Productos Ecológicos",
      "_count": {
        "products": 15
      }
    }
  ]
}
```

---

### 6. Actualizar una Categoría

**PATCH** `/categories/:id`

**Permisos**: ADMIN (requiere JWT)

**Parámetros de ruta:**

- `id`: ID de la categoría

**Body (JSON):**

```json
{
  "name": "Productos Eco-Sostenibles",
  "description": "Nueva descripción",
  "isActive": true
}
```

**Response (200 OK):**

```json
{
  "id": "cat123",
  "name": "Productos Eco-Sostenibles",
  "description": "Nueva descripción",
  "isActive": true,
  "updatedAt": "2025-11-21T11:00:00Z",
  "_count": {
    "products": 15
  }
}
```

**Respuestas posibles:**

- `404 Not Found`: Categoría no encontrada
- `409 Conflict`: Nombre de categoría ya existe

---

### 7. Cambiar Estado de una Categoría

**PATCH** `/categories/:id/toggle-status`

**Permisos**: ADMIN (requiere JWT)

**Parámetros de ruta:**

- `id`: ID de la categoría

**Response (200 OK):**

```json
{
  "id": "cat123",
  "name": "Productos Ecológicos",
  "description": "...",
  "isActive": false,
  "updatedAt": "2025-11-21T11:05:00Z",
  "_count": {
    "products": 15
  }
}
```

**Respuestas posibles:**

- `404 Not Found`: Categoría no encontrada

---

### 8. Eliminar una Categoría (Soft Delete)

**DELETE** `/categories/:id`

**Permisos**: ADMIN (requiere JWT)

**Parámetros de ruta:**

- `id`: ID de la categoría

**Response (200 OK):**

```json
{
  "id": "cat123",
  "name": "Productos Ecológicos",
  "isActive": false
}
```

**Respuestas posibles:**

- `404 Not Found`: Categoría no encontrada
- `400 Bad Request`: Tiene productos activos asociados

---

## Protección de Endpoints

### Sin Autenticación

- GET `/categories` - Listar todas
- GET `/categories/:id` - Obtener por ID
- GET `/categories/:id/products` - Productos de categoría
- GET `/categories/stats/general` - Estadísticas

### Con Autenticación (ADMIN)

- POST `/categories` - Crear
- PATCH `/categories/:id` - Actualizar
- PATCH `/categories/:id/toggle-status` - Cambiar estado
- DELETE `/categories/:id` - Eliminar

## Códigos de Estado HTTP

| Código | Descripción                               |
| ------ | ----------------------------------------- |
| 200    | OK - Operación exitosa                    |
| 201    | Created - Categoría creada                |
| 400    | Bad Request - Tiene productos activos     |
| 404    | Not Found - Categoría no encontrada       |
| 409    | Conflict - Nombre de categoría duplicado  |
| 403    | Forbidden - No autorizado (no eres ADMIN) |

## Validaciones

- **Nombre**: Mínimo 3 caracteres, máximo 100
- **Descripción**: Máximo 500 caracteres
- **Nombre único**: No puede haber dos categorías con el mismo nombre
- **Eliminación**: No se puede eliminar si tiene productos activos

## Ejemplos con cURL

```bash
# Crear categoría
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Productos Ecológicos",
    "description": "Productos sostenibles"
  }'

# Listar categorías
curl -X GET http://localhost:3000/categories

# Obtener categoría
curl -X GET http://localhost:3000/categories/cat123

# Obtener productos de categoría
curl -X GET "http://localhost:3000/categories/cat123/products?skip=0&take=10"

# Actualizar categoría
curl -X PATCH http://localhost:3000/categories/cat123 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Eco-Sostenibles"}'

# Cambiar estado
curl -X PATCH http://localhost:3000/categories/cat123/toggle-status \
  -H "Authorization: Bearer <token>"

# Eliminar categoría
curl -X DELETE http://localhost:3000/categories/cat123 \
  -H "Authorization: Bearer <token>"

# Estadísticas
curl -X GET http://localhost:3000/categories/stats/general
```

## Notas de Seguridad

- Solo ADMINS pueden crear, actualizar o eliminar categorías
- Las categorías se eliminan con soft delete (no se borran de la BD)
- Los nombres de categoría son únicos
- No se puede eliminar una categoría que tenga productos activos
- Todas las operaciones se auditan con timestamps
