// src/navigation/AuthStack.tsx
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import AuthLandingScreen from '../screens/auth/LoginScreen';
import AuthPhoneLogin from '../screens/auth/AuthPhoneLogin';
import AuthEmailLogin from '../screens/auth/AuthEmailLogin';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import { RootStackParamList } from './RootStackParamList';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';

/** ---------- Types ---------- */
export type AuthStackParamList = {
  AuthLanding: undefined;
  AuthPhoneLogin: undefined;
  AuthEmailLogin: { prefillEmail?: string } | undefined;
  ForgotPassword: { email?: string } | undefined;
  Register: undefined;
  VerifyEmail: { email: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** ---------- Wrapper: inject handlers to AuthEmailLogin ---------- */
function AuthEmailLoginScreen() {
  const authNav =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  // ใช้ root nav เพื่อไป MainTabs ที่ Root
  const rootNav = useNavigation<any>(); // หรือ NavigationProp<RootStackParamList>

  return (
    <AuthEmailLogin
      onLogin={({ email }) => {
        // ไปหน้า main app ที่ Root (ชื่อ route ตามที่คุณตั้งไว้)
        // ตัวอย่าง: Root มี "MainTabs"
        rootNav.navigate?.('MainTabs');
      }}
      onForgot={(email?: string) => {
        authNav.navigate('ForgotPassword', { email });
      }}
      onRegister={() => {
        console.log('Email login pressed');
        authNav.navigate('Register');
      }}
    />
  );
}

/** ---------- Auth Stack ---------- */
export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="AuthLanding"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AuthLanding" component={AuthLandingScreen} />
      <Stack.Screen name="AuthPhoneLogin" component={AuthPhoneLogin} />
      <Stack.Screen name="AuthEmailLogin" component={AuthEmailLoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
