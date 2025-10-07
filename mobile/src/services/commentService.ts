import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const getDb = () => {
  if (!db) {
    throw new Error('Firebase não foi inicializado corretamente');
  }
  return db;
};

export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateCommentData {
  content: string;
  postId: string;
}

export interface UpdateCommentData {
  content?: string;
}

class CommentService {
  private get commentsCollection() {
    return collection(getDb(), 'comments');
  }

  // Criar um novo comentário
  async createComment(userId: string, commentData: CreateCommentData): Promise<string> {
    try {
      const docRef = await addDoc(this.commentsCollection, {
        ...commentData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      throw new Error('Falha ao criar comentário');
    }
  }

  // Buscar comentários de um post
  async getPostComments(postId: string): Promise<Comment[]> {
    try {
      const q = query(
        this.commentsCollection,
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Comment));
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      throw new Error('Falha ao buscar comentários');
    }
  }

  // Atualizar comentário
  async updateComment(commentId: string, updateData: UpdateCommentData): Promise<void> {
    try {
      const commentRef = doc(this.commentsCollection, commentId);
      await updateDoc(commentRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
      throw new Error('Falha ao atualizar comentário');
    }
  }

  // Deletar comentário
  async deleteComment(commentId: string): Promise<void> {
    try {
      const commentRef = doc(this.commentsCollection, commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      throw new Error('Falha ao deletar comentário');
    }
  }
}

export const commentService = new CommentService();