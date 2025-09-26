// src/navigation/GlassTabBar.tsx
import React, { useMemo, useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View, LayoutChangeEvent, Animated } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 🔹 ใช้ BlurView ถ้ามี (Expo)
let BlurView: any = View;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    BlurView = require("expo-blur").BlurView;
} catch (_) { }

const COLOR = {
    glass: "rgba(150, 224, 222, 0.93)",   // fallback เมื่อไม่มี blur
    glassBorder: "rgba(255,255,255,0.85)",
    active: "#0ea5e9",
    inactive: "#64748b",
};

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap | undefined> = {
    HomeTab: "home-outline",
    HistoryTab: "document-text-outline",
    TeamTab: "people-outline",
    PerksTab: "gift-outline",
    ProfileTab: "person-outline",
};

const shadow = (r = 10) =>
    Platform.select({
        ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: r, shadowOffset: { width: 0, height: Math.ceil(r / 2) } },
        android: { elevation: Math.ceil(r / 2) },
        default: {},
    }) as any;

export default function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    // เก็บตำแหน่ง/ความกว้างของแต่ละแท็บเพื่อเลื่อน active indicator
    const [items, setItems] = useState<{ x: number; w: number }[]>(
        new Array(state.routes.length).fill({ x: 0, w: 0 })
    );
    const indicatorX = useRef(new Animated.Value(0)).current;
    const indicatorW = useRef(new Animated.Value(44)).current;

    const onItemLayout = (idx: number) => (e: LayoutChangeEvent) => {
        const { x, width } = e.nativeEvent.layout;
        setItems((prev) => {
            const next = [...prev];
            next[idx] = { x, w: width };
            return next;
        });
    };

    // อัปเดตตำแหน่ง indicator เมื่อ index เปลี่ยนหรือเมื่อวัด layout เสร็จ
    React.useEffect(() => {
        const i = state.index;
        const has = items[i] && items[i].w > 0;
        if (!has) return;
        const { x, w } = items[i];
        const pad = 10; // ช่องว่างซ้ายขวาของเม็ดยา
        Animated.spring(indicatorX, { toValue: x + pad / 2, useNativeDriver: false, friction: 7 }).start();
        Animated.spring(indicatorW, { toValue: Math.max(44, w - pad), useNativeDriver: false, friction: 7 }).start();
    }, [state.index, items]); // eslint-disable-line react-hooks/exhaustive-deps

    const Wrapper = useMemo(() => (BlurView !== View ? BlurView : View), []);

    return (
        <View
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                paddingHorizontal: 12,
                paddingBottom: Math.max(insets.bottom, 10),
                paddingTop: 8,
                backgroundColor: "transparent",
            }}
            pointerEvents="box-none"
        >
            <Wrapper
                {...(BlurView !== View ? { intensity: 40, tint: "light" } : {})}
                style={[
                    {
                        borderRadius: 20,
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: COLOR.glassBorder,
                        backgroundColor: BlurView === View ? COLOR.glass : "transparent",
                    },
                    shadow(10),
                ]}
            >
                {/* กล่องปุ่ม */}
                <View style={{ paddingVertical: 10, paddingHorizontal: 8 }}>
                    {/* Active indicator pill */}
                    <Animated.View
                        pointerEvents="none"
                        style={{
                            position: "absolute",
                            top: 8,
                            bottom: 8,
                            transform: [{ translateX: indicatorX }],
                            width: indicatorW,
                            borderRadius: 14,
                            backgroundColor: "rgba(255,255,255,0.9)",
                            // เงาเบาให้เม็ดยาดูยก:
                            ...(Platform.OS === "ios"
                                ? { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }
                                : { elevation: 2 }),
                        }}
                    />

                    <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                        {state.routes.map((route, index) => {
                            const isFocused = state.index === index;
                            const { options } = descriptors[route.key];
                            const label = (options.tabBarLabel ?? options.title ?? route.name) as string;
                            const iconName = ICON_MAP[route.name] ?? "ellipse-outline";
                            const badge = options.tabBarBadge as number | string | undefined;

                            const onPress = () => {
                                const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
                                if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name as never);
                            };

                            const onLongPress = () => navigation.emit({ type: "tabLongPress", target: route.key });

                            return (
                                <TouchableOpacity
                                    key={route.key}
                                    onPress={onPress}
                                    onLongPress={onLongPress}
                                    onLayout={onItemLayout(index)}
                                    activeOpacity={0.9}
                                    accessibilityRole="tab"
                                    accessibilityState={{ selected: isFocused }}
                                    accessibilityLabel={options.tabBarAccessibilityLabel}
                                    style={{ alignItems: "center", minWidth: 68, paddingVertical: 4, paddingHorizontal: 10 }}
                                    hitSlop={{ top: 6, bottom: 6, left: 8, right: 8 }}
                                >
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <Ionicons
                                            name={iconName}
                                            size={22}
                                            color={isFocused ? COLOR.active : COLOR.inactive}
                                        />
                                        {badge != null && (
                                            <View
                                                style={{
                                                    position: "absolute",
                                                    top: -6,
                                                    right: -12,
                                                    minWidth: 16,
                                                    height: 16,
                                                    paddingHorizontal: 3,
                                                    borderRadius: 8,
                                                    backgroundColor: "#ef4444",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Text style={{ color: "white", fontSize: 10, fontWeight: "800" }}>
                                                    {String(badge)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            marginTop: 4,
                                            fontSize: 12,
                                            fontWeight: "600",
                                            color: isFocused ? COLOR.active : COLOR.inactive,
                                        }}
                                    >
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </Wrapper>
        </View>
    );
}
