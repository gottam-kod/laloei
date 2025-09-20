import axios from 'axios';
import { instanceAxios } from '../axios';
import { ApiError, LoginRequest, LoginResponse } from '../../interface/auth/login.interface';
import { MeResponse } from '../../interface/auth/me.interface';

const API_URL = 'http://localhost:3030';

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
