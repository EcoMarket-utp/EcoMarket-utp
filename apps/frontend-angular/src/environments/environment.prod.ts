export const environment = {
  production: true,
  apiUrl: 'https://ecomarket-utp-frontend.onrender.com/api',
  apiBaseUrl: 'https://ecomarket-utp-frontend.onrender.com',
  uploadUrl: 'https://ecomarket-utp-frontend.onrender.com/api/upload',
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
