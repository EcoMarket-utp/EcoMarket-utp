import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function convertBigIntToString(value: any): any {
  if (typeof value === 'bigint') return value.toString();
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(convertBigIntToString);
  if (typeof value === 'object') {
    // If it's a plain object or has toJSON, attempt to convert its properties
    const result: any = {};
    for (const key of Object.keys(value)) {
      try {
        result[key] = convertBigIntToString(value[key]);
      } catch (_) {
        // If property access throws, fallback to original
        result[key] = value[key];
      }
    }
    return result;
  }
  return value;
}

@Injectable()
export class BigIntToStringInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => convertBigIntToString(data)));
  }
}
