import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.users.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: string) {
    return this.prisma.users.findUnique({
      where: { id: BigInt(id) },
    });
  }

  async update(id: string, updateUserDto: any) {
    return this.prisma.users.update({
      where: { id: BigInt(id) },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return this.prisma.users.delete({
      where: { id: BigInt(id) },
    });
  }
}
