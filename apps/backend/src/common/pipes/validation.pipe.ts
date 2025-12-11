import { PipeTransform, Injectable, BadRequestException, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

/**
 * Validation Pipe
 * Valida los DTOs usando class-validator
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ValidationPipe.name);

  async transform(value: any, { metatype }: any) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        return {
          field: error.property,
          messages: Object.values(error.constraints || {}),
        };
      });

      this.logger.warn(`Validation failed: ${JSON.stringify(errorMessages)}`);

      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
