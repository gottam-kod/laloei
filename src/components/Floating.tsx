import { StyleSheet, View, ViewStyle } from "react-native";
import { UI } from "../theme/token";

const Floating = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
    <View style={[S.float, style]}>
        {/* top highlight hairline */}
        {/* <View style={S.floatTopHL} /> */}
        {children}
    </View>
);

export default Floating;

const S = StyleSheet.create({
    /* Floating base (card wrapper) */
    float: {
        backgroundColor: 'rgba(247, 248, 250, 0.46)',
        borderRadius: UI.radius.xl,
        padding: UI.space.lg,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.65)',
        shadowColor: '#0f172a', shadowOpacity: 0.08, shadowRadius: 12, elevation: 2,
        position: 'relative',
    },
    floatTopHL: {
        position: 'absolute', left: 0, right: 0, top: 0, height: 1,
        borderTopLeftRadius: UI.radius.xl, borderTopRightRadius: UI.radius.xl,
        backgroundColor: 'rgba(255,255,255,0.9)', opacity: 0.7
    },
});