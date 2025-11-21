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
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtener todos los usuarios con paginación y filtros
   */
  async getAllUsers(page: number = 1, limit: number = 10, role?: Role) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
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
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            isActive: true,
          },
        },
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
  async getUsersByRole(role: Role) {
    return await this.prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  /**
   * Actualizar rol de un usuario
   */
  async updateUserRole(userId: string, dto: UpdateUserRoleDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    if (user.role === dto.newRole) {
      throw new BadRequestException(
        `El usuario ya tiene el rol ${dto.newRole}`,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: dto.newRole },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true,
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
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    if (user.isActive === dto.isActive) {
      const status = dto.isActive ? 'activado' : 'desactivado';
      throw new BadRequestException(`El usuario ya está ${status}`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: dto.isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true,
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
        this.prisma.user.count(),
        this.prisma.user.count({ where: { isActive: true } }),
        this.prisma.user.groupBy({
          by: ['role'],
          _count: {
            id: true,
          },
        }),
        this.prisma.user.count({ where: { role: 'SELLER' } }),
        this.prisma.user.count({ where: { role: 'ADMIN' } }),
      ]);

    const roleStats = usersByRole.reduce(
      (acc, item) => {
        acc[item.role] = item._count.id;
        return acc;
      },
      {} as Record<Role, number>,
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
    return await this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  /**
   * Crear un usuario admin
   */
  async createAdminUser(dto: CreateAdminUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email ya registrado');
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'ADMIN',
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
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
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const deletedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    return {
      message: 'Usuario desactivado exitosamente',
      user: deletedUser,
    };
  }
}
