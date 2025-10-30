// src/auth/role-policy.ts
import { Perm } from './perm';
import { Role } from './roles';

export const ROLE_POLICY: Record<Role, Perm[]> = {
  SUPERADMIN: [
    'leave:view_org','leave:create','leave:cancel_own','leave:approve',
    'attendance:view_org','attendance:edit',
    'team:view','member:invite','member:manage',
    'payroll:view','payroll:edit','payroll:export',
    'finance:view','finance:export',
    'audit:view',
    'settings:view','settings:edit',
    'tab:home','tab:history','tab:team','tab:perks','tab:profile',
  ],
  ORGADMIN: [
    'leave:view_org','leave:create','leave:cancel_own','leave:approve',
    'attendance:view_org','attendance:edit',
    'team:view','member:invite','member:manage',
    'payroll:view','payroll:export',
    'finance:view',
    'audit:view',
    'settings:view',
    'tab:home','tab:history','tab:team','tab:perks','tab:profile',
  ],
  HRADMIN: [
    'leave:view_org','leave:create','leave:cancel_own','leave:approve',
    'attendance:view_org','attendance:edit',
    'team:view','member:invite',
    'payroll:view','payroll:export',
    'audit:view',
    'tab:home','tab:history','tab:team','tab:profile',
  ],
  MANAGER: [
    'leave:view_team','leave:create','leave:cancel_own','leave:approve',
    'attendance:view_team',
    'team:view',
    'tab:home','tab:history','tab:team','tab:profile',
  ],
  TEAMLEAD: [
    'leave:view_team','leave:create','leave:cancel_own',
    'attendance:view_team',
    'team:view',
    'tab:home','tab:history','tab:team','tab:profile',
  ],
  HRSTAFF: [
    'leave:view_org','leave:create','leave:cancel_own',
    'attendance:view_org',
    'team:view',
    'tab:home','tab:history','tab:team','tab:profile',
  ],
  ATTENDANCEADMIN: [
    'attendance:view_org','attendance:edit',
    'tab:home','tab:profile',
  ],
  PAYROLL: [
    'payroll:view','payroll:edit','payroll:export',
    'tab:home','tab:profile',
  ],
  FINANCE: [
    'finance:view','finance:export',
    'tab:home','tab:profile',
  ],
  AUDITOR: [
    'audit:view','leave:view_org','attendance:view_org','payroll:view','finance:view',
    'tab:home','tab:profile',
  ],
  ITSUPPORT: [
    'settings:view',
    'tab:home','tab:profile',
  ],
  EMP: [
    'leave:view_own','leave:create','leave:cancel_own',
    'attendance:view_own',
    'tab:home','tab:history','tab:profile',
  ],
  CONTRACTOR: [
    'leave:view_own','leave:create',
    'attendance:view_own',
    'tab:home','tab:profile',
  ],
  INTERN: [
    'leave:view_own','leave:create',
    'attendance:view_own',
    'tab:home','tab:profile',
  ],
};
