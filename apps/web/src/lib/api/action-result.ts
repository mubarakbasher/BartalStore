import { ApiClientError } from './client';

export interface ActionError {
  code: string;
  status: number;
  message_en: string;
  message_ar: string;
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError };

export function actionFail(err: unknown): { ok: false; error: ActionError } {
  if (err instanceof ApiClientError) {
    return {
      ok: false,
      error: {
        code: err.code,
        status: err.status,
        message_en: err.message_en,
        message_ar: err.message_ar,
      },
    };
  }
  return {
    ok: false,
    error: {
      code: 'UNKNOWN',
      status: 500,
      message_en: 'Something went wrong. Please try again.',
      message_ar: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    },
  };
}

/** Thrown by server-read helpers when there is no access token in cookies. */
export class NotAuthenticatedError extends Error {
  constructor() {
    super('Not authenticated');
    this.name = 'NotAuthenticatedError';
  }
}
