// pickPrimaryRole.ts
import { Role, ROLE_PRIORITY } from './roles';

const toRole = (r: string): Role | null => {
  const up = (r || '').toUpperCase() as Role;
  return (ROLE_PRIORITY as string[]).includes(up) ? (up as Role) : null;
};

/**
 * เลือกบทบาท "หลัก" จากอินพุตที่อาจเป็น string / Role เดี่ยว หรืออาร์เรย์
 * - ใช้ priority (ยิ่งอยู่ซ้ายยิ่งแรง)
 * - รองรับ override priority ถ้าต้องการ
 */
export function pickPrimaryRole(
  input: string[],
  priority: Role[] = ROLE_PRIORITY
): Role {


  if (!input) return 'EMP';
  const list = Array.isArray(input) ? input : [input];

  const valid = list
    .map(x => (typeof x === 'string' ? toRole(x) : x))
    .filter((r): r is Role => !!r);
    
  if (!valid.length) return 'EMP';
 
  // สร้าง rank map จาก priority
  const rank = new Map<Role, number>(priority.map((r, i) => [r, i]));

  valid.sort((a, b) => (rank.get(a)! - rank.get(b)!));
  return valid[0];
}