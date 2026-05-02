import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { Screen, HeaderBar } from '@/components/ui';
import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';

/**
 * Scan tab — receipt capture flow.
 * Phase 4 replaces the placeholder with a real camera + OCR.
 */
export default function ScanScreen() {
  return (
    <Screen scroll={false}>
      <HeaderBar title="Scan Receipt" showAvatar={false} />

      <View style={styles.cameraPlaceholder}>
        <View style={styles.cameraIconCircle}>
          <Text style={styles.cameraIcon}>📷</Text>
        </View>
        <Text style={styles.cameraTitle}>Capture a receipt</Text>
        <Text style={styles.cameraBody}>
          Point your camera at a paper receipt to digitise your purchases.
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>🖼️</Text>
          <Text style={styles.actionLabel}>Library</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutterButton} activeOpacity={0.7}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>🔦</Text>
          <Text style={styles.actionLabel}>Torch</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: Colors.green[50],
    borderRadius: Radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.green[200],
    borderStyle: 'dashed',
  },
  cameraIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.green[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  cameraIcon: {
    fontSize: 36,
  },
  cameraTitle: {
    ...TypeScale.subheading,
    color: Colors.green[600],
    marginBottom: Spacing.sm,
  },
  cameraBody: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: Colors.green[50],
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.green[200],
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  actionLabel: {
    ...TypeScale.label,
    color: Colors.green[500],
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.green[300],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.green[200],
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.green[400],
  },
});
