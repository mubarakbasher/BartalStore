import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '@bartal/shared';

interface AuthedRequest extends Request {
  user?: { id: string; role: UserRole };
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    if (req.user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message_en: 'Admin role required.',
        message_ar: 'هذا الإجراء يتطلب صلاحية مشرف.',
      });
    }
    return true;
  }
}
