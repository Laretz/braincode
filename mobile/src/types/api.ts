// Tipos da API do BrainCode
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  code?: string;
  language?: string;
  imageUrl?: string;
  tags: string[];
  isPublic: boolean;
  folderId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User; // Agora obrigatório - todo post deve ter um usuário
  folder?: Folder;
  _count?: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

// Tipos de requisição
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  code?: string;
  language?: string;
  imageUrl?: string;
  tags: string[];
  isPublic: boolean;
  folderId?: string;
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
  color: string;
  isPublic?: boolean;
}

export interface CreateCommentRequest {
  content: string;
  postId: string;
}

// Tipos de resposta
export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
}