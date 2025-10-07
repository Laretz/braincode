import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { COLORS } from '../../constants';
import { FeedStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useGetPost, useCreateComment, useComments } from '../../hooks/useApi';
import PostItem from '../../components/PostItem';

type PostDetailsRouteProp = RouteProp<FeedStackParamList, 'PostDetails'>;
type PostDetailsNavigationProp = StackNavigationProp<FeedStackParamList, 'PostDetails'>;

const PostDetailsScreen: React.FC = () => {
  const route = useRoute<PostDetailsRouteProp>();
  const navigation = useNavigation<PostDetailsNavigationProp>();
  const { postId } = route.params;
  
  const { user } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  
  const { data: post, isLoading, error } = useGetPost(postId);
  const { data: comments, isLoading: commentsLoading } = useComments(postId);
  const createCommentMutation = useCreateComment();

  // Inicializar valores quando o post for carregado
  React.useEffect(() => {
    if (post) {
      setLikesCount(post.likesCount || 0);
      // TODO: Implementar verificação se o usuário curtiu o post
      setIsLiked(false);
    }
  }, [post]);

  const handleLike = () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para curtir posts');
      return;
    }
    
    // TODO: Implementar lógica de like no Firebase
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para comentar');
      return;
    }

    if (!commentText.trim()) {
      Alert.alert('Erro', 'Digite um comentário');
      return;
    }

    createCommentMutation.mutate({
      userId: user.id,
      postId,
      content: commentText.trim(),
    }, {
      onSuccess: () => {
        setCommentText('');
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar o post</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
      </View>

      <ScrollView style={styles.content}>
        <PostItem
          post={post}
          currentUserId={user?.id}
          onLike={handleLike}
          showActions={false}
        />

        {/* Post Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? COLORS.error : COLORS.textSecondary}
            />
            <Text style={styles.actionText}>{likesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={COLORS.textSecondary}
            />
            <Text style={styles.actionText}>{post.commentsCount || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="share-outline"
              size={24}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comentários</Text>
          
          {/* Add Comment */}
          {user && (
            <View style={styles.addCommentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Adicione um comentário..."
                placeholderTextColor={COLORS.textSecondary}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { opacity: commentText.trim() ? 1 : 0.5 }
                ]}
                onPress={handleComment}
                disabled={!commentText.trim() || createCommentMutation.isPending}
              >
                <Ionicons name="send" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Comments List */}
          {comments && comments.length > 0 ? (
            comments.map((comment: any) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>
                      {comment.user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View style={styles.commentInfo}>
                    <Text style={styles.commentUserName}>
                      {comment.user?.name || 'Usuário'}
                    </Text>
                    <Text style={styles.commentDate}>
                      {formatDate(comment.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  commentsSection: {
    padding: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    padding: 12,
  },
  commentItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentInfo: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  commentDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  commentContent: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noCommentsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default PostDetailsScreen;