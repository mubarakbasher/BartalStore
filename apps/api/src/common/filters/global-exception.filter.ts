import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiError } from '@bartal/shared';

interface BilingualMessage {
  en: string;
  ar: string;
}

/**
 * Global exception filter that wraps every error in the bilingual envelope
 * defined in PRD §10.2.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.extractStatus(exception);
    const { code, message } = this.extractDetails(exception);

    const body: ApiError = {
      success: false,
      error: {
        code,
        message_en: message.en,
        message_ar: message.ar,
        status,
      },
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status} ${code}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json(body);
  }

  private extractStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private extractDetails(exception: unknown): { code: string; message: BilingualMessage } {
    if (exception instanceof NotImplementedException) {
      return {
        code: 'NOT_IMPLEMENTED',
        message: {
          en: 'This endpoint is scaffolded but not yet implemented.',
          ar: 'هذه الواجهة قيد التطوير ولم تُنفَّذ بعد.',
        },
      };
    }
    if (exception instanceof HttpException) {
      const resp = exception.getResponse();
      const code = this.codeFromStatus(exception.getStatus());
      if (typeof resp === 'string') {
        return { code, message: { en: resp, ar: this.fallbackAr(code) } };
      }
      const obj = resp as Record<string, unknown>;
      const en = String(obj.message_en ?? obj.message ?? exception.message);
      const ar = String(obj.message_ar ?? this.fallbackAr(code));
      return { code: String(obj.code ?? code), message: { en, ar } };
    }
    return {
      code: 'INTERNAL_ERROR',
      message: {
        en: 'Something went wrong. Please try again.',
        ar: 'حدث خطأ ما. الرجاء المحاولة مرة أخرى.',
      },
    };
  }

  private codeFromStatus(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'VALIDATION_ERROR';
      case 429:
        return 'RATE_LIMITED';
      case 501:
        return 'NOT_IMPLEMENTED';
      default:
        return status >= 500 ? 'INTERNAL_ERROR' : 'ERROR';
    }
  }

  private fallbackAr(code: string): string {
    switch (code) {
      case 'BAD_REQUEST':
      case 'VALIDATION_ERROR':
        return 'يرجى مراجعة الحقول المرسلة.';
      case 'UNAUTHORIZED':
        return 'الرجاء تسجيل الدخول للمتابعة.';
      case 'FORBIDDEN':
        return 'غير مسموح لك بهذا الإجراء.';
      case 'NOT_FOUND':
        return 'غير موجود.';
      case 'CONFLICT':
        return 'يوجد تعارض في البيانات.';
      case 'RATE_LIMITED':
        return 'محاولات كثيرة جداً. الرجاء الانتظار قليلاً.';
      case 'NOT_IMPLEMENTED':
        return 'هذه الواجهة قيد التطوير.';
      default:
        return 'حدث خطأ ما.';
    }
  }
}
