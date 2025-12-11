import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * Parse Int Pipe
 * Convierte y valida que un parámetro sea un número entero válido
 */
@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    const intValue = parseInt(value, 10);

    if (isNaN(intValue)) {
      throw new BadRequestException(`Validation failed: "${value}" is not a valid integer`);
    }

    if (intValue < 1) {
      throw new BadRequestException(`Validation failed: "${value}" must be greater than 0`);
    }

    return intValue;
  }
}
