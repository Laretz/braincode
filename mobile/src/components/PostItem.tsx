import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import type { Post } from '../types/api';

interface PostItemProps {
  post: Post;
  onPress?: (post: Post) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  currentUserId?: string;
  showActions?: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ 
  post, 
  onPress,
  onLike, 
  onComment,
  currentUserId,
  showActions = true,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes <= 1 ? 'agora' : `${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInHours < 24 * 7) {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      javascript: '#f7df1e',
      typescript: '#3178c6',
      python: '#3776ab',
      java: '#ed8b00',
      csharp: '#239120',
      cpp: '#00599c',
      go: '#00add8',
      rust: '#000000',
      php: '#777bb4',
      ruby: '#cc342d',
    };
    return colors[language.toLowerCase()] || COLORS.primary;
  };

  const handlePress = () => {
    if (onPress) {
      onPress(post);
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(post.id);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.postItem}
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {post.user?.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName} numberOfLines={1}>
              {post.user?.name || 'Usuário'}
            </Text>
            <View style={styles.metaInfo}>
              <Text style={styles.userUsername} numberOfLines={1}>
                @{post.user?.name?.toLowerCase().replace(/\s+/g, '') || 'usuario'}
              </Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.postContent}>
        <Text style={styles.postTitle} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.postDescription} numberOfLines={3}>
          {post.content}
        </Text>
        
        {/* Language Tag */}
        {post.language && (
          <View style={styles.languageContainer}>
            <View
              style={[
                styles.languageTag,
                { backgroundColor: getLanguageColor(post.language) },
              ]}
            >
              <Text style={styles.languageText}>{post.language}</Text>
            </View>
          </View>
        )}

        {/* Code Preview */}
        {post.code && (
          <View style={styles.codePreview}>
            <Text style={styles.codeText} numberOfLines={4}>
              {post.code}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      {showActions && (
        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
          >
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={post.isLiked ? COLORS.error : COLORS.textSecondary}
            />
            <Text style={styles.actionText}>{post._count?.likes || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleComment}
          >
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={COLORS.textSecondary}
            />
            <Text style={styles.actionText}>{post._count?.comments || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="share-outline"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postItem: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  avatarText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
    minWidth: 0, // Permite que o texto seja truncado
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userUsername: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  separator: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginHorizontal: 6,
  },
  postDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  postContent: {
    marginBottom: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
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
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default PostItem;