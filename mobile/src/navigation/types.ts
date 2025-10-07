import type { NavigatorScreenParams } from '@react-navigation/native';

// Tipos de navegação para o Stack Principal
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Tipos de navegação para Autenticação
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

// Tipos de navegação para Tabs Principais
export type MainTabParamList = {
  Feed: NavigatorScreenParams<FeedStackParamList>;
  Folders: NavigatorScreenParams<FoldersStackParamList>;
  Create: undefined;
  Search: NavigatorScreenParams<SearchStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

// Tipos de navegação para Feed
export type FeedStackParamList = {
  FeedList: undefined;
  PostDetails: { postId: string };
  UserProfile: { userId: string };
};

// Tipos de navegação para Pastas
export type FoldersStackParamList = {
  FoldersList: undefined;
  FolderDetails: { folderId: string };
  CreateFolder: undefined;
  EditFolder: { folderId: string };
};

// Tipos de navegação para Busca
export type SearchStackParamList = {
  SearchHome: undefined;
  SearchResults: { query: string; type?: 'posts' | 'users' | 'folders' };
};

// Tipos de navegação para Perfil
export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  Settings: undefined;
  MyPosts: undefined;
  MyFolders: undefined;
};

// Declaração global para TypeScript
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}