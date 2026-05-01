import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { Colors, TypeScale, Spacing } from '@/constants/theme';

/**
 * Settings tab — profile, account, data, sign out (Phase 8).
 * Placeholder with sign-out button for Phase 3.
 */
export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <SettingsItem label="Profile" icon="👤" />
        <SettingsItem label="Account" icon="🔒" />
        <SettingsItem label="Export Data" icon="📊" />
        <SettingsItem label="Items Needing Review" icon="📝" />
        <SettingsItem label="About" icon="ℹ️" />
      </View>

      <TouchableOpacity
        style={styles.signOutButton}
        activeOpacity={0.7}
        onPress={() => {
          // Phase 3: sign out
        }}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

function SettingsItem({ label, icon }: { label: string; icon: string }) {
  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.6}>
      <Text style={styles.itemIcon}>{icon}</Text>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
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
  section: {
    backgroundColor: Colors.green[50],
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.green[200],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.green[200],
  },
  itemIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  itemLabel: {
    ...TypeScale.body,
    color: Colors.text.primary,
    flex: 1,
  },
  chevron: {
    fontSize: 22,
    color: Colors.text.muted,
  },
  signOutButton: {
    marginTop: Spacing.xxl,
    backgroundColor: Colors.green[300],
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  signOutText: {
    ...TypeScale.body,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
});
