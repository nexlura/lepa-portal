/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { NextRequest } from 'next/server';

const API_HOST = process.env.NEXT_PUBLIC_API_URL;

// Local API route
export const invokeInternalAPIRoute = (route: string): string =>
  `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/${route}`;

// Local API route
export const invokeExternalAPIRoute = (route: string): string =>
  `${API_HOST}/api/v1/${route}`;

// Backend host for external API
export const getAPIBackendHost = (): string => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

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

// Axios instance setup
const axiosInstance = axios.create({
  baseURL: `${API_HOST}/api/v1` || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api`,
  withCredentials: true,
});

// Base request handler
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

    if ([200, 201].includes(response.status)) {
      return response.data;
    } else {
      console.error(`Unexpected status code: ${response.status}`);
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    console.error('Request failed:', error);
    return 'An unexpected error occurred. Please try again later.' as any;
  }

  return null;
};

// API Helpers
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
