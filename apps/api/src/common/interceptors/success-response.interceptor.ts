import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

/**
 * Wraps every successful response in `{ success: true, data: ... }` per PRD §10.2.
 * - If a service already returned `{ success, data | error, ... }`, passes it through.
 * - If a service returned `{ data: T[], meta }` (paginated), hoists `data` and `meta`
 *   to the top level of the envelope.
 * - Otherwise, wraps the payload as `data`.
 */
@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor<unknown, unknown> {
  intercept(_context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (data === null || typeof data !== 'object') {
          return { success: true, data };
        }
        const obj = data as Record<string, unknown>;
        if ('success' in obj) return obj;
        if ('data' in obj && 'meta' in obj && Array.isArray(obj.data)) {
          return { success: true, data: obj.data, meta: obj.meta };
        }
        return { success: true, data };
      }),
    );
  }
}
