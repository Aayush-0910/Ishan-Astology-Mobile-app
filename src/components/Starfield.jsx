import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// Small deterministic PRNG so the stars stay put between renders and launches.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Faint gold star specks behind every screen — the app's take on the site's
 * fixed `.bg-sparks` background layer. Purely decorative, never touchable.
 */
export default function Starfield({ count = 70 }) {
  const { width, height } = useWindowDimensions();

  const stars = useMemo(() => {
    const rand = mulberry32(2020);
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      x: rand() * width,
      y: rand() * height,
      r: 0.5 + rand() * 1.1,
      o: 0.25 + rand() * 0.45,
    }));
  }, [count, width, height]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        {stars.map((s) => (
          <Circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill="#E8DDB4" opacity={s.o} />
        ))}
      </Svg>
    </View>
  );
}
