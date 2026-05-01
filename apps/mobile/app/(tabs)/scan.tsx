import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, TypeScale, Spacing } from '@/constants/theme';

/**
 * Scan tab — receipt capture flow (Phase 4 builds this out).
 * Placeholder for now.
 */
export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Receipt</Text>

      <View style={styles.cameraPlaceholder}>
        <View style={styles.cameraIcon}>
          <Text style={styles.cameraEmoji}>📷</Text>
        </View>
        <Text style={styles.cameraLabel}>
          Camera will appear here in Phase 4
        </Text>
        <Text style={styles.cameraBody}>
          Point your camera at a paper receipt to capture and categorise your
          purchases.
        </Text>
      </View>

      <View style={styles.optionsRow}>
        <View style={styles.option}>
          <Text style={styles.optionEmoji}>🖼️</Text>
          <Text style={styles.optionLabel}>Library</Text>
        </View>
        <View style={styles.option}>
          <Text style={styles.optionEmoji}>🔦</Text>
          <Text style={styles.optionLabel}>Torch</Text>
        </View>
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
    marginBottom: Spacing.xxl,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: Colors.green[50],
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.green[200],
    borderStyle: 'dashed',
  },
  cameraIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.green[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  cameraEmoji: {
    fontSize: 36,
  },
  cameraLabel: {
    ...TypeScale.label,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  cameraBody: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  option: {
    alignItems: 'center',
    backgroundColor: Colors.green[50],
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.green[200],
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  optionLabel: {
    ...TypeScale.label,
    color: Colors.green[500],
  },
});
