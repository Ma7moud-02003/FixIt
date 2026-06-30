export interface PaginatedResponse<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  succeeded: boolean;
  messages: string[];
  meta: unknown;
  data: T[];
}
 