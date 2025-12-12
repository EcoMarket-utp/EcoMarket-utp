export const environment = {
  production: true,
  apiUrl: 'https://ecomarket-utp-backend.onrender.com/api',
  apiBaseUrl: 'https://ecomarket-utp-backend.onrender.com',
  uploadUrl: 'https://ecomarket-utp-backend.onrender.com/api/upload',
  storageKeys: {
    token: 'ecomarket_token',
    refreshToken: 'ecomarket_refresh_token',
    user: 'ecomarket_user',
    cart: 'ecomarket_cart',
  },
  logging: {
    enableConsoleLogging: false,
    enableRemoteLogging: true,
  },
};
