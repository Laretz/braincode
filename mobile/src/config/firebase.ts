import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase - substitua pelos seus dados do console Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:demo',
};

let app: FirebaseApp | null;
let auth: Auth | null;
let db: Firestore | null;

try {
  // Inicializar Firebase
  app = initializeApp(firebaseConfig);
  
  // Configurar Auth
  try {
    auth = initializeAuth(app);
  } catch (authError: any) {
    // Se já foi inicializado, usar getAuth
    if (authError.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      throw authError;
    }
  }
  
  // Configurar Firestore
  db = getFirestore(app);
  
  // Para desenvolvimento local (opcional)
  if (__DEV__) {
    console.log('Firebase inicializado em modo de desenvolvimento');
    // Conectar ao emulador do Firestore se estiver em desenvolvimento
    // connectFirestoreEmulator(db, 'localhost', 8080);
  }
} catch (error) {
  console.error('Erro ao inicializar Firebase:', error);
  // Em caso de erro, criar instâncias mock para evitar crashes
  app = null;
  auth = null;
  db = null;
}

export { auth, db };
export default app;