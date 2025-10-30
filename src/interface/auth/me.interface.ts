import { JSX } from "react";

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

export type PermissionCode =
  | 'REPORT_VIEW'
  | 'LEAVE_APPROVE'
  | 'LEAVE_REQUEST_VIEW'
  | 'TEAM_VIEW'
  | (string & {}); // เผื่ออนาคต

export type MenuIcon =
  | 'home-outline'
  | 'add-circle-outline'
  | 'time-outline'
  | 'checkmark-done-outline'
  | 'people-outline'
  | 'person-outline'
  | (string & {}); // เผื่ออนาคต

export interface MenuItem {
  id: string;              // UUID
  key: string;             // unique key
  title: string;           // i18n title
  route: string;           // path
  icon?: MenuIcon | null;  // อนุญาต null
  order: number;           // ลำดับ
  parentId?: string | null;
}


export interface UserProfileResponse {
  user: User
  preferences: Preferences
  security: Security
  orgs: any[]
  roles: string[]
  active_org: ActiveOrg
  permissions: any[]
  menus: Menu[]
  unread_counts: UnreadCounts
  feature_flags: FeatureFlags
  api: Api
  etag: string
  updated_at: string

}

export interface User {
  id: string
  email: string
  name: string
  avatar_url: string
  phone: any
  email_verified: boolean
  roles: string[]
}

export interface Preferences {
  locale: string
  timezone: string
  theme: string
}

export interface Security {
  mfa_enabled: boolean
  last_login_at: string
}

export interface ActiveOrg {
  id: string
  name: string
  plan: string
  features: Features
}

export interface Features {}

export interface Menu {
  key: string
  map_key: string
  component: JSX.Element | (() => JSX.Element)
  title: string
  icon: string
  route: string
  parent_key: string
}

export interface UnreadCounts {
  approvals: number
  notifications: number
}

export interface FeatureFlags {
  new_nav: boolean
  beta_profile: boolean
}

export interface Api {
  min_app_version: string
  force_update: boolean
}
