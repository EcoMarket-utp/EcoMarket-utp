import { CreateProductDto } from './dto/create-product.dto';
import Product from './entities/product.entity';

export default class ProductsService {
  private items: Product[] = [];

  create(data: CreateProductDto): Promise<Product> {
    const product: Product = {
      id: (this.items.length + 1).toString(),
      name: data.name,
      price: data.price,
      description: data.description || '',
    };
    this.items.push(product);
    return Promise.resolve(product);
  }

  findAll(): Promise<Product[]> {
    return Promise.resolve(this.items);
  }
}
