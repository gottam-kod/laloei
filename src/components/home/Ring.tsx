import React from 'react';
import Svg, { Circle } from 'react-native-svg';

type Props = { size?: number; stroke?: number; value?: number; color: string; track?: string };
export default function Ring({ size=64, stroke=8, value=0, color, track='#E9EEF5' }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value ?? 0));
  const offset = c - (v / 100) * c;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <Circle
        cx={size/2} cy={size/2} r={r}
        stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none"
        strokeDasharray={`${c} ${c}`} strokeDashoffset={offset}
        rotation="-90" origin={`${size/2}, ${size/2}`}
      />
    </Svg>
  );
}
