import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Crear una nueva categoría (ADMIN only)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente' })
  @ApiResponse({ status: 409, description: 'Categoría ya existe' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  /**
   * Obtener todas las categorías
   */
  @Get()
  @ApiResponse({ status: 200, description: 'Lista de categorías' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Incluir categorías inactivas',
  })
  findAll(@Query('includeInactive') includeInactive = 'false') {
    return this.categoriesService.findAll(includeInactive === 'true');
  }

  /**
   * Obtener categoría por ID
   */
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Categoría encontrada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  /**
   * Obtener categoría con productos
   */
  @Get(':id/products')
  @ApiResponse({ status: 200, description: 'Categoría con productos' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiQuery({ name: 'skip', required: false, description: 'Saltar registros' })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Cantidad de registros',
  })
  findWithProducts(
    @Param('id') id: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    return this.categoriesService.findWithProducts(
      id,
      parseInt(skip),
      parseInt(take),
    );
  }

  /**
   * Obtener estadísticas de categorías
   */
  @Get('stats/general')
  @ApiResponse({ status: 200, description: 'Estadísticas' })
  getStatistics() {
    return this.categoriesService.getStatistics();
  }

  /**
   * Actualizar una categoría (ADMIN only)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Categoría actualizada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 409, description: 'Conflicto' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  /**
   * Cambiar estado de una categoría
   */
  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Estado cambiado' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  toggleStatus(@Param('id') id: string) {
    return this.categoriesService.toggleStatus(id);
  }

  /**
   * Eliminar una categoría (Soft delete)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Categoría eliminada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 400, description: 'Tiene productos asociados' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
