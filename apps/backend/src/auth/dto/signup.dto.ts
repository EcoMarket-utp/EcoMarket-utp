import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from '@prisma/client';

export class SignupDto {
  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Email único del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
  })
  @IsString()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    example: 'CUSTOMER',
    enum: Role,
    description: 'Rol: CUSTOMER, SELLER o ADMIN',
    required: false,
    default: 'CUSTOMER',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.ADMIN;
}
