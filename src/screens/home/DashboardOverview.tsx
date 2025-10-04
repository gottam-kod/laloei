import { BackgroundFX } from '@/src/components/Background';
import { HeaderBar } from '@/src/components/HeaderProfile';
import { MainTabParamList } from '@/src/navigation/RootStackParamList';
import { UI } from '@/src/theme/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

type Role = 'owner' | 'manager';

type Props = {
    role?: Role;
    userName?: string;
    orgName?: string;
    // ถ้ามีข้อมูลจริง ยิงเข้ามาแทน mock ด้านล่างได้เลย
    monthlyUsedDays?: { monthLabel: string; used: number }[];
    leaveBreakdown?: { name: 'พักร้อน' | 'ลาป่วย' | 'ลากิจ'; value: number }[];
    totalThisMonth?: number;
    totalSummary?: number;
    mostLeaveDateLabel?: string;
};

const C = {
    bg: '#F5F8FB',
    card: '#FFFFFF',
    line: '#E8EEF6',
    text: '#0F172A',
    sub: '#6B7A90',
    brand: '#29C5BD',
    blue: '#3B82F6',
    orange: '#F59E0B',
    green: '#10B981',
    chipBg: '#EEF4FB',
};


export default function DashboardOverview({
    role = 'owner',
    userName = 'Marisa',
    orgName = 'บริษัท A',
    monthlyUsedDays,
    leaveBreakdown,
    totalThisMonth,
    totalSummary,
    mostLeaveDateLabel,
}: Props) {
    const nav = useNavigation<NativeStackNavigationProp<MainTabParamList>>();

    const [period, setPeriod] = useState<'รายวัน' | 'รายเดือน' | 'รายปี'>('รายเดือน');

    // ===== Mock เมื่อยังไม่มีข้อมูลจริง =====
    const fallbackBreakdown = [
        { name: 'พักร้อน' as const, value: 12.5, color: C.green },
        { name: 'ลาป่วย' as const, value: 8.0, color: C.blue },
        { name: 'ลากิจ' as const, value: 4.5, color: C.orange },
    ];
    const fallbackTrend = [
        { monthLabel: 'ต.ค.', used: 6 },
        { monthLabel: 'พ.ย.', used: 8 },
        { monthLabel: 'ธ.ค.', used: 10 },
        { monthLabel: 'ม.ค.', used: 12 },
        { monthLabel: 'ก.พ.', used: 16 },
        { monthLabel: 'มี.ค.', used: 24 },
    ];

    const breakdown = useMemo(() => {
        const raw = leaveBreakdown ?? fallbackBreakdown;
        // map -> PieChart format
        return raw.map((d, idx) => ({
            name: d.name,
            population: d.value,
            color: (d as any).color ?? [C.green, C.blue, C.orange][idx % 3],
            legendFontColor: C.sub,
            legendFontSize: 12,
        }));
    }, [leaveBreakdown]);

    const trend = useMemo(() => monthlyUsedDays ?? fallbackTrend, [monthlyUsedDays]);

    const totalThis = totalThisMonth ?? breakdown.reduce((s, d: any) => s + d.population, 0);
    const summaryAll = totalSummary ?? 75;
    const mostDate = mostLeaveDateLabel ?? '30 มี.ค.';

    return (
        <SafeAreaView style={S.root}>
            <BackgroundFX />
            {/* Header */}
            <HeaderBar
                    avatar={'xxx'}
                    name={userName}
                    role={'admin'}
                    onPressBell={() => {
                        // logic ที่อยากให้ทำเวลา user กดกระดิ่ง
                        nav.navigate('Notifications' as any);   // หรือ rootNav.navigate('MainTabs', { screen:'Notifications' })
                    }}
                    />

            <View style={[S.periodRow, { marginBottom: 12 }]}>
                {(['รายวัน', 'รายเดือน', 'รายปี'] as const).map(p => (
                    <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={[S.chip, period === p && S.chipActive]}>
                        <Text style={[S.chipTxt, period === p && S.chipTxtActive]}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={S.wrap} showsVerticalScrollIndicator={false}>

                {/* Card: Breakdown + Total */}
                <View style={S.card}>
                    <View style={S.cardHeader}>
                        <Text style={S.cardTitle}>สถิติการลา</Text>
                        <View style={S.totalBadge}>
                            <Text style={S.totalNum}>{totalThis}</Text>
                            <Text style={S.totalSub}>รวมวันลา{period === 'รายเดือน' ? 'เดือนนี้' : ''}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        {/* Pie */}
                        <PieChart
                            data={breakdown}
                            width={(width - 32) * 0.48}
                            height={180}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="40"
                            chartConfig={chartConfig}
                            hasLegend={false}
                            center={[0, 0]}
                        />

                        {/* Legend */}
                        <View style={{ flex: 1, paddingLeft: 40, justifyContent: 'center', gap: 10 }}>
                            {breakdown.map((d: any) => (
                                <View key={d.name} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: d.color }} />
                                        <Text style={S.legendTxt}>{d.name}</Text>
                                    </View>
                                    <Text style={S.legendVal}>{d.population}</Text>
                                </View>
                            ))}
                        </View>

                    </View>

                </View>

                {/* Card: Trend */}
                <View style={S.card}>
                    <Text style={S.cardTitle}>แนวโน้มการลา</Text>
                    <LineChart
                        width={width - 32}
                        height={200}
                        data={{
                            labels: trend.map(t => t.monthLabel),
                            datasets: [{ data: trend.map(t => t.used) }]
                        }}
                        chartConfig={chartConfig}
                        withVerticalLines={false}
                        withHorizontalLines
                        bezier
                        style={{ borderRadius: 12, marginTop: 8 }}
                        fromZero
                        segments={4}
                    />
                </View>

                {/* Two small cards */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={[S.card, { flex: 1 }]}>
                        <Text style={S.cardTitle}>สรุป</Text>
                        <Text style={S.bigNum}>{summaryAll}</Text>
                        <Text style={S.meta}>รวมวันลา</Text>
                    </View>
                    <View style={[S.card, { flex: 1 }]}>
                        <Text style={S.cardTitle}>ลาที่เยอะที่สุด</Text>
                        <Text style={S.bigNum}>{mostDate}</Text>
                        <Text style={S.meta}>วันยอดสูงสุด</Text>
                    </View>
                </View>

                {/* Role-specific mini insight */}
                <View style={[S.card, { marginTop: 12 }]}>
                    <Text style={S.cardTitle}>{role === 'owner' ? 'ภาพรวมองค์กร' : 'ภาพรวมทีม'}</Text>
                    <Text style={S.note}>
                        {role === 'owner'
                            ? 'เดือนนี้ทีมที่ลามากที่สุด: ฝ่ายพัฒนา (12 วัน) · สัดส่วนลาป่วยสูงขึ้น 8% จากเดือนก่อน'
                            : 'ทีมของคุณลารวม 25 วัน · ลาป่วยคิดเป็น 32% ของทั้งหมด'}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (o = 1) => `rgba(41,197,189,${o})`,
    labelColor: () => '#6B7A90',
    propsForDots: { r: '3' },
    propsForBackgroundLines: { strokeDasharray: '', stroke: '#E8EEF6' },
};

const S = StyleSheet.create({
    root: { flex: 1, backgroundColor: UI.color.bg },
    wrap: { paddingHorizontal: UI.space.lg, paddingTop: UI.space.sm, gap: UI.space.lg },

    header: { marginBottom: 12 },
    hName: { color: C.text, fontSize: 18, fontWeight: '900' },
    hBadge: { backgroundColor: '#E6F7F5', color: C.brand, fontSize: 12, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, overflow: 'hidden' },
    hSub: { color: C.sub, marginTop: 4 },

    periodRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    chip: { backgroundColor: C.chipBg, paddingHorizontal: 12, height: 30, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
    chipActive: { backgroundColor: '#DDF7F5', borderWidth: 1, borderColor: '#C7EEEB' },
    chipTxt: { color: C.sub, fontWeight: '700', fontSize: 12 },
    chipTxtActive: { color: C.brand },

    card: { backgroundColor: C.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.line, marginBottom: 12 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    cardTitle: { color: C.text, fontWeight: '900' },
    totalBadge: { alignItems: 'flex-start' },
    totalNum: { color: C.text, fontWeight: '900', fontSize: 22, lineHeight: 24 },
    totalSub: { color: C.sub, fontSize: 12 },

    legendTxt: { color: C.text, fontWeight: '700' },
    legendVal: { color: C.sub, fontWeight: '800' },

    bigNum: { fontSize: 22, fontWeight: '900', color: C.text, marginTop: 6 },
    meta: { color: C.sub, marginTop: 2 },
    note: { color: C.sub, marginTop: 6, lineHeight: 18 },
});
