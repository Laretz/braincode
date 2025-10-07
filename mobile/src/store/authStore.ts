import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, UserProfile, RegisterData } from '../services/authService';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (user: UserProfile) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
       user: null,
       isAuthenticated: false,
       isLoading: false,
       error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          
          const userProfile = await authService.login({ email, password });
          
          set({
            user: userProfile,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Erro no login:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true });
          
          const userProfile = await authService.register(data);
          
          set({
            user: userProfile,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Erro no registro:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Fazer logout no Firebase
          await authService.logout();
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
          // Mesmo com erro, limpar o estado
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true });
          
          // Fazer logout no Firebase
          await authService.logout();
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
          // Mesmo com erro, limpar o estado
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      loadUser: async () => {
        try {
          set({ isLoading: true });
          
          // Verificar se o usuário ainda está autenticado no Firebase
          const currentUser = authService.getCurrentUser();
          if (currentUser && get().user) {
            set({
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateUser: (user: UserProfile) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);