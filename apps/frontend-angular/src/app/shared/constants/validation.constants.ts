export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PRODUCT_NAME_MIN_LENGTH: 3,
  PRODUCT_NAME_MAX_LENGTH: 255,
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'La contraseña debe tener mínimo 8 caracteres',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  INVALID_USERNAME: 'El nombre de usuario solo puede contener letras, números y guiones',
  USERNAME_TOO_SHORT: 'El nombre de usuario debe tener mínimo 3 caracteres',
  USERNAME_TOO_LONG: 'El nombre de usuario no puede exceder 30 caracteres',
  PRODUCT_NAME_REQUIRED: 'El nombre del producto es requerido',
  QUANTITY_INVALID: 'La cantidad debe ser un número positivo',
  PRICE_INVALID: 'El precio debe ser un número válido',
};

export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Perfil actualizado exitosamente',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
  PRODUCT_CREATED: 'Producto creado exitosamente',
  PRODUCT_UPDATED: 'Producto actualizado exitosamente',
  PRODUCT_DELETED: 'Producto eliminado exitosamente',
  CATEGORY_CREATED: 'Categoría creada exitosamente',
  REVIEW_POSTED: 'Reseña publicada exitosamente',
};
