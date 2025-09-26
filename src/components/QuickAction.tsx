// src/components/QuickAction.tsx
import React, { memo, useMemo, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  Animated,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// ถ้ามีธีมของคุณเองให้เอาอันนี้มาใช้แทน fallback ด้านล่าง
// import { COLOR as THEME } from "@/src/theme/theme";

export type QuickActionProps = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  icon?: keyof typeof Ionicons.glyphMap; // อย่างใดอย่างหนึ่ง
  emoji?: string;                         // อย่างใดอย่างหนึ่ง
  disabled?: boolean;
  glass?: boolean;                        // true = พื้นหลังโปร่งใส
  size?: number;                          // ขนาดกล่องไอคอน (ค่าเริ่ม 58)
  color?: string;                         // สีไอคอน/อีโมจิ
  style?: any;                            // สไตล์หุ้มรอบ component
  testID?: string;
};

// --- Fallback theme (ถ้าไม่มี THEME) ---
const COLOR = {
  text: "#1e293b",
  glass: "rgba(255,255,255,0.6)",
  glassBorder: "rgba(255,255,255,0.75)",
};

// เงา cross-platform นุ่ม ๆ
const shadow = (r = 6) =>
  Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: r,
      shadowOffset: { width: 0, height: Math.ceil(r / 2) },
    },
    android: { elevation: Math.ceil(r / 2) },
    default: {},
  }) as any;

const QuickAction: React.FC<QuickActionProps> = ({
  label,
  onPress,
  icon,
  emoji,
  disabled,
  glass = true,
  size = 58,
  color = COLOR.text,
  style,
  testID,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, friction: 6 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }).start();

  const content = useMemo(() => {
    if (emoji) return <Text style={[styles.emoji, { fontSize: size * 0.45 }]}>{emoji}</Text>;
    return <Ionicons name={icon ?? "sparkles-outline"} size={Math.round(size * 0.41)} color={color} />;
  }, [emoji, icon, size, color]);

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityLabel={label}
      android_ripple={{ color: "#00000010", borderless: false }}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={[styles.wrap, style, disabled && { opacity: 0.5 }]}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale }],
            width: size,
            height: size,
            borderRadius: size * 0.28,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: glass ? COLOR.glass : "#fff",
            borderWidth: glass ? StyleSheet.hairlineWidth : 0,
            borderColor: glass ? COLOR.glassBorder : "transparent",
          },
          shadow(6),
        ]}
      >
        {content}
      </Animated.View>

      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
};

export default memo(QuickAction);

const styles = StyleSheet.create({
  wrap: { alignItems: "center", width: 78, gap: 6 },
  emoji: { lineHeight: 26 },
  label: { fontSize: 12, fontWeight: "600", color: COLOR.text },
});
