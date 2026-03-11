// Generic API wrapper used by backend `Result<T>`
export interface ApiResult<T> {
  isSuccess: boolean;
  data?: T | null;
  errorMessage?: string | null;
  successMessage?: string | null;
  errors?: string[];
  total?: number | null;
  page?: number | null;
  limit?: number | null;
  totalPages?: number | null;
}