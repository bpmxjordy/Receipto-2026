/**
 * <Card> — green-tinted card matching the deck's rounded card style.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

import { Colors, Spacing, Radii } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  /** Override the default padding */
  padding?: number;
  /** Render without the green tint (white card) */
  plain?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  padding = Spacing.xl,
  plain = false,
  style,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          padding,
          backgroundColor: plain ? Colors.bg.primary : Colors.green[50],
          borderColor: plain ? Colors.border.light : Colors.green[200],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.lg,
    borderWidth: 1,
  },
});
