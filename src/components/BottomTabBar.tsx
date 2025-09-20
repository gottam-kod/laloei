import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Platform } from "react-native";
import { COLOR, SHADOW } from "../theme/theme";


export type TabName = 'Home' | 'Requests' | 'Team' | 'Perks' | 'Profile' | 'LeaveHistory';

type BottomTabBarProps = {
  active?: TabName;
  onChange?: (t: TabName) => void;
};

export default function BottomTabBar({ active = 'Home', onChange }: BottomTabBarProps) {
  // eslint-disable-next-line react/no-unstable-nested-components
  const Tab = ({ name, label, emoji }:
    { name: TabName; label: string; emoji: string }) => {
    const isActive = active === name;
    return (
      <TouchableOpacity
        onPress={() => onChange?.(name)}
        style={styles.tabItem}
        activeOpacity={0.9}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
          <Text style={[styles.tabEmoji, isActive && styles.tabEmojiActive]}>{emoji}</Text>
        </View>
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.tabWrap, SHADOW()]}>
      <Tab name="Home"     label="หน้าหลัก"  emoji="🏠" />
      <Tab name="Requests" label="คำขอ"    emoji="📝" />
      <Tab name="Team"     label="ทีม"      emoji="👥" />
      <Tab name="Perks"    label="สวัสดิการ" emoji="🎁" />
      <Tab name="Profile"  label="โปรไฟล์"  emoji="👤" />
    </View>
  );
}

const styles = StyleSheet.create({
  tabWrap: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLOR.line,
    ...(Platform.OS === 'android' ? { elevation: 4 } : {}),
  },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F3F7FB',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  tabBadgeActive: { backgroundColor: '#E0F2FF' },
  tabEmoji: { fontSize: 16, color: COLOR.dim },
  tabEmojiActive: { fontSize: 16, color: COLOR.brand },
  tabLabel: { fontSize: 11.5, color: COLOR.dim, marginTop: 2 },
  tabLabelActive: { color: COLOR.brand, fontWeight: '700' },
});
