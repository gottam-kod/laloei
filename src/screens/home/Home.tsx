// src/screens/home/HomeRole.tsx
import React from 'react';
import { useAuthStore } from '@/src/store/useAuthStore';

import MgScreen from './MgScreen';
import EmpScreen from './EmpScreen';
import HrScreen from './HRSrcreen';
import AdminScreen from './AdminScreen';

export default function HomeRole() {
  const role = useAuthStore(s => s.profile?.role) as string | string[] | undefined;

//   "SUPERADMIN"
// "ORGADMIN"
// "HRADMIN"
// "HRSTAFF"
// "ATTENDANCEADMIN"
// "LINEMANAGER"
// "TEAMLEAD"
// "EMP"
// "PAYROLL"
// "FINANCE"
// "AUDITOR"
// "ITSUPPORT"
// "CONTRACTOR"
// "INTERN"
  
  if (Array.isArray(role)) {
    if (role.length === 0) return <EmpScreen />; // กันเหนียว
    if (role.includes('SUPERADMIN') || role.includes('ORGADMIN')) return <AdminScreen />;
    if (role.includes('HRADMIN')) return <HrScreen />;
    if (role.includes('MANAGER')) return <MgScreen />;
    return <EmpScreen />;
  }
  // กรณี role เป็น string
  switch (role) {
    case 'admin':
      return <AdminScreen />;
    case 'hr':
      return <HrScreen />;
    case 'manager':
      return <MgScreen />;
    case 'employee':
    default:
      return <EmpScreen />;
  }
}
