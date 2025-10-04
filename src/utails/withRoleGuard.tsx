// utils/withRoleGuard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useAuthStore } from '@/src/store/useAuthStore';
import type { Role } from '@/src/auth/roles';

export default function withRoleGuard<P extends React.PropsWithChildren<{}>>(
  Wrapped: React.ComponentType<P>,
  allow: Role[] // roles ที่อนุญาต
) {
  return (props: P) => {
    const role = (useAuthStore(s => s.profile?.role) as unknown as Role) ?? 'employee';
    if (!allow.includes(role)) {
      return (
        <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
          <Text>คุณไม่มีสิทธิ์เข้าหน้านี้</Text>
        </View>
      );
    }
    return <Wrapped {...props} />;
  };
}
