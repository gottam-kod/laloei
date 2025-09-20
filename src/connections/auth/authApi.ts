import axios from 'axios';
import { instanceAxios } from '../axios';
import { ApiError, LoginRequest, LoginResponse } from '../../interface/auth/login.interface';
import { MeResponse } from '../../interface/auth/me.interface';

const API_URL = 'http://localhost:3030/api/v1';

// POST /auth/login
export async function loginWithEmail(
  payload: LoginRequest,                       // { email: string; password: string }
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<LoginResponse> {
  try {
    const res = await instanceAxios.post<LoginResponse>(
      '/auth/login',                           // ใช้ path; baseURL ใส่ผ่าน config ด้านล่าง
      payload,                                 // <-- data (ไม่ใช่ body)
      {
        baseURL: API_URL,
        signal,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
    console.log('res.data', res.data);
    return res.data;                           // axios parse ให้แล้ว
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      const message =
        (data as any)?.message ||
        (data as any)?.error ||
        (status === 401 ? 'Invalid credentials' : err.message || 'Request failed');
      throw new ApiError(message, status, data);
    }
    if (err?.name === 'AbortError') throw err; // ถูกยกเลิก
    throw new ApiError('Network error', 0);
  }
}
// GET /auth/me
export async function getMe(
  token: string,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<MeResponse> {
  try {
    const res = await instanceAxios.get<MeResponse>('/auth/me', {
      baseURL: API_URL,
      signal,
      timeout: timeoutMs,
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('getMe res.data', res.data);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      const message = (data as any)?.message || err.message || 'Request failed';
      throw new ApiError(message, status, data);
    }
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('Network error', 0);
  }
}

export async function logout(
  token: string,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<void> {
  try {
    await instanceAxios.post(
      '/auth/logout',
      {},
      {
        baseURL: API_URL,
        signal,
        timeout: timeoutMs,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      const message = (data as any)?.message || err.message || 'Request failed';
      throw new ApiError(message, status, data);
    }
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('Network error', 0);
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
        baseURL: API_URL,
        signal,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
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
        baseURL: API_URL,
        signal,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
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
// POST /auth/reset-password
export async function resetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<void> {
  try {
    await instanceAxios.post(
      '/auth/reset-password',
      { token, new_password: newPassword, confirm_password: confirmPassword },
      {
        baseURL: API_URL,
        signal,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
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

