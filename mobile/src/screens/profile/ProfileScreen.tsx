import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { usePosts } from '../../hooks/useApi';
import { COLORS } from '../../constants';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../../navigation/types';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileHome'>;

interface StatItemProps {
  label: string;
  value: number;
  icon: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon as any} size={24} color={COLORS.primary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface MenuItemProps {
  label: string;
  icon: string;
  onPress: () => void;
  showArrow?: boolean;
  color?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  label, 
  icon, 
  onPress, 
  showArrow = true,
  color = COLORS.text 
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={[styles.menuItemText, { color }]}>{label}</Text>
    </View>
    {showArrow && (
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, signOut } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const { data: userPosts, refetch } = usePosts({
    userId: user?.id,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // TODO: Implementar tela EditProfile
    Alert.alert('Em breve', 'Esta funcionalidade será implementada em breve!');
    // navigation.navigate('EditProfile');
  };

  const handleMyPosts = () => {
    // TODO: Implementar tela MyPosts
    Alert.alert('Em breve', 'Esta funcionalidade será implementada em breve!');
    // navigation.navigate('MyPosts');
  };

  const handleMyFolders = () => {
    // TODO: Implementar tela MyFolders
    Alert.alert('Em breve', 'Esta funcionalidade será implementada em breve!');
    // navigation.navigate('MyFolders');
  };

  const handleSettings = () => {
    // TODO: Implementar tela Settings
    Alert.alert('Em breve', 'Esta funcionalidade será implementada em breve!');
    // navigation.navigate('Settings');
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.userName}>{user.name || user.email}</Text>
          <Text style={styles.userUsername}>@{user.name?.toLowerCase().replace(/\s+/g, '') || 'usuario'}</Text>
          
          {user.bio && (
            <Text style={styles.userBio}>{user.bio}</Text>
          )}

          <View style={styles.joinDateContainer}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.joinDate}>
              Entrou em {user.createdAt ? formatJoinDate(user.createdAt) : 'Data não disponível'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <StatItem
            label="Posts"
            value={userPosts?.length || 0}
            icon="document-text-outline"
          />
          <StatItem
            label="Pastas"
            value={0}
            icon="folder-outline"
          />
          <StatItem
            label="Curtidas"
            value={userPosts?.reduce((total: number, post: any) => total + (post._count?.likes || 0), 0) || 0}
            icon="heart-outline"
          />
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Conteúdo</Text>
          
          <MenuItem
            label="Meus Posts"
            icon="document-text-outline"
            onPress={handleMyPosts}
          />
          
          <MenuItem
            label="Minhas Pastas"
            icon="folder-outline"
            onPress={handleMyFolders}
          />
          
          <MenuItem
            label="Posts Curtidos"
            icon="heart-outline"
            onPress={() => Alert.alert('Em breve', 'Esta funcionalidade será implementada em breve!')}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <MenuItem
            label="Configurações"
            icon="settings-outline"
            onPress={handleSettings}
          />
          
          <MenuItem
            label="Privacidade"
            icon="shield-outline"
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          />
          
          <MenuItem
            label="Ajuda"
            icon="help-circle-outline"
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          />
          
          <MenuItem
            label="Sobre"
            icon="information-circle-outline"
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          />
        </View>

        <View style={styles.menuSection}>
          <MenuItem
            label="Sair"
            icon="log-out-outline"
            onPress={handleLogout}
            showArrow={false}
            color={COLORS.error}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>BrainCode v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.background,
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  userBio: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  joinDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  joinDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});