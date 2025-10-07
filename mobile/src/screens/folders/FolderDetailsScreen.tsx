import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants';
import { FoldersStackParamList } from '../../navigation/types';
import {
  useFolder,
  usePosts,
  useRecalculatePostsCount,
} from '../../hooks/useApi';
import { useAuthStore } from '../../store/authStore';
import { Post } from '../../types/api';

// Importar o componente PostItem
import PostItem from '../../components/PostItem';

type FolderDetailsScreenRouteProp = RouteProp<FoldersStackParamList, 'FolderDetails'>;
type FolderDetailsScreenNavigationProp = StackNavigationProp<FoldersStackParamList, 'FolderDetails'>;

export default function FolderDetailsScreen() {
  const route = useRoute<FolderDetailsScreenRouteProp>();
  const navigation = useNavigation<FolderDetailsScreenNavigationProp>();
  const { user } = useAuthStore();
  const { folderId } = route.params;

  // Buscar dados da pasta
  const {
    data: folder,
    isLoading: folderLoading,
    error: folderError,
  } = useFolder(folderId);

  // Buscar posts da pasta
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = usePosts({ folderId });

  // Hook para recalcular contador de posts
  const recalculatePostsCount = useRecalculatePostsCount();

  // Recalcular contador quando a tela carrega
  useEffect(() => {
    if (folderId) {
      console.log('🔄 Recalculando contador de posts para pasta:', folderId);
      recalculatePostsCount.mutate(folderId);
    }
  }, [folderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handlePostPress = (post: Post) => {
    // TODO: Navegar para tela de detalhes do post quando criada
    Alert.alert('Em breve', 'Visualização detalhada do post em desenvolvimento');
  };

  const handleRefresh = () => {
    refetchPosts();
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostItem
      post={item}
      onPress={() => handlePostPress(item)}
      currentUserId={user?.id || ''}
      showActions={false}
    />
  );

  const renderEmpty = () => {
    if (postsLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="document-outline"
          size={64}
          color={COLORS.textSecondary}
        />
        <Text style={styles.emptyTitle}>Nenhum post ainda</Text>
        <Text style={styles.emptySubtitle}>
          Esta pasta ainda não possui posts. Crie um novo post e organize-o aqui!
        </Text>
      </View>
    );
  };

  const renderHeader = () => {
    if (!folder) return null;

    return (
      <View style={[styles.folderHeader, { borderLeftColor: folder.color }]}>
        <View style={styles.folderIcon}>
          <Ionicons name="folder" size={32} color={folder.color} />
        </View>
        <View style={styles.folderInfo}>
          <Text style={styles.folderName}>{folder.name}</Text>
          {folder.description && (
            <Text style={styles.folderDescription}>{folder.description}</Text>
          )}
          <View style={styles.folderMeta}>
            <Text style={styles.folderStats}>
              {posts?.length || 0} {(posts?.length || 0) === 1 ? 'post' : 'posts'}
            </Text>
            <Text style={styles.folderDate}>
              Criada em {formatDate(folder.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (folderLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando pasta...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (folderError || !folder) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Erro ao carregar pasta</Text>
          <Text style={styles.errorSubtitle}>
            {folderError?.message || 'Pasta não encontrada'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (postsError) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Erro ao carregar posts</Text>
          <Text style={styles.errorSubtitle}>
            Tente novamente em alguns instantes
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRefresh}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts || []}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={postsLoading}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
  },
  folderHeader: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  folderIcon: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  folderDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  folderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  folderStats: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  folderDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});