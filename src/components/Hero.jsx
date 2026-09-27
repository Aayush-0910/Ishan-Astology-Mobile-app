import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { spacing } from '../theme';

/** Page-top hero band with the soft gold glow from the website's `.hero-glow`. */
export default function Hero({ children, compact = false }) {
  return (
    <View style={[styles.hero, compact && styles.compact]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="30%" r="60%">
              <Stop offset="0" stopColor="#C8A046" stopOpacity="0.16" />
              <Stop offset="1" stopColor="#C8A046" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow)" />
        </Svg>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.gutter,
    paddingTop: 40,
    paddingBottom: 44,
  },
  compact: { paddingTop: 32, paddingBottom: 32 },
});
