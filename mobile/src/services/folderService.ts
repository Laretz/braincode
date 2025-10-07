import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const getDb = () => {
  if (!db) {
    throw new Error('Firebase não foi inicializado corretamente');
  }
  return db;
};

export interface Folder {
  id: string;
  name: string;
  description?: string;
  userId: string;
  color: string;
  icon: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  postsCount: number;
}

export interface CreateFolderData {
  name: string;
  description?: string;
  color: string;
  icon: string;
  isPublic: boolean;
}

export interface UpdateFolderData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  isPublic?: boolean;
}

class FolderService {
  private get foldersCollection() {
    return collection(getDb(), "folders");
  }

  // Criar uma nova pasta
  async createFolder(
    userId: string,
    folderData: CreateFolderData
  ): Promise<string> {
    try {
      // Remove campos undefined para evitar erros no Firestore
      const cleanFolderData = Object.fromEntries(
        Object.entries(folderData).filter(([_, value]) => value !== undefined)
      );

      const docRef = await addDoc(this.foldersCollection, {
        ...cleanFolderData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        postsCount: 0,
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
      throw new Error("Falha ao criar pasta");
    }
  }

  // Buscar pastas do usuário
  async getUserFolders(userId: string): Promise<Folder[]> {
    try {
      // Temporariamente removendo orderBy até que os índices sejam processados
      const q = query(
        this.foldersCollection,
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const folders = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        } as Folder;
      });

      // Ordenação manual no cliente até que os índices estejam prontos
      return folders.sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime; // desc
      });
    } catch (error) {
      console.error("Erro ao buscar pastas do usuário:", error);
      throw new Error("Falha ao buscar pastas");
    }
  }

  // Buscar pastas públicas
  async getPublicFolders(): Promise<Folder[]> {
    try {
      const q = query(
        this.foldersCollection,
        where("isPublic", "==", true),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        } as Folder;
      });
    } catch (error) {
      console.error("Erro ao buscar pastas públicas:", error);
      throw new Error("Falha ao buscar pastas públicas");
    }
  }

  // Buscar uma pasta específica
  async getFolder(folderId: string): Promise<Folder | null> {
    try {
      const docRef = doc(this.foldersCollection, folderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        } as Folder;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar pasta:", error);
      throw new Error("Falha ao buscar pasta");
    }
  }

  // Atualizar pasta
  async updateFolder(
    folderId: string,
    updateData: UpdateFolderData
  ): Promise<void> {
    try {
      const docRef = doc(this.foldersCollection, folderId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao atualizar pasta:", error);
      throw new Error("Falha ao atualizar pasta");
    }
  }

  // Deletar pasta
  async deleteFolder(folderId: string): Promise<void> {
    try {
      const docRef = doc(this.foldersCollection, folderId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erro ao deletar pasta:", error);
      throw new Error("Falha ao deletar pasta");
    }
  }

  // Incrementar contador de posts
  async incrementPostsCount(folderId: string): Promise<void> {
    try {
      const docRef = doc(this.foldersCollection, folderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentCount = docSnap.data().postsCount || 0;
        await updateDoc(docRef, {
          postsCount: currentCount + 1,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Erro ao incrementar contador de posts:", error);
      throw new Error("Falha ao atualizar contador de posts");
    }
  }

  // Decrementar contador de posts
  async decrementPostsCount(folderId: string): Promise<void> {
    try {
      const docRef = doc(this.foldersCollection, folderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentCount = docSnap.data().postsCount || 0;
        await updateDoc(docRef, {
          postsCount: Math.max(0, currentCount - 1),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Erro ao decrementar contador de posts:", error);
      throw new Error("Falha ao atualizar contador de posts");
    }
  }

  // Recalcular contador de posts de uma pasta
  async recalculatePostsCount(folderId: string): Promise<void> {
    try {
      // Buscar todos os posts da pasta
      const postsCollection = collection(getDb(), "posts");
      const q = query(postsCollection, where("folderId", "==", folderId));
      const querySnapshot = await getDocs(q);
      const actualCount = querySnapshot.size;

      console.log(`📊 Pasta ${folderId}: ${actualCount} posts encontrados`);

      // Atualizar o contador na pasta
      const docRef = doc(this.foldersCollection, folderId);
      await updateDoc(docRef, {
        postsCount: actualCount,
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ Contador da pasta ${folderId} atualizado para ${actualCount}`);
    } catch (error) {
      console.error("Erro ao recalcular contador de posts:", error);
      throw new Error("Falha ao recalcular contador de posts");
    }
  }

  // Observar pastas do usuário em tempo real
  subscribeToUserFolders(
    userId: string,
    callback: (folders: Folder[]) => void
  ): () => void {
    // Temporariamente removendo orderBy até que os índices sejam processados
    const q = query(
      this.foldersCollection,
      where("userId", "==", userId)
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const folders = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Folder)
        );
        
        // Ordenação manual no cliente até que os índices estejam prontos
        const sortedFolders = folders.sort((a, b) => {
          // Lidar com Timestamps do Firestore ou strings de data
          const aTime = (a.createdAt as any)?.toDate 
            ? (a.createdAt as any).toDate() 
            : a.createdAt 
              ? new Date(a.createdAt) 
              : new Date(0);
          const bTime = (b.createdAt as any)?.toDate 
            ? (b.createdAt as any).toDate() 
            : b.createdAt 
              ? new Date(b.createdAt) 
              : new Date(0);
          return bTime.getTime() - aTime.getTime(); // desc
        });
        
        callback(sortedFolders);
      },
      (error) => {
        console.error("Erro na observação de pastas:", error);
      }
    );
  }

  // Observar pastas públicas em tempo real
  subscribeToPublicFolders(callback: (folders: Folder[]) => void): () => void {
    const q = query(
      this.foldersCollection,
      where("isPublic", "==", true),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const folders = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Folder)
        );
        callback(folders);
      },
      (error) => {
        console.error("Erro na observação de pastas públicas:", error);
      }
    );
  }

  // Verificar se o usuário é dono da pasta
  async isOwner(folderId: string, userId: string): Promise<boolean> {
    try {
      const folder = await this.getFolder(folderId);
      return folder?.userId === userId;
    } catch (error) {
      console.error("Erro ao verificar propriedade da pasta:", error);
      return false;
    }
  }
}

export const folderService = new FolderService();
