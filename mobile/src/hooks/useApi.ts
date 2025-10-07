import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { postService, CreatePostData } from '../services/postService';
import { folderService, CreateFolderData } from '../services/folderService';
import { commentService } from '../services/commentService';
import { userService } from '../services/userService';
import type { User } from '../types/api';

// Query Keys para Firebase
export const QUERY_KEYS = {
  POSTS: 'posts',
  POST: 'post',
  FOLDERS: 'folders',
  FOLDER: 'folder',
  COMMENTS: 'comments',
  USERS: 'users',
  USER: 'user',
} as const;

// Usuário padrão para casos onde não conseguimos buscar o usuário
const DEFAULT_USER: User = {
  id: 'unknown',
  name: 'Usuário Desconhecido',
  email: '',
  bio: '',
  avatar: '',
  githubUrl: '',
  linkedinUrl: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Posts
export const usePosts = (params?: {
  search?: string;
  page?: number;
  limit?: number;
  userId?: string;
  folderId?: string;
  isPublic?: boolean;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS, params],
    queryFn: async () => {
      let posts;
      
      if (params?.userId) {
        posts = await postService.getUserPosts(params.userId);
      } else if (params?.isPublic) {
        posts = await postService.getPublicPosts();
      } else if (params?.folderId) {
        posts = await postService.getPostsByFolder(params.folderId);
      } else {
        posts = await postService.getPublicPosts();
      }

      // Buscar informações de usuário para cada post
      const postsWithUsers = await Promise.all(
        posts.map(async (post) => {
          try {
            const user = await userService.getUserById(post.userId);
            return {
              ...post,
              user: user ? {
                  id: user.uid,
                  name: user.displayName,
                  email: user.email || '',
                  bio: user.bio || '',
                  avatar: user.avatar || '',
                  githubUrl: user.githubUrl || '',
                  linkedinUrl: user.linkedinUrl || '',
                  createdAt: user.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                  updatedAt: user.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                } : DEFAULT_USER,
              createdAt: post.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              updatedAt: post.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            };
          } catch (error) {
            console.error(`Erro ao buscar usuário ${post.userId}:`, error);
            return {
              ...post,
              user: DEFAULT_USER,
              createdAt: post.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              updatedAt: post.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            };
          }
        })
      );

      return postsWithUsers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POST, id],
    queryFn: () => postService.getPost(id),
    enabled: !!id,
  });
};

export const useGetPost = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS, postId],
    queryFn: async () => {
      const post = await postService.getPost(postId);
      
      if (!post) {
        throw new Error('Post não encontrado');
      }
      
      // Buscar informações do usuário
      try {
        const user = await userService.getUserById(post.userId);
        return {
          ...post,
          user: user ? {
            id: user.uid,
            name: user.displayName,
            email: user.email || '',
            bio: user.bio || '',
            avatar: user.avatar || '',
            githubUrl: user.githubUrl || '',
            linkedinUrl: user.linkedinUrl || '',
            createdAt: user.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: user.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          } : DEFAULT_USER,
          createdAt: post.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: post.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
      } catch (error) {
        console.error('Erro ao buscar usuário para post:', postId, error);
        return {
          ...post,
          user: DEFAULT_USER,
          createdAt: post.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: post.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
      }
    },
    enabled: !!postId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, postData }: { userId: string; postData: CreatePostData }) => {
      console.log('🚀 Criando post:', { userId, postData });
      
      const post = await postService.createPost(userId, postData);
      console.log('✅ Post criado com ID:', post);
      
      // Se o post foi criado em uma pasta, incrementar o contador
      if (postData.folderId) {
        console.log('📁 Incrementando contador da pasta:', postData.folderId);
        try {
          await folderService.incrementPostsCount(postData.folderId);
          console.log('✅ Contador incrementado com sucesso');
        } catch (error) {
          console.error('❌ Erro ao incrementar contador de posts:', error);
          // Não falha a criação do post se o contador falhar
        }
      } else {
        console.log('📝 Post criado sem pasta específica');
      }
      
      return post;
    },
    onSuccess: () => {
      console.log('🔄 Invalidando queries...');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      // Buscar o post antes de deletar para saber qual pasta decrementar
      const post = await postService.getPost(postId);
      
      // Deletar o post
      await postService.deletePost(postId);
      
      // Se o post estava em uma pasta, decrementar o contador
      if (post?.folderId) {
        try {
          await folderService.decrementPostsCount(post.folderId);
        } catch (error) {
          console.error('Erro ao decrementar contador de posts:', error);
          // Não falha a deleção do post se o contador falhar
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useSearchPosts = (params: {
  query: string;
  language?: string;
  sortBy?: 'recent' | 'popular' | 'oldest';
}) => {
  return useQuery({
    queryKey: ['search', 'posts', params.query, params.language, params.sortBy],
    queryFn: async () => {
      const posts = await postService.searchPosts(params);
      
      // Buscar informações dos usuários para cada post
      const postsWithUsers = await Promise.all(
        posts.map(async (post) => {
          try {
            const user = await userService.getUserById(post.userId);
            return {
               ...post,
               user: user ? {
                id: user.uid,
                name: user.displayName,
                email: user.email || '',
                bio: user.bio || '',
                avatar: user.avatar || '',
                githubUrl: user.githubUrl || '',
                linkedinUrl: user.linkedinUrl || '',
                createdAt: user.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: user.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              } : DEFAULT_USER,
               createdAt: post.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
               updatedAt: post.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
             };
          } catch (error) {
            console.error('Erro ao buscar usuário para post:', post.id, error);
            return {
               ...post,
               user: DEFAULT_USER,
               createdAt: post.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
               updatedAt: post.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
             };
          }
        })
      );

      return postsWithUsers;
    },
    enabled: params.query.length >= 2,
    staleTime: 30 * 1000, // 30 segundos
  });
};

export const useGetPublicPosts = () => {
  return useQuery({
    queryKey: ['posts', 'public'],
    queryFn: () => postService.getPublicPosts(),
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      postService.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
    },
  });
};



// TODO: Implementar funcionalidade de likes no Firebase
// export const useLikePost = () => {
//   const queryClient = useQueryClient();
//   
//   return useMutation({
//     mutationFn: (id: string) => postService.likePost(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
//     },
//   });
// };

// TODO: Implementar funcionalidade de unlikes no Firebase
// export const useUnlikePost = () => {
//   const queryClient = useQueryClient();
//   
//   return useMutation({
//     mutationFn: (id: string) => postService.unlikePost(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
//     },
//   });
// };

// Folders
export const useFolders = (params?: {
  search?: string;
  page?: number;
  limit?: number;
  userId?: string;
  isPublic?: boolean;
  folderId?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FOLDERS, params],
    queryFn: () => {
      if (params?.userId) {
        return folderService.getUserFolders(params.userId);
      }
      return folderService.getPublicFolders();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useFolder = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FOLDER, id],
    queryFn: () => folderService.getFolder(id),
    enabled: !!id,
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, folderData }: { userId: string; folderData: CreateFolderData }) =>
      folderService.createFolder(userId, folderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useGetUserFolders = (userId: string) => {
  return useQuery({
    queryKey: ['folders', 'user', userId],
    queryFn: () => folderService.getUserFolders(userId),
    enabled: !!userId,
  });
};

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      folderService.updateFolder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLDERS] });
    },
  });
};

export const useRecalculatePostsCount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (folderId: string) =>
      folderService.recalculatePostsCount(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLDERS] });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => folderService.deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLDERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
    },
  });
};

// Comments
export const useComments = (postId: string, params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENTS, postId, params],
    queryFn: () => commentService.getPostComments(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, postId, content }: { userId: string; postId: string; content: string }) => 
      commentService.createComment(userId, { content, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      commentService.updateComment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => commentService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
    },
  });
};

// Users
// TODO: Implementar busca de usuários no Firebase
/*
export const useUsers = (params?: {
  search?: string;
  page?: number;
  limit?: number;
  hasGithub?: boolean;
  hasLinkedin?: boolean;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, params],
    queryFn: () => supabaseApiService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
*/

export const useGetUserPosts = (userId: string) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => postService.getUserPosts(userId),
    enabled: !!userId,
  });
};

// TODO: Implementar busca de usuário por ID no Firebase
/*
export const useUser = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER, id],
    queryFn: () => supabaseApiService.getUserById(id),
    enabled: !!id,
  });
};
*/

// TODO: Implementar atualização de perfil no Firebase
/*
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<User>) => supabaseApiService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([QUERY_KEYS.PROFILE], updatedUser);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });
};
*/