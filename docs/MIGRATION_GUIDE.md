# 🚀 GUÍA COMPLETA: Migrar tablas a AWS RDS

## 📋 Estado actual:
- ✅ Conectividad con AWS RDS verificada
- ✅ Tablas locales disponibles (sin datos)
- ✅ Migración de Prisma lista (`20251013051730_init`)

## 🎯 Pasos para migrar a AWS RDS:

### **1. Obtener credenciales de AWS RDS**
1. Ve a [AWS Console](https://console.aws.amazon.com/rds/)
2. Navega a: **RDS → Databases → database-1**
3. En la pestaña **"Connectivity & security"** encontrarás:
   - **Endpoint**: `database-1.c702yeeu6qxd.us-east-2.rds.amazonaws.com` ✅
   - **Master username**: `[LO QUE CONFIGURASTE]`
4. Si no recuerdas la contraseña:
   - Haz clic en **"Actions" → "Modify"**
   - Busca **"New master password"**
   - Configura una nueva contraseña

### **2. Configurar DATABASE_URL**
Edita el archivo: `apps/backend/prisma/.env`

```env
DATABASE_URL="postgresql://[TU_USUARIO]:[TU_CONTRASEÑA]@database-1.c702yeeu6qxd.us-east-2.rds.amazonaws.com:5432/[TU_BASE_DE_DATOS]?schema=public"
```

**Reemplaza:**
- `[TU_USUARIO]` → Usuario maestro de RDS (ej: `postgres`, `ecomarket_admin`)
- `[TU_CONTRASEÑA]` → Contraseña que configuraste
- `[TU_BASE_DE_DATOS]` → Nombre de la base de datos (ej: `postgres`, `ecomarket`)

### **3. Ejecutar la migración**
```powershell
# Ejecutar script de migración
.\scripts\migrate-to-aws.ps1
```

**O manualmente:**
```powershell
cd apps/backend
pnpm db:generate
pnpm db:migrate:prod
```

### **4. Verificar que funcionó**
```powershell
# Abrir Prisma Studio para ver las tablas
cd apps/backend
pnpm db:studio
```

## 🔧 Troubleshooting:

### Error de autenticación:
```
Error: P1001: Can't reach database server
```
**Solución**: Verifica usuario/contraseña en DATABASE_URL

### Error de base de datos no existe:
```
Error: P1003: Database does not exist
```
**Solución**: 
1. Cambia `[TU_BASE_DE_DATOS]` por `postgres` (base de datos por defecto)
2. O crea la base de datos: `CREATE DATABASE ecomarket;`

### Error de SSL:
```
Error: SSL connection required
```
**Solución**: Agrega `?sslmode=require` al final de DATABASE_URL

## 🎉 Una vez completado:
- ✅ Esquema completo en AWS RDS
- ✅ Todas las tablas creadas (users, products, categories, orders, etc.)
- ✅ Listo para Sprint 2 (Backend + Autenticación)

---

**💡 Tip**: Mantén también tu base de datos local para desarrollo. Puedes usar:
- Local: Para desarrollo diario
- AWS RDS: Para pruebas y producción