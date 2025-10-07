import { z } from 'zod'

// Schema para busca de usuários
export const getUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})

// Schema para parâmetros de usuário
export const userParamsSchema = z.object({
  id: z.string().uuid('ID do usuário deve ser um UUID válido')
})

// Schema para seguir/deixar de seguir usuário
export const followUserSchema = z.object({
  userId: z.string().uuid('ID do usuário deve ser um UUID válido')
})