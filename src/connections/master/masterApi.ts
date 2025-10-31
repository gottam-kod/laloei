import axios from 'axios';
import { ApiError, LoginRequest, LoginResponse } from '../../interface/auth/login.interface';
import { instanceAxios } from '@/src/connections/http';
import { LeaveType } from '@/src/interface/leave-type';

// Get /api/v1/leave-types
export async function fetchLeaveTypes(
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<LeaveType[]> {
  try {
    const res = await instanceAxios.get('/leave-types', {
      signal,
      timeout: timeoutMs,
    });
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
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