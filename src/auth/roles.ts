// src/auth/roles.ts

import { HomeStackParamList } from "../navigation/RootStackParamList";

export type Role =
    | 'SUPERADMIN'
    | 'OWNER'
    | 'HR'
    | 'MANAGER'
    | 'ORGADMIN'
    | 'HRSTAFF'
    | 'ATTENDANCEADMIN'
    | 'TEAMLEAD'
    | 'EMP'
    | 'PAYROLL'
    | 'FINANCE'
    | 'AUDITOR'
    | 'ITSUPPORT'
    | 'CONTRACTOR'
    | 'INTERN'
    ;

export type QuickKey =
  | 'MENU_LEAVE'
  | 'MENU_HISTORY'
  | 'MENU_APPROVE'
  | 'MENU_CALENDAR'
  | 'MENU_POLICY'
  | 'MENU_PROFILE'
  | 'MENU_REPORT'
  | 'MENU_SUMMARY'
  | 'MENU_SETTING'
  | 'MENU_NOTIFICATION';


export const ROLE_PRIORITY: Role[] = [
  'SUPERADMIN',
  'OWNER',
  'ORGADMIN',
  'HR',
  'MANAGER', 'TEAMLEAD',
  'ATTENDANCEADMIN', 'PAYROLL', 'FINANCE',
  'HRSTAFF', 'ITSUPPORT',
  'EMP',
  'CONTRACTOR',
  'INTERN',
  // หมายเหตุ: 'AUDITOR' เป็นบทบาทตรวจสอบ (read-only ส่วนใหญ่)
  // ถ้าต้องการให้อยู่สูง/ต่ำกว่านี้ ให้แทรกตำแหน่งที่ต้องการ
];

export type UserProfile = {
  id: string;
  name: string;
  // เดิมเคยมี role: string | string[]
  roles: Role[];          // ✅ เก็บเป็นอาเรย์เสมอ
  activeRole?: Role;      // ✅ บทบาทที่กำลังใช้งาน (optional)
  menus?: { key: string }[];
};
export const TABS = {
    HomeTab: 'home',
    HistoryTab: 'leave-history',
    TeamTab: 'team',
    PerksTab: 'perks',
    ProfileTab: 'profile',
    ReportTab: 'report',
} as const;
export type TabKey = keyof typeof TABS;

export const QUICK_TO_ROUTE: Record<QuickKey, keyof HomeStackParamList> = {
  MENU_LEAVE:    'LeaveRequest',
  MENU_HISTORY:  'LeaveHistory',
  MENU_APPROVE:  'ApproveCenter',
  MENU_CALENDAR: 'CalendarScreen',
  MENU_POLICY:   'PolicyScreen',
  MENU_PROFILE:  'ProfileScreen',
  MENU_REPORT:   'ReportScreen',
  MENU_SUMMARY:  'SummaryScreen',
  MENU_SETTING:  'SettingsScreen',
  MENU_NOTIFICATION: 'Notifications',
};



export const ROLE_QUICK_MAP: Record<Role, string[]> = {
  // พนักงาน: 3 ปุ่มหลักตามลำดับที่แนะนำ + โปรไฟล์/แจ้งเตือน
  EMP: ['MENU_LEAVE', 'MENU_HISTORY', 'MENU_CALENDAR', 'MENU_PROFILE', 'MENU_NOTIFICATION'],

  // หัวหน้า/HR: เพิ่ม "อนุมัติ" ต่อท้าย (ถี่ แต่เฉพาะ role นี้)
  MANAGER: ['MENU_LEAVE', 'MENU_HISTORY', 'MENU_CALENDAR', 'MENU_APPROVE', 'MENU_PROFILE', 'MENU_NOTIFICATION'],
  HR: ['MENU_LEAVE', 'MENU_HISTORY', 'MENU_CALENDAR', 'MENU_APPROVE', 'MENU_PROFILE', 'MENU_NOTIFICATION'],

  // กลุ่มผู้บริหาร/ดูแลระบบ: ให้ครบ ใช้ All Menu เป็นหลัก
  OWNER: ['MENU_LEAVE', 'MENU_HISTORY', 'MENU_CALENDAR', 'MENU_APPROVE', 'MENU_PROFILE', 'MENU_NOTIFICATION'],
  SUPERADMIN: ['MENU_LEAVE', 'MENU_HISTORY', 'MENU_CALENDAR', 'MENU_APPROVE', 'MENU_PROFILE', 'MENU_NOTIFICATION'],

  ORGADMIN: [],
  HRSTAFF: [],
  ATTENDANCEADMIN: [],
  TEAMLEAD: [],
  PAYROLL: [],
  FINANCE: [],
  AUDITOR: [],
  ITSUPPORT: [],
  CONTRACTOR: [],
  INTERN: [],
};


// ถ้าต้องละเอียดมากขึ้น: ต่อ “permission” (string) แทน role ตรงๆ
export const PERMISSIONS = {
    viewHome: 'view_home',
    viewHistory: 'view_history',
    viewTeam: 'view_team',
    viewPerks: 'view_perks',
    viewProfile: 'view_profile',
} as const;
export type PermissionKey = keyof typeof PERMISSIONS;