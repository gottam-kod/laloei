// navigation/ProfileStack.tsx
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';
import CreateOrganizationScreen from '../screens/org/CreateOrganizationScreen';
import MyOrganizationsScreen from '../screens/org/MyOrganizationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AuthStackParamList, ProfileStackParamList } from './RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import InviteScreen from '../screens/org/InviteScreen';


const Stack = createNativeStackNavigator<ProfileStackParamList>();


export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        options={{ title: 'โปรไฟล์' }}
        children={(props) => (
          <ProfileScreen
            {...props}
            onInviteMembers={() => {
              props.navigation.navigate('InviteMember');
            }}
          />
        )}
      />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'เปลี่ยนรหัสผ่าน' }} />
      <Stack.Screen name="CreateOrganization" component={CreateOrganizationScreen} options={{ title: 'ตั้งค่าองค์กร', presentation: 'transparentModal' }} />
      <Stack.Screen name="MyOrganization" component={MyOrganizationsScreen} options={{ title: 'องค์กรของฉัน' }} />
      <Stack.Screen name="InviteMember" component={InviteScreen} options={{ title: 'เชิญสมาชิก' }} />
     {/* <Stack.Screen
        name="ChangeLanguage"
        component={ChangeLanguageScreen}
        options={{ headerShown: false, presentation: 'transparentModal', animation: 'slide_from_bottom' }}
      /> */}
    </Stack.Navigator>
  );
}
