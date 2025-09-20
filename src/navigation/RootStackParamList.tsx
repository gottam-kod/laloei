// src/navigation/RootStackParamList.ts
import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};

/* ----- Tabs ----- */
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  HistoryTab: NavigatorScreenParams<HistoryStackParamList>;
  TeamTab: NavigatorScreenParams<TeamStackParamList> | undefined;
  PerksTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

/* ----- Stacks under each tab ----- */
export type HomeStackParamList = {
  HomeDashboard: undefined;
  Requests: undefined;
  LeaveRequest: undefined;
  ApprovalList: undefined;
  LeaveSummary: undefined;
  HRNews: undefined;
  CheckInScreen: undefined;
};

export type HistoryStackParamList = {
  LeaveHistory: undefined;
};

export type TeamStackParamList = {
  Team: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  ChangePassword?: { email: string; code: string };
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
};
