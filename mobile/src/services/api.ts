import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { storageService } from '../utils/storage';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '../constants';
import type {
  User,
  Post,
  Folder,
  Comment,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  CreatePostRequest,
  CreateFolderRequest,
  CreateCommentRequest,
  PaginatedResponse,
  ApiError,
} from '../types/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor para adicionar token
    this.api.interceptors.request.use(
      async (config) => {
        let token = await storageService.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        // Token temporário para testes - TODO: Remover quando integração Firebase/Backend estiver pronta
        if (!token) {
          token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWdhZm9nMnEwMDAzbmw4OTRibzk3a2FpIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzU5NDcxMTI0fQ.kKEhGHeUk3zIsPQFUGm4DLugXSFRKyJLVYz3jkOZfJM';
        }
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para tratar erros
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          message: this.getErrorMessage(error),
          statusCode: error.response?.status || 0,
        };
        return Promise.reject(apiError);
      }
    );
  }

  private getErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    switch (error.response?.status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
          return ERROR_MESSAGES.NETWORK_ERROR;
        }
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  // Autenticação
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/profile');
    return response.data;
  }

  // Usuários
  async getUsers(params?: {
    search?: string;
    page?: number;
    limit?: number;
    hasGithub?: boolean;
    hasLinkedin?: boolean;
  }): Promise<PaginatedResponse<User>> {
    const response: AxiosResponse<PaginatedResponse<User>> = await this.api.get('/users', { params });
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put('/users/profile', data);
    return response.data;
  }

  // Posts
  async getPosts(params?: {
    search?: string;
    page?: number;
    limit?: number;
    userId?: string;
    folderId?: string;
    isPublic?: boolean;
  }): Promise<PaginatedResponse<Post>> {
    const response: AxiosResponse<{ success: boolean; data: PaginatedResponse<Post> }> = await this.api.get('/posts', { params });
    return response.data.data;
  }

  async getPostById(id: string): Promise<Post> {
    const response: AxiosResponse<{ success: boolean; data: Post }> = await this.api.get(`/posts/${id}`);
    return response.data.data;
  }

  async createPost(data: CreatePostRequest): Promise<Post> {
    const response: AxiosResponse<{ success: boolean; data: Post }> = await this.api.post('/posts', data);
    return response.data.data;
  }

  async updatePost(id: string, data: Partial<CreatePostRequest>): Promise<Post> {
    const response: AxiosResponse<{ success: boolean; data: Post }> = await this.api.put(`/posts/${id}`, data);
    return response.data.data;
  }

  async deletePost(id: string): Promise<void> {
    await this.api.delete(`/posts/${id}`);
  }

  async likePost(id: string): Promise<void> {
    await this.api.post(`/posts/${id}/like`);
  }

  async unlikePost(id: string): Promise<void> {
    await this.api.delete(`/posts/${id}/like`);
  }

  async searchPosts(params: {
    query: string;
    language?: string;
    sortBy?: 'recent' | 'popular' | 'oldest';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Post>> {
    const response: AxiosResponse<{ success: boolean; data: PaginatedResponse<Post> }> = await this.api.get('/posts/search', { params });
    return response.data.data;
  }

  // Pastas
  async getFolders(params?: {
    search?: string;
    page?: number;
    limit?: number;
    userId?: string;
  }): Promise<PaginatedResponse<Folder>> {
    const response: AxiosResponse<{ success: boolean; data: { folders: Folder[]; pagination: any } }> = await this.api.get('/folders', { params });
    return {
      data: response.data.data.folders,
      meta: response.data.data.pagination
    };
  }

  async getFolderById(id: string): Promise<Folder> {
    const response: AxiosResponse<{ success: boolean; data: Folder }> = await this.api.get(`/folders/${id}`);
    return response.data.data;
  }

  async createFolder(data: CreateFolderRequest): Promise<Folder> {
    const response: AxiosResponse<{ success: boolean; data: Folder }> = await this.api.post('/folders', data);
    return response.data.data;
  }

  async updateFolder(id: string, data: Partial<CreateFolderRequest>): Promise<Folder> {
    const response: AxiosResponse<{ success: boolean; data: Folder }> = await this.api.put(`/folders/${id}`, data);
    return response.data.data;
  }

  async deleteFolder(id: string): Promise<void> {
    await this.api.delete(`/folders/${id}`);
  }

  async getUserFolders(userId: string): Promise<PaginatedResponse<Folder>> {
    return this.getFolders({ userId });
  }

  // Comentários
  async getComments(postId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Comment>> {
    const response: AxiosResponse<PaginatedResponse<Comment>> = await this.api.get(`/posts/${postId}/comments`, { params });
    return response.data;
  }

  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const response: AxiosResponse<Comment> = await this.api.post('/comments', data);
    return response.data;
  }

  async updateComment(id: string, content: string): Promise<Comment> {
    const response: AxiosResponse<Comment> = await this.api.put(`/comments/${id}`, { content });
    return response.data;
  }

  async deleteComment(id: string): Promise<void> {
    await this.api.delete(`/comments/${id}`);
  }
}

export const apiService = new ApiService();