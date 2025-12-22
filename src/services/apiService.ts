/**
 * Production-grade API service using axios-auth-refresh library
 * Handles authentication, token refresh, and error handling
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosRequestConfig } from "axios";
// @ts-ignore - axios-auth-refresh doesn't have perfect TypeScript support
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useSnackbar } from "../contexts/SnackbarContext";
import type { AlertColor } from "@mui/material";
import { isTokenExpiringSoon } from "../utils/tokenUtils";

const FRIENDLY_MESSAGES: Record<number | string, string> = {
  400: "There seems to be an issue with your request. Please check and try again.",
  401: "You're not authorized. Please log in again.",
  403: "You don't have permission to perform this action.",
  404: "We couldn't find what you're looking for.",
  408: "The request took too long. Please try again.",
  500: "Something went wrong on our end. Please try again later.",
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  UNKNOWN: "An unexpected error occurred. Please try again.",
};

// Use proxy in development, direct URL in production
const getBaseURL = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return import.meta.env.DEV ? '' : 'https://localhost:7141';
};

const BASE_URL = getBaseURL();

// Create separate axios instance for refresh to avoid interceptors
const refreshAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/register/participant',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
  '/api/auth/resend-verification',
  '/api/auth/google-login',
  '/api/auth/google-response',
] as const;

// Main API instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Check if endpoint is public (doesn't require auth)
 */
const isPublicEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some(endpoint => url.startsWith(endpoint));
};

/**
 * Function that will be called to refresh the token
 * This is called automatically by axios-auth-refresh on 401 errors
 */
const refreshAuthLogic = async (failedRequest: AxiosError): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");
  
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    // Use separate axios instance to avoid interceptors
    const response = await refreshAxios.post<{ token: string; refreshToken?: string }>(
      '/api/auth/refresh',
      { refreshToken }
    );

    const { token, refreshToken: newRefreshToken } = response.data;
    
    if (!token) {
      throw new Error("No token in refresh response");
    }

    // Update tokens
    localStorage.setItem("authToken", token);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    // Update the failed request's authorization header
    if (failedRequest.config?.headers) {
      failedRequest.config.headers.Authorization = `Bearer ${token}`;
    }

    return token;
  } catch (error) {
    // Refresh failed - clear tokens and redirect to login
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    
    // Only redirect if not already on auth pages
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath.includes('/login') || 
                      currentPath.includes('/register') || 
                      currentPath.includes('/participant');
    
    if (!isAuthPage) {
      window.location.href = "/login";
    }
    
    throw error;
  }
};

// Set up automatic token refresh using axios-auth-refresh
createAuthRefreshInterceptor(api, refreshAuthLogic, {
  statusCodes: [401], // Only refresh on 401
  skipWhileRefreshing: true, // Queue requests while refreshing
  retryInstance: api, // Use same instance for retry
  onRetry: (requestConfig: AxiosRequestConfig) => {
    // Add token to retry request
    const token = localStorage.getItem("authToken");
    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
});

// Simple proactive refresh function (separate from library's reactive refresh)
let lastProactiveRefresh = 0;
const PROACTIVE_REFRESH_INTERVAL = 60000; // Don't refresh more than once per minute

const proactiveRefresh = async (): Promise<string | null> => {
  const now = Date.now();
  if (now - lastProactiveRefresh < PROACTIVE_REFRESH_INTERVAL) {
    return localStorage.getItem("authToken");
  }

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    // Use raw axios to avoid interceptors
    const response = await axios.post<{ token: string; refreshToken?: string }>(
      `${BASE_URL}/api/auth/refresh`,
      { refreshToken }
    );

    const { token, refreshToken: newRefreshToken } = response.data;
    if (token) {
      localStorage.setItem("authToken", token);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }
      lastProactiveRefresh = now;
      return token;
    }
  } catch (error) {
    // Silent fail - let reactive refresh handle it
  }
  
  return null;
};

// Request interceptor: Add auth token and proactively refresh if needed
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip auth for public endpoints
    if (isPublicEndpoint(config.url)) {
      return config;
    }

    // Add auth token
    let token = localStorage.getItem("authToken");
    
    // Proactively refresh if token is expiring soon (within 5 minutes)
    if (token && isTokenExpiringSoon(token, 300)) {
      const newToken = await proactiveRefresh();
      if (newToken) {
        token = newToken;
      }
    }
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Handle API errors and show user-friendly messages
 */
const handleError = (error: unknown, showSnackbar: (message: string, severity?: AlertColor) => void): void => {
  if (!axios.isAxiosError(error)) {
    showSnackbar(FRIENDLY_MESSAGES["UNKNOWN"], "error");
    return;
  }

  const axiosError = error as AxiosError;
  let message = "";

  if (axiosError.response) {
    const status = axiosError.response.status;
    const data = axiosError.response.data as { detail?: string; message?: string; title?: string; errors?: string[] };
    
    const backendMessage = data?.detail || data?.message || data?.title || data?.errors?.[0];
    
    if (isPublicEndpoint(axiosError.config?.url) && backendMessage) {
      message = backendMessage;
    } else {
      message = FRIENDLY_MESSAGES[status] || `Error ${status}: Please try again.`;
      if (backendMessage && status !== 401) {
        message += ` ${backendMessage}`;
      }
    }
  } else if (axiosError.request) {
    message = FRIENDLY_MESSAGES["NETWORK_ERROR"];
  } else {
    message = FRIENDLY_MESSAGES["UNKNOWN"];
  }

  showSnackbar(message, "error");
};

/**
 * API Service Hook
 * Provides typed methods for API calls with automatic error handling
 */
export const useApiService = () => {
  const { showSnackbar } = useSnackbar();

  const get = async <T>(url: string, params?: Record<string, unknown>, options?: { silent?: boolean }): Promise<T> => {
    try {
      // Remove undefined/null values from params
      const cleanParams = params ? Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
      ) : undefined;
      
      const { data } = await api.get<T>(url, { params: cleanParams });
      return data;
    } catch (error) {
      if (!options?.silent) {
        handleError(error, showSnackbar);
      }
      throw error;
    }
  };

  const post = async <T>(url: string, body?: unknown, options?: { silent?: boolean }): Promise<T> => {
    try {
      const { data } = await api.post<T>(url, body);
      return data;
    } catch (error) {
      if (!options?.silent) {
        handleError(error, showSnackbar);
      }
      throw error;
    }
  };

  const put = async <T>(url: string, body?: unknown, options?: { silent?: boolean }): Promise<T> => {
    try {
      const { data } = await api.put<T>(url, body);
      return data;
    } catch (error) {
      if (!options?.silent) {
        handleError(error, showSnackbar);
      }
      throw error;
    }
  };

  const del = async <T>(url: string, body?: unknown, options?: { silent?: boolean }): Promise<T> => {
    try {
      const { data } = await api.delete<T>(url, { data: body });
      return data;
    } catch (error) {
      if (!options?.silent) {
        handleError(error, showSnackbar);
      }
      throw error;
    }
  };

  return { get, post, put, del };
};
