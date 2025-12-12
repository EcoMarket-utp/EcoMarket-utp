# Guía de Despliegue en Render

Esta guía explica cómo desplegar el proyecto EcoMarket en Render, una plataforma de nube que soporta aplicaciones web y APIs. El proyecto es un monorepo con backend (NestJS) y frontend (Angular), ambos usando Docker.

## Prerrequisitos

- Cuenta en [Render](https://render.com).
- Repositorio conectado a GitHub (Settings > Account > Connected Accounts).
- Base de datos PostgreSQL creada en Render (ya configurada según tus indicaciones).
- Credenciales de la base de datos ya agregadas al proyecto (variables de entorno).

## Paso 1: Preparar el Repositorio

Asegúrate de que el código esté actualizado en GitHub en la rama `dev`. Si hiciste cambios, haz commit y push:

```bash
git add .
git commit -m "Preparar para despliegue en Render"
git push origin dev
```

## Paso 2: Desplegar el Backend

1. Ve al [Dashboard de Render](https://dashboard.render.com).
2. Haz clic en **New > Web Service**.
3. Selecciona **Connect** y elige tu repositorio GitHub: `EcoMarket-utp/EcoMarket-utp`.
4. Configura:
   - **Branch**: `dev`
   - **Runtime**: Docker
   - **Dockerfile Path**: `apps/backend/Dockerfile`
   - **Build Command**: Deja vacío (Render usa el Dockerfile).
   - **Start Command**: Deja vacío.
   - **Environment**: Node
   - **Instance Type**: Free (o elige uno pago si necesitas más recursos).
5. Agrega las **Environment Variables** necesarias:
   - `DATABASE_URL`: La URL de tu base de datos PostgreSQL (incluye `?sslmode=require`).
   - `JWT_SECRET`: (Opcional, ya implementado en el código con una clave segura; usa una personal si prefieres).
   - `NODE_ENV`: `production`
   - Otras variables específicas de tu app (revisa el código en `apps/backend/src/config/`).
6. Haz clic en **Create Web Service**. Render construirá y desplegará automáticamente.

## Paso 3: Desplegar el Frontend

1. En el Dashboard de Render, haz clic en **New > Web Service** nuevamente.
2. Selecciona el mismo repositorio GitHub.
3. Configura:
   - **Branch**: `dev`
   - **Runtime**: Docker
   - **Dockerfile Path**: `apps/frontend-angular/Dockerfile`
   - **Build Command**: Deja vacío.
   - **Start Command**: Deja vacío.
   - **Environment**: Node
   - **Instance Type**: Free.
4. Agrega **Environment Variables** si es necesario (ej. URL del backend):
   - `API_URL`: La URL del backend desplegado (ej. `https://tu-backend.onrender.com`).
5. Haz clic en **Create Web Service**. Render construirá y desplegará el frontend.

## Paso 4: Verificar el Despliegue

- Una vez desplegado, Render te proporcionará URLs para cada servicio (backend y frontend).
- Accede a la URL del frontend para probar la aplicación.
- Revisa los logs en Render si hay errores (pestaña Logs en cada servicio).
- Para el backend, asegúrate de que las migraciones de Prisma se ejecuten (verifica el Dockerfile o agrega un comando si es necesario).

## Paso 5: Desactivar el Redeploy Automático (Recomendado para Plan Free)

Para evitar consumos innecesarios en el plan gratuito de Render, desactiva el redeploy automático:

1. Ve al dashboard de Render y selecciona cada servicio (backend y frontend).
2. En la pestaña **Settings**, busca la opción **Auto-Deploy**.
3. Desactívala (toggle off).
4. Ahora los servicios solo se redeployarán manualmente cuando hagas clic en **Manual Deploy**.

## Notas Adicionales

- **Actualizaciones**: Render detecta cambios en GitHub automáticamente y redeploya. Solo haz push a la rama `dev`.
- **Redeploy Manual**: Para el plan gratuito, es recomendable desactivar el auto-redeploy (ver Paso 5) para evitar consumos innecesarios.
- **Base de Datos**: Si necesitas reiniciar o cambiar la DB, hazlo desde el panel de PostgreSQL en Render.
- **Costos**: El plan Free es suficiente para pruebas, pero limita el uso. Actualiza si necesitas más.
- **Seguridad**: Nunca expongas claves sensibles en el código. Usa siempre variables de entorno.
- **Soporte**: Si encuentras problemas, consulta la [documentación de Render](https://docs.render.com) o los logs detallados.

¡Tu aplicación debería estar funcionando en Render! Si necesitas ajustes, edita las configuraciones en el dashboard.</content>
<filePath>C:\Users\aldai\Downloads\proyectos\EcoMarket-utp\RENDER_DEPLOYMENT.md