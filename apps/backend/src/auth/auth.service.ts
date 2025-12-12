import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async signup(dto: SignupDto) {
    // Verificar si el email ya existe
    const existingUser = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email ya registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Crear usuario con datos completos y rol dinámico
    const user = await this.prisma.users.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        username: dto.email.split('@')[0],
        first_name: dto.firstName,
        last_name: dto.lastName,
        is_active: true,
      },
    });

    // Generar JWT
    const payload = { sub: user.id.toString(), email: user.email };
    const token = this.jwtService.sign(payload);

    // Devolver usuario sin password y token
    // Asignar rol por defecto usando la tabla `roles` y la relación `users_roles`
    const roleName = 'ROLE_USER';
    let role = await this.prisma.roles.findUnique({ where: { name: roleName } });
    if (!role) {
      role = await this.prisma.roles.create({ data: { name: roleName, description: 'Default user role' } });
    }

    await this.prisma.users_roles.create({ data: { user_id: user.id, role_id: role.id } });

    // Enviar webhook a n8n para email de bienvenida
    try {
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n-7hcl.onrender.com/webhook/user-registration';
      await firstValueFrom(
        this.httpService.post(n8nWebhookUrl, {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          registration_type: 'Usuario',
          user_id: user.id.toString(),
        })
      );
      console.log(`✅ Webhook enviado para usuario: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error enviando webhook para usuario ${user.email}:`, error.message);
      // No lanzamos error para no interrumpir el registro
    }

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isActive: user.is_active,
      },
      token,
      message: 'Usuario registrado exitosamente',
    };
  }

  async login(dto: LoginDto) {
    // Buscar usuario por email
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (!user?.is_active) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar contraseña
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT
    const payload = { sub: user.id.toString(), email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isActive: user.is_active,
      },
      token,
      message: 'Login exitoso',
    };
  }
}
