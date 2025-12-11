/**
 * Application-wide constants
 */

export const APP_NAME = 'EcoMarket API';
export const APP_VERSION = '1.0.0';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const CACHE_CONFIG = {
  DEFAULT_TTL: 300, // 5 minutes
  MAX_TTL: 3600, // 1 hour
};

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
