import { categorySchema } from './categorySchema'
import { tagSchema } from './tagSchema'
import { z } from 'zod'

export const petSchema = z.object({
  'id': z.number().readonly().optional(),
  'name': z.string(),
  'category': z.lazy(() => categorySchema).schema.optional(),
  'photoUrls': z.array(z.string()),
  'tags': z.array(z.lazy(() => tagSchema).schema).optional(),
  'status': z.enum([`available`, `pending`, `sold`]).describe(`pet status in the store`).optional(),
})
