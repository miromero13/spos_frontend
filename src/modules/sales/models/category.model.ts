import { type ApiBase } from '@/models'

export interface Category extends ApiBase {
  name: string
  description: string
}

export interface CreateCategory extends Partial<Omit<Category, 'id'>> {}
