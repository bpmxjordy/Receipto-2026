import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, TypeScale, Spacing } from '@/constants/theme';

/**
 * Home tab — "Your week" summary card (Phase 7 will fill this in).
 * For now, a branded placeholder.
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Receipto</Text>
        <Text style={styles.subtitle}>Track your receipts. Know your impact.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Week</Text>
        <Text style={styles.cardBody}>
          Capture your first receipt to start tracking your spending and CO₂
          footprint.
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>—</Text>
            <Text style={styles.statLabel}>Receipts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>—</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>—</Text>
            <Text style={styles.statLabel}>CO₂</Text>
          </View>
        </View>
      </View>

      <View style={styles.logoContainer}>
        <View style={styles.logoBg}>
          <Text style={styles.logoText}>R</Text>
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
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    ...TypeScale.heading,
    color: Colors.green[600],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...TypeScale.body,
    color: Colors.text.secondary,
  },
  card: {
    backgroundColor: Colors.green[50],
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.green[200],
  },
  cardTitle: {
    ...TypeScale.subheading,
    color: Colors.green[600],
    marginBottom: Spacing.sm,
  },
  cardBody: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...TypeScale.subheading,
    color: Colors.green[400],
  },
  statLabel: {
    ...TypeScale.caption,
    color: Colors.text.muted,
    marginTop: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  logoBg: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: Colors.green[50],
    borderWidth: 2,
    borderColor: Colors.green[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.green[300],
  },
});
