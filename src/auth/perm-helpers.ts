// src/auth/perm-helpers.ts
import { ROLE_POLICY } from './role-policy';
import { Perm } from './perm';
import { Role } from './roles';

// รวมสิทธิ์ทั้งหมดจากหลายบทบาท
export function collectPerms(roles: Role[]): Set<Perm> {
  const s = new Set<Perm>();
  roles.forEach(r => ROLE_POLICY[r]?.forEach(p => s.add(p)));
  return s;
}

// เลือก scope สูงสุดที่ผู้ใช้มีสำหรับ leave/attendance
export function resolveScope(perms: Set<Perm>, resource: 'leave'|'attendance'): 'org'|'team'|'own'|null {
  if (perms.has(`${resource}:view_org` as Perm))  return 'org';
  if (perms.has(`${resource}:view_team` as Perm)) return 'team';
  if (perms.has(`${resource}:view_own` as Perm))  return 'own';
  return null;
}

// ตัวช่วย UI: แท็บไหนเห็น
export function tabsFromPerms(perms: Set<Perm>): Array<'HomeTab'|'HistoryTab'|'TeamTab'|'PerksTab'|'ProfileTab'> {
  const res: any[] = [];
  if (perms.has('tab:home'))    res.push('HomeTab');
  if (perms.has('tab:history')) res.push('HistoryTab');
  if (perms.has('tab:team'))    res.push('TeamTab');
  if (perms.has('tab:perks'))   res.push('PerksTab');
  if (perms.has('tab:profile')) res.push('ProfileTab');
  return res;
}
