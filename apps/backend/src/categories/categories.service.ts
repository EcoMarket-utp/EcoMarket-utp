import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crear una nueva categoría
   */
  async create(dto: CreateCategoryDto) {
    // Verificar si la categoría ya existe
    const existingCategory = await this.prisma.categories.findUnique({
      where: { name: dto.name },
    });

    if (existingCategory) {
      throw new ConflictException(`La categoría "${dto.name}" ya existe`);
    }

    return await this.prisma.categories.create({
      data: {
        name: dto.name,
        description: dto.description,
        slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
        is_active: true,
      },
    });
  }

  /**
   * Obtener todas las categorías (con opción de filtro por estado)
   */
  async findAll(includeInactive = false) {
    const where: any = {};
    if (!includeInactive) {
      where.is_active = true;
    }

    return await this.prisma.categories.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Obtener una categoría por ID
   */
  async findById(id: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id: BigInt(id) },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            is_active: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return category;
  }

  /**
   * Obtener categoría por nombre
   */
  async findByName(name: string) {
    const category = await this.prisma.categories.findUnique({
      where: { name },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoría "${name}" no encontrada`);
    }

    return category;
  }

  /**
   * Actualizar una categoría
   */
  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findById(id);

    // Si cambia el nombre, verificar que no exista otra categoría con ese nombre
    if (dto.name && dto.name !== category.name) {
      const existingCategory = await this.prisma.categories.findUnique({
        where: { name: dto.name },
      });

      if (existingCategory) {
        throw new ConflictException(`La categoría "${dto.name}" ya existe`);
      }
    }

    return await this.prisma.categories.update({
      where: { id: BigInt(id) },
      data: {
        name: dto.name || category.name,
        slug: (dto.name || category.name).toLowerCase().replace(/\s+/g, '-'),
        description:
          dto.description !== undefined
            ? dto.description
            : category.description,
        is_active: dto.isActive !== undefined ? dto.isActive : category.is_active,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  /**
   * Cambiar estado de una categoría (activa/inactiva)
   */
  async toggleStatus(id: string) {
    const category = await this.findById(id);

    return await this.prisma.categories.update({
      where: { id: BigInt(id) },
      data: { is_active: !category.is_active },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  /**
   * Eliminar una categoría (soft delete)
   */
  async delete(id: string) {
    const category = await this.findById(id);

    // Verificar si tiene productos activos
    const productCount = await this.prisma.products.count({
      where: { category_id: BigInt(id), is_active: true },
    });

    if (productCount > 0) {
      throw new BadRequestException(
        `No se puede eliminar la categoría "${category.name}" porque tiene ${productCount} producto(s) activo(s)`,
      );
    }

    return await this.prisma.categories.update({
      where: { id: BigInt(id) },
      data: { is_active: false },
    });
  }

  /**
   * Obtener categorías con productos
   */
  async findWithProducts(id: string, skip = 0, take = 10) {
    const category = await this.findById(id);

    const products = await this.prisma.products.findMany({
      where: { category_id: BigInt(id), is_active: true },
      skip,
      take,
      include: {
        users: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const totalProducts = await this.prisma.products.count({
      where: { category_id: BigInt(id), is_active: true },
    });

    return {
      category,
      products,
      pagination: {
        total: totalProducts,
        skip,
        take,
        pages: Math.ceil(totalProducts / take),
      },
    };
  }

  /**
   * Obtener estadísticas de categorías
   */
  async getStatistics() {
    const totalCategories = await this.prisma.categories.count();
    const activeCategories = await this.prisma.categories.count({
      where: { is_active: true },
    });

    const categoriesWithProducts = await this.prisma.categories.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      totalCategories,
      activeCategories,
      inactiveCategories: totalCategories - activeCategories,
      categoriesWithProducts,
    };
  }
}
