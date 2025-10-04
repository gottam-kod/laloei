import { memo } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { UI } from "../theme/theme";
import Floating from "./Floating";

type Balance = { label: string; used: number; total: number; grad?: [string, string] };

// BalanceCard
const BalanceCard = memo(function BalanceCard({ variant, items }: { variant: 'modern' | 'premium'; items: Balance[]; }) {
    return (
        <Floating>
            {items.map((x, idx) => {
                const pct = Math.min(100, Math.round((x.used / x.total) * 100));
                return (
                    <View key={x.label} style={[S.barRow, idx === 0 && { marginTop: 0 }]}>
                        <View style={S.barHead}>
                            <Text style={S.barLabel}>{x.label}</Text>
                            <Text style={S.barVal}>{x.total - x.used} left</Text>
                        </View>
                        <View style={S.track}>
                            {variant === 'premium' && x.grad ? (
                                <LinearGradient colors={x.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[S.fill, { width: `${pct}%` }]} />
                            ) : <View style={[S.fill, { width: `${pct}%`, backgroundColor: UI.color.accent }]} />}
                        </View>
                    </View>
                );
            })}
        </Floating>
    );
});


const S = StyleSheet.create({
    /* Balance */
    barRow: { marginTop: UI.space.md },
    barHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    barLabel: { color: UI.color.text, fontWeight: '700' },
    barVal: { color: UI.color.accentDark, fontWeight: '800' },
    track: { height: 10, backgroundColor: UI.color.muted, borderRadius: UI.radius.pill, overflow: 'hidden' },
    fill: { height: '100%', borderRadius: UI.radius.pill },
    

});
export default BalanceCard;


