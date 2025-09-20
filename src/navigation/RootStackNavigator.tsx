// src/navigation/RootStackNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStackParamList';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { useAuthStore, useIsLoggedIn } from '../store/useAuthStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const hydrated = useAuthStore((s) => s.hydrated);
if (!hydrated) return null; // หรือ Splash ระหว่างรอ
const isLoggedIn = useIsLoggedIn();
  // const isSignedIn = false; // TODO: ผูกกับ auth จริง
  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? 'MainTabs' : 'AuthStack'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
