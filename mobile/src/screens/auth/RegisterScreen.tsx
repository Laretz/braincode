import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SUCCESS_MESSAGES } from '../../constants';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/types';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  username: z.string()
    .min(3, 'Username deve ter pelo menos 3 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username deve conter apenas letras, números e underscore'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register: signUp, isLoading: loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      const { confirmPassword, ...registerData } = data;
      await signUp({
        email: registerData.email,
        password: registerData.password,
        name: registerData.name,
        username: registerData.username,
      });
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Junte-se à comunidade de desenvolvedores
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome Completo</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={COLORS.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        errors.name && styles.inputError,
                      ]}
                      placeholder="Seu nome completo"
                      placeholderTextColor={COLORS.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                    />
                  </View>
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            {/* Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="at-outline"
                      size={20}
                      color={COLORS.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        errors.username && styles.inputError,
                      ]}
                      placeholder="seuusername"
                      placeholderTextColor={COLORS.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                )}
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username.message}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={COLORS.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        errors.email && styles.inputError,
                      ]}
                      placeholder="seu@email.com"
                      placeholderTextColor={COLORS.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={COLORS.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        errors.password && styles.inputError,
                      ]}
                      placeholder="Sua senha"
                      placeholderTextColor={COLORS.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={COLORS.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={COLORS.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        errors.confirmPassword && styles.inputError,
                      ]}
                      placeholder="Confirme sua senha"
                      placeholderTextColor={COLORS.textSecondary}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={COLORS.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
              )}
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={COLORS.error} />
                <Text style={styles.errorMessage}>{error}</Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  errorMessage: {
    color: COLORS.error,
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});