import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/RootStackParamList';
import { QUICK_TO_ROUTE, QuickKey } from '@/src/auth/roles';


type Nav = NativeStackNavigationProp<HomeStackParamList, keyof HomeStackParamList>;

type UseQuickActionsOptions = {
  /** ใช้เปิด Modal “ดูทั้งหมด” (เชื่อมกับปุ่ม FAB/All) */
  openAllMenu?: () => void;
  /** ถ้ามีระบบ permission ให้ส่งฟังก์ชันตรวจสอบเข้ามาได้ (ไม่ส่งก็ข้ามไป) */
  can?: (key: QuickKey) => boolean;
};


export function useQuickActions(opts: UseQuickActionsOptions = {}) {
  const navigation = useNavigation<Nav>();

  const onQuickPress = useCallback((key: QuickKey) => {
    // ถ้ามีระบบสิทธิ์
    if (opts.can && !opts.can(key)) {
      Alert.alert('ไม่มีสิทธิ์', 'คุณไม่มีสิทธิ์เข้าถึงเมนูนี้');
      return;
    }

    const route = QUICK_TO_ROUTE[key];
    if (route) {
      navigation.navigate(route);
      return;
    }

    // เผื่ออนาคตมี key แปลก ๆ หรือยังไม่แมป
    Alert.alert('ยังไม่ได้เชื่อมหน้า', `ยังไม่มี route สำหรับ "${key}"`);
  }, [navigation, opts]);

  const openAll = useCallback(() => {
    opts.openAllMenu?.();
  }, [opts]);

  return { onQuickPress, openAll };
}
