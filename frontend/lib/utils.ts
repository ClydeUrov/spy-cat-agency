import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API Error handling utilities
export interface ApiError {
  message: string
  status?: number
  details?: string
}

export function handleApiError(error: any): ApiError {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const detail = error.response.data?.detail || error.response.data?.message

    switch (status) {
      case 400:
        return {
          message: detail || "Invalid request. Please check your input.",
          status,
          details: detail,
        }
      case 404:
        return {
          message: "Resource not found.",
          status,
          details: detail,
        }
      case 422:
        return {
          message: "Validation error. Please check your input.",
          status,
          details: detail,
        }
      case 500:
        return {
          message: "Server error. Please try again later.",
          status,
          details: detail,
        }
      default:
        return {
          message: detail || "An unexpected error occurred.",
          status,
          details: detail,
        }
    }
  } else if (error.request) {
    // Network error
    return {
      message: "Network error. Please check your connection and try again.",
      details: "Unable to connect to the server",
    }
  } else {
    // Other error
    return {
      message: error.message || "An unexpected error occurred.",
      details: error.toString(),
    }
  }
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}
