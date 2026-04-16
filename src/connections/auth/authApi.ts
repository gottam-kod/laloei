// src/connections/auth/authApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { instanceAxios } from '@/src/connections/http';
import { ApiError, LoginRequest, LoginResponse } from '@/src/interface/auth/login.interface';
import { UserProfileResponse } from '@/src/interface/auth/me.interface';
import { CONSTANTS } from '@/src/config/constants';

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
    await AsyncStorage.setItem(CONSTANTS.STORAGE_KEY_TOKEN, res.data.access_token);
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

// เพิ่มฟังก์ชันอื่นๆ เช่น register, forgotPassword ตามต้องการ
// POST /auth/register
// POST /auth/forgot-password
// เป็นต้น

//   {
//   "email": "jane@acme.com",
//   "phone": "+66959839411",
//   "password": "P@ssw0rd123",
//   "first_name": "Jane",
//   "last_name": "Doe",
//   "name": "Jane Doe",
//   "locale": "th-TH",
//   "timezone": "Asia/Bangkok",
//   "device_info": {
//     "os": "iOS",
//     "appVersion": "1.2.3",
//     "deviceId": "abc123"
//   }
// }
export async function register(
  payload: {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
    tosAgreed: boolean;
    marketingOptIn: boolean;
  },
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<void> {
  try {
    await instanceAxios.post(
      '/auth/register',
      payload,
      {
        signal,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
  } catch (err: any) {
    if (!err) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      const message =
        (data as any)?.message ||
        (data as any)?.error ||
        (status === 401 ? 'Invalid credentials' : err.message || 'Request failed');
      throw new ApiError(message, status, data);
    }
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('Network error', 0);
  }
}
// POST /auth/forgot-password
export async function forgotPassword(
  email: string,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<void> {
  try {
    await instanceAxios.post(
      '/auth/forgot-password',
      { email },
      {
        signal,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
  } catch (err: any) {
    if (!err) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      const message =
        (data as any)?.message ||
        (data as any)?.error ||
        (status === 401 ? 'Invalid credentials' : err.message || 'Request failed');
      throw new ApiError(message, status, data);
    }
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('Network error', 0);
  }
}