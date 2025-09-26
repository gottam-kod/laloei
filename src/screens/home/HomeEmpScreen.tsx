// app/home.tsx (Expo Router)
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ICONS = [
  { name: "call-outline", label: "ประวัติการลา", route: "/history" },
  { name: "add-circle-outline", label: "จองบันทึกลา", route: "/request" },
  { name: "people-outline", label: "ทีมงาน", route: "/team" },
  { name: "stats-chart-outline", label: "สรุปวันลา", route: "/summary" },
];

export default function Home() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#7fd7ff", "#e6f7ff"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <Text style={{ fontSize: 32, fontWeight: "800", color: "white", marginBottom: 20, textAlign: "center" }}>
          Laloei
        </Text>

        {/* Shortcut buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: 20,
            padding: 12,
            marginBottom: 20,
          }}
        >
          {ICONS.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => router.push({ pathname: item.route as any })}
              style={{ flex: 1, alignItems: "center" }}
            >
              <Ionicons name={item.name as any} size={28} color="#334155" />
              <Text style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leave balance card */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: 20,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>เหลือวันลาทั้งหมด</Text>
          {[
            { type: "ลาพักผ่อน", days: 8 },
            { type: "ลากิจ", days: 6 },
            { type: "ลาป่วย", days: 5 },
          ].map((row, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text>{row.type}</Text>
              <Text style={{ fontWeight: "600" }}>{row.days} วัน</Text>
            </View>
          ))}
        </View>

        {/* HR News */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: 20,
            padding: 16,
          }}
        >
          <Text style={{ fontWeight: "700", marginBottom: 4 }}>ข่าวสาร HR</Text>
          <Text style={{ color: "#475569" }}>
            กบข. ลางานกรรมนออบิเนน และอีลี นะลัดกรนบนอับเบล
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Tab Mock (placeholder) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 12,
          borderTopWidth: 0.5,
          borderColor: "#cbd5e1",
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        {["หน้าหลัก", "อนุมัติ", "การลางอนุมัติ", "โปรไฟล์"].map((label, idx) => (
          <TouchableOpacity key={idx} style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: idx === 0 ? "#0ea5e9" : "#64748b" }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}
