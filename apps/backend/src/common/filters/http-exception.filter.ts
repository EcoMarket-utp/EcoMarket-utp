import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

/**
 * Global HTTP Exception Filter
 * Maneja todas las excepciones HTTP de la aplicación
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Internal server error';
    let errors: any = null;

    if (typeof exceptionResponse === 'object') {
      message = exceptionResponse['message'] || message;
      errors = exceptionResponse['error'] || null;
    }

    this.logger.error(`HTTP ${status}: ${message}`, exception.stack);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
      errors,
    });
  }
}
