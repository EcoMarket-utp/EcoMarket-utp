/**
 * JWT configuration for authentication
 */
export const jwtConfig = () => ({
  secret: process.env.JWT_SECRET || '04fec69faae12bdb6ec426ee41084093ad76668e47ba5e04923ddee9b6244f64',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || '0795b2493f941cb9b16e9fc3a48b0757fd5f51fe9a094a41ce3822abf9cecd10',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
});

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || '04fec69faae12bdb6ec426ee41084093ad76668e47ba5e04923ddee9b6244f64',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '0795b2493f941cb9b16e9fc3a48b0757fd5f51fe9a094a41ce3822abf9cecd10',
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};
