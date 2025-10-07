// Configurações da API
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.194:3334', // URL do backend (IP da rede local)
  TIMEOUT: 10000,
};

// Cores do tema
export const COLORS = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#10b981',
  background: '#ffffff',
  backgroundDark: '#1f2937',
  surface: '#f9fafb',
  surfaceDark: '#374151',
  text: '#111827',
  textDark: '#f9fafb',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  borderDark: '#4b5563',
  error: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  info: '#3b82f6',
};

// Cores para pastas
export const FOLDER_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
  '#f43f5e', // rose
];

// Linguagens de programação suportadas
export const PROGRAMMING_LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C#', value: 'csharp' },
  { label: 'C++', value: 'cpp' },
  { label: 'C', value: 'c' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Dart', value: 'dart' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'scss' },
  { label: 'SQL', value: 'sql' },
  { label: 'JSON', value: 'json' },
  { label: 'YAML', value: 'yaml' },
  { label: 'XML', value: 'xml' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Bash', value: 'bash' },
  { label: 'PowerShell', value: 'powershell' },
];

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
};

// Configurações de storage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'braincode_auth_token',
  USER_DATA: 'braincode_user_data',
  THEME: 'braincode_theme',
};

// Configurações de validação
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 500,
  POST_TITLE_MAX_LENGTH: 100,
  POST_CONTENT_MAX_LENGTH: 5000,
  FOLDER_NAME_MAX_LENGTH: 30,
  COMMENT_MAX_LENGTH: 500,
};

// Mensagens de erro
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente.',
};

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  REGISTER: 'Conta criada com sucesso!',
  POST_CREATED: 'Post criado com sucesso!',
  POST_UPDATED: 'Post atualizado com sucesso!',
  POST_DELETED: 'Post excluído com sucesso!',
  FOLDER_CREATED: 'Pasta criada com sucesso!',
  FOLDER_UPDATED: 'Pasta atualizada com sucesso!',
  FOLDER_DELETED: 'Pasta excluída com sucesso!',
  COMMENT_CREATED: 'Comentário adicionado!',
  LIKE_ADDED: 'Post curtido!',
  LIKE_REMOVED: 'Curtida removida!',
};