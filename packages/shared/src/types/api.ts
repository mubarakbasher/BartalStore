/**
 * Standard API response envelope per PRD §10.2.
 * Backend wraps every successful response in `ApiSuccess`, every error in `ApiError`.
 */

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message_en: string;
    message_ar: string;
    status: number;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> extends ApiSuccess<T[]> {
  meta: PaginationMeta;
}

export type SortDirection = 'asc' | 'desc';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  direction?: SortDirection;
}
