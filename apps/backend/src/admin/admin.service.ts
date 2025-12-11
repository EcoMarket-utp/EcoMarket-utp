import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  CreateAdminUserDto,
} from './dto/index';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtener todos los usuarios con paginación y filtros
   */
  async getAllUsers(page: number = 1, limit: number = 10, role?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          role: true,
          is_active: true,
          last_login_at: true,
          created_at: true,
          updated_at: true,
        },
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener un usuario por ID
   */
  async getUserById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  /**
   * Obtener usuarios por rol
   */
  async getUsersByRole(role: string) {
    return await this.prisma.users.findMany({
      where: { role },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    });
  }

  /**
   * Actualizar rol de un usuario
   */
  async updateUserRole(userId: string, dto: UpdateUserRoleDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    if (user.role === dto.newRole) {
      throw new BadRequestException(
        `El usuario ya tiene el rol ${dto.newRole}`,
      );
    }

    const updatedUser = await this.prisma.users.update({
      where: { id: BigInt(userId) },
      data: { role: dto.newRole },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
        updated_at: true,
      },
    });

    return {
      message: `Rol de usuario actualizado a ${dto.newRole}`,
      user: updatedUser,
    };
  }

  /**
   * Cambiar estatus de un usuario (activar/desactivar)
   */
  async updateUserStatus(userId: string, dto: UpdateUserStatusDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    if (user.is_active === dto.isActive) {
      const status = dto.isActive ? 'activado' : 'desactivado';
      throw new BadRequestException(`El usuario ya está ${status}`);
    }

    const updatedUser = await this.prisma.users.update({
      where: { id: BigInt(userId) },
      data: { is_active: dto.isActive },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
        updated_at: true,
      },
    });

    return {
      message: `Usuario ${dto.isActive ? 'activado' : 'desactivado'} exitosamente`,
      user: updatedUser,
    };
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getUserStatistics() {
    const [totalUsers, activeUsers, usersByRole, sellerCount, adminCount] =
      await Promise.all([
        this.prisma.users.count(),
        this.prisma.users.count({ where: { is_active: true } }),
        this.prisma.users.groupBy({
          by: ['role'],
          _count: {
            id: true,
          },
        }),
        this.prisma.users.count({ where: { role: 'SELLER' } }),
        this.prisma.users.count({ where: { role: 'ADMIN' } }),
      ]);

    const roleStats = usersByRole.reduce(
      (acc, item) => {
        acc[item.role] = item._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      roleStats,
      sellerCount,
      adminCount,
      customerCount: totalUsers - sellerCount - adminCount,
    };
  }

  /**
   * Buscar usuarios por email o nombre
   */
  async searchUsers(query: string) {
    return await this.prisma.users.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { first_name: { contains: query, mode: 'insensitive' } },
          { last_name: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    });
  }

  /**
   * Crear un usuario admin
   */
  async createAdminUser(dto: CreateAdminUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email ya registrado');
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        first_name: dto.firstName,
        last_name: dto.lastName,
        role: 'ADMIN',
        is_active: true,
        username: dto.email.split('@')[0],
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    });

    return {
      message: 'Usuario administrador creado exitosamente',
      user,
    };
  }

  /**
   * Eliminar un usuario (soft delete)
   */
  async deleteUser(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const deletedUser = await this.prisma.users.update({
      where: { id: BigInt(userId) },
      data: { is_active: false },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
      },
    });

    return {
      message: 'Usuario desactivado exitosamente',
      user: deletedUser,
    };
  }
}
