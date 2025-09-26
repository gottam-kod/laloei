
export type OrganizationModel = {
    address: {
        city: string;
        country: string;
        line1: string;
        line2?: string | null;
        postal_code: string;
        state: string;
    };
    billing_email: string;
    billing_name: string;
    created_at: string;
    domain?: string | null;
    id: string;
    locale?: string | null;
    name: string;
    owner_user_id: string;
    phone?: string | null;
    subdomain?: string | null;
    tax_id?: string | null;
    timezone?: string | null;
    updated_at: string;
    role?: 'owner' | 'admin' | 'approver' | 'hr' | 'member';
    plan_code?: string | null;
    trial?: { status: 'trialing' | 'active' | 'canceled' | 'past_due'; ends_at?: string | null } | null;
    members_count?: number;
};