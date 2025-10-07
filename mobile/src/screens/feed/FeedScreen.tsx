import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { usePosts } from '../../hooks/useApi';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../constants';
import PostItem from '../../components/PostItem';
import type { Post } from '../../types/api';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { FeedStackParamList } from '../../navigation/types';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../navigation/types';

type FeedScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FeedStackParamList, 'FeedList'>,
  BottomTabNavigationProp<MainTabParamList>
>;

export default function FeedScreen() {
  const navigation = useNavigation<FeedScreenNavigationProp>();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: posts,
    isLoading,
    refetch,
  } = usePosts({ isPublic: true });

  // Remover funcionalidades de paginação infinita por enquanto
  const fetchNextPage = () => {};
  const hasNextPage = false;
  const isFetchingNextPage = false;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLike = async (postId: string) => {
    try {
      // Implementar lógica de like/unlike
      console.log('Like post:', postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = (postId: string) => {
    navigation.navigate('PostDetails', { postId });
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostItem
      post={item}
      onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
      onLike={handleLike}
      onComment={handleComment}
      currentUserId={user?.id}
      showActions={true}
    />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>Nenhum post encontrado</Text>
      <Text style={styles.emptySubtitle}>
        Seja o primeiro a compartilhar seu código!
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('Create')}
      >
        <Text style={styles.createButtonText}>Criar Post</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Search', { screen: 'SearchHome' })}
          >
            <Ionicons name="search" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Create')}
          >
            <Ionicons name="add" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
  postItem: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  userUsername: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  postDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  postContent: {
    marginBottom: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  languageContainer: {
    marginBottom: 12,
  },
  languageTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  languageText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '600',
  },
  codePreview: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 16,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
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
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});