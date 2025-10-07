import { z } from 'zod'

// Schema para criação de pasta
export const createFolderSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal').optional(),
  isPublic: z.boolean().default(false)
})

// Schema para atualização de pasta
export const updateFolderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal').optional(),
  isPublic: z.boolean().optional()
})

// Schema para busca de pastas
export const getFoldersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  userId: z.string().optional(),
  isPublic: z.coerce.boolean().optional(),
  search: z.string().optional()
})

// Schema para parâmetros de pasta
export const folderParamsSchema = z.object({
  id: z.string().uuid('ID da pasta deve ser um UUID válido')
})