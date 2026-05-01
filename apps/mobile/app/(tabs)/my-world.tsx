import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, TypeScale, Spacing } from '@/constants/theme';

/**
 * My World tab — planet health + community (future Phase F1/F4).
 * Placeholder for now.
 */
export default function MyWorldScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My World</Text>

      <View style={styles.planetContainer}>
        <View style={styles.planet}>
          <Text style={styles.planetEmoji}>🌍</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Ranking</Text>
            <Text style={styles.statValue}>—</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Points</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Community</Text>
        <Text style={styles.cardBody}>
          Start tracking your receipts to join the community leaderboard and
          earn eco points.
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
    marginBottom: Spacing.xxl,
  },
  planetContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  planet: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.green[50],
    borderWidth: 2,
    borderColor: Colors.green[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  planetEmoji: {
    fontSize: 56,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.xxxl,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    ...TypeScale.label,
    color: Colors.text.muted,
  },
  statValue: {
    ...TypeScale.subheading,
    color: Colors.green[400],
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.green[50],
    borderRadius: 16,
    padding: Spacing.xl,
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
  },
});
