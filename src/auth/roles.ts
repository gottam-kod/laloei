// src/auth/roles.ts

export type Role =
    | 'SUPERADMIN'
    | 'HRADMIN'
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

export const ROLES: { code: Role; name: string; label: string }[] = [
    { code: 'SUPERADMIN', name: 'ผู้ดูแลระบบสูงสุด', label: 'Super Admin' },
    { code: 'HRADMIN', name: 'ผู้ดูแลระบบทรัพยากรบุคคล', label: 'HR Admin' },
    { code: 'MANAGER', name: 'ผู้จัดการ', label: 'Manager' },
    { code: 'ORGADMIN', name: 'ผู้ดูแลระบบองค์กร', label: 'Org Admin' },
    { code: 'HRSTAFF', name: 'เจ้าหน้าที่ทรัพยากรบุคคล', label: 'HR Staff' },
    { code: 'ATTENDANCEADMIN', name: 'ผู้ดูแลระบบการเข้าออกงาน', label: 'Attendance Admin' },
    { code: 'TEAMLEAD', name: 'หัวหน้าทีม', label: 'Team Lead' },
    { code: 'EMP', name: 'พนักงาน', label: 'Employee' },
    { code: 'PAYROLL', name: 'ฝ่ายเงินเดือน', label: 'Payroll' },
    { code: 'FINANCE', name: 'ฝ่ายการเงิน', label: 'Finance' },
    { code: 'AUDITOR', name: 'ผู้ตรวจสอบ', label: 'Auditor' },
    { code: 'ITSUPPORT', name: 'ฝ่ายสนับสนุนไอที', label: 'IT Support' },
    { code: 'CONTRACTOR', name: 'ผู้รับเหมา', label: 'Contractor' },
    { code: 'INTERN', name: 'นักศึกษา/ฝึกงาน', label: 'Intern' },
];
export const TABS = {
    HomeTab: 'home',
    HistoryTab: 'leave-history',
    TeamTab: 'team',
    PerksTab: 'perks',
    ProfileTab: 'profile',
} as const;
export type TabKey = keyof typeof TABS;

// กำหนดสิทธิ์เห็นแท็บต่อ role
export const TAB_POLICY: Record<Role, TabKey[]> = {
    SUPERADMIN: ['HomeTab', 'HistoryTab', 'TeamTab', 'PerksTab', 'ProfileTab'],
    HRADMIN: ['HomeTab', 'HistoryTab', 'TeamTab', 'ProfileTab'],
    MANAGER: ['HomeTab', 'HistoryTab', 'TeamTab', 'ProfileTab'],
    EMP: ['HomeTab', 'HistoryTab', 'ProfileTab'],
    ORGADMIN: ['HomeTab', 'HistoryTab', 'TeamTab', 'PerksTab', 'ProfileTab'],
    HRSTAFF: [],
    ATTENDANCEADMIN: [],
    TEAMLEAD: [],
    PAYROLL: [],
    FINANCE: [],
    AUDITOR: [],
    ITSUPPORT: [],
    CONTRACTOR: [],
    INTERN: []
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