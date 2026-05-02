/**
 * <Tag> — small pill label for categories, filters, status indicators.
 */

import React from 'react';
import { StyleSheet, Text, View, type ViewStyle, type StyleProp } from 'react-native';

import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';

interface TagProps {
  label: string;
  /** Background colour (defaults to green-50) */
  color?: string;
  /** Text colour (defaults to green-600) */
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function Tag({
  label,
  color = Colors.green[50],
  textColor = Colors.green[600],
  style,
}: TagProps) {
  return (
    <View style={[styles.tag, { backgroundColor: color }, style]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
  },
  label: {
    ...TypeScale.caption,
    fontWeight: '600',
  },
});
