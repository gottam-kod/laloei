import axios from 'axios';
import { instanceAxios } from '../axios';
import { ApiError, LoginRequest, LoginResponse } from '../../interface/auth/login.interface';
import { OrganizationModel } from '@/src/interface/organization';
import { Role } from '@/src/auth/roles';

// export class InviteMemberDto {
//   @ApiProperty({ format: 'uuid', example: '7c531fa1-c5c0-496a-9129-72958f2a9c2d', description: 'org_id จากตาราง organizations' })
//   @IsUUID()
//   org_id!: string;

//   @ApiProperty({ example: ['bb_org@gmail.com'] })
//   @IsEmail({}, { each: true })
//   email!: string[];

//   @ApiProperty({ format: 'uuid', example: 'f4b7db8c-a55d-452b-84da-3dffdfbeeb9b', description: 'role_id จากตาราง roles' })
//   @IsUUID()
//   role_id!: string;

//   @ApiPropertyOptional({ maxLength: 500, example: 'เชิญเข้าร่วมทีม HR ครับ' })
//   @IsOptional()
//   @IsString()
//   @Length(0, 500)
//   message?: string;
// }

interface InviteMembersParams {
  email: string[];
  org_id: string;
  role_id: string;
  message: string;
  expireDays: number;
}

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
    console.log('createOrganization payload', payload);
    const res = await instanceAxios.post<{ organization: any }>(
      '/organizations',
      payload,
      {
        signal,
        timeout: timeoutMs,
      }
    );
    // console.log('createOrganization res.data', res.data);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      console.log('createOrganization error', { status, data });
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
): Promise<OrganizationModel[]> {
  try {
    const res = await instanceAxios.get<{ organizations: OrganizationModel[] }>('/organizations/my', {
      signal,
      timeout: timeoutMs,
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
    });
    console.log('listMyOrganizations res.data', res.data);
    return res.data.organizations;
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
        signal,
        timeout: timeoutMs,
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
) {
    try {
        console.log('getOrganization orgId', orgId);
    const res = await instanceAxios.get<OrganizationModel>(`/organizations/${orgId}`, {
      signal,
      timeout: timeoutMs,
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
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

export async function inviteUser(params: InviteMembersParams): Promise<any> {
  try {
    console.log('inviteUser params', params);
    const res = await instanceAxios.post(
      `/organizations/invite`,
      params,
      {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
      }
    );
    return res.data;
  } catch (err: any) {

    if (axios.isAxiosError(err)) {

      console.log('inviteUser error ================> ', err.message);
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
