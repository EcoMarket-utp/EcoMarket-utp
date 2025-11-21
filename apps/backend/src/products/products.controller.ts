import { Request, Response } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import ProductsService from './products.service';

const productsService = new ProductsService();

export default class ProductsController {
  async create(
    req: Request<Record<string, any>, any, CreateProductDto>,
    res: Response,
  ) {
    const data = req.body;
    const product = await productsService.create(data);
    return res.status(201).json(product);
  }

  async findAll(req: Request, res: Response) {
    const items = await productsService.findAll();
    return res.json(items);
  }
}
