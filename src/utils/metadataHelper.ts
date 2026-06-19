import { ApiResponse, Pagination } from "../models/envelope/api-response.type";
import { AppMessages } from "./AppMessages";


export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    meta: {
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      message: AppMessages.GENERICS.SUCCESS,
      errorType: null,
    },
    data
  };
}

export function successPaginatedResponse<T>(
  data: T,
  pagination: Pagination,
  message: string
): ApiResponse<T> {
  return {
    meta: {
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      message,
      errorType: null,
    },
    data,
    pagination,
  };
}

export function errorResponse<T = null>(
  message: string,
  errorType: string | null = null
): ApiResponse<T> {
  return {
    meta: {
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      message,
      errorType,
    },
    data: null,
    pagination: null,
  };
}