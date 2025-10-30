// navigation/ProfileStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';
import CreateOrganizationScreen from '../screens/org/CreateOrganizationScreen';
import MyOrganizationsScreen from '../screens/org/MyOrganizationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ProfileStackParamList } from './RootStackParamList';
import InviteScreen from '../screens/org/InviteScreen';
import UpgradePlanScreen from '../screens/UpgradePlanScreen';
import BillingScreen from '../screens/BillingScreen';
import TeamStructureScreen from '../screens/TeamStructureScreen';
import LeaveTypesScreen from '../screens/LeaveTypesScreen';
import SettingsScreen from '../screens/SettingsScreen';


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
      <Stack.Screen name="UpgradePlan" component={UpgradePlanScreen} options={{ title: 'อัปเกรดแผน' }} />
      <Stack.Screen name="Billing" component={BillingScreen} options={{ title: 'การชำระเงิน' }} />
      <Stack.Screen name="TeamStructure" component={TeamStructureScreen} options={{ title: 'โครงสร้างทีม' }} />
      <Stack.Screen name="LeaveType" component={LeaveTypesScreen} options={{ title: 'ประเภทการลา' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'การตั้งค่าองค์กร' }} />
     {/* <Stack.Screen
        name="ChangeLanguage"
        component={ChangeLanguageScreen}
        options={{ headerShown: false, presentation: 'transparentModal', animation: 'slide_from_bottom' }}
      /> */}
    </Stack.Navigator>
  );
}
