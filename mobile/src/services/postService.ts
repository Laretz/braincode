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
  limit,
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

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  folderId?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likesCount: number;
  commentsCount: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  code?: string;
  language?: string;
  folderId?: string;
  tags: string[];
  isPublic: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  folderId?: string;
  tags?: string[];
  isPublic?: boolean;
}

class PostService {
  private get postsCollection() {
    return collection(getDb(), "posts");
  }

  // Criar um novo post
  async createPost(userId: string, postData: CreatePostData): Promise<string> {
    try {
      if (!userId) {
        throw new Error('userId é obrigatório para criar um post');
      }

      // Remove campos undefined para evitar erros no Firestore
      const cleanPostData = Object.fromEntries(
        Object.entries(postData).filter(([_, value]) => value !== undefined)
      );

      const finalData = {
        ...cleanPostData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
      };

      const docRef = await addDoc(this.postsCollection, finalData);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar post:", error);
      throw new Error("Falha ao criar post");
    }
  }

  // Buscar posts do usuário
  async getUserPosts(userId: string): Promise<Post[]> {
    try {
      // Temporariamente removendo orderBy até que os índices sejam processados
      const q = query(
        this.postsCollection,
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Post)
      );

      // Ordenação manual no cliente até que os índices estejam prontos
      return posts.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime.getTime() - aTime.getTime(); // desc
      });
    } catch (error) {
      console.error("Erro ao buscar posts do usuário:", error);
      throw new Error("Falha ao buscar posts");
    }
  }

  // Buscar posts públicos
  async getPublicPosts(limitCount: number = 20): Promise<Post[]> {
    try {
      // Temporariamente removendo orderBy para evitar erro de índice
      // Para usar orderBy com where, é necessário criar um índice composto no Firestore
      const q = query(
        this.postsCollection,
        where("isPublic", "==", true),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Post)
      );

      // Ordenação manual no cliente até que o índice seja criado
      return posts.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });
    } catch (error) {
      console.error("Erro ao buscar posts públicos:", error);
      throw new Error("Falha ao buscar posts públicos");
    }
  }

  // Buscar posts por pasta
  async getPostsByFolder(folderId: string): Promise<Post[]> {
    try {
      const q = query(
        this.postsCollection,
        where("folderId", "==", folderId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Post)
      );
    } catch (error) {
      console.error("Erro ao buscar posts da pasta:", error);
      throw new Error("Falha ao buscar posts da pasta");
    }
  }

  // Buscar um post específico
  async getPost(postId: string): Promise<Post | null> {
    try {
      const docRef = doc(this.postsCollection, postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Post;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar post:", error);
      throw new Error("Falha ao buscar post");
    }
  }

  // Atualizar post
  async updatePost(postId: string, updateData: UpdatePostData): Promise<void> {
    try {
      const docRef = doc(this.postsCollection, postId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao atualizar post:", error);
      throw new Error("Falha ao atualizar post");
    }
  }

  // Deletar post
  async deletePost(postId: string): Promise<void> {
    try {
      const docRef = doc(this.postsCollection, postId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      throw new Error("Falha ao deletar post");
    }
  }

  // Observar posts do usuário em tempo real
  subscribeToUserPosts(
    userId: string,
    callback: (posts: Post[]) => void
  ): () => void {
    const q = query(
      this.postsCollection,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const posts = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Post)
        );
        callback(posts);
      },
      (error) => {
        console.error("Erro na observação de posts:", error);
      }
    );
  }

  // Observar posts públicos em tempo real
  subscribeToPublicPosts(
    callback: (posts: Post[]) => void,
    limitCount: number = 20
  ): () => void {
    const q = query(
      this.postsCollection,
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const posts = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Post)
        );
        callback(posts);
      },
      (error) => {
        console.error("Erro na observação de posts públicos:", error);
      }
    );
  }

  // Buscar posts por tags
  async getPostsByTags(tags: string[]): Promise<Post[]> {
    try {
      const q = query(
        this.postsCollection,
        where("tags", "array-contains-any", tags),
        where("isPublic", "==", true),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Post)
      );
    } catch (error) {
      console.error("Erro ao buscar posts por tags:", error);
      throw new Error("Falha ao buscar posts por tags");
    }
  }

  // Buscar posts por texto
  async searchPosts(params: {
    query: string;
    language?: string;
    sortBy?: 'recent' | 'popular' | 'oldest';
  }): Promise<Post[]> {
    try {
      const { query: searchQuery, language, sortBy = 'recent' } = params;
      
      // Buscar posts públicos que contenham o termo no título ou conteúdo
      let q = query(
        this.postsCollection,
        where("isPublic", "==", true)
      );

      // Filtrar por linguagem se especificada
      if (language) {
        q = query(q, where("tags", "array-contains", language));
      }

      // Ordenar conforme solicitado
      switch (sortBy) {
        case 'popular':
          q = query(q, orderBy("likesCount", "desc"));
          break;
        case 'oldest':
          q = query(q, orderBy("createdAt", "asc"));
          break;
        default: // 'recent'
          q = query(q, orderBy("createdAt", "desc"));
          break;
      }

      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Post)
      );

      // Filtrar posts que contenham o termo de busca no título ou conteúdo
      const searchTerm = searchQuery.toLowerCase();
      return posts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm) ||
        post.content?.toLowerCase().includes(searchTerm) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      throw new Error("Falha ao buscar posts");
    }
  }
}

export const postService = new PostService();
