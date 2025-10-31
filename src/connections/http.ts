// src/connections/http.ts
import axios, { AxiosRequestConfig } from 'axios';

declare global {
  var __AUTH_TOKEN__: string | undefined;
}

export const instanceAxios = axios.create({
  baseURL: 'http://localhost:3003/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ========== Token Provider ==========
let getToken: (() => Promise<string | null>) | null = null;
export function registerTokenProvider(fn: () => Promise<string | null>) {
  getToken = fn;
}

instanceAxios.interceptors.request.use(async (config) => {
  const token =
    (await (getToken?.() ?? Promise.resolve(null))) ??
    globalThis.__AUTH_TOKEN__ ??
    null;

  if (token) {
    config.headers = {
      ...(config.headers ?? {}),
      Authorization: `Bearer ${token}`,
    } as any;
  }
  return config;
});

// ========== Unauthorized Handler ==========
type UnauthorizedHandler = (reason?: string) => Promise<void> | void;
let onUnauthorized: UnauthorizedHandler | null = null;
export function registerUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorized = handler;
}

// เพื่อป้องกันยิงซ้ำใน interceptor
declare module 'axios' {
  export interface AxiosRequestConfig {
    _handled401?: boolean;
  }
}

instanceAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const original: AxiosRequestConfig = error?.config ?? {};
    if (status === 401 && !original._handled401) {
      original._handled401 = true;
      try {
        await onUnauthorized?.('unauthorized');
      } catch {}
    }
    return Promise.reject(error);
  }
);
