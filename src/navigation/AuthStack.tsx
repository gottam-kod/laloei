// src/navigation/AuthStack.tsx
import { useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';

import AuthEmailLogin from '../screens/auth/AuthEmailLogin';
import AuthPhoneLogin from '../screens/auth/AuthPhoneLogin';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import AuthLandingScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

export type AuthStackParamList = {
  AuthLanding: undefined;
  AuthPhoneLogin: undefined;
  AuthEmailLogin: undefined;
  ForgotPassword: { email?: string } | undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** ---------- Wrapper: inject handlers to AuthEmailLogin ---------- */
function AuthEmailLoginScreen() {
  const authNav =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const rootNav = useNavigation<any>();

  return (
    <AuthEmailLogin
      onLogin={({ email }) => {
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
