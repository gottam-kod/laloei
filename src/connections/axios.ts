import axios from 'axios';

declare global {
  var __AUTH_TOKEN__: string | undefined;
}

export const instanceAxios = axios.create({
  baseURL: 'http://localhost:3030',
  headers: { 'Content-Type': 'application/json' },
});

instanceAxios.interceptors.request.use(async (config) => {
  // เติมจาก Keychain/AsyncStorage ตามที่คุณเก็บ
  const token = globalThis.__AUTH_TOKEN__; // ตัวอย่าง; เปลี่ยนเป็นวิธีเก็บของคุณ
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
