#!/bin/bash

# Script para validar conexión con AWS RDS
echo "🔍 Validando conexión con AWS RDS..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Datos de conexión (reemplaza con tus datos reales)
DB_HOST="database-1.c702yeeu6qxd.us-east-2.rds.amazonaws.com"
DB_PORT="5432"
DB_USER="[TU_USERNAME]"  # Reemplaza con tu usuario
DB_NAME="[TU_DATABASE]"  # Reemplaza con tu base de datos

echo -e "${YELLOW}🌐 Probando conectividad de red...${NC}"

# Probar conectividad básica
if command -v telnet &> /dev/null; then
    echo "Probando telnet $DB_HOST $DB_PORT"
    timeout 10 telnet $DB_HOST $DB_PORT
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Puerto $DB_PORT está abierto${NC}"
    else
        echo -e "${RED}❌ No se puede conectar al puerto $DB_PORT${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  telnet no está disponible, probando con ping...${NC}"
    ping -c 3 $DB_HOST
fi

echo -e "\n${YELLOW}🗄️  Probando conexión con PostgreSQL...${NC}"

# Probar con psql si está disponible
if command -v psql &> /dev/null; then
    echo "Probando conexión con psql..."
    echo "IMPORTANTE: Tendrás que ingresar la contraseña cuando se solicite"
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Conexión exitosa con PostgreSQL${NC}"
    else
        echo -e "${RED}❌ Error en la conexión con PostgreSQL${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  psql no está disponible. Instálalo para probar la conexión directa${NC}"
fi

echo -e "\n${YELLOW}📋 Pasos siguientes:${NC}"
echo "1. Asegúrate de tener las credenciales correctas"
echo "2. Verifica que el Security Group permita conexiones desde tu IP"
echo "3. Actualiza el archivo .env con las credenciales reales"
echo "4. Ejecuta las migraciones de Prisma"