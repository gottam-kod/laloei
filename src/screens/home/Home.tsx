// app/home.tsx  (Expo / React Native)
// สวยสุดโทนฟ้า-สว่าง + glass + เน้นอ่านง่าย + รองรับกดทุกปุ่มด้วย props

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ProfileHeader from "@/src/components/ProfileHeader";
import { COLOR as THEME } from "@/src/theme/theme"; // ถ้าไม่มี ให้แทนด้วยพาเล็ตด้านล่าง
import QuickAction from "@/src/components/QuickAction";
import { useAuthStore } from "@/src/store/useAuthStore";

// fallback palette (ใช้ถ้าไม่มี THEME)
const COLOR = {
  ...{
    primary: "#39c0f6",
    primary2: "#7fd7ff",
    text: "#0f172a",
    textDim: "#475569",
    border: "#e2e8f0",
    glass: "rgba(255,255,255,0.75)",
    glass2: "rgba(255,255,255,0.6)",
  },
  ...(THEME || {}),
};

type HomeProps = {
  onRequestLeave?: () => void;
  onOpenHistory?: () => void;
  onViewTeam?: () => void;
  onViewLeaveSummary?: () => void;
  onViewHRNews?: () => void;
  onOpenApprovals?: () => void;
  onOpenProfile?: () => void;
  onOpenHome?: () => void;
  onOpenTeam?: () => void;
  onOpenSummary?: () => void;
};

const Home: React.FC<HomeProps> = ({ onRequestLeave, onOpenHistory, onViewTeam, onViewLeaveSummary, onViewHRNews, onOpenTeam, onOpenSummary }) => {
  const profile = useAuthStore(s => s.profile);
  console.log("Home profile=", profile);
  return (
    <LinearGradient
      colors={["#bfe6ff", "#eaf7ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Header โปรไฟล์สุดพรีเมียม */}
      <ProfileHeader
        name={profile?.name || "ชื่อพนักงาน"}
        position={profile?.position || "เจ้าหน้าที่ HR"}
        company={profile?.orgs[0]?.name || "บริษัท ABC จำกัด"}
        avatarUri={profile?.avatarUri || "https://i.pravatar.cc/120?img=5"}
        notificationCount={profile?.notificationCount || 1}
        onNotiPress={() => console.log("เปิดกล่องแจ้งเตือน")}
      />
{/* /Users/yotap/project/leaveApp/src/laloei/src */}
      {/* เนื้อหา */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 28, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions — วงกลม glass พร้อมเงาเบา */}
        <Glass
          style={{
            paddingVertical: 14,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              gap: 8,
            }}
          >
            <QuickAction
              icon="time-outline"
              label="ประวัติการลา"
              onPress={onOpenHistory}
              // disabled={!props.onOpenHistory}
            />
            <QuickAction
              icon="add-circle-outline"
              label="จองบันทึกลา"
              onPress={onRequestLeave}
              // disabled={!props.onRequestLeave}
            />
            <QuickAction
              icon="people-outline"
              label="ทีมงาน"
              onPress={onViewTeam ?? onOpenTeam}
              // disabled={!props.onViewTeam && !props.onOpenTeam}
            />
            <QuickAction
              icon="stats-chart-outline"
              label="สรุปวันลา"
              onPress={onViewLeaveSummary ?? onOpenSummary}
              // disabled={!props.onViewLeaveSummary && !props.onOpenSummary}
            />
          </View>
        </Glass>

        {/* Leave Balance */}
        <Glass>
          <SectionTitle>เหลือวันลากำหนด</SectionTitle>
          <Row label="ลาพักผ่อน" value="8 วัน" />
          <Divider />
          <Row label="ลากิจ" value="6 วัน" />
          <Divider />
          <Row label="ลาป่วย" value="5 วัน" />
        </Glass>

        {/* HR News */}
        <Glass pressable onPress={onViewHRNews}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconBubble name="newspaper-outline" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text
                style={{ fontWeight: "800", color: COLOR.text, marginBottom: 4 }}
              >
                ข่าวสาร HR
              </Text>
              <Text style={{ color: COLOR.textDim }} numberOfLines={2}>
                อัปเดตกฎการลาพักร้อนและคู่มือความปลอดภัยใหม่ กรุณาตรวจสอบรายละเอียด
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </View>
        </Glass>
      </ScrollView>
    </LinearGradient>
  );
}

/* ---------- UI Helpers (พิถีพิถันเรื่องเงา/ขอบ/กด) ---------- */

const Glass: React.FC<
  React.PropsWithChildren<{ style?: any; pressable?: boolean; onPress?: () => void }>
> = ({ children, style, pressable, onPress }) => {
  const base = (
    <View
      style={[
        {
          backgroundColor: COLOR.glass,
          borderRadius: 20,
          padding: 16,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.65)",
          ...shadow(8),
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!pressable) return base;
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#00000010", borderless: false }}
      style={{ borderRadius: 20 }}
    >
      {base}
    </Pressable>
  );
};

const SectionTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Text style={{ fontWeight: "900", color: COLOR.text, marginBottom: 8 }}>{children}</Text>
);

const Divider = () => (
  <View
    style={{
      height: 1,
      backgroundColor: COLOR.border,
      opacity: 0.8,
      marginVertical: 6,
    }}
  />
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    <Text style={{ color: COLOR.text }}>{label}</Text>
    <Text style={{ color: COLOR.text, fontWeight: "800" }}>{value}</Text>
  </View>
);

function TabItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ alignItems: "center", minWidth: 64 }}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!active }}
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={22} color={active ? "#0ea5e9" : "#64748b"} />
      <Text style={{ fontSize: 12, color: active ? "#0ea5e9" : "#64748b" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/** เงาแบบ cross-platform ละมุน */
function shadow(radius = 8) {
  return Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: Math.ceil(radius / 2) },
    },
    android: { elevation: Math.ceil(radius / 2) },
    default: {},
  }) as any;
}

// Simple IconBubble component for displaying an icon in a circular background
const IconBubble = ({
  name,
  size = 24,
  color = "#0ea5e9",
  backgroundColor = "#e0f2fe",
}: {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
}) => (
  <View
    style={{
      width: size + 16,
      height: size + 16,
      borderRadius: (size + 16) / 2,
      backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 4,
    }}
  >
    <Ionicons name={name} size={size} color={color} />
  </View>
);

export default Home;
