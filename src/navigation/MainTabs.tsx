// src/navigation/RootTabs.tsx
import React, { JSX } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { NavigatorScreenParams } from "@react-navigation/native";
import GlassTabBar from "@/src/navigation/GlassTabBar";
import LeaveHistoryScreen from "@/src/screens/LeaveHistoryScreen";
import TeamScreen from "@/src/screens/TeamScreen";
import PerksScreen from "@/src/screens/PerksScreen";
import ProfileStack from "@/src/navigation/ProfileStack";
import { useTranslation } from "react-i18next";
import { HomeScreen } from "../screens/home/HomeScreen";

export type RootTabParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
  TeamTab: undefined;
  PerksTab: undefined;
  ProfileTab: NavigatorScreenParams<any> | undefined; // ถ้ามีสแตกข้างใน
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootTabs(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
  screenOptions={{
    headerShown: false,
    // tabBarStyle: {
      // backgroundColor: "transparent",
      // borderTopWidth: 0,
      // elevation: 0, // Android
      // position: "absolute",
    // },
  }}
  tabBar={(props) => <GlassTabBar {...props} />}
>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: t("tabs.home") }} />
      <Tab.Screen name="HistoryTab" component={LeaveHistoryScreen} options={{ title: t("tabs.requests") }} />
      <Tab.Screen name="TeamTab" component={TeamScreen} options={{ title: t("tabs.team") }} />
      <Tab.Screen name="PerksTab" component={PerksScreen} options={{ title: t("tabs.perks") }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: t("tabs.profile") }} />
    </Tab.Navigator>
  );
}
