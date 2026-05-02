import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

/**
 * Auth stack layout — login and register screens.
 * No tab bar, no header — clean full-screen auth experience.
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bg.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
