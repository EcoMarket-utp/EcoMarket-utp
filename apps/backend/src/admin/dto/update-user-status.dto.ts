import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'Estado del usuario (activo/inactivo)',
  })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
