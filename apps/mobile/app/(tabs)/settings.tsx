import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { Screen, HeaderBar, Button } from '@/components/ui';
import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';
import { useAuthStore } from '@/src/stores/authStore';

/**
 * Settings tab — profile, account, data export, sign out.
 * Phase 8 will build out each sub-screen.
 */
export default function SettingsScreen() {
  const { logout, loading } = useAuthStore();

  return (
    <Screen>
      <HeaderBar title="Settings" showAvatar={false} />

      <View style={styles.section}>
        <SettingsItem label="Profile" icon="👤" />
        <SettingsItem label="Account" icon="🔒" />
        <SettingsItem label="Export Data" icon="📊" />
        <SettingsItem label="Items Needing Review" icon="📝" />
        <SettingsItem label="About" icon="ℹ️" last />
      </View>

      <View style={styles.signOutContainer}>
        <Button
          title="Sign Out"
          variant="primary"
          onPress={logout}
          loading={loading}
        />
      </View>

      <Text style={styles.version}>Receipto v0.1.0</Text>
    </Screen>
  );
}

function SettingsItem({
  label,
  icon,
  last = false,
}: {
  label: string;
  icon: string;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.item, !last && styles.itemBorder]}
      activeOpacity={0.6}
    >
      <Text style={styles.itemIcon}>{icon}</Text>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.green[50],
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.green[200],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  itemBorder: {
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
  signOutContainer: {
    marginTop: Spacing.xxl,
  },
  version: {
    ...TypeScale.caption,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
