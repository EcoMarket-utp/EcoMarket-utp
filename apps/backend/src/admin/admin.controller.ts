import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  CreateAdminUserDto,
} from './dto/index';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Obtener todos los usuarios con paginación
   */
  @Get('users')
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Cantidad de usuarios por página',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filtrar por rol (CUSTOMER, SELLER, ADMIN)',
  })
  getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('role') role?: string,
  ) {
    return this.adminService.getAllUsers(
      parseInt(page),
      parseInt(limit),
      role as any,
    );
  }

  /**
   * Obtener usuario por ID
   */
  @Get('users/:id')
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  /**
   * Obtener usuarios por rol
   */
  @Get('users-by-role/:role')
  @ApiResponse({ status: 200, description: 'Usuarios por rol obtenidos' })
  @ApiParam({
    name: 'role',
    description: 'Rol a filtrar (CUSTOMER, SELLER, ADMIN)',
  })
  getUsersByRole(@Param('role') role: string) {
    return this.adminService.getUsersByRole(role as any);
  }

  /**
   * Buscar usuarios
   */
  @Get('search')
  @ApiQuery({ name: 'q', description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda' })
  searchUsers(@Query('q') query: string) {
    return this.adminService.searchUsers(query);
  }

  /**
   * Obtener estadísticas de usuarios
   */
  @Get('statistics')
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas' })
  getStatistics() {
    return this.adminService.getUserStatistics();
  }

  /**
   * Actualizar rol de un usuario
   */
  @Patch('users/:id/role')
  @ApiResponse({ status: 200, description: 'Rol actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  updateUserRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.adminService.updateUserRole(id, dto);
  }

  /**
   * Cambiar estado de un usuario (activar/desactivar)
   */
  @Patch('users/:id/status')
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  updateUserStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.adminService.updateUserStatus(id, dto);
  }

  /**
   * Crear un nuevo usuario administrador
   */
  @Post('users/create-admin')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Administrador creado exitosamente',
  })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  createAdminUser(@Body() dto: CreateAdminUserDto) {
    return this.adminService.createAdminUser(dto);
  }

  /**
   * Eliminar un usuario (desactivar)
   */
  @Delete('users/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Usuario desactivado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  /**
   * Seed database with sample data
   */
  @Post('seed')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Database seeded successfully' })
  @ApiResponse({ status: 500, description: 'Seeding failed' })
  async seedDatabase() {
    return this.adminService.seedDatabase();
  }
}
