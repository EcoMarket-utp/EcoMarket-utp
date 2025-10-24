# Prisma / Base de datos — instrucciones para desarrolladores

Este directorio contiene la configuración de Prisma para el backend. Sigue estos pasos localmente para configurar tu entorno sin subir credenciales al repo.

1) Crear archivo `.env` local

- Copia el archivo de ejemplo:

  cp .env.example .env

- Rellena la variable `DATABASE_URL` con tu cadena de conexión (no la subas al repo).

2) Instalar dependencias (desde la raíz del monorepo o desde `apps/backend`)

  pnpm install --filter ./apps/backend...

3) Generar Prisma Client

  cd apps/backend
  pnpm db:generate

4) Aplicar migraciones (RDS/producción)

  # Asegúrate de que .env contiene la DATABASE_URL apuntando a la BD correcta
  pnpm db:migrate:prod

5) Ejecutar tests e2e localmente (si aplican)

  pnpm test:e2e

Buenas prácticas
- Nunca commitees archivos `.env` con credenciales. Añadelos a `.gitignore` si aún no lo están.
- Usa secretos de CI/CD (CircleCI environment variables / AWS Secrets Manager) para despliegues.
- Si necesitas rotar credenciales, hazlo desde AWS Console o usando AWS CLI con autorización adecuada y actualiza las variables locales y del CI.

Soporte
- Si tienes problemas conectando a RDS, verifica:
  - Tu IP está permitida en el Security Group
  - Las variables `DATABASE_URL` están bien formadas
  - El RDS está en estado "available"
