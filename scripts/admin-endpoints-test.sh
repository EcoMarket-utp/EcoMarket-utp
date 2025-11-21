#!/bin/bash
# Scripts de ejemplo para probar Admin Endpoints
# Usar: source admin-endpoints-test.sh

# Variables
BASE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@ecomarket.com"
ADMIN_PASSWORD="Admin123456"
TOKEN=""

echo "╔════════════════════════════════════════════════════════╗"
echo "║   EcoMarket Admin Endpoints - Test Script             ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# 1. LOGIN - Obtener Token JWT
echo "▶ Step 1: LOGIN - Obtener Token JWT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

echo "Response:"
echo "$LOGIN_RESPONSE" | jq '.'

# Extraer token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Error: No se pudo obtener el token. Verifica las credenciales."
  exit 1
fi

echo "✓ Token obtenido: ${TOKEN:0:50}..."
echo ""

# 2. OBTENER TODOS LOS USUARIOS
echo "▶ Step 2: OBTENER TODOS LOS USUARIOS (Paginación)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X GET "$BASE_URL/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# 3. OBTENER ESTADÍSTICAS
echo "▶ Step 3: OBTENER ESTADÍSTICAS DE USUARIOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X GET "$BASE_URL/admin/statistics" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# 4. OBTENER USUARIOS POR ROL
echo "▶ Step 4: OBTENER USUARIOS CON ROL SELLER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X GET "$BASE_URL/admin/users-by-role/SELLER" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# 5. BUSCAR USUARIOS
echo "▶ Step 5: BUSCAR USUARIO POR EMAIL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X GET "$BASE_URL/admin/search?q=test" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# 6. CREAR NUEVO ADMIN (Reemplaza con email real)
echo "▶ Step 6: CREAR NUEVO USUARIO ADMIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
CREATE_ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/users/create-admin" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@ecomarket.com",
    "password": "AdminPassword123",
    "firstName": "New",
    "lastName": "Admin"
  }')

echo "Response:"
echo "$CREATE_ADMIN_RESPONSE" | jq '.'

# Extraer ID del nuevo admin
NEW_ADMIN_ID=$(echo "$CREATE_ADMIN_RESPONSE" | jq -r '.user.id')
echo "Nuevo Admin ID: $NEW_ADMIN_ID"
echo ""

# 7. OBTENER USUARIO POR ID
if [ "$NEW_ADMIN_ID" != "null" ] && [ -n "$NEW_ADMIN_ID" ]; then
  echo "▶ Step 7: OBTENER USUARIO POR ID"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  curl -s -X GET "$BASE_URL/admin/users/$NEW_ADMIN_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" | jq '.'
  echo ""

  # 8. CAMBIAR ROL DEL USUARIO (Primero obtenemos un usuario existente)
  echo "▶ Step 8: CAMBIAR ROL DE USUARIO A SELLER"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  # Obtener el primer usuario para cambiar su rol
  USERS_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/users?page=1&limit=1" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
  
  FIRST_USER_ID=$(echo "$USERS_RESPONSE" | jq -r '.data[0].id')
  
  if [ "$FIRST_USER_ID" != "null" ] && [ -n "$FIRST_USER_ID" ]; then
    curl -s -X PATCH "$BASE_URL/admin/users/$FIRST_USER_ID/role" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"newRole": "SELLER"}' | jq '.'
  fi
  echo ""

  # 9. CAMBIAR ESTADO DEL USUARIO
  echo "▶ Step 9: DESACTIVAR USUARIO"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if [ "$NEW_ADMIN_ID" != "null" ] && [ -n "$NEW_ADMIN_ID" ]; then
    curl -s -X PATCH "$BASE_URL/admin/users/$NEW_ADMIN_ID/status" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"isActive": false}' | jq '.'
  fi
  echo ""

  # 10. REACTIVAR USUARIO
  echo "▶ Step 10: REACTIVAR USUARIO"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if [ "$NEW_ADMIN_ID" != "null" ] && [ -n "$NEW_ADMIN_ID" ]; then
    curl -s -X PATCH "$BASE_URL/admin/users/$NEW_ADMIN_ID/status" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"isActive": true}' | jq '.'
  fi
  echo ""

  # 11. ELIMINAR (SOFT DELETE) USUARIO
  echo "▶ Step 11: ELIMINAR USUARIO (Soft Delete)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if [ "$NEW_ADMIN_ID" != "null" ] && [ -n "$NEW_ADMIN_ID" ]; then
    curl -s -X DELETE "$BASE_URL/admin/users/$NEW_ADMIN_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" | jq '.'
  fi
  echo ""
fi

echo "╔════════════════════════════════════════════════════════╗"
echo "║          ✓ Test completado exitosamente              ║"
echo "╚════════════════════════════════════════════════════════╝"
