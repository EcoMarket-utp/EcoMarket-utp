# Planificación de Sprints - EcoMarket

Este documento resume la organización y asignación de tareas para los dos primeros sprints del proyecto EcoMarket.

---

## Sprint 1 - Fundamentos (23 al 30 de octubre de 2025)

### 1. Configurar repositorio y flujo Git  
**Responsable:** Juan  
- Crear ramas main/dev/feature.
- Definir reglas de PR y convenciones de commits.
- Documentar el flujo en el README.

**Criterios de aceptación:**  
- Ramas creadas y protegidas.
- README actualizado con el flujo de trabajo.

---

### 2. Generar esqueleto NestJS con dependencias  
**Responsable:** Jefferson  
- Crear proyecto NestJS con módulos principales (Auth, Products, Users).
- Instalar y configurar Prisma, JWT, Swagger.

**Criterios de aceptación:**  
- Proyecto compila y arranca.
- Dependencias instaladas y configuradas.

---

### 3. Implementar autenticación JWT y roles  
**Responsable:** Jefferson  
- Configurar AuthModule, endpoints de login/registro.
- Implementar lógica de roles (comprador, vendedor, admin).

**Criterios de aceptación:**  
- Login/registro funcional.
- Roles asignados correctamente.

---

### 4. CRUD de productos y usuarios  
**Responsable:** Miguel  
- Crear endpoints REST para productos y usuarios.
- Validar datos y manejar errores.

**Criterios de aceptación:**  
- Endpoints probados y funcionales.
- Validaciones implementadas.

---

### 5. Documentar endpoints y migración  
**Responsable:** Miguel  
- Documentar API con Swagger.
- Actualizar README con pasos de migración y uso.

**Criterios de aceptación:**  
- Documentación accesible y actualizada.
- Swagger disponible en el backend.

---

### 6. Integrar frontend con backend (login y catálogo)  
**Responsable:** Juan  
- Conectar Angular con endpoints de autenticación y productos.
- Probar login y visualización de catálogo.

**Criterios de aceptación:**  
- Frontend consume correctamente los endpoints.
- Login y catálogo funcionales.

---

### 7. Crear documentación técnica del frontend  
**Responsable:** Dario  
- Documentar estructura de carpetas, componentes y estilos.
- Explicar cómo iniciar y desarrollar en el frontend.

**Criterios de aceptación:**  
- Documentación clara y accesible en la carpeta `docs/`.
- Instrucciones de uso y desarrollo actualizadas.

---

### 8. Configurar CI/CD con CircleCI  
**Responsable:** Juan  
- Configurar pipeline de integración y despliegue continuo (CI/CD) usando CircleCI para backend y frontend.
- Automatizar pruebas, build y despliegue en ramas principales.
- Documentar el proceso y agregar el archivo de configuración `.circleci/config.yml` al repositorio.

**Criterios de aceptación:**  
- Pipeline de CircleCI ejecuta pruebas y build automáticamente en cada push/PR.
- Despliegue automático en entorno de staging (si aplica).
- Archivo de configuración y documentación agregados al repositorio.

---

## Sprint 2 - Funcionalidades avanzadas e integración (31 de octubre al 13 de noviembre de 2025)

### 1. Integrar frontend con nuevas funcionalidades del backend  
**Responsable:** Juan  
- Conectar Angular con endpoints de carrito, pedidos y administración.
- Probar flujo de compra y gestión de productos desde el frontend.

**Criterios de aceptación:**  
- Frontend consume correctamente los nuevos endpoints.
- Flujo de compra y administración funcionales.

---

### 2. Integrar AWS S3 para imágenes de productos  
**Responsable:** Jefferson  
- Implementar subida y gestión de imágenes en S3 desde backend y frontend.
- Configurar permisos y validaciones de archivos.

**Criterios de aceptación:**  
- Imágenes subidas y accesibles en S3.
- Seguridad y validación de archivos implementadas.

---

### 3. Endpoints de administración y gestión de roles  
**Responsable:** Jefferson  
- CRUD para administración de usuarios, productos y roles.
- Validar acceso según rol (admin, vendedor, comprador).

**Criterios de aceptación:**  
- Funcionalidad de administración completa y probada.
- Acceso restringido por roles.

---

### 4. Pruebas automatizadas (unitarias e integración)  
**Responsable:** Miguel  
- Implementar tests con Jest y supertest para backend.
- Asegurar cobertura mínima del 80%.

**Criterios de aceptación:**  
- Tests ejecutan y pasan en CI.
- Cobertura reportada y validada.

---

### 5. Configurar CI/CD y despliegue en AWS  
**Responsable:** Miguel  
- Pipeline de GitHub Actions para backend y frontend.
- Despliegue automático en EC2 + RDS + S3.

**Criterios de aceptación:**  
- Despliegue automático y funcional en AWS.
- Pipeline documentado y probado.

---

### 6. Documentar manual de usuario y demo  
**Responsable:** Juan  
- Crear manual de uso para compradores, vendedores y administradores.
- Preparar demo funcional para presentación final.

**Criterios de aceptación:**  
- Manual accesible y claro.
- Demo lista y validada por el equipo.

---

> Documento generado el 23 de octubre de 2025 para referencia y seguimiento del proyecto.
