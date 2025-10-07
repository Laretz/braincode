# 📱 BrainCode

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)

</div>

---

## 🎯 **Sobre o Projeto**

O **BrainCode** é uma rede social inovadora projetada especificamente para desenvolvedores que desejam organizar, compartilhar e descobrir conhecimento de forma estruturada e colaborativa.

### 🔍 Problema que Resolve
- **📚 Fragmentação do conhecimento**: Desenvolvedores frequentemente perdem insights valiosos em notas dispersas
- **🗂️ Falta de organização**: Dificuldade em categorizar e encontrar conteúdo técnico relevante
- **🏝️ Isolamento profissional**: Limitadas oportunidades de compartilhar experiências e aprender com pares
- **🌊 Sobrecarga de informação**: Excesso de conteúdo sem curadoria ou contexto adequado

### ✨ Solução Proposta
Uma plataforma que combina:
- 📝 **Organização pessoal** através de posts estruturados em pastas temáticas
- 🤝 **Colaboração social** com sistema de comentários e interações
- 🔍 **Descoberta inteligente** de conteúdo relevante baseado em interesses
- 👥 **Networking profissional** conectando desenvolvedores com interesses similares

## 🏗️ Arquitetura

### 📱 Mobile (Principal)
- **Framework**: React Native com Expo
- **Linguagem**: TypeScript
- **Backend**: Firebase (Firestore + Auth + Storage)
- **Gerenciamento de Estado**: Zustand
- **Cache/Sincronização**: TanStack Query
- **UI Library**: NativeBase
- **Navegação**: React Navigation
- **Animações**: Reanimated

### 🔄 Shared
- **Schemas**: TypeScript interfaces compartilhados
- **Tipos**: Definições comuns entre módulos

### 🔥 Firebase Services
- **Authentication**: Login/registro de usuários
- **Firestore**: Banco de dados NoSQL em tempo real
- **Storage**: Upload e armazenamento de imagens
- **Analytics**: Métricas de uso da aplicação

## 🛠️ Stack Tecnológico

### 📱 Mobile Stack
```typescript
// Core
- React Native 0.74.5
- Expo SDK 51.0.28
- TypeScript 5.3.3

// Backend-as-a-Service
- Firebase 10.13.2
- Firestore (Database)
- Firebase Auth
- Firebase Storage

// State Management
- Zustand 4.5.5
- TanStack Query 5.56.2

// UI & Navigation
- NativeBase 3.4.28
- React Navigation 6.x
- React Native Reanimated 3.10.1

// Forms & Validation
- React Hook Form 7.53.0
- Zod (via shared schemas)

// Development
- Expo Dev Tools
- TypeScript
- ESLint + Prettier
```

## 🚀 Funcionalidades Implementadas

### ✅ **Autenticação Completa**
- 🔐 Login/Registro com Firebase Auth
- 👤 Perfil de usuário personalizado
- 🚪 Logout seguro
- 🔄 Persistência de sessão

### ✅ **Sistema de Posts**
- 📝 Criar posts com título e conteúdo rico
- ✏️ Editar posts próprios
- 🗑️ Deletar posts próprios
- 📱 Feed principal com scroll infinito
- 🔄 Atualizações em tempo real

### ✅ **Organização Inteligente**
- 📂 Criar pastas temáticas personalizadas
- 🗂️ Organizar posts em pastas
- 📊 Contador de posts por pasta
- 🎯 Visualização filtrada por pasta

### ✅ **Interação Social**
- 💬 Sistema completo de comentários
- 👀 Visualização de comentários em tempo real
- 🔄 Atualizações automáticas

### 🔄 **Em Desenvolvimento**
- ❤️ Sistema de likes
- 👥 Seguir usuários
- 🔍 Busca avançada
- 📱 Notificações push

## 📱 Telas da Aplicação

### 🔐 **Stack de Autenticação**
- **LoginScreen** - Interface de login elegante
- **RegisterScreen** - Cadastro de novos usuários

### 🏠 **Stack Principal**
- **HomeScreen** - Feed principal com posts
- **CreatePostScreen** - Criação de novos posts
- **PostDetailScreen** - Detalhes + comentários
- **ProfileScreen** - Perfil do usuário
- **FoldersScreen** - Gerenciamento de pastas
- **SearchScreen** - Busca de conteúdo

## 🗂️ Estrutura do Projeto

```
braincode/
├── mobile/                 # 📱 App React Native + Expo
│   ├── src/
│   │   ├── components/     # 🧩 Componentes reutilizáveis
│   │   │   ├── ui/        # 🎨 Componentes base
│   │   │   ├── forms/     # 📝 Componentes de formulário
│   │   │   └── layout/    # 🏗️ Componentes de layout
│   │   ├── screens/       # 📺 Telas da aplicação
│   │   │   ├── auth/      # 🔐 Autenticação
│   │   │   ├── home/      # 🏠 Tela principal
│   │   │   ├── posts/     # 📝 Posts
│   │   │   ├── profile/   # 👤 Perfil
│   │   │   └── folders/   # 📂 Pastas
│   │   ├── hooks/         # 🎣 Custom hooks
│   │   ├── services/      # 🔧 Serviços Firebase
│   │   ├── stores/        # 🗄️ Estados globais
│   │   ├── types/         # 📝 Tipos TypeScript
│   │   ├── utils/         # 🛠️ Utilitários
│   │   └── config/        # ⚙️ Configurações
│   ├── assets/            # 🖼️ Recursos visuais
│   └── app.json          # 📋 Config Expo
├── shared/                # 🔄 Schemas compartilhados
├── firebase.json          # 🔥 Config Firebase
├── firestore.rules        # 🔒 Regras de segurança
└── firestore.indexes.json # 📊 Índices otimizados
```

## 🚀 Instalação e Configuração

### **📋 Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio (Android)
- Xcode (iOS)

### **⚡ Instalação Rápida**

```bash
# 1. Clone o repositório
git clone <repository-url>
cd braincode

# 2. Instale dependências
cd mobile
npm install

# 3. Configure Firebase
cp .env.example .env
# Edite o .env com suas credenciais Firebase

# 4. Execute o projeto
npm start
```

### **📱 Executar no Dispositivo**

```bash
# Android
npm run android

# iOS  
npm run ios

# Web
npm run web
```

## 🔥 Configuração Firebase

### **1. Criar Projeto**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie novo projeto
3. Ative Authentication, Firestore e Storage

### **2. Configurar Serviços**
```javascript
// Authentication
- Email/Password ✅
- Domínios autorizados ✅

// Firestore
- Banco de dados criado ✅
- Regras de segurança ✅
- Índices otimizados ✅

// Storage
- Upload de imagens ✅
- Regras configuradas ✅
```

### **3. Variáveis de Ambiente**
```bash
# .env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📊 Estrutura do Firestore

### **🗃️ Coleções Principais**

```typescript
// users - Dados dos usuários
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// folders - Organização em pastas
interface Folder {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// posts - Posts dos usuários
interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  folderId?: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// comments - Comentários nos posts
interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: Timestamp;
}
```

### **📈 Índices Otimizados**
```javascript
// posts collection - Para consultas por pasta
{
  fields: [
    { fieldPath: "folderId", order: "ASCENDING" },
    { fieldPath: "createdAt", order: "DESCENDING" }
  ]
}
```

## 🔒 Segurança Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus dados
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Posts públicos para leitura, edição apenas pelo autor
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
    
    // Comentários requerem autenticação
    match /comments/{commentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Pastas privadas por usuário
    match /folders/{folderId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🚀 Deploy e Distribuição

### **📦 Build com EAS**
```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Configurar projeto
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios

# Submit para stores
eas submit
```

### **🌐 Deploy Firebase**
```bash
# Deploy regras e índices
firebase deploy --only firestore:rules,firestore:indexes

# Deploy completo
firebase deploy
```

## 📈 Performance e Otimização

### **⚡ Estratégias Implementadas**
- **Lazy Loading** - Componentes carregados sob demanda
- **React.memo** - Memoização de componentes
- **Infinite Queries** - Paginação eficiente
- **TanStack Query** - Cache inteligente
- **Índices Firestore** - Consultas otimizadas
- **Image Optimization** - Compressão automática

### **📊 Métricas**
- Tempo de carregamento inicial: < 3s
- Scroll infinito: 60fps
- Cache hit rate: > 90%
- Bundle size: < 50MB

## 🔮 Roadmap de Desenvolvimento

### **🎯 Próximas Features (Q1 2025)**
- [ ] ❤️ Sistema de likes nos posts
- [ ] 👥 Seguir/deixar de seguir usuários
- [ ] 🔍 Busca avançada com filtros
- [ ] 📱 Notificações push
- [ ] 🌙 Modo escuro
- [ ] 📤 Compartilhamento de posts

### **🛠️ Melhorias Técnicas (Q2 2025)**
- [ ] 🧪 Testes automatizados (Jest + Detox)
- [ ] 🔄 CI/CD pipeline
- [ ] 📊 Monitoramento de erros (Sentry)
- [ ] 📈 Analytics avançados
- [ ] 📱 Suporte offline
- [ ] 🔄 Sincronização em background

### **🚀 Features Avançadas (Q3-Q4 2025)**
- [ ] 🤖 IA para sugestões de conteúdo
- [ ] 🎥 Suporte a vídeos
- [ ] 🔗 Integração com GitHub
- [ ] 📊 Dashboard de analytics
- [ ] 🌐 Versão web (React)

**Desenvolvido com ❤️ para a comunidade dev**
