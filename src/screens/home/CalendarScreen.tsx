// screens/CalendarScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BackgroundFX } from "../../components/Background";
import { COLOR } from "../../theme/token";
import { useTranslation } from "react-i18next";
import { ThaiLocale } from "@/src/utails/calendar-locale";


/* ====== Mock Data (แทนด้วย API จริงได้) ====== */
type LeaveType = "AL" | "SL" | "CL" | "UL";
type LeaveItem = {
  id: string;
  type: LeaveType;
  start_date: string;
  end_date: string;
  title?: string;
  status?: "pending" | "approved" | "rejected";
};
const LEAVES: LeaveItem[] = [
  { id: "1", type: "AL", start_date: "2025-10-03", end_date: "2025-10-03", title: "ลาพักร้อน 1 วัน", status: "approved" },
  { id: "2", type: "SL", start_date: "2025-10-08", end_date: "2025-10-10", title: "ลาป่วย", status: "pending" },
  { id: "3", type: "CL", start_date: "2025-10-18", end_date: "2025-10-18", title: "ลากิจ", status: "approved" },
  { id: "4", type: "UL", start_date: "2025-10-24", end_date: "2025-10-25", title: "ลาไม่รับค่าจ้าง", status: "rejected" },
];

/* ====== สีของประเภทลา / สถานะ ====== */
const LEAVE_COLORS: Record<LeaveType, string> = {
  AL: "#10B981", SL: "#F59E0B", CL: "#6366F1", UL: "#EF4444",
};
const STATUS_COLORS: Record<NonNullable<LeaveItem["status"]>, string> = {
  approved: "#10B981",
  pending: "#F59E0B",
  rejected: "#EF4444",
};

/* ====== Helper ====== */
type MarkedDates = Record<string, {
  marked?: boolean;
  dots?: { key: string; color: string }[];
  selected?: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
}>;

const addDays = (iso: string, n: number) => {
  const d = new Date(iso); d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const eachDay = (startISO: string, endISO: string) => {
  const out: string[] = []; let cur = startISO;
  while (cur <= endISO) { out.push(cur); cur = addDays(cur, 1); }
  return out;
};
function buildMarkedDates(leaves: LeaveItem[], selected?: string): MarkedDates {
  const md: MarkedDates = {};
  for (const lv of leaves) {
    const dot = { key: lv.type, color: LEAVE_COLORS[lv.type] };
    for (const iso of eachDay(lv.start_date, lv.end_date)) {
      if (!md[iso]) md[iso] = { dots: [] };
      const dots = (md[iso] as any).dots as { key: string; color: string }[];
      if (!dots.find(d => d.key === dot.key)) dots.push(dot);
      (md[iso] as any).marked = true;
    }
  }
  if (selected) {
    md[selected] = {
      ...(md[selected] || {}),
      selected: true,
      selectedColor: COLOR.primary,
      selectedTextColor: "#fff",
    };
  }
  return md;
}
function groupByDate(leaves: LeaveItem[]) {
  const map = new Map<string, LeaveItem[]>();
  for (const lv of leaves) {
    for (const iso of eachDay(lv.start_date, lv.end_date)) {
      if (!map.has(iso)) map.set(iso, []);
      map.get(iso)!.push(lv);
    }
  }
  return map;
}

function LegendChip({ color, label }: { color: string; label: string }) {
  return (
    <View style={S.legendChip}>
      <View style={[S.swatch, { backgroundColor: color }]} />
      <Text style={S.legendText}>{label}</Text>
    </View>
  );
}

/* ====== Component ====== */
export default function CalendarScreen() {
  // switch to th locale th/en
  const { t, i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || '').startsWith('th') ? 'th' : 'en';
  if (current === 'th') {
    LocaleConfig.locales["th"] = ThaiLocale;
  }
  LocaleConfig.defaultLocale = current;

  const nav = useNavigation<any>();
  const [selected, setSelected] = useState<string | undefined>();
  const dayMap = useMemo(() => groupByDate(LEAVES), []);
  const marked = useMemo(() => buildMarkedDates(LEAVES, selected), [selected]);
  const items = selected ? dayMap.get(selected) || [] : [];

  const onDayPress = (day: any) => setSelected(day.dateString);

  return (
    <LinearGradient colors={[COLOR.bgTopA, COLOR.bgTopB]} style={{ flex: 1 }}>
      <BackgroundFX />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={S.header}>
          <TouchableOpacity style={S.iconBtn} onPress={() => nav.goBack()}>
            <Ionicons name="chevron-back" size={22} color={COLOR.text} />
          </TouchableOpacity>
          <Text style={S.title}>{t("calendar.title")}</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Calendar */}
        <View style={S.calendarWrap}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={marked}
            markingType="multi-dot"
            theme={{
              backgroundColor: "transparent",
              calendarBackground: "transparent",
              textSectionTitleColor: COLOR.sub,
              todayTextColor: COLOR.primary,
              dayTextColor: COLOR.text,
              arrowColor: COLOR.primary,
              monthTextColor: COLOR.text,
              textMonthFontWeight: "700",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 13,
            }}
            firstDay={1}
          />

          <View style={S.colorDesc}>
            <LegendChip color={LEAVE_COLORS.AL} label="ลาพักร้อน" />
            <Text style={S.sep}> | </Text>
            <LegendChip color={LEAVE_COLORS.SL} label="ลาป่วย" />
            <Text style={S.sep}> | </Text>
            <LegendChip color={LEAVE_COLORS.CL} label="ลากิจ" />
            <Text style={S.sep}> | </Text>
            <LegendChip color={LEAVE_COLORS.UL} label="ลาไม่รับค่าจ้าง" />
          </View>
        </View>

        {/* Detail card */}
        <View style={S.detailCard}>
          {!selected ? (
            <Text style={S.detailHint}>{t("calendar.eventDetails")}</Text>
          ) : items.length === 0 ? (
            <View style={S.empty}>
              <Text style={S.emptyTitle}>{t("calendar.noLeaveRequests", { month: selected })}</Text>
              <TouchableOpacity
                style={S.emptyBtn}
                onPress={() => nav.navigate("LeaveRequestScreen", {
                  preset: { start_date: selected, end_date: selected },
                })}
              >
                <Text style={S.emptyBtnText}>{t("calendar.requestLeave")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            items.map((lv) => (
              <View key={lv.id} style={S.rowItem}>
                <View style={[S.typeBar, { backgroundColor: LEAVE_COLORS[lv.type] }]} />
                <View style={{ flex: 1 }}>
                  <Text style={S.rowTitle}>{lv.title}</Text>
                  <Text style={S.rowSub}>
                    {lv.start_date === lv.end_date
                      ? lv.start_date
                      : `${lv.start_date} – ${lv.end_date}`}
                  </Text>
                </View>
                {/* Description color */}
                <View style={S.statusBox}>
                  <Text
                    style={[
                      S.statusText,
                      { color: STATUS_COLORS[lv.status || "pending"] },
                    ]}
                  >
                    {lv.status === "approved"
                      ? t("status.APPROVED")
                      : lv.status === "rejected"
                        ? t("status.REJECTED")
                        : t("status.PENDING")}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Floating Add Button */}
        {/* <TouchableOpacity
          style={S.fab}
          onPress={() => nav.navigate("LeaveRequestScreen")}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={S.fabText}>ขอลา</Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    </LinearGradient>
  );
}

/* ====== Styles ====== */
const S = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFFAA",
  },
  title: { fontSize: 20, fontWeight: "800", color: COLOR.text },

  calendarWrap: {
    borderRadius: 16,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 8,
    padding: 8,
    elevation: 2,
  },

  detailCard: {
    marginTop: 10,
    marginHorizontal: 16,
    marginBottom: 76,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR.line,
    padding: 12,
  },
  detailHint: { color: COLOR.sub, textAlign: "center" },
  empty: { alignItems: "center", gap: 8 },
  emptyTitle: { color: COLOR.text, fontWeight: "700" },
  emptyBtn: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginTop: 4,
  },
  emptyBtnText: { color: "#fff", fontWeight: "800" },

  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.line,
  },
  typeBar: { width: 8, height: 36, borderRadius: 4 },
  rowTitle: { color: COLOR.text, fontWeight: "800" },
  rowSub: { color: COLOR.sub, fontSize: 12 },

  statusBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
  },
  statusText: { fontSize: 12, fontWeight: "700" },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLOR.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  fabText: { color: "#fff", fontWeight: "800" },
  colorDesc: {
    marginTop: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  colorDescLabel: {
    fontWeight: "800",
    color: COLOR.text,
    marginRight: 6,
  },
  sep: { color: COLOR.sub, marginHorizontal: 6, fontWeight: "600" },
  legendChip: { flexDirection: "row", alignItems: "center", gap: 6 },
  swatch: { width: 12, height: 12, borderRadius: 6 },
  legendText: { color: COLOR.sub, fontWeight: "700" },
});
