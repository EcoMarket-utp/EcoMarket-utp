import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import UsersService from './users.service';

const usersService = new UsersService();

export default class UsersController {
  async create(
    req: Request<Record<string, any>, any, CreateUserDto>,
    res: Response,
  ) {
    const data = req.body;
    const user = await usersService.create(data);
    return res.status(201).json(user);
  }

  async findAll(req: Request, res: Response) {
    const items = await usersService.findAll();
    return res.json(items);
  }
}
