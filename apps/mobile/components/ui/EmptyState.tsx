/**
 * <EmptyState> — centered placeholder with the R logo icon, title, and body.
 *
 * Used on History, My World, etc. when there's no data yet.
 */

import React from 'react';
import { StyleSheet, Text, View, type ViewStyle, type StyleProp } from 'react-native';

import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';

interface EmptyStateProps {
  /** Heading text */
  title: string;
  /** Descriptive body text */
  body: string;
  /** Optional custom icon (defaults to the R logo) */
  icon?: React.ReactNode;
  /** Optional action button below the text */
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({ title, body, icon, action, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {icon ?? (
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>R</Text>
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 80,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: Radii.lg,
    backgroundColor: Colors.green[50],
    borderWidth: 2,
    borderColor: Colors.green[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.green[300],
  },
  title: {
    ...TypeScale.subheading,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  body: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  action: {
    marginTop: Spacing.xl,
  },
});
