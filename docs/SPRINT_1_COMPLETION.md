# 🚀 Guía de Finalización del Sprint 1 - EcoMarket

## ✅ Lo que ya está configurado:
- ✅ Base de datos PostgreSQL en AWS RDS
- ✅ Esquema de Prisma completo
- ✅ Docker Compose mejorado con PostgreSQL y Redis
- ✅ Variables de entorno organizadas
- ✅ Estructura de archivos del proyecto

## 🔧 Pasos para completar la configuración:

### 1. **Configurar AWS S3**
```bash
# 1. Crear bucket S3 (reemplaza con un nombre único)
aws s3 mb s3://ecomarket-images-tu-nombre-2024 --region us-east-1

# 2. Aplicar política de acceso público
aws s3api put-bucket-policy --bucket ecomarket-images-tu-nombre-2024 --policy file://docs/s3-policy.json

# 3. Configurar CORS
aws s3api put-bucket-cors --bucket ecomarket-images-tu-nombre-2024 --cors-configuration file://docs/s3-cors.json
```

### 2. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env.development

# Editar .env.development con tus datos reales:
# - AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY
# - DATABASE_URL con tu endpoint de RDS
# - JWT_SECRET con un secreto seguro
```

### 3. **Configurar Prisma con AWS RDS**
```bash
# Ir al directorio del backend
cd apps/backend

# Editar prisma/.env con tu DATABASE_URL de AWS RDS
echo 'DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/database_name?schema=public"' > prisma/.env

# Generar cliente de Prisma
pnpm db:generate

# Ejecutar migraciones en AWS RDS
pnpm db:migrate:prod
```

### 4. **Probar el entorno local**
```bash
# Levantar solo la base de datos local para desarrollo
docker-compose up postgres redis -d

# Verificar que todo funciona
docker-compose ps
```

### 5. **Verificar conexión con AWS**
```bash
# Probar conexión con S3
aws s3 ls s3://tu-bucket-name

# Probar conexión con RDS (desde el backend)
cd apps/backend
pnpm db:studio
```

## 📋 Checklist final del Sprint 1:

- [ ] ✅ Base de datos PostgreSQL en AWS RDS creada
- [ ] 🔧 Bucket S3 configurado para imágenes
- [ ] 🔧 Variables de entorno configuradas
- [ ] 🔧 Prisma conectado con AWS RDS
- [ ] 🔧 Docker Compose funcionando
- [ ] 🔧 Migraciones ejecutadas en AWS RDS

## 🎯 Próximos pasos (Sprint 2):
Una vez completado este Sprint 1, estarás listo para:
- Implementar autenticación JWT
- Crear endpoints REST con NestJS
- Configurar Swagger para documentación
- Implementar middleware de seguridad

## 🆘 Troubleshooting:

### Problema con RDS
```bash
# Verificar conectividad
telnet your-rds-endpoint 5432
```

### Problema con S3
```bash
# Verificar permisos
aws sts get-caller-identity
```

### Problema con Docker
```bash
# Limpiar y reiniciar
docker-compose down -v
docker-compose up -d
```