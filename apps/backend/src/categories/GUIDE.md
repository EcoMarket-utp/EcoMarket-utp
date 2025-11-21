# Guía de Características - Categories Module

## Estructura

```
src/categories/
├── categories.module.ts         # Módulo NestJS
├── categories.controller.ts     # Controlador (8 endpoints)
├── categories.service.ts        # Lógica de negocio (8 métodos)
├── categories.controller.spec.ts
├── categories.service.spec.ts
├── dto/
│   ├── index.ts
│   ├── create-category.dto.ts
│   └── update-category.dto.ts
└── README.md
```

## Características Principales

### 1. Gestión de Categorías

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Crear nuevas categorías
- ✅ Listar todas (con opción de incluir inactivas)
- ✅ Obtener detalles por ID
- ✅ Actualizar información

### 2. Estado de Categorías

- ✅ Activar/Desactivar categorías
- ✅ Cambio de estado independiente
- ✅ Soft delete preservando datos

### 3. Relación con Productos

- ✅ Ver productos de una categoría
- ✅ Paginación de productos
- ✅ Conteo de productos por categoría
- ✅ Validación: No se puede eliminar categoría con productos activos

### 4. Estadísticas

- ✅ Total de categorías
- ✅ Activas vs inactivas
- ✅ Categorías con conteo de productos
- ✅ Información por categoría

### 5. Seguridad

- ✅ Endpoints públicos para lectura
- ✅ Endpoints protegidos para escritura (ADMIN)
- ✅ Validación de entrada con class-validator
- ✅ Control de acceso basado en roles

### 6. Validaciones

- ✅ Nombre único (no duplicados)
- ✅ Nombre: mín 3 caracteres, máx 100
- ✅ Descripción: máx 500 caracteres
- ✅ Validación de relaciones

## Métodos del Servicio

```typescript
// Lectura
findAll(includeInactive?)          // Listar todas
findById(id)                       // Por ID
findByName(name)                   // Por nombre
findWithProducts(id, skip, take)   // Con productos
getStatistics()                    // Estadísticas

// Escritura
create(dto)                        // Crear
update(id, dto)                    // Actualizar
toggleStatus(id)                   // Cambiar estado
delete(id)                         // Eliminar (soft)
```

## Endpoints

| Método | Ruta                            | Autenticación | Descripción    |
| ------ | ------------------------------- | ------------- | -------------- |
| POST   | `/categories`                   | ADMIN         | Crear          |
| GET    | `/categories`                   | Pública       | Listar todas   |
| GET    | `/categories/:id`               | Pública       | Por ID         |
| GET    | `/categories/:id/products`      | Pública       | Productos      |
| GET    | `/categories/stats/general`     | Pública       | Estadísticas   |
| PATCH  | `/categories/:id`               | ADMIN         | Actualizar     |
| PATCH  | `/categories/:id/toggle-status` | ADMIN         | Cambiar estado |
| DELETE | `/categories/:id`               | ADMIN         | Eliminar       |

## DTOs y Validaciones

### CreateCategoryDto

```typescript
{
  name: string           // 3-100 caracteres, requerido
  description?: string   // 0-500 caracteres, opcional
}
```

### UpdateCategoryDto

```typescript
{
  name?: string          // 3-100 caracteres, opcional
  description?: string   // 0-500 caracteres, opcional
  isActive?: boolean     // opcional
}
```

## Ejemplos de Uso

### Crear Categoría

```bash
POST /categories
{
  "name": "Productos Ecológicos",
  "description": "Productos sostenibles y eco-friendly"
}
```

### Listar Categorías

```bash
GET /categories              # Solo activas
GET /categories?includeInactive=true  # Todas
```

### Obtener Categoría con Productos

```bash
GET /categories/cat123/products?skip=0&take=10
```

### Actualizar

```bash
PATCH /categories/cat123
{
  "name": "Eco-Sostenibles",
  "description": "Nueva descripción"
}
```

### Cambiar Estado

```bash
PATCH /categories/cat123/toggle-status
# Alterna entre activo e inactivo
```

### Eliminar

```bash
DELETE /categories/cat123
# Solo si no tiene productos activos
```

## Relaciones con Otros Módulos

### Products Module

- Cada producto tiene `categoryId`
- Puede obtener productos de una categoría
- No se puede eliminar categoría con productos

### Admin Module

- Admins pueden crear/actualizar/eliminar categorías
- Logs de cambios en categorías

## Flujo de Uso Típico

1. **Admin crea categoría**

   ```
   POST /categories → 201 Created
   ```

2. **Usuario lista categorías**

   ```
   GET /categories → 200 OK
   ```

3. **Usuario obtiene productos de categoría**

   ```
   GET /categories/{id}/products → 200 OK
   ```

4. **Admin actualiza categoría**

   ```
   PATCH /categories/{id} → 200 OK
   ```

5. **Admin desactiva categoría**
   ```
   PATCH /categories/{id}/toggle-status → 200 OK
   ```

## Respuestas de Error

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "La categoría \"Ecológico\" ya existe",
  "error": "Conflict"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Categoría con ID abc123 no encontrada",
  "error": "Not Found"
}
```

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "No se puede eliminar la categoría \"Ecológico\" porque tiene 5 producto(s) activo(s)",
  "error": "Bad Request"
}
```

## Características Especiales

### Soft Delete

- Las categorías no se eliminan físicamente
- Se marca `isActive = false`
- Preserva historial e integridad referencial
- Permite recuperación

### Paginación de Productos

```json
{
  "pagination": {
    "total": 100,
    "skip": 0,
    "take": 10,
    "pages": 10
  }
}
```

### Conteo de Productos

Cada categoría incluye `_count.products` automáticamente

### Timestamps

- `createdAt`: Cuando se creó
- `updatedAt`: Último cambio

## Integración

✅ Integrado con Prisma ORM  
✅ Usa guardias JwtAuthGuard y RolesGuard  
✅ Swagger documentation automática  
✅ Tests unitarios incluidos

## Limitaciones

- No se pueden eliminar categorías con productos activos
- Nombres deben ser únicos
- Descripción máximo 500 caracteres
- Máximo 8 caracteres para operaciones complejas

## Futuros Mejoras

- [ ] Búsqueda por nombre
- [ ] Sorting customizable
- [ ] Filtros avanzados
- [ ] Importar/exportar
- [ ] Reordenamiento
- [ ] Histórico de cambios
