// auth/session.ts

import { resetToLogin } from '@/src/navigation/navigationRef';
import { useAuthStore } from '@/src/store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type JwtPayload = { exp?: number };

const parseJwt = (t: string): JwtPayload => {
  try {
    const [, payload] = t.split('.');
    const json = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    return json;
  } catch { return {}; }
};

export const isTokenExpired = (token?: string) => {
  if (!token) return true;
  const { exp } = parseJwt(token);
  if (!exp) return false; // ถ้าไม่มี exp ปล่อยให้เซิร์ฟเวอร์เป็นตัวตัดสิน
  const now = Math.floor(Date.now() / 1000);
  return exp <= now;
};

let loggingOut = false;
export async function logoutAndGoLogin(reason?: string) {
  if (loggingOut) return;
  loggingOut = true;
  try {
    // ล้าง token ทั้งหมด
    globalThis.__AUTH_TOKEN__ = undefined;
    try { await AsyncStorage.removeItem('auth_token'); } catch {}

    // ล้าง state ผู้ใช้ใน store (ถ้ามี)
    useAuthStore.getState().logout?.();

    // กลับหน้า Login
    resetToLogin();
  } finally {
    loggingOut = false;
  }
}
