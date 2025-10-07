import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  bio?: string;
  avatar?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UpdateUserData {
  displayName?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

class UserService {
  private usersCollection = collection(db!, "users");

  // Buscar usuário por ID
  async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(this.usersCollection, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          uid: docSnap.id,
          ...docSnap.data(),
        } as UserProfile;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw new Error("Falha ao buscar usuário");
    }
  }

  // Buscar usuários por nome/username
  async searchUsers(searchTerm: string, limitCount: number = 20): Promise<UserProfile[]> {
    try {
      // Buscar por displayName
      const displayNameQuery = query(
        this.usersCollection,
        where("displayName", ">=", searchTerm),
        where("displayName", "<=", searchTerm + "\uf8ff"),
        orderBy("displayName"),
        limit(limitCount)
      );

      // Buscar por username
      const usernameQuery = query(
        this.usersCollection,
        where("username", ">=", searchTerm),
        where("username", "<=", searchTerm + "\uf8ff"),
        orderBy("username"),
        limit(limitCount)
      );

      const [displayNameSnapshot, usernameSnapshot] = await Promise.all([
        getDocs(displayNameQuery),
        getDocs(usernameQuery),
      ]);

      const users = new Map<string, UserProfile>();

      // Adicionar resultados de displayName
      displayNameSnapshot.docs.forEach((doc) => {
        users.set(doc.id, {
          uid: doc.id,
          ...doc.data(),
        } as UserProfile);
      });

      // Adicionar resultados de username (sem duplicar)
      usernameSnapshot.docs.forEach((doc) => {
        if (!users.has(doc.id)) {
          users.set(doc.id, {
            uid: doc.id,
            ...doc.data(),
          } as UserProfile);
        }
      });

      return Array.from(users.values()).slice(0, limitCount);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw new Error("Falha ao buscar usuários");
    }
  }

  // Atualizar perfil do usuário
  async updateProfile(userId: string, updateData: UpdateUserData): Promise<void> {
    try {
      const docRef = doc(this.usersCollection, userId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw new Error("Falha ao atualizar perfil");
    }
  }

  // Verificar se username está disponível
  async isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    try {
      const q = query(
        this.usersCollection,
        where("username", "==", username),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return true;
      }

      // Se há um usuário para excluir da verificação (edição de perfil)
      if (excludeUserId) {
        const existingUser = querySnapshot.docs[0];
        return existingUser.id === excludeUserId;
      }

      return false;
    } catch (error) {
      console.error("Erro ao verificar username:", error);
      throw new Error("Falha ao verificar username");
    }
  }
}

export const userService = new UserService();