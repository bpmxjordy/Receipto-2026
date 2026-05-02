import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen, HeaderBar, Card, Tag } from '@/components/ui';
import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';

/**
 * My World tab — planet health, ranking, community.
 * Matches iPhone 14 - 63.png from the design deck.
 * Future phases (F1, F4) will wire real data.
 */
export default function MyWorldScreen() {
  return (
    <Screen>
      <HeaderBar title="My World" showBack showAvatar={false} />

      {/* Planet + ranking + points row */}
      <View style={styles.planetSection}>
        <View style={styles.labelCol}>
          <Text style={styles.metaLabel}>Ranking</Text>
          <Text style={styles.metaValueGreen}>—</Text>
        </View>

        <View style={styles.planetContainer}>
          <View style={styles.planet}>
            <Text style={styles.planetEmoji}>🌍</Text>
          </View>
        </View>

        <View style={styles.labelCol}>
          <Text style={styles.metaLabel}>Points</Text>
          <Text style={styles.metaValue}>0</Text>
        </View>
      </View>

      <View style={styles.statsButtonRow}>
        <Tag label="My statistics" color={Colors.green[300]} textColor={Colors.text.inverse} />
      </View>

      {/* Community card */}
      <Card style={styles.communityCard}>
        <Text style={styles.cardTitle}>Your Community</Text>

        <View style={styles.communityTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Top 3</Text>
            <Text style={styles.tableHeaderText}>Points</Text>
            <Text style={styles.tableHeaderText}>Trees</Text>
            <Text style={styles.tableHeaderText}>Ranking</Text>
          </View>
          <Text style={styles.tableEmpty}>
            Invite friends to see your community here.
          </Text>
        </View>

        <View style={styles.inviteRow}>
          <Text style={styles.inviteText}>Invite more friends and get more points</Text>
          <View style={styles.shareChip}>
            <Text style={styles.shareChipText}>Share</Text>
          </View>
        </View>
      </Card>

      {/* Ranking card */}
      <Card style={styles.rankingCard}>
        <View style={styles.rankingHeader}>
          <Text style={styles.cardTitle}>Ranking</Text>
          <View style={styles.filterRow}>
            <Tag label="Local" />
            <Tag label="1 week" />
          </View>
        </View>

        <View style={styles.rankingGrid}>
          <RankingStat label="Overall" value="—" />
          <RankingStat label="Average CO₂" value="—" />
          <RankingStat label="Points" value="—" />
          <RankingStat label="Friends" value="—" />
        </View>
      </Card>
    </Screen>
  );
}

function RankingStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.rankingStat}>
      <Text style={styles.rankingStatLabel}>{label}</Text>
      <Text style={styles.rankingStatValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  planetSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  labelCol: {
    alignItems: 'center',
    minWidth: 70,
  },
  metaLabel: {
    ...TypeScale.label,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  metaValue: {
    ...TypeScale.subheading,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  metaValueGreen: {
    ...TypeScale.subheading,
    color: Colors.green[400],
    fontWeight: '700',
  },
  planetContainer: {
    alignItems: 'center',
  },
  planet: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.green[50],
    borderWidth: 2,
    borderColor: Colors.green[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  planetEmoji: {
    fontSize: 48,
  },
  statsButtonRow: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  communityCard: {
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    ...TypeScale.subheading,
    color: Colors.green[600],
    marginBottom: Spacing.md,
  },
  communityTable: {
    marginBottom: Spacing.md,
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  tableHeaderText: {
    ...TypeScale.caption,
    color: Colors.text.muted,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'center',
  },
  tableEmpty: {
    ...TypeScale.bodySmall,
    color: Colors.text.muted,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.green[100],
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inviteText: {
    ...TypeScale.caption,
    color: Colors.green[600],
    flex: 1,
  },
  shareChip: {
    backgroundColor: Colors.green[300],
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  shareChipText: {
    ...TypeScale.caption,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  rankingCard: {
    marginBottom: Spacing.xl,
  },
  rankingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rankingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  rankingStat: {
    width: '46%',
    backgroundColor: Colors.bg.primary,
    borderRadius: Radii.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  rankingStatLabel: {
    ...TypeScale.caption,
    color: Colors.text.muted,
    marginBottom: 2,
  },
  rankingStatValue: {
    ...TypeScale.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
});
