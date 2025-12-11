import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * Protects routes que requieren autenticación válida
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
