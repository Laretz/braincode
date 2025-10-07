// Buscar posts de um usuário ordenados por data
query(
  postsCollection,
  where("userId", "==", userId),
  orderBy("createdAt", "desc")
)# 🏗️ Arquitetura do BrainCode

## 📋 **Visão Geral**

O **BrainCode** é uma rede social para desenvolvedores organizarem e compartilharem conhecimento, construída com uma arquitetura moderna e escalável baseada em **React Native + Firebase**.

## 🎯 Conceito

Uma plataforma onde desenvolvedores podem:
- 📝 Criar posts organizados em pastas
- 💬 Comentar e interagir com outros desenvolvedores
- 🔍 Buscar conteúdo relevante
- 👤 Gerenciar perfis e seguir outros usuários

## 🏛️ Arquitetura Geral

```
BrainCode/
├── mobile/           # 📱 App React Native + Expo
├── shared/           # 🔄 Schemas TypeScript compartilhados
├── firebase.json     # ⚙️ Configuração Firebase
├── firestore.rules   # 🔒 Regras de segurança
└── firestore.indexes.json # 📊 Índices do Firestore
```

## 📱 Mobile App (React Native + Expo)

### **Stack Tecnológico:**
- **React Native** com **Expo** - Framework principal
- **TypeScript** - Tipagem estática
- **Firebase** - Backend-as-a-Service
- **Zustand** - Gerenciamento de estado
- **TanStack Query** - Cache e sincronização de dados
- **NativeBase** - Biblioteca de componentes UI
- **React Navigation** - Navegação entre telas
- **React Hook Form** - Gerenciamento de formulários

### **Estrutura do Mobile:**

```
mobile/
├── src/
│   ├── components/     # 🧩 Componentes reutilizáveis
│   ├── screens/        # 📺 Telas da aplicação
│   ├── hooks/          # 🎣 Custom hooks
│   ├── services/       # 🔧 Serviços (Firebase, API)
│   ├── stores/         # 🗄️ Estados globais (Zustand)
│   ├── types/          # 📝 Definições de tipos
│   ├── utils/          # 🛠️ Utilitários
│   └── config/         # ⚙️ Configurações
├── assets/             # 🖼️ Imagens e recursos
└── app.json           # 📋 Configuração do Expo
```

## 🔥 Firebase Backend

### **Serviços Utilizados:**

#### **🔐 Authentication**
- Login/registro de usuários
- Gerenciamento de sessões
- Integração com providers externos

#### **📊 Firestore Database**
- **Coleções principais:**
  - `users` - Dados dos usuários
  - `posts` - Posts dos usuários
  - `folders` - Organização em pastas
  - `comments` - Comentários nos posts

#### **📁 Storage**
- Upload de imagens de perfil
- Armazenamento de mídia dos posts

### **Estrutura do Firestore:**

```javascript
// Coleção: users
{
  id: string,
  name: string,
  email: string,
  avatar?: string,
  bio?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Coleção: folders
{
  id: string,
  name: string,
  description?: string,
  userId: string,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Coleção: posts
{
  id: string,
  title: string,
  content: string,
  userId: string,
  folderId?: string,
  tags: string[],
  createdAt: timestamp,
  updatedAt: timestamp
}

// Coleção: comments
{
  id: string,
  content: string,
  postId: string,
  userId: string,
  createdAt: timestamp
}
```

## 🔄 Fluxo de Dados

### **1. Autenticação:**
```
User → Firebase Auth → App State (Zustand) → Protected Routes
```

### **2. Operações CRUD:**
```
UI Component → Custom Hook → Firebase Service → Firestore → TanStack Query Cache → UI Update
```

### **3. Estado Global:**
```
Zustand Stores:
├── authStore     # 👤 Estado de autenticação
├── userStore     # 👥 Dados do usuário
└── appStore      # 🎛️ Estado geral da aplicação
```

## 🎣 Custom Hooks

### **Principais Hooks:**
- `useAuth()` - Gerenciamento de autenticação
- `useApi()` - Operações com Firebase
- `usePosts()` - Gerenciamento de posts
- `useFolders()` - Gerenciamento de pastas
- `useComments()` - Gerenciamento de comentários

## 🔧 Serviços

### **Firebase Services:**
- `authService.ts` - Autenticação
- `postService.ts` - Operações com posts
- `folderService.ts` - Operações com pastas
- `commentService.ts` - Operações com comentários
- `userService.ts` - Operações com usuários

## 📊 Índices do Firestore

### **Índices Configurados:**
```javascript
// posts collection
{
  fields: [
    { fieldPath: "folderId", order: "ASCENDING" },
    { fieldPath: "createdAt", order: "DESCENDING" }
  ]
}
```

## 🔒 Segurança

### **Firestore Rules:**
- Usuários só podem editar seus próprios dados
- Posts são públicos para leitura
- Comentários requerem autenticação
- Validação de tipos e estruturas

## 🚀 Performance

### **Otimizações:**
- **TanStack Query** para cache inteligente
- **Lazy loading** de componentes
- **Infinite queries** para listas grandes
- **Índices otimizados** no Firestore
- **Memoização** de componentes pesados

## 🔄 Shared Schemas

### **Tipos Compartilhados:**
```typescript
// shared/schemas/
├── user.ts       # Tipos de usuário
├── post.ts       # Tipos de post
├── folder.ts     # Tipos de pasta
└── comment.ts    # Tipos de comentário
```

## 📈 Escalabilidade

### **Estratégias:**
- **Modularização** por funcionalidade
- **Separação de responsabilidades**
- **Cache inteligente** com TanStack Query
- **Lazy loading** de recursos
- **Índices otimizados** para consultas

## 🛠️ Desenvolvimento

### **Ferramentas:**
- **Expo CLI** - Desenvolvimento e build
- **TypeScript** - Tipagem estática
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

### **Scripts Principais:**
```bash
npm start          # Inicia o servidor de desenvolvimento
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa no navegador
```

## 🔮 Futuras Melhorias

### **Roadmap:**
- 🔍 **Busca avançada** com Algolia
- 📱 **Push notifications**
- 🌙 **Modo escuro**
- 📊 **Analytics** de uso
- 🔄 **Sincronização offline**
- 👥 **Sistema de seguir usuários**
- ❤️ **Sistema de likes**

---

*Esta arquitetura foi projetada para ser **escalável**, **manutenível** e **performática**, seguindo as melhores práticas de desenvolvimento mobile e Firebase.*