# Almacenamiento Local - Configuración para Render

## Descripción

El proyecto ahora utiliza almacenamiento local de archivos en lugar de AWS S3. Los archivos subidos se guardan en la carpeta `public/uploads/`.

## Endpoints de Upload

### Subir una imagen
```bash
POST /api/uploads/image
Content-Type: multipart/form-data

Form Data:
- file: <image file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/uuid-filename.jpg",
    "filename": "uuid-filename.jpg",
    "size": 12345
  }
}
```

### Subir múltiples imágenes
```bash
POST /api/uploads/images
Content-Type: multipart/form-data

Form Data:
- files: <image files> (máximo 10 archivos)
```

## Configuración en Render

### 1. Variables de Entorno
En el dashboard de Render, configurar:

```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=604800
NODE_ENV=production
```

### 2. Persistencia de Archivos
Render proporciona un disco persistente que se mantiene entre deployments. Los archivos subidos en `public/uploads/` se guardarán automáticamente.

**Importante:** En Render, la carpeta `public/uploads/` es persistente, pero si necesitas acceso a través de HTTP:

1. Asegúrate de que el servidor esté sirviendo archivos estáticos desde `public/`
2. Los archivos serán accesibles en: `https://your-app.onrender.com/uploads/filename.jpg`

### 3. Build Command
```bash
npm install && npx prisma migrate deploy && npm run build
```

### 4. Start Command
```bash
npm run start:prod
```

## Limitaciones Actuales

- **Tamaño máximo de archivo:** 5MB
- **Tipos permitidos:** JPEG, PNG, GIF, WebP
- **Máximo de archivos por subida múltiple:** 10 archivos

## Migración desde AWS S3

Los siguientes cambios se han realizado:
- ✅ Removido módulo AWS (`src/aws/`)
- ✅ Removidas dependencias `@aws-sdk`
- ✅ Creado servicio local de upload (`src/common/upload/`)
- ✅ Configurado `ServeStaticModule` en NestJS
- ✅ Limpiado CircleCI config (sin deploy automático)

## Estructura de Carpetas

```
backend/
├── public/
│   └── uploads/          # Carpeta para archivos subidos
├── src/
│   └── common/
│       ├── services/
│       │   └── upload.service.ts
│       └── upload/
│           ├── upload.module.ts
│           └── upload.controller.ts
└── package.json
```

## Testing Local

Para probar localmente:

```bash
# Instalar dependencias
pnpm install

# Crear archivo .env en apps/backend/
# Ejecutar servidor
pnpm --filter ./apps/backend... start:dev

# Subir archivo con curl
curl -X POST http://localhost:3000/api/uploads/image \
  -F "file=@./imagen.jpg"
```

## Notas Importantes

1. **Respaldo:** En producción con Render, asegúrate de hacer respaldos regulares de la carpeta `public/uploads/`
2. **Escalabilidad:** Si la aplicación crece mucho, considera migrar a un servicio CDN como Cloudinary
3. **Limpieza:** Implementa un job de limpieza para borrar archivos antiguos si es necesario

## Referencias

- [Render Docs - Persistent Disk](https://render.com/docs/disks)
- [NestJS Serve Static](https://docs.nestjs.com/recipes/serve-static)
- [Multer - Express Middleware for File Upload](https://github.com/expressjs/multer)
