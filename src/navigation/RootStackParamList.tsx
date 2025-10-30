// src/navigation/RootStackParamList.ts
import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  VerifyEmail: { email?: string } | undefined; // ใช้ optional OK ถ้าหน้าจอรองรับค่าเปล่า
};

/* ----- Home stack under HomeTab ----- */
export type HomeStackParamList = {
  LaloeiHome: undefined;
  LeaveRequest: undefined;
  LeaveHistory: undefined;
  ApproveCenter: undefined;
  CalendarScreen: undefined;
  PolicyScreen: undefined;
  ProfileScreen: undefined;
  ReportScreen: undefined;
  SummaryScreen: undefined;
  SettingsScreen: undefined;
  Notifications: undefined;
};

/* ----- Tabs ----- */
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>; // ✅ ชี้ไปที่ HomeStack
  HistoryTab: NavigatorScreenParams<HistoryStackParamList> | undefined;
  TeamTab: NavigatorScreenParams<TeamStackParamList> | undefined;
  PerksTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type HistoryStackParamList = {
  LeaveHistory: undefined;
};

export type TeamStackParamList = {
  Team: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
  ChangePassword: { email?: string; code?: string } | undefined; // ✅ route key ไม่ optional
  ChangeLanguage: undefined;
  SettingOrganization: undefined;
  CreateOrganization: undefined;
  MyOrganization: undefined;
  InviteMember: undefined;
  ManageMembers: undefined;
  Terms: undefined;
  DeviceInfo: undefined;
  UpgradePlan: undefined;
  Billing: undefined;
  TeamStructure: undefined;
  LeaveType: undefined;
  Settings: undefined;
};


/* ----- Auth ----- */
export type AuthStackParamList = {
  AuthLanding: undefined;
  AuthPhoneLogin: undefined;
  AuthEmailLogin: undefined;
  AuthOtpVerify: { phone: string };
  ForgotPassword: { email?: string };
  ChangePassword: { email: string; code: string };
  Register: undefined;
  VerifyEmail: { email: string };
};
