import { useAuthStore } from '@/src/store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiError, LoginRequest, LoginResponse } from '../../interface/auth/login.interface';
import { UserProfileResponse } from '../../interface/auth/me.interface';
import { navigationRef } from '../../navigation/navigationRef';
import { instanceAxios } from '../axios';
import { CreateLeaveRequestPayload, LeaveRequest } from '@/src/interface/leave-request';

// LeaveRequest 
// POST /leave-requests
export async function createLeaveRequest(
  payload: CreateLeaveRequestPayload, // ตัวอย่าง payload
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<{ id: string; status: string }> {
  try {
    const res = await instanceAxios.post<{ id: string; status: string }>(
      '/leave-requests', // ใช้ path; baseURL ใส่ผ่าน config ด้านล่าง
      payload, // <-- data (ไม่ใช่ body)
      {
        signal,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
    return res.data; // axios parse ให้แล้ว
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

// GET /leave-requests
export async function fetchLeaveRequests(
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<LeaveRequest[]> {
  try {
    const res = await instanceAxios.get<LeaveRequest[]>(
      '/leave-requests',
      {
        signal,
        timeout: timeoutMs,
      }
    );
    console.log('fetchLeaveRequests success', res.data);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      console.log('fetchLeaveRequests error', { status, data });
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

// PUT /leave-requests/:id/approve
export async function approveLeaveRequest(
  id: string,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<{ id: string; status: string }> {
  try {
    const res = await instanceAxios.put<{ id: string; status: string }>(
      `/leave-requests/${id}/approve`,
      {},
      {
        signal,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
    return res.data;
  } catch (err: any) {
    console.log('approveLeaveRequest error', err);
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

// PUT /leave-requests/:id/reject
export async function rejectLeaveRequest(
  id: string,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<{ id: string; status: string }> {
  try {
    const res = await instanceAxios.put<{ id: string; status: string }>(
      `/leave-requests/${id}/reject`,
      {},
      {
        signal,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
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

// DELETE /leave-requests/:id
export async function cancelLeaveRequest(
  id: string,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<void> {
  try {
    await instanceAxios.delete(`/leave-requests/${id}`, {
      signal,
      timeout: timeoutMs,
    });
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

