/**
 * Validation-related constants
 */

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  USERNAME_REGEX: /^[a-zA-Z0-9_-]*$/,
};

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Email format is invalid',
  INVALID_PASSWORD: 'Password must contain uppercase, lowercase, numbers and special characters',
  INVALID_USERNAME: 'Username can only contain letters, numbers, hyphens and underscores',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access denied',
  INTERNAL_ERROR: 'Internal server error',
};

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
};
