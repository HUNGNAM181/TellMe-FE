export interface ApiErrorResponse {
  isSuccess?: boolean;
  errorMessage?: string | null;
  errors?: string[];
  message?: string;
  status?: number;
}

export function handleApiError(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data) {
      if (data.errorMessage) {
        return data.errorMessage;
      }

      if (data.errors && data.errors.length > 0) {
        return data.errors.join(", ");
      }

      if (data.message) {
        return data.message;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Something went wrong. Please try again.";
}

function isAxiosError(error: unknown): error is {
  response?: {
    data?: unknown;
    status?: number;
  };
} {
  return typeof error === "object" && error !== null && "response" in error;
}
