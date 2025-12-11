export interface User {
  id: bigint;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export type UserModel = User;
export interface UpdateProfileRequest {
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}
