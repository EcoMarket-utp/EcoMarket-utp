import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';

export default class UsersService {
  private items: User[] = [];
  create(data: CreateUserDto): Promise<User> {
    const user: User = {
      id: (this.items.length + 1).toString(),
      username: data.username,
      email: data.email,
    };
    this.items.push(user);
    return Promise.resolve(user);
  }

  findAll(): Promise<User[]> {
    return Promise.resolve(this.items);
  }
}
