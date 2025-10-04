// src/components/AuthGate.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/src/navigation/RootStackParamList';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const profile = useAuthStore(s => s.profile);
  const hydrated = useAuthStore(s => s.hydrated);
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (hydrated && !profile) {
      nav.reset({ index: 0, routes: [{ name: 'AuthStack' as never }] });
    }
  }, [hydrated, profile, nav]);

  if (!hydrated) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}
