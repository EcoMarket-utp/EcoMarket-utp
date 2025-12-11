export const APP_NAME = 'EcoMarket';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = 'http://localhost:3000/api';

export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  CURRENT_USER: 'current_user',
  CART_ID: 'cart_id',
};

export const MESSAGES = {
  SUCCESS: 'Operación completada exitosamente',
  ERROR: 'Ocurrió un error inesperado',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso denegado',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION_ERROR: 'Error de validación',
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGOUT_SUCCESS: 'Sesión cerrada',
  PRODUCT_ADDED_TO_CART: 'Producto agregado al carrito',
  PRODUCT_REMOVED_FROM_CART: 'Producto removido del carrito',
  CHECKOUT_SUCCESS: 'Compra realizada exitosamente',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};
