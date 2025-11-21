import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { AwsS3Service } from '../aws/aws-s3.service';

class UploadUrlDto {
  filename!: string;
  contentType?: string;
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService, private readonly aws: AwsS3Service) {}

  @Post('upload-url')
  async getUploadUrl(@Body() body: UploadUrlDto) {
    const bucket = process.env.AWS_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET_NAME || '';
    if (!bucket) {
      throw new Error('AWS_S3_BUCKET_NAME is not configured in environment');
    }
    const filename = body.filename ?? 'file';
    const contentType = body.contentType || 'application/octet-stream';
    // sanitize filename to avoid path traversal and spaces
    const filenameSafe = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const key = `products/${Date.now()}_${filenameSafe}`;
    const { url } = await this.aws.getUploadUrl(bucket, key, contentType);
    return { url, key, bucket };
  }

  @Post()
  async create(@Body() data: CreateProductDto) {
    return this.productsService.create(data);
  }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<CreateProductDto>) {
    return this.productsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
