import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSearchPosts } from '../../hooks/useApi';
import { COLORS, PROGRAMMING_LANGUAGES } from '../../constants';
import PostItem from '../../components/PostItem';
import type { Post } from '../../types/api';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { SearchStackParamList } from '../../navigation/types';

type SearchScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'SearchHome'>;

interface SearchFilters {
  language?: string;
  sortBy?: 'recent' | 'popular' | 'oldest';
}



export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading, error } = useSearchPosts({
    query: debouncedQuery,
    language: filters.language,
    sortBy: filters.sortBy,
  });

  const handlePostPress = (postId: string) => {
    // TODO: Implementar navegação para PostDetails quando a tela for criada
    console.log('Navegar para post:', postId);
    // navigation.navigate('PostDetails', { postId });
  };

  const handleLanguageFilter = (language: string) => {
    setFilters(prev => ({
      ...prev,
      language: prev.language === language ? undefined : language,
    }));
  };

  const handleSortFilter = (sortBy: 'recent' | 'popular' | 'oldest') => {
    setFilters(prev => ({
      ...prev,
      sortBy: prev.sortBy === sortBy ? undefined : sortBy,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostItem 
      post={item} 
      onPress={(post) => handlePostPress(post.id)}
      showActions={false}
    />
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    
    if (debouncedQuery.length < 2) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>Buscar Posts</Text>
          <Text style={styles.emptySubtitle}>
            Digite pelo menos 2 caracteres para buscar
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle" size={64} color={COLORS.error} />
          <Text style={styles.emptyTitle}>Erro na busca</Text>
          <Text style={styles.emptySubtitle}>
            Tente novamente em alguns instantes
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={64} color={COLORS.textSecondary} />
        <Text style={styles.emptyTitle}>Nenhum resultado</Text>
        <Text style={styles.emptySubtitle}>
          Tente usar palavras-chave diferentes
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons 
            name="options-outline" 
            size={24} 
            color={Object.keys(filters).length > 0 ? COLORS.primary : COLORS.text} 
          />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar posts, códigos, usuários..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Language Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Linguagens</Text>
            <View style={styles.filterTags}>
              {PROGRAMMING_LANGUAGES.slice(0, 6).map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  style={[
                    styles.filterTag,
                    filters.language === lang.value && styles.filterTagActive,
                  ]}
                  onPress={() => handleLanguageFilter(lang.value)}
                >
                  <Text
                    style={[
                      styles.filterTagText,
                      filters.language === lang.value && styles.filterTagTextActive,
                    ]}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Ordenar por</Text>
            <View style={styles.filterTags}>
              {[
                { value: 'recent', label: 'Recentes' },
                { value: 'popular', label: 'Populares' },
                { value: 'oldest', label: 'Antigos' },
              ].map((sort) => (
                <TouchableOpacity
                  key={sort.value}
                  style={[
                    styles.filterTag,
                    filters.sortBy === sort.value && styles.filterTagActive,
                  ]}
                  onPress={() => handleSortFilter(sort.value as 'recent' | 'popular' | 'oldest')}
                >
                  <Text
                    style={[
                      styles.filterTagText,
                      filters.sortBy === sort.value && styles.filterTagTextActive,
                    ]}
                  >
                    {sort.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Clear Filters */}
          {Object.keys(filters).length > 0 && (
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Limpar filtros</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Results */}
      <View style={styles.resultsContainer}>
        {isLoading && debouncedQuery.length >= 2 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}

        <FlatList
          data={searchResults || []}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  filtersContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTagActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTagText: {
    fontSize: 14,
    color: COLORS.text,
  },
  filterTagTextActive: {
    color: COLORS.background,
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  userUsername: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  postDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  postContent: {
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  postDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  languageContainer: {
    marginBottom: 8,
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
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
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