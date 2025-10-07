import { z } from 'zod'

// Schema para criação de post
export const createPostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  codeSnippet: z.string().optional(),
  language: z.string().optional(),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).max(10, 'Máximo 10 tags').default([]),
  folderId: z.string().optional(),
  isPublic: z.boolean().default(true)
})

// Schema para atualização de post
export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  codeSnippet: z.string().optional(),
  language: z.string().optional(),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).max(10).optional(),
  folderId: z.string().optional(),
  isPublic: z.boolean().optional()
})

// Schema para busca de posts
export const getPostsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  userId: z.string().optional(),
  folderId: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  language: z.string().optional(),
  search: z.string().optional(),
  isPublic: z.coerce.boolean().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'likes']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// Schema para parâmetros de post
export const postParamsSchema = z.object({
  id: z.string().uuid('ID do post deve ser um UUID válido')
})

// Schema para criação de comentário
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório').max(1000),
  parentId: z.string().optional()
})

// Schema para parâmetros de comentário
export const commentParamsSchema = z.object({
  postId: z.string().uuid('ID do post deve ser um UUID válido'),
  commentId: z.string().uuid('ID do comentário deve ser um UUID válido').optional()
})