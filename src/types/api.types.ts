export interface Pagination {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}
export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  errorMessage?: string | null;
  successMessage?: string | null;
  errors?: any[];
  pagination?: Pagination;
}
