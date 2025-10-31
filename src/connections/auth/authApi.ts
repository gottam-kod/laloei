// src/connections/auth/authApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { instanceAxios } from '@/src/connections/http';
import { ApiError, LoginRequest, LoginResponse } from '@/src/interface/auth/login.interface';
import { UserProfileResponse } from '@/src/interface/auth/me.interface';

declare global {
  var __AUTH_TOKEN__: string | undefined;
}

export async function loginWithEmail(
  payload: LoginRequest,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<LoginResponse> {
  try {
    const res = await instanceAxios.post<LoginResponse>('/auth/login', payload, {
      signal, timeout: timeoutMs, headers: { accept: '*/*' },
    });
    globalThis.__AUTH_TOKEN__ = res.data.access_token;
    await AsyncStorage.setItem('auth_token', res.data.access_token);
    return res.data;
  } catch (err: any) {
    if (err?.response) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      const message =
        data?.message ||
        data?.error ||
        (status === 401 ? 'Invalid credentials' : err.message || 'Request failed');
      throw new ApiError(message, status, data);
    }
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('Network error', 0);
  }
}

export async function getMe(
  token: string,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<UserProfileResponse> {
  try {
    const res = await instanceAxios.get<UserProfileResponse>('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
      signal, timeout: timeoutMs,
    });
    return res.data;
  } catch (err: any) {
    if (err?.response) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      const message = data?.message || err.message || 'Request failed';
      throw new ApiError(message, status, data);
    }
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('Network error', 0);
  }
}

export async function logout(
  token?: string,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<void> {
  try {
    if (token) {
      await instanceAxios.post('/auth/logout', {}, {
        signal, timeout: timeoutMs, headers: { Authorization: `Bearer ${token}` },
      });
    }
  } finally {
    globalThis.__AUTH_TOKEN__ = undefined;
    try { await AsyncStorage.removeItem('auth_token'); } catch {}
  }
}
