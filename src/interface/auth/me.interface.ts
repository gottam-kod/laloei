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
  id: string;
  email: string;
  name: string;
  orgId: string | null;
  email_verified: boolean;
  locale: string;        // เช่น "th-TH"
  timezone: string;      // เช่น "Asia/Bangkok"
  phone: string | null;  // เบอร์โทร
  device_info: string | null;
  position: string;
  avatarUri: string | null;
  department: string;
  // org_name: string | null;
  notificationCount: number; // จำนวนแจ้งเตือน
  org?: Organization | null; // ชื่อบริษัท (ถ้ามี)  
  role: string;          // เช่น "SUPERADMIN"
  permissions: PermissionCode[];
  menus: MenuItem[];
}

// Define Organization type (customize fields as needed)
export type Organization = {
  orgId: string;
  orgName: string;
  subdomain?: string | null;
};
