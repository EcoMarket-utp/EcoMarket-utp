# Flujo de trabajo colaborativo – EcoMarket

## Convención de ramas

- `main`: Rama principal y estable (producción).
- `dev`: Rama de desarrollo principal.
- `feature/IDJira-descripcion`: Nuevas funcionalidades (ejemplo: `feature/EC-2-login-usuario`).
- `bugfix/IDJira-descripcion`: Corrección de errores.
- `hotfix/IDJira-descripcion`: Correcciones urgentes.
- `release/version`: Preparar una nueva versión.

## Reglas de commits

- Todo commit debe incluir el ID del ticket de Jira al inicio:
  ```
  EC-2: feat(auth): implementar login de usuario
  ```

## Flujo de trabajo

1. **Crear rama**
   - Desde `dev` o `feature`, crea una rama para tu ticket usando la convención.
   - Ejemplo:
     ```
     git checkout dev
     git checkout -b feature/EC-2-login-usuario
     git push origin feature/EC-2-login-usuario
     ```

2. **Desarrollar y hacer commits**
   - Realiza los cambios y haz commits descriptivos con el ID de Jira.

3. **Abrir Pull Request**
   - Abre un PR hacia `dev` o `main`.
   - El título y/o la descripción deben incluir el ID del ticket de Jira (ejemplo: `Resolves EC-2`).
   - Solicita revisión de al menos un compañero.

4. **Checks automáticos**
   - El PR debe pasar los checks de CI/CD (tests, lint, etc.) antes de merge.

5. **Merge y cierre**
   - Solo se permite merge mediante PR y revisión.
   - Al hacer merge, Jira puede marcar el ticket como "Done" automáticamente si la integración está activa.

## Protección de ramas

- Las ramas `main`, `dev` y `feature` están protegidas:
  - Solo se puede hacer merge mediante PR.
  - Se requiere revisión y aprobación.
  - Se bloquean los pushes directos y los force pushes.
  - Los PR deben pasar los checks automáticos.

## Integración con Jira

- Los mensajes de commit y PR deben incluir el ID del ticket de Jira.
- La integración Jira-GitHub vincula automáticamente los PR y commits a los tickets.
- Al hacer merge de un PR con el ID del ticket, Jira puede cambiar el estado del ticket a "Done".

---

Este flujo asegura trazabilidad, calidad y colaboración efectiva en el desarrollo del proyecto.