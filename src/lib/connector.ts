/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { NextRequest } from 'next/server';

// Environment variables with proper fallbacks
const API_HOST = process.env.NEXT_PUBLIC_API_URL;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Default URLs for different environments
const DEFAULT_INTERNAL_URL = 'http://localhost:3000';
// NODE_ENV === 'development'
//   ? 'http://localhost:3000'
//   : 'https://localhost:3000';

const DEFAULT_EXTERNAL_URL = 'http://localhost:8081';
// NODE_ENV === 'development'
//   ? 'http://localhost:8081'
//   : 'https://localhost:8081';

// Internal API route (Next.js API routes)
export const invokeInternalAPIRoute = (route: string): string => {
  const baseUrl = NEXTAUTH_URL || DEFAULT_INTERNAL_URL;
  return `${baseUrl}/api/${route}`;
};

// External API route (Backend API)
export const invokeExternalAPIRoute = (route: string): string => {
  if (!API_HOST) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
  }
  return `${API_HOST}/api/v1/${route}`;
};

// Backend host for external API
export const getAPIBackendHost = (): string => {
  return API_HOST || DEFAULT_EXTERNAL_URL;
};

// Get host header for X-Lepa-Host-Header (client-side only)
export const getHostHeader = (): string => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Fallback for server-side rendering
  return NEXTAUTH_URL || DEFAULT_INTERNAL_URL;
};

// Extract JSON from NextRequest
export const getRequestBodyJSON = async (
  request: NextRequest
): Promise<Record<string, any>> => {
  const clonedRequest = request.clone();
  return await clonedRequest.json();
};

// Utility: Trim all string values in a nested object
const trimStringValues = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) return obj;

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    if (typeof value === 'string') {
      obj[key] = value.trim();
    } else if (typeof value === 'object') {
      obj[key] = trimStringValues(value);
    }
  }

  return obj;
};

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Axios instance setup with production-ready configuration
const axiosInstance = axios.create({
  baseURL: API_HOST ? `${API_HOST}/api/v1` : undefined,
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor for logging and error handling
axiosInstance.interceptors.request.use(
  (config) => {
    if (NODE_ENV === 'development') {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  (response) => {
    if (NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    if (NODE_ENV === 'development') {
      console.error(
        `❌ API Error: ${error.response?.status} ${error.config?.url}`,
        error.response?.data
      );
    }
    return Promise.reject(error);
  }
);

// Base request handler with improved error handling
const sendRequest = async <T = any>(
  method: RequestMethod,
  url: string,
  body: Record<string, any> | null = null,
  config: AxiosRequestConfig = {}
): Promise<T | null> => {
  try {
    if (body) {
      trimStringValues(body);
    }

    const requestConfig: AxiosRequestConfig = {
      method,
      url: url.trim(),
      data: body ?? undefined,
      ...config,
    };

    const response: AxiosResponse<T> = await axiosInstance.request<T>(
      requestConfig
    );

    // Handle successful responses
    if ([200, 201, 202, 204].includes(response.status)) {
      return response.data;
    } else {
      console.error(
        `Unexpected status code: ${response.status} for ${method} ${url}`
      );
      return null;
    }
  } catch (error: any) {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message || error.message;
      // Log error details in development
      if (NODE_ENV === 'development') {
        console.error(`API Error [${statusCode}]: ${message}`, {
          url: error.config?.url,
          method: error.config?.method,
          data: error.response?.data,
        });
      }

      // Return structured error response
      return {
        error: true,
        status: statusCode,
        message: message || 'An error occurred while processing the request',
      } as any;
    }

    // Handle network or unexpected errors
    console.error('Unexpected error in sendRequest:', error);
    return {
      error: true,
      status: 500,
      message: 'An unexpected error occurred. Please try again later.',
    } as any;
  }
};

// API Helpers with improved error handling
export const getModel = async <T = any>(
  path: string,
  config: AxiosRequestConfig = {}
): Promise<T | null> => await sendRequest<T>('GET', path, null, config);

export const postModel = async <T = any>(
  path: string,
  body: Record<string, any> | null = null,
  config: AxiosRequestConfig = {}
): Promise<T | null> => await sendRequest<T>('POST', path, body, config);

export const patchModel = async <T = any>(
  path: string,
  body: Record<string, any> | null = null,
  config: AxiosRequestConfig = {}
): Promise<T | null> => await sendRequest<T>('PATCH', path, body, config);

export const deleteModel = async <T = any>(
  path: string,
  config: AxiosRequestConfig = {}
): Promise<T | null> => await sendRequest<T>('DELETE', path, null, config);

// Utility function to check if response is an error
export const isErrorResponse = (
  response: any
): response is { error: true; status: number; message: string } => {
  return response && typeof response === 'object' && response.error === true;
};

// Utility function to get error message from response
export const getErrorMessage = (response: any): string => {
  if (isErrorResponse(response)) {
    return response.message;
  }
  if (typeof response === 'string') {
    return response;
  }
  return 'An unexpected error occurred';
};

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
