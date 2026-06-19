export interface ApiResponse<T> {
  meta: Meta;
  data: T | null;
  pagination?: Pagination | null;
}

export interface Meta {
  transactionId: string;
  timestamp: string;
  message: string;
  errorType?: string | null;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}