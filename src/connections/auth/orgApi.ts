import axios from 'axios';
import { instanceAxios } from '../axios';
import { ApiError, LoginRequest, LoginResponse } from '../../interface/auth/login.interface';
import { MeResponse } from '../../interface/auth/me.interface';

const API_URL = 'http://localhost:3030/api/v1';

// POST /orgs
export async function createOrganization(
  payload: {
    name: string;
    slug: string;
    domain?: string;
    billing_email: string;
    billing_name?: string;
    tax_id?: string;
    phone?: string;
    timezone: string;
    locale: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    members?: { email: string; role: 'owner' | 'admin' | 'member' }[];
    plan_code?: string;
    start_trial?: boolean;
    owner_user_id: string;
  },
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<{ organization: any }> {
  try {
    const res = await instanceAxios.post<{ organization: any }>(
      '/orgs',
      payload,
      {
        baseURL: API_URL,
        signal,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
    console.log('createOrganization res.data', res.data);
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

// GET /orgs/my
export async function listMyOrganizations(
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<{ organizations: any[] }> {
  try {
    const res = await instanceAxios.get<{ organizations: any[] }>('/orgs/my', {
      baseURL: API_URL,
      signal,
      timeout: timeoutMs,
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
    });
    console.log('listMyOrganizations res.data', res.data);
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

// POST /orgs/:orgId/leave
export async function leaveOrganization(
  orgId: string,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<void> {
  try {
    await instanceAxios.post(
      `/orgs/${orgId}/leave`,
      {},
      {
        baseURL: API_URL,
        signal,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
    console.log('leaveOrganization success');
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

// GET /orgs/:orgId
export async function getOrganization(
  orgId: string,
  { signal, timeoutMs = 10000 }: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<{ organization: any }> {
    try {
    const res = await instanceAxios.get<{ organization: any }>(`/orgs/${orgId}`, {
      baseURL: API_URL,
      signal,
      timeout: timeoutMs,
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
    });
    console.log('getOrganization res.data', res.data);
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
