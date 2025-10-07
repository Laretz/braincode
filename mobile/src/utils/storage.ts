import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Wrapper para armazenamento seguro que funciona tanto no mobile quanto na web
 * No mobile usa ExpoSecureStore, na web usa localStorage
 */
class StorageService {
  /**
   * Armazena um valor de forma segura
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Na web, usar localStorage
        localStorage.setItem(key, value);
      } else {
        // No mobile, usar SecureStore
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
      throw error;
    }
  }

  /**
   * Recupera um valor armazenado
   */
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // Na web, usar localStorage
        return localStorage.getItem(key);
      } else {
        // No mobile, usar SecureStore
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error(`Erro ao recuperar ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove um valor armazenado
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Na web, usar localStorage
        localStorage.removeItem(key);
      } else {
        // No mobile, usar SecureStore
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
      throw error;
    }
  }

  /**
   * Verifica se uma chave existe
   */
  async hasItem(key: string): Promise<boolean> {
    try {
      const value = await this.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Erro ao verificar ${key}:`, error);
      return false;
    }
  }

  /**
   * Limpa todos os dados armazenados (use com cuidado!)
   */
  async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Na web, limpar apenas as chaves do app
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('braincode_')) {
            localStorage.removeItem(key);
          }
        });
      } else {
        // No mobile, seria necessário conhecer todas as chaves
        // Por segurança, não implementamos clear completo no mobile
        console.warn('Clear completo não implementado para mobile por segurança');
      }
    } catch (error) {
      console.error('Erro ao limpar storage:', error);
      throw error;
    }
  }
}

// Exportar instância singleton
export const storageService = new StorageService();

// Exportar também como default para compatibilidade
export default storageService;