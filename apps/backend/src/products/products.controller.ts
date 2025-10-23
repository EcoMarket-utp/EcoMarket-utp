import { Request, Response } from "express";
import ProductsService from "./products.service";

const productsService = new ProductsService();

export default class ProductsController {
  async create(req: Request, res: Response) {
    const data = req.body;
    const product = await productsService.create(data);
    return res.status(201).json(product);
  }

  async findAll(req: Request, res: Response) {
    const items = await productsService.findAll();
    return res.json(items);
  }
}
