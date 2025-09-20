// navigation/ProfileStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';
import CreateOrganizationScreen from '../screens/org/CreateOrganizationScreen';
import MyOrganizationsScreen from '../screens/org/MyOrganizationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ProfileStackParamList } from './RootStackParamList';



const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'เปลี่ยนรหัสผ่าน' }} />
      <Stack.Screen name="CreateOrganization" component={CreateOrganizationScreen} options={{ title: 'ตั้งค่าองค์กร' }} />
      <Stack.Screen name="MyOrganization" component={MyOrganizationsScreen} options={{ title: 'องค์กรของฉัน' }} />
     {/* <Stack.Screen
        name="ChangeLanguage"
        component={ChangeLanguageScreen}
        options={{ headerShown: false, presentation: 'transparentModal', animation: 'slide_from_bottom' }}
      /> */}
    </Stack.Navigator>
  );
}
