import React, { memo } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

type BackgroundProps = {
  children: React.ReactNode;
  [key: string]: any; // Accept any additional props
};

export const BackgroundFX = memo(
  function BackgroundFX() {
    return (
      <View style={styles.bgFx} pointerEvents="none">
        {/* Base gradient (ฟ้า→เขียวพาสเทล) */}
        <LinearGradient
          colors={['#058af0ff', '#65daf1ff']}
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

        <View style={{ position: 'absolute' }}>
        
          <LinearGradient
            colors={[ '#f1f3f5ff', '#65daf142']}
            start={{ x: 0, y: 0.1 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.spot,
              {
                top: 200,
                left: 200,
                width: 400,
                height: 400,
                // backgroundColor: '#2d7368ff',
                // Gradient
                opacity: 0.85,
              },
            ]}
          />
        </View>

        {/* Bottom arc (ม่วงอ่อน) */}
        <View
          style={[
            styles.spot,
            {
              bottom: -250,
              left: -150,
              width: 400,
              height: 400,
              backgroundColor: '#068bf124',
              opacity: 0.9,
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