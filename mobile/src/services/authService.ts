import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User,
  UserCredential 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const getAuth = () => {
  if (!auth) {
    throw new Error('Firebase Auth não foi inicializado corretamente');
  }
  return auth;
};

const getDb = () => {
  if (!db) {
    throw new Error('Firebase Firestore não foi inicializado corretamente');
  }
  return db;
};

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  /**
   * Registra um novo usuário
   */
  async register(data: RegisterData): Promise<UserProfile> {
    try {
      // Criar usuário no Firebase Auth
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        getAuth(), 
        data.email, 
        data.password
      );

      const user = userCredential.user;

      // Atualizar perfil do usuário
      await updateProfile(user, {
        displayName: data.name
      });

      // Criar documento do usuário no Firestore
      const userProfile: UserProfile = {
        id: user.uid,
        email: data.email,
        name: data.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(getDb(), 'users', user.uid), userProfile);

      return userProfile;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Faz login do usuário
   */
  async login(data: LoginData): Promise<UserProfile> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        getAuth(), 
        data.email, 
        data.password
      );

      const user = userCredential.user;
      
      // Buscar dados do usuário no Firestore
      const userDoc = await getDoc(doc(getDb(), 'users', user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Dados do usuário não encontrados');
      }

      const userData = userDoc.data() as UserProfile;
      
      // Garantir que o id esteja sempre presente
      if (!userData.id) {
        userData.id = user.uid;
      }

      return userData;
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await signOut(getAuth());
    } catch (error: any) {
      console.error('Erro no logout:', error);
      throw new Error('Erro ao fazer logout');
    }
  }

  /**
   * Obtém o usuário atual (desabilitado - usando API do backend)
   */
  getCurrentUser(): User | null {
    console.log('Firebase desabilitado - usando apenas API do backend PostgreSQL');
    return null;
  }

  /**
   * Busca dados completos do usuário atual
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = this.getCurrentUser();
    if (!user) return null;

    try {
      const userDoc = await getDoc(doc(getDb(), 'users', user.uid));
      return userDoc.exists() ? userDoc.data() as UserProfile : null;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }

  /**
   * Converte códigos de erro Firebase em mensagens amigáveis
   */
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este email já está sendo usado por outra conta';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/operation-not-allowed':
        return 'Operação não permitida';
      case 'auth/weak-password':
        return 'Senha muito fraca. Use pelo menos 6 caracteres';
      case 'auth/user-disabled':
        return 'Esta conta foi desabilitada';
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/invalid-credential':
        return 'Credenciais inválidas';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde';
      default:
        return 'Erro de autenticação. Tente novamente';
    }
  }
}

export const authService = new AuthService();