import { Platform } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

type AuthState = {
  token: string | null;
  /** ใช้เช็คว่า rehydrate เสร็จหรือยัง (กันกระพริบ/เงื่อนไขก่อน mount) */
  hydrated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setHydrated: (v: boolean) => void;
};

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
      hydrated: false,
      login: (token) => set({ token }),
      logout: () => set({ token: null }),
      setHydrated: (v) => set({ hydrated: v }),
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

/** ตัวช่วยอ่านสถานะล็อกอินแบบ “อนุมานจาก token” (ไม่ซ้ำซ้อนกับ state) */
export const useIsLoggedIn = () => useAuthStore((s) => !!s.token);
