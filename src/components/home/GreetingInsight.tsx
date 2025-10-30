import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLOR, FONT } from '../../theme/token';

type Props = { greetTime: string; name: string; insight: string; opacity: Animated.AnimatedInterpolation<number> };
export default function GreetingInsight({ greetTime, name, insight, opacity }: Props) {
  return (
    <Animated.View style={{ gap: 6, opacity }}>
      <Text style={[styles.greet, { fontFamily: FONT.heading }]}>{greetTime}, {name} 👋</Text>
      <View style={styles.insight}>
        <Ionicons name="bulb-outline" size={16} color={COLOR.info} />
        <Text style={[styles.insightText, { fontFamily: FONT.body }]}>{insight}</Text>
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  greet: { fontSize: 24, fontWeight: '900', color: COLOR.text },
  insight: { flexDirection: 'row', alignItems: 'center', columnGap: 6, backgroundColor: COLOR.chip, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
  insightText: { fontSize: 12, fontWeight: '700', color: COLOR.info },
});
