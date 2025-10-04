// components/QuoteFloat.tsx
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated, Easing, LayoutChangeEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function QuoteFloat({
  th = 'ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น',
  en = 'Where there is effort, there is success.',
  speed = 40,         // px/second
  gap = 32,           // ช่องว่างระหว่างข้อความซ้ำ
}: {
  th?: string;
  en?: string;
  speed?: number;
  gap?: number;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [wrapW, setWrapW] = useState(0);
  const [textW, setTextW] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  const onWrap = (e: LayoutChangeEvent) => setWrapW(e.nativeEvent.layout.width);
  const onText = (e: LayoutChangeEvent) => setTextW(e.nativeEvent.layout.width);

  useEffect(() => {
    const needScroll = textW > 0 && wrapW > 0 && textW > wrapW;
    setCanScroll(needScroll);
    if (!needScroll) {
      translateX.stopAnimation();
      translateX.setValue(0);
      return;
    }
    const distance = textW + gap;         // ระยะที่ต้องวิ่งจนพ้น
    const duration = (distance / speed) * 1000;

    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -distance,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // กระโดดกลับมาจุดเริ่ม (ไม่เห็น เพราะมีตัวข้อความสำรองต่อท้าย)
        Animated.timing(translateX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [wrapW, textW, speed, gap, translateX]);

  return (
    <View style={S.wrap} onLayout={onWrap}>
      <View style={S.topHL} />
      <LinearGradient colors={['#FFFFFF', '#F9FCFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={S.inner}>
        {/* Marquee row */}
        <View style={S.marqueeClip}>
          {/* fade edges */}
          <LinearGradient colors={['#F9FCFF', 'transparent']} style={[S.fade, { left: 0 }]} start={{x:0,y:0.5}} end={{x:1,y:0.5}} pointerEvents="none"/>
          <LinearGradient colors={['transparent', '#F9FCFF']} style={[S.fade, { right: 0 }]} start={{x:0,y:0.5}} end={{x:1,y:0.5}} pointerEvents="none"/>

          <Animated.View style={{ flexDirection:'row', transform:[{ translateX }] }}>
            {/* ชุดที่ 1 (วัดความกว้าง) */}
            <Text style={S.th} numberOfLines={1} onLayout={onText}>
              “{th}”
            </Text>
            {/* ช่องว่าง */}
            <View style={{ width: gap }} />
            {/* ชุดที่ 2 (สำรองต่อท้าย) */}
            {canScroll && (
              <>
                <Text style={S.th} numberOfLines={1}>“{th}”</Text>
                <View style={{ width: gap }} />
              </>
            )}
          </Animated.View>
        </View>

        {/* English subtitle (อยู่นิ่ง) */}
        <Text style={S.en} numberOfLines={1}>{en}</Text>
      </LinearGradient>
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    shadowColor: '#0f172a',
    shadowOpacity: Platform.OS === 'ios' ? 0.10 : 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  topHL: { position:'absolute', left:0, right:0, top:0, height:1, backgroundColor:'rgba(255,255,255,0.9)', zIndex:1 },
  inner: { padding:16, borderRadius:20, gap:6 },

  marqueeClip: { height: 24, overflow: 'hidden', position:'relative' },
  fade: { position:'absolute', top:0, bottom:0, width:24, zIndex:10 },

  th: { color:'#0F172A', fontSize:16, fontWeight:'900' },
  en: { color:'#6B7A90', fontSize:12, fontWeight:'600' },
});
