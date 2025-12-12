export const environment = {
  production: false,
  apiUrl: 'http://localhost:3002/api',
  apiBaseUrl: 'http://localhost:3002',
  uploadUrl: 'http://localhost:3002/api/upload',
  storageKeys: {
    token: 'ecomarket_token',
    refreshToken: 'ecomarket_refresh_token',
    user: 'ecomarket_user',
    cart: 'ecomarket_cart',
  },
  logging: {
    enableConsoleLogging: true,
    enableRemoteLogging: false,
  },
};
