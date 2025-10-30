import { Platform } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { pickPrimaryRole } from '../auth/pickPrimaryRole';
import { ActiveOrg, Menu } from '../interface/auth/me.interface';

type AuthState = {
  token: string | null;
  /** ใช้เช็คว่า rehydrate เสร็จหรือยัง (กันกระพริบ/เงื่อนไขก่อน mount) */
  profile: Profile | null;
  hydrated: boolean;
  lang: 'th' | 'en';
  login: (token: string) => void;
  logout: () => void;
  setHydrated: (v: boolean) => void;
  setProfile: (p: Profile | null) => void;
};

type Profile = {
  id: string;
  email: string;
  name?: string | null;
  locale?: string | null;
  timezone?: string | null;
  department?: string | null;
  position?: string | null;
  avatarUri?: string | null;
  notificationCount?: number;
  roles?: string[]; // เช่น ['owner', 'admin']
  lang?: 'th' | 'en'; // ภาษา UI ที่เลือก (ถ้ามี)
  menus?: Menu[]; // เมนูที่ผู้ใช้มีสิทธิ์เข้าถึง
  permissions?: string[]; // สิทธิ์ที่ผู้ใช้มี
  org?: ActiveOrg | null; // ชื่อบริษัท (ถ้ามี)
}



/** Storage ฝั่ง native (iOS/Android) — เข้ารหัสด้วย SecureStore */
const secureStoreStorage: StateStorage = {
  getItem: async (name: string) => (await SecureStore.getItemAsync(name)) ?? null,
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

/** เลือก storage ตามแพลตฟอร์ม: web = localStorage, native = SecureStore */
const storage = Platform.OS === 'web'
  ? createJSONStorage(() => localStorage)
  : createJSONStorage(() => secureStoreStorage);

// ถ้าต้องการใช้ AsyncStorage แทน SecureStore ให้ใช้:
// import AsyncStorage from '@react-native-async-storage/async-storage';
// const storage = createJSONStorage(() => AsyncStorage);

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      profile: null,
      hydrated: false,
      lang: 'th',
      login: (token) => set({ token }),
      logout: () => set({ token: null, profile: null }),
      setHydrated: (v) => set({ hydrated: v }),
      setProfile: (p: Profile | null) => {
        if (p) {
          p.lang = p.lang || (p.locale || '').startsWith('th') ? 'th' : 'en';
          set({ profile: p });
          set({ lang: p.lang });
        } else {
          // ล้าง profile ทิ้ง (เช่น กรณี logout)
          set({ profile: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage,
      version: 1,
      // Persist เฉพาะข้อมูลที่จำเป็น (ไม่เก็บฟังก์ชัน/สถานะชั่วคราว)
      partialize: (state) => ({ token: state.token }),
      // เมื่อ rehydrate เสร็จ ให้ตั้ง hydrated = true
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('auth rehydrate error:', error);
        }
        state?.setHydrated(true);
      },
    }
  )
);




export const useUserRole = () => {
  const profile = useAuthStore((s) => s.profile);
  const rawRoles = profile?.roles;
  const roleArray: string[] = Array.isArray(rawRoles)
    ? rawRoles.filter((r): r is string => typeof r === 'string')
    : (typeof rawRoles === 'string' ? [rawRoles] : []);

  if (roleArray.length === 0) {
    return 'EMP';
  } else if (roleArray.length === 1) {
    return roleArray[0] || 'EMP';
  } else {
    return pickPrimaryRole(roleArray);
  }
}

/** ตัวช่วยอ่านสถานะล็อกอินแบบ “อนุมานจาก token” (ไม่ซ้ำซ้อนกับ state) */
export const useIsLoggedIn = () => useAuthStore((s) => !!s.token);
