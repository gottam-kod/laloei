import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLOR as THEME_COLOR } from '../theme/theme';
import { Tone } from '../interface/tone';

const COLOR =
  THEME_COLOR ?? {
    brand: '#1AA6B7',
    ok: '#22C55E',
    warn: '#F59E0B',
    danger: '#EF4444',
    line: '#EEF5F9',
  };

const toneColor = (t: Tone) =>
  t === 'ok' ? COLOR.ok : t === 'warn' ? COLOR.warn : t === 'danger' ? COLOR.danger : COLOR.brand;

export type ProgressBarProps = {
  value: number;            // 0..100
  tone?: Tone;
  height?: number;          // default 10
  radius?: number;          // default 999
  trackColor?: string;      // default COLOR.line
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  tone = 'brand',
  height = 10,
  radius = 999,
  trackColor = COLOR.line,
}) => {
  const widthPct = Math.min(100, Math.max(0, value));
  return (
    <View style={[styles.track, { height, borderRadius: radius, backgroundColor: trackColor }]}>
      <View style={[styles.fill, { width: `${widthPct}%`, borderRadius: radius, backgroundColor: toneColor(tone) }]} />
    </View>
  );
};

export default memo(ProgressBar);

const styles = StyleSheet.create({
  track: { overflow: 'hidden' },
  fill: { height: '100%' },
});
