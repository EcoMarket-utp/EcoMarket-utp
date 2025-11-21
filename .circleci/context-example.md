# CircleCI — ejemplo de contexto y variables de entorno

Este archivo es una plantilla/instrucción para crear un contexto en CircleCI con las variables necesarias para desplegar y ejecutar migraciones contra RDS y para acceder a S3.

IMPORTANTE: No incluyas valores reales en el repositorio. Crea el contexto en CircleCI y añade las variables desde la interfaz web o usando la API/CLI de CircleCI.

Variables recomendadas (nombres exactos usados en `.circleci/config.yml` y en el código):

- DATABASE_URL: cadena de conexión completa para Prisma (p. ej. "postgresql://user:pass@host:5432/db?schema=public")
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION (ej: us-east-1)
- AWS_S3_BUCKET_NAME
- JWT_SECRET

Ejemplo de creación manual (interfaz web):

1. Ve a https://app.circleci.com/organization-settings (requiere permisos de org)
2. En el menú, selecciona "Contexts" y crea un nuevo contexto (p. ej. `ecomarket-prod`)
3. Dentro del contexto, añade las variables listadas arriba con sus valores.
4. En tu pipeline (`.circleci/config.yml`) referencia el contexto en el job o usa variables de proyecto a nivel del repositorio.

Ejemplo (plantilla) de uso en `.circleci/config.yml`:

```
jobs:
  deploy:
    docker:
      - image: cimg/node:20.18.0
    steps:
      - checkout
      - setup_remote_docker
      - run: echo "Deploy using context variables"

workflows:
  deploy:
    jobs:
      - deploy:
          context: ecomarket-prod
```

Comandos (CLI/Automation) — opcionales

- Crear contexto (requiere `circleci` CLI v0.1+ y estar autenticado):

  circleci context create org/<ORG_SLUG> ecomarket-prod

- Añadir variable al contexto (usa la API o la interfaz web; la CLI oficial puede no soportar añadir secrets directamente dependiendo de la versión):

  # usando la API de CircleCI (ejemplo con curl):
  curl -X POST "https://circleci.com/api/v2/context/<context-id>/environment-variable" \
    -H "Circle-Token: $CIRCLE_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"AWS_ACCESS_KEY_ID","value":"<value>"}'

Notas de seguridad
- Usa una cuenta con permisos mínimos para crear/gestionar contextos.
- Considera usar AWS Secrets Manager para secretos de producción y sólo referencias en el CI.
- Revisa rotación de claves y permisos del IAM user que uses para CI.
