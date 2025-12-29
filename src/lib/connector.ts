/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { getTenantDomain } from '@/utils/hostHeader';

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

// Check if we're running on the client side
const isClientSide = (): boolean => {
  return typeof window !== 'undefined';
};

// Base request handler with improved error handling
// Automatically routes client-side requests through Next.js proxy to avoid CORS
const sendRequest = async <T = any>(
  method: RequestMethod,
  url: string,
  body: Record<string, any> | FormData | null = null,
  config: AxiosRequestConfig = {}
): Promise<T | null> => {
  try {
    // Create a copy of body before trimming to avoid mutating the original
    // Skip processing if body is FormData
    let processedBody = body;
    if (body && !(body instanceof FormData)) {
      processedBody = JSON.parse(JSON.stringify(body)); // Deep clone
      trimStringValues(processedBody);
    }

    // If client-side, route through Next.js proxy to avoid CORS
    if (isClientSide()) {
      return await sendRequestViaProxy<T>(method, url, processedBody, config);
    }

    // Server-side: use direct external API call
    // Automatically get session and host header
    const session = await auth().catch(() => null);

    // Dynamically import headers() only on server-side to avoid client-side import errors
    let hostHeader = '';
    try {
      const { headers: getHeaders } = await import('next/headers');
      const headerList = await getHeaders().catch(() => null);
      const host =
        headerList?.get('host') || headerList?.get('x-forwarded-host') || '';
      hostHeader = getTenantDomain(host);
    } catch {
      // If headers() is not available (e.g., in API routes or client context), use env fallback
      hostHeader = process.env.NEXT_PUBLIC_LEPA_HOST_HEADER || '';
    }

    // Ensure we always have a host header - use env as final fallback
    if (!hostHeader) {
      hostHeader = process.env.NEXT_PUBLIC_LEPA_HOST_HEADER || '';
    }

    // Get X-Lepa-Host-Header - prioritize config, then auto-extracted, then env
    const lepaHostHeader =
      config.headers?.['X-Lepa-Host-Header'] ||
      hostHeader ||
      process.env.NEXT_PUBLIC_LEPA_HOST_HEADER ||
      '';

    // Merge headers: defaults + auto headers + config headers (config takes precedence)
    // IMPORTANT: Always include X-Lepa-Host-Header - it's required for all requests
    const mergedHeaders: Record<string, string> = {
      // Convert axios default headers to strings
      ...Object.fromEntries(
        Object.entries(axiosInstance.defaults.headers.common || {}).map(
          ([k, v]) => [k, String(v ?? '')]
        )
      ),
      // Always add X-Lepa-Host-Header (REQUIRED - backend will reject without it)
      'X-Lepa-Host-Header': lepaHostHeader,
      // Only add Authorization if session exists and not already provided in config
      ...(session?.user?.accessToken && !config.headers?.['Authorization']
        ? { Authorization: `Bearer ${session.user.accessToken}` }
        : {}),
      // Config headers override everything (except X-Lepa-Host-Header which we ensure above)
      ...Object.fromEntries(
        Object.entries(config.headers || {}).map(([k, v]) => [
          k,
          String(v ?? ''),
        ])
      ),
    };

    console.log(session?.user?.accessToken);

    const requestConfig: AxiosRequestConfig = {
      ...config,
      method,
      url: url.trim(),
      data: processedBody ?? undefined,
      headers: mergedHeaders,
    };

    // Ensure Content-Type is set for POST/PUT/PATCH requests with body
    // Don't set Content-Type for FormData - axios will set it with boundary
    if (
      ['POST', 'PUT', 'PATCH'].includes(method) &&
      processedBody &&
      requestConfig.headers
    ) {
      if (
        !(processedBody instanceof FormData) &&
        !requestConfig.headers['Content-Type']
      ) {
        requestConfig.headers['Content-Type'] = 'application/json';
      }
    }

    const response: AxiosResponse<T> = await axiosInstance.request<T>(
      requestConfig
    );

    // Handle successful responses
    if ([200, 201, 202, 204].includes(response.status)) {
      // For 204 No Content, return success indicator
      if (response.status === 204) {
        return { status: 204, success: true } as any;
      }
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
      // Log error details in development (404s are warnings since endpoints may not exist yet)
      if (NODE_ENV === 'development') {
        if (statusCode === 404) {
          console.warn(`API Endpoint not found [404]: ${error.config?.url} - This is expected if the endpoint hasn't been implemented yet.`);
        } else {
          console.error(`API Error [${statusCode}]: ${message}`, {
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data,
          });
        }
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

// Client-side request handler that routes through Next.js proxy
const sendRequestViaProxy = async <T = any>(
  method: RequestMethod,
  url: string,
  body: Record<string, any> | FormData | null = null,
  config: AxiosRequestConfig = {}
): Promise<T | null> => {
  try {
    // Parse URL to separate path and query params
    // Handle both absolute URLs and relative paths
    let path: string;
    const searchParams = new URLSearchParams();

    if (url.includes('?')) {
      // URL has query params
      const [pathPart, queryPart] = url.split('?');
      path = pathPart.startsWith('/') ? pathPart.slice(1) : pathPart;
      const urlParams = new URLSearchParams(queryPart);
      urlParams.forEach((value, key) => {
        searchParams.append(key, value);
      });
    } else {
      // No query params in URL
      path = url.startsWith('/') ? url.slice(1) : url;
    }

    // Add query params from config (config params take precedence)
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }

    // Build proxy URL
    const proxyUrl = invokeInternalAPIRoute(`proxy/${path}`);
    const finalUrl = searchParams.toString()
      ? `${proxyUrl}?${searchParams.toString()}`
      : proxyUrl;

    // Determine if body is FormData
    const isFormData = body instanceof FormData;

    // Prepare headers - don't set Content-Type for FormData (browser will set it with boundary)
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    // Merge any additional headers from config
    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        // Don't override Content-Type for FormData
        if (!(isFormData && key.toLowerCase() === 'content-type')) {
          headers[key] = String(value);
        }
      });
    }

    // Make request to proxy
    const response = await fetch(finalUrl, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      credentials: 'include', // Include cookies for session
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return { status: 204, success: true } as any;
    }

    // Handle successful responses
    if (response.status >= 200 && response.status < 300) {
      const contentType = response.headers.get('content-type') || '';
      const contentLength = response.headers.get('content-length');
      
      // If content-length is 0, return null immediately
      if (contentLength === '0') {
        return null;
      }
      
      // Check if response has content before parsing
      // Handle both explicit JSON content-type and cases where it might be missing
      if (contentType.includes('application/json') || !contentType) {
        try {
          // Read response as text first to check if it's empty
          const text = await response.text();
          
          // If body is empty or whitespace, return null
          if (!text || text.trim() === '') {
            return null;
          }
          
          // Parse JSON
          const data = JSON.parse(text);
          return data;
        } catch (parseError: any) {
          // If JSON parsing fails, return null instead of throwing
          // This prevents ClientFetchError from breaking the app
          // Only log in development to avoid noise
          if (NODE_ENV === 'development') {
            console.warn('Failed to parse JSON response:', parseError?.message || 'Invalid JSON', {
              url: finalUrl,
              contentType,
              contentLength,
            });
          }
          return null;
        }
      }
      // For non-JSON responses, return null
      return null;
    }

    // Handle error responses
    let errorData = { message: 'Request failed' };
    try {
      const text = await response.text();
      if (text && text.trim() !== '') {
        errorData = JSON.parse(text);
      }
    } catch {
      // If parsing fails, use default error message
    }

    return {
      error: true,
      status: response.status,
      message:
        errorData.message || 'An error occurred while processing the request',
    } as any;
  } catch (error: any) {
    // Handle network errors
    console.error('Proxy request error:', error);
    return {
      error: true,
      status: undefined,
      message: error.message || 'Network error occurred',
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

// Post FormData helper - specifically for multipart/form-data requests
export const postFormData = async <T = any>(
  path: string,
  formData: FormData,
  config: AxiosRequestConfig = {}
): Promise<T | null> => await sendRequest<T>('POST', path, formData, config);

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
