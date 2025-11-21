#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
ADMIN_TOKEN=""
CATEGORY_ID=""

echo -e "${BLUE}=== Categories API Test Script ===${NC}\n"

# Function to print section
print_section() {
  echo -e "\n${YELLOW}>>> $1${NC}"
}

# Function to print success
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# 1. List all categories
print_section "Test 1: Listar todas las categorías"
RESPONSE=$(curl -s -X GET "$BASE_URL/categories")
echo "$RESPONSE" | jq '.' 2>/dev/null && print_success "GET /categories" || print_error "Failed to parse response"

# 2. Get categories with inactive
print_section "Test 2: Listar categorías incluyendo inactivas"
RESPONSE=$(curl -s -X GET "$BASE_URL/categories?includeInactive=true")
echo "$RESPONSE" | jq '.' 2>/dev/null && print_success "GET /categories?includeInactive=true" || print_error "Failed to parse response"

# 3. Get statistics
print_section "Test 3: Obtener estadísticas"
RESPONSE=$(curl -s -X GET "$BASE_URL/categories/stats/general")
echo "$RESPONSE" | jq '.' 2>/dev/null && print_success "GET /categories/stats/general" || print_error "Failed to parse response"

# Check if admin token is provided
if [ -z "$ADMIN_TOKEN" ]; then
  print_error "ADMIN_TOKEN no configurado. Saltando pruebas de admin."
  exit 0
fi

# 4. Create category
print_section "Test 4: Crear nueva categoría"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prueba Categoría '"$(date +%s)"'",
    "description": "Categoría de prueba creada por script"
  }')

echo "$CREATE_RESPONSE" | jq '.' 2>/dev/null && print_success "POST /categories" || print_error "Failed to create category"

# Extract ID from response
CATEGORY_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id' 2>/dev/null)

if [ -z "$CATEGORY_ID" ] || [ "$CATEGORY_ID" = "null" ]; then
  print_error "No se pudo extraer el ID de la categoría"
  exit 1
fi

print_success "Categoría creada con ID: $CATEGORY_ID"

# 5. Get category by ID
print_section "Test 5: Obtener categoría por ID"
RESPONSE=$(curl -s -X GET "$BASE_URL/categories/$CATEGORY_ID")
echo "$RESPONSE" | jq '.' 2>/dev/null && print_success "GET /categories/$CATEGORY_ID" || print_error "Failed to get category"

# 6. Update category
print_section "Test 6: Actualizar categoría"
UPDATE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Categoría Actualizada",
    "description": "Descripción actualizada"
  }')

echo "$UPDATE_RESPONSE" | jq '.' 2>/dev/null && print_success "PATCH /categories/$CATEGORY_ID" || print_error "Failed to update category"

# 7. Get category with products
print_section "Test 7: Obtener categoría con productos (paginado)"
RESPONSE=$(curl -s -X GET "$BASE_URL/categories/$CATEGORY_ID/products?skip=0&take=10")
echo "$RESPONSE" | jq '.' 2>/dev/null && print_success "GET /categories/$CATEGORY_ID/products" || print_error "Failed to get products"

# 8. Toggle category status
print_section "Test 8: Cambiar estado de categoría"
TOGGLE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/categories/$CATEGORY_ID/toggle-status" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json")

echo "$TOGGLE_RESPONSE" | jq '.' 2>/dev/null && print_success "PATCH /categories/$CATEGORY_ID/toggle-status" || print_error "Failed to toggle status"

# 9. Try to create duplicate (should fail)
print_section "Test 9: Intentar crear categoría duplicada (debe fallar)"
DUP_RESPONSE=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Categoría Actualizada",
    "description": "Esta debería fallar"
  }')

ERROR_CODE=$(echo "$DUP_RESPONSE" | jq -r '.statusCode' 2>/dev/null)
if [ "$ERROR_CODE" = "409" ]; then
  print_success "Validación correcta: Categoría duplicada rechazada (409)"
else
  echo "$DUP_RESPONSE" | jq '.' 2>/dev/null
fi

# 10. Delete category
print_section "Test 10: Eliminar categoría"
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json")

echo "$DELETE_RESPONSE" | jq '.' 2>/dev/null && print_success "DELETE /categories/$CATEGORY_ID" || print_error "Failed to delete category"

print_section "Pruebas completadas"
print_success "Script finalizado"
