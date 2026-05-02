import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen, TextField, Button, Divider } from '@/components/ui';
import { Colors, TypeScale, Spacing, Radii } from '@/constants/theme';
import { useAuthStore } from '@/src/stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

/**
 * Login screen — matches iPhone 14 - 33.png
 */
export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    clearError();
    await login(data.email, data.password);
  };

  return (
    <Screen scroll={false} backgroundColor={Colors.bg.primary}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoBg}>
            <Text style={styles.logoText}>R</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Login with your Email</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextField
                placeholder="Email..."
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoComplete="email"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextField
                placeholder="Password..."
                value={value}
                onChangeText={onChange}
                isPassword
                autoComplete="password"
                error={errors.password?.message}
              />
            )}
          />

          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorBanner}>{error}</Text>}

          <Button
            title="Login"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or login with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google sign-in (placeholder — Phase 10 adds Apple too) */}
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Text style={styles.socialIcon}>G</Text>
            <Text style={styles.socialLabel}>Google</Text>
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Create one</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  logoBg: {
    width: 120,
    height: 120,
    borderRadius: Radii.xl,
    backgroundColor: Colors.green[50],
    borderWidth: 2,
    borderColor: Colors.green[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.green[300],
  },
  formSection: {
    paddingHorizontal: Spacing.sm,
  },
  formTitle: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  forgotText: {
    ...TypeScale.caption,
    color: Colors.text.link,
  },
  errorBanner: {
    ...TypeScale.bodySmall,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    backgroundColor: '#FEE2E2',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.sm,
    overflow: 'hidden',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border.light,
  },
  dividerText: {
    ...TypeScale.caption,
    color: Colors.text.muted,
    marginHorizontal: Spacing.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
  },
  socialLabel: {
    ...TypeScale.body,
    color: Colors.text.primary,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    ...TypeScale.bodySmall,
    color: Colors.text.secondary,
  },
  registerLink: {
    ...TypeScale.bodySmall,
    color: Colors.text.link,
    fontWeight: '600',
  },
});
