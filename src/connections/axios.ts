import axios from 'axios';
import { logoutAndGoLogin } from './auth/authApi';

declare global {
  var __AUTH_TOKEN__: string | undefined;
}

export const instanceAxios = axios.create({
  baseURL: 'http://localhost:3003/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

instanceAxios.interceptors.request.use(async (config) => {
  // เติมจาก Keychain/AsyncStorage ตามที่คุณเก็บ
  const token = globalThis.__AUTH_TOKEN__; // ตัวอย่าง; เปลี่ยนเป็นวิธีเก็บของคุณ
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instanceAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config;

    // กันยิงซ้ำ/ลูป
    if (status === 401 && !original?._handled401) {
      original._handled401 = true;
      await logoutAndGoLogin('unauthorized');
    }
    return Promise.reject(error);
  }
);