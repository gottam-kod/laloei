export type MeResponse = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  locale?: string | null;
  timezone?: string | null;
  email_verified_at?: string | null;
  memberships: Array<{
    org_id: string;
    role: 'owner' | 'admin' | 'hr' | 'approver' | 'member';
    org: {
      id: string;
      name: string;
      subdomain?: string | null;
    };
  }>;
  userRoles: Array<{
    id: string;
    role_id: string;
    org_id?: string | null;
    role: {
      id: string;
      name: string;
      description?: string | null;
    };
  }>;
};