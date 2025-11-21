import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto, sellerId: string) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
        description: dto.description,
        stock: dto.stock ?? 0,
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
        sellerId,
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(skip = 0, take = 10) {
    return this.prisma.product.findMany({
      where: { isActive: true },
      skip,
      take,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async findByCategory(categoryId: string, skip = 0, take = 10) {
    return this.prisma.product.findMany({
      where: { categoryId, isActive: true },
      skip,
      take,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: Partial<CreateProductDto>, sellerId: string) {
    const product = await this.findById(id);

    // Verificar que el vendedor sea el propietario
    if (product.sellerId !== sellerId) {
      throw new Error('No autorizado para actualizar este producto');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        price: dto.price,
        description: dto.description,
        stock: dto.stock,
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async delete(id: string, sellerId: string) {
    const product = await this.findById(id);

    if (product.sellerId !== sellerId) {
      throw new Error('No autorizado para eliminar este producto');
    }

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
