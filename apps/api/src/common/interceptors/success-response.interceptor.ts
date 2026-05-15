import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { ApiSuccess } from '@bartal/shared';

/**
 * Wraps every successful response in `{ success: true, data: ... }`.
 * If a controller already returns `{ success, data }` or `{ success, error }`,
 * the interceptor passes it through unchanged.
 */
@Injectable()
export class SuccessResponseInterceptor<T>
  implements NestInterceptor<T, ApiSuccess<T> | T>
{
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiSuccess<T> | T> {
    return next.handle().pipe(
      map((data) => {
        if (
          data !== null &&
          typeof data === 'object' &&
          'success' in (data as Record<string, unknown>)
        ) {
          return data;
        }
        return { success: true, data } as ApiSuccess<T>;
      }),
    );
  }
}
