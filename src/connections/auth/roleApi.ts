import axios from 'axios';
import { instanceAxios } from '../axios';

import { ApiError } from '../../interface/auth/login.interface';
import { Role } from '@/src/auth/roles';

// GET /roles
export async function fetchRoles(
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<{ id: string; code: Role; name: string }[]> {
  try {
    const res = await instanceAxios.get('/role', {
      signal,
      timeout: timeoutMs,
    });

    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      console.log('fetchRoles error', { status, data });
      const message =
        (data as any)?.message ||
        (data as any)?.error ||
        (status === 401 ? 'Unauthorized' : err.message || 'Request failed');
      throw new ApiError(message, status, data);
    }
    if (err?.name === 'AbortError') throw err; // ถูกยกเลิก
    throw new ApiError('Network error', 0);
  }
}