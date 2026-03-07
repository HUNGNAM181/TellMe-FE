export interface Pagination {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}
export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  errorMessage: string | null;
  successMessage: string | null;
  errors: any[];
  total: number | null;
  page: number | null;
  limit: number | null;
  totalPages: number | null;
}
