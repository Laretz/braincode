import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/types';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo e Título */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="code-slash" size={80} color={COLORS.background} />
            </View>
            <Text style={styles.title}>BrainCode</Text>
            <Text style={styles.subtitle}>
              Seu caderno virtual para organizar e compartilhar conhecimento
            </Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="folder" size={24} color={COLORS.background} />
              <Text style={styles.featureText}>Organize em pastas</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="code" size={24} color={COLORS.background} />
              <Text style={styles.featureText}>Compartilhe código</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="people" size={24} color={COLORS.background} />
              <Text style={styles.featureText}>Conecte com devs</Text>
            </View>
          </View>

          {/* Botões */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.primaryButtonText}>Criar Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.background,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    color: COLORS.background,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttons: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  secondaryButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: '600',
  },
});