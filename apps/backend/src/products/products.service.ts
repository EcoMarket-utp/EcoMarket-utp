import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    const payload: any = {
      name: data.name,
      slug: data.slug ?? slugify(data.name),
      description: data.description || undefined,
      short_description: data.shortDescription || undefined,
      sku: data.sku || undefined,
      price: data.price != null ? data.price.toString() : undefined,
      compare_price: data.comparePrice != null ? data.comparePrice.toString() : undefined,
      cost_price: data.costPrice != null ? data.costPrice.toString() : undefined,
      stock_quantity: data.stockQuantity ?? 0,
      low_stock_threshold: data.lowStockThreshold,
      is_active: data.isActive ?? true,
      is_featured: data.isFeatured ?? false,
      is_digital: data.isDigital ?? false,
      weight: data.weight != null ? data.weight.toString() : undefined,
      dimensions: (data as any).dimensions || undefined,
      category_id: data.categoryId != null ? BigInt(data.categoryId) : undefined,
      brand: (data as any).brand || undefined,
      tags: data.tags ?? [],
      seo_title: (data as any).seoTitle || undefined,
      seo_description: (data as any).seoDescription || undefined,
    };


    // Use delegates that match the introspected schema: `products` and `product_images`.
    const created = await (this.prisma as any).products.create({ data: payload });

    // If images provided, persist them in product_images table
    if (Array.isArray(data.images) && data.images.length > 0) {
      const imagesData = data.images.map((img: any) => ({
        product_id: created.id,
        image_url: img.imageUrl,
        alt_text: img.altText || null,
        sort_order: img.sortOrder ?? 0,
        is_primary: img.isPrimary ?? false,
      }));

      // Persist images using the `product_images` delegate from the generated client
      const imagesDelegate = (this.prisma as any).product_images;
      if (!imagesDelegate) {
        throw new Error('Prisma client does not expose a product_images delegate');
      }

      if (typeof imagesDelegate.createMany === 'function') {
        await imagesDelegate.createMany({ data: imagesData });
      } else {
        for (const img of imagesData) {
          await imagesDelegate.create({ data: img });
        }
      }
    }

    // Return created product including images
    return (this.prisma as any).products.findUnique({ where: { id: created.id }, include: { product_images: true } });
  }

  async findAll() {
    return (this.prisma as any).products.findMany({ include: { product_images: true } });
  }
  async findOne(id: string) {
    return (this.prisma as any).products.findUnique({ where: { id: BigInt(id) }, include: { product_images: true } });
  }

  async update(id: string, data: Partial<CreateProductDto>) {
    const payload: any = {};
    if (data.name) payload.name = data.name;
    if ((data as any).slug) payload.slug = (data as any).slug;
    if (data.description !== undefined) payload.description = data.description;
    if (data.price !== undefined) payload.price = data.price.toString();
    if ((data as any).stockQuantity !== undefined) payload.stock_quantity = (data as any).stockQuantity;
    if ((data as any).tags !== undefined) payload.tags = (data as any).tags;
    return (this.prisma as any).products.update({ where: { id: BigInt(id) }, data: payload });
  }

  async remove(id: string) {
    return (this.prisma as any).products.delete({ where: { id: BigInt(id) } });
  }
}

