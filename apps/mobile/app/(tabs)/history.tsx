import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, TypeScale, Spacing } from '@/constants/theme';

/**
 * History tab — list of past receipts (Phase 6 will build this out).
 */
export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipts</Text>
      <Text style={styles.label}>Latest Receipt</Text>

      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>R</Text>
        </View>
        <Text style={styles.emptyTitle}>No receipts yet</Text>
        <Text style={styles.emptyBody}>
          Tap the Scan tab to capture your first receipt.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
  },
  title: {
    ...TypeScale.heading,
    color: Colors.green[600],
    marginBottom: Spacing.lg,
  },
  label: {
    ...TypeScale.label,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: Colors.green[50],
    borderWidth: 2,
    borderColor: Colors.green[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyIconText: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.green[300],
  },
  emptyTitle: {
    ...TypeScale.subheading,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyBody: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
  },
});
