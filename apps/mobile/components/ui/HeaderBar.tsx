/**
 * <HeaderBar> — top bar with title, optional back arrow, and user avatar pill.
 *
 * Matches the deck's "< Receipts   [avatar JordanC ≡]" pattern.
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';

interface HeaderBarProps {
  /** Screen title */
  title: string;
  /** Show a back arrow that calls router.back() */
  showBack?: boolean;
  /** User display name (shown in the avatar pill) */
  userName?: string;
  /** User avatar URL */
  avatarUrl?: string;
  /** Show the avatar pill (default: true for tab screens) */
  showAvatar?: boolean;
  /** Optional right-side action */
  rightAction?: React.ReactNode;
}

export function HeaderBar({
  title,
  showBack = false,
  userName,
  avatarUrl,
  showAvatar = true,
  rightAction,
}: HeaderBarProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.right}>
        {rightAction}
        {showAvatar && (
          <TouchableOpacity style={styles.avatarPill} activeOpacity={0.7}>
            <View style={styles.avatarCircle}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarInitial}>
                  {userName ? userName.charAt(0).toUpperCase() : '?'}
                </Text>
              )}
              <View style={styles.onlineDot} />
            </View>
            {userName && (
              <Text style={styles.avatarName} numberOfLines={1}>
                {userName}
              </Text>
            )}
            <Text style={styles.menuIcon}>≡</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  backArrow: {
    fontSize: 32,
    color: Colors.green[400],
    lineHeight: 34,
    marginRight: Spacing.xs,
  },
  title: {
    ...TypeScale.heading,
    color: Colors.green[600],
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.green[50],
    borderRadius: Radii.full,
    paddingLeft: 2,
    paddingRight: Spacing.md,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.green[200],
    gap: Spacing.xs,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.green[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  onlineDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    borderWidth: 1.5,
    borderColor: Colors.green[50],
  },
  avatarName: {
    ...TypeScale.label,
    color: Colors.text.primary,
    maxWidth: 80,
  },
  menuIcon: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
});
