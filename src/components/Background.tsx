import React, { memo } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';




type BackgroundProps = {
  children: React.ReactNode;
  [key: string]: any; // Accept any additional props
};

export const BackgroundFX = memo(function BackgroundFX() {
  return (
    <View style={styles.bgFx} pointerEvents="none">
      {/* Base gradient (ฟ้า→เขียวพาสเทล) */}
      <LinearGradient
        colors={['#EAF6FF', '#F9FEFF']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Top-left arc (ฟ้าสด) */}
      <View
        style={[
          styles.spot,
          {
            top: -160,
            left: -100,
            width: 360,
            height: 360,
            backgroundColor: '#B8E9FF',
            opacity: 0.8,
          },
        ]}
      />

      {/* Top-right arc (มิ้นต์พาสเทล) */}
      <View
        style={[
          styles.spot,
          {
            top: 120,
            right: -60,
            width: 340,
            height: 340,
            backgroundColor: '#CFF7F1',
            opacity: 0.85,
          },
        ]}
      />

      {/* Bottom arc (ม่วงอ่อน) */}
      <View
        style={[
          styles.spot,
          {
            bottom: -160,
            left: 30,
            width: 400,
            height: 400,
            backgroundColor: '#E9E6FF',
            opacity: 0.9,
          },
        ]}
      />

      {/* Extra faint aura */}
      <View
        style={[
          styles.spot,
          {
            top: 280,
            left: -140,
            width: 500,
            height: 500,
            backgroundColor: '#D8FFF8',
            opacity: 0.5,
          },
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  bgFx: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  spot: {
    position: 'absolute',
    borderRadius: 999,
    // Blur สำหรับ web เท่านั้น
    filter: Platform.OS === 'web' ? ('blur(80px)') as any : undefined,
  },
});