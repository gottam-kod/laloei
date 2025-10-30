// src/auth/perm.ts
export type Scope = 'own' | 'team' | 'org';

export type Perm =
  // Leave
  | 'leave:view_own' | 'leave:view_team' | 'leave:view_org'
  | 'leave:create'   | 'leave:cancel_own'
  | 'leave:approve'  // อนุมัติ (ตามขอบเขตของบทบาท)
  // Attendance
  | 'attendance:view_own' | 'attendance:view_team' | 'attendance:view_org'
  | 'attendance:edit'     // แก้/ชดเชยเวลา
  // Team/Org
  | 'team:view' | 'member:invite' | 'member:manage'
  // Payroll
  | 'payroll:view' | 'payroll:edit' | 'payroll:export'
  // Finance
  | 'finance:view' | 'finance:export'
  // Audit
  | 'audit:view'
  // System
  | 'settings:view' | 'settings:edit'
  // Tabs (ช่วยเรื่อง UI visibility—อิงเมนู)
  | 'tab:home' | 'tab:history' | 'tab:team' | 'tab:perks' | 'tab:profile';
