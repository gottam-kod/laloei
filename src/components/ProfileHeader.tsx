import React, { useMemo, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  useColorScheme,
  StyleProp,
  ViewStyle,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  name: string;
  avatarUri?: string;
  position?: string;
  company?: string;
  notificationCount?: number;
  onNotiPress?: () => void;
  style?: StyleProp<ViewStyle>;
  gradientColors?: [string, string];
};

const clamp = (n: number, min = 0, max = 99) => Math.max(min, Math.min(max, n));

export default function ProfileHeader({
  name,
  avatarUri,
  position,
  company,
  notificationCount,
  onNotiPress,
  style,
  gradientColors,
}: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const COLORS = {
    text: isDark ? "#e5eef7" : "#0f172a",
    sub: isDark ? "#c7d2fe" : "#475569",
    chipText: "#2563eb",
    ringA: "#7fd7ff",
    ringB: "#8ee3cf",
  };

  const gradient = gradientColors ?? (isDark ? ["#1c3352", "#224862"] : ["#cfe9ff", "#e9f6ff"]);

  // micro-interaction scale
  const scale = useRef(new Animated.Value(1)).current;
  const bump = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, friction: 6 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
    ]).start();
  };

  // อักษรย่อ (initials) กรณีไม่มีรูป
  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/);
    const s = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
    return s.toUpperCase();
  }, [name]);

  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }, style]}>
      <SafeAreaView edges={["top"]} style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 }}>
        {/* แถวบน: avatar + ชื่อ/ตำแหน่ง/บริษัท + noti */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Avatar + gradient ring */}
          <LinearGradient
            colors={[COLORS.ringA, COLORS.ringB]}
            style={{ width: 64, height: 64, borderRadius: 32, padding: 2, marginRight: 12 }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 30,
                backgroundColor: isDark ? "#0b1220" : "#ffffff",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <Text style={{ fontWeight: "800", color: COLORS.chipText }}>{initials}</Text>
              )}
            </View>
          </LinearGradient>

          {/* Name / Position / Company */}
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{ color: COLORS.text, fontSize: 20, fontWeight: "900" }}>
              {name}
            </Text>
            {!!position && (
              <Text numberOfLines={1} style={{ color: COLORS.sub, marginTop: 2 }}>
                {position}
              </Text>
            )}
            {!!company && (
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  marginTop: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons name="business-outline" size={14} color={COLORS.chipText} />
                <Text numberOfLines={1} style={{ color: COLORS.chipText, fontWeight: "700", marginLeft: 6 }}>
                  {company}
                </Text>
              </View>
            )}
          </View>

          {/* Notification */}
          <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
              onPress={() => {
                bump();
                onNotiPress?.();
              }}
              android_ripple={{ color: "#00000011", borderless: true, radius: 22 }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)",
              }}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
              {typeof notificationCount === "number" && notificationCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    minWidth: 18,
                    height: 18,
                    paddingHorizontal: 4,
                    borderRadius: 9,
                    backgroundColor: "#ef4444",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 11, fontWeight: "800" }}>
                    {clamp(notificationCount)}
                  </Text>
                </View>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
