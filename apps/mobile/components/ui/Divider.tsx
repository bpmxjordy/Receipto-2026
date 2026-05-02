/**
 * <Divider> — thin horizontal line.
 */

import React from 'react';
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

interface DividerProps {
  /** Vertical margin (default: Spacing.lg) */
  spacing?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Divider({
  spacing = Spacing.lg,
  color = Colors.border.light,
  style,
}: DividerProps) {
  return (
    <View
      style={[
        styles.line,
        { marginVertical: spacing, backgroundColor: color },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
  },
});
