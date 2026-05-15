import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Auth guard that attaches `req.user` when a valid token is present
 * but never blocks the request when it's missing. Used for guest-browsing
 * endpoints that still personalize when the user happens to be logged in.
 */
@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(_err: unknown, user: TUser): TUser {
    return user;
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
