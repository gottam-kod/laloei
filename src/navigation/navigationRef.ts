import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function resetToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.reset({ index: 0, routes: [{ name: 'AuthStack' }] }); // เปลี่ยนเป็นชื่อ Stack/Login ของคุณ
  }
}