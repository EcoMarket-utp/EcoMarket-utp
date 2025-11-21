import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'Nuevo rol para el usuario',
    enum: ['CUSTOMER', 'SELLER', 'ADMIN'],
  })
  @IsNotEmpty()
  @IsEnum(['CUSTOMER', 'SELLER', 'ADMIN'])
  newRole: Role;
}
